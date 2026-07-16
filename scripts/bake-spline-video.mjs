#!/usr/bin/env node
/**
 * Bakes a Spline .splinecode scene into a short looping, alpha-channel WebM
 * for use on mobile/low-end devices instead of booting the full WebGL
 * runtime (see .claude/performance-audit.md, item 3).
 *
 * Captures real frames from @splinetool/runtime running headlessly in the
 * locally installed Chrome (via playwright-core, no browser download),
 * then encodes with the bundled ffmpeg-static binary. No system-wide
 * ffmpeg/Playwright browser install required.
 *
 * Capture method: raw gl.readPixels() into an in-page buffer, transferred
 * to Node ONCE at the end (not per-frame). Earlier approaches were much
 * slower for the same real GPU (confirmed hardware-accelerated via
 * chrome://gpu, not a software-rendering issue):
 *   - page.screenshot() per frame: full-page CDP compositing + encode
 *     round-trip per call (~300-450ms/frame, 2-5fps regardless of scene).
 *   - canvas.toDataURL() + exposeFunction per frame: faster (skips the
 *     full-page pipeline) but still forces a GPU pipeline flush AND a CPU
 *     PNG encode AND a CDP IPC round-trip on every single frame. Live
 *     playback never does any of that — the GPU can pipeline frame N+1
 *     while frame N is still displaying. Forcing a sync point every frame
 *     collapses that overlap, and it's a much bigger tax on an
 *     expensive multi-pass shader (e.g. the hero scene's blur pass) than
 *     on a cheap one (e.g. sparkles) — which is why the two scenes' fps
 *     diverged so much under that method.
 * Reading raw pixels and deferring ALL transfer to one bulk call at the
 * end removes the encode and per-frame IPC cost entirely, leaving only
 * the unavoidable render + readback cost — the actual ceiling for a given
 * scene on this GPU.
 *
 * NOTE: true HEVC-with-alpha (.mov, required for Safari/iOS video alpha)
 * can only be encoded via Apple's videotoolbox, which does not exist on
 * Windows/Linux ffmpeg builds. This script only produces the WebM (VP9
 * alpha) source, which covers Chrome/Firefox/Edge — the majority of
 * Android. Safari/iOS will fall back to the static poster frame until a
 * Mac is used to encode the .mov counterpart from the raw frame dump (see
 * bakeScene — kept when KEEP_FRAMES=1).
 *
 * Usage: node scripts/bake-spline-video.mjs
 */

import { chromium } from 'playwright-core';
import ffmpegPath from 'ffmpeg-static';
import { createServer } from 'node:http';
import { readFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(ROOT, 'public');
const RUNTIME_DIR = join(ROOT, 'node_modules', '@splinetool', 'runtime', 'build');
const RUNTIME_JS = join(RUNTIME_DIR, 'runtime.js');
const OUT_DIR = join(PUBLIC_DIR, '3d');
const TMP_ROOT = join(__dirname, '.bake-tmp');

// No time modification of any kind: the scene's own requestAnimationFrame
// loop runs at whatever real rate the browser/GPU gives it, and we read
// the canvas once per rAF tick. Frame timestamps are real performance.now()
// values recorded in-page, so encoding uses the *actual* measured capture
// fps — playback speed is exactly 1:1 with the live WebGL scene.
const LOOP_SECONDS = 10;
// Hard ceiling on frames captured, purely to bound in-page memory
// (frameBytes * MAX_FRAMES must stay well under Chrome's per-tab limits).
const MAX_FRAMES = 600;

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

// Only the landing hero scene gets the responsive zoom/FOV fix (it was
// cropped — see calculateResponsiveZoom/adjustCameraFOV replication in
// buildHarnessHtml below, mirroring components/custom/spline.tsx). The
// works-hero sparkles scene keeps its original 400x400 framing untouched.
const SCENES = [
  {
    name: 'hero-mobile',
    scene: 'hero.splinecode',
    cameraPosition: { x: 50, y: -90, z: 380 },
    cameraRotation: { x: -0.05, y: -0.15, z: 0 },
    viewport: { width: 300, height: 300 }, // hero-scene.tsx mobile: size-[300px]
    applyResponsiveFraming: true,
  },
  {
    name: 'sparkles-mobile',
    scene: 'sparkles.splinecode',
    cameraPosition: { x: 50, y: -90, z: 380 },
    cameraRotation: { x: -0.05, y: -0.15, z: 0 },
    viewport: { width: 400, height: 400 },
    applyResponsiveFraming: false,
  },
];

function findChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(
    'No local Chrome/Edge install found. Install Chrome, or set CHROME_PATH env var.'
  );
}

function mimeFor(path) {
  const ext = extname(path);
  return (
    { '.html': 'text/html', '.js': 'application/javascript', '.splinecode': 'application/octet-stream' }[
      ext
    ] ?? 'application/octet-stream'
  );
}

async function startStaticServer(fileMap) {
  const server = createServer(async (req, res) => {
    const url = req.url ?? '/';
    // Runtime chunks (boolean.js, physics.js, ...) are dynamically imported
    // relative to runtime.js's own URL, so fall back to the runtime build
    // directory for any path not explicitly mapped.
    const entry = fileMap[url] ?? join(RUNTIME_DIR, url.replace(/^\//, ''));
    if (!existsSync(entry)) {
      res.writeHead(404);
      res.end();
      return;
    }
    const body = await readFile(entry);
    res.writeHead(200, { 'Content-Type': mimeFor(entry), 'Access-Control-Allow-Origin': '*' });
    res.end(body);
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  return { server, port };
}

function buildHarnessHtml(sceneConfig, loopSeconds, maxFrames) {
  const { cameraPosition, cameraRotation, viewport, applyResponsiveFraming } = sceneConfig;
  const { width, height } = viewport;

  const framingScript = applyResponsiveFraming
    ? `
  // Mirrors components/custom/spline.tsx's calculateResponsiveZoom +
  // adjustCameraFOV so the bake matches what SplinePlayer auto-fits to at
  // this container size on a real device.
  const baseSize = Math.min(${width}, ${height});
  const zoomFactor = baseSize / 400;
  const calculatedZoom = Math.max(0.5, Math.min(2, zoomFactor)) * 0.92;
  if (app.setZoom) app.setZoom(calculatedZoom);`
    : '';

  const fovScript = applyResponsiveFraming
    ? `
    const aspectRatio = ${width} / ${height};
    if (camera.fov !== undefined && camera.updateProjectionMatrix) {
      const baseFOV = camera.fov || 50;
      const adjustedFOV = aspectRatio > 1
        ? baseFOV * (1 + (aspectRatio - 1) * 0.1)
        : baseFOV * (1 + (1 / aspectRatio - 1) * 0.15);
      camera.fov = Math.min(75, Math.max(45, adjustedFOV));
      camera.updateProjectionMatrix();
    }`
    : '';

  return `<!doctype html>
<html><head><style>html,body{margin:0;background:transparent}canvas{display:block}</style></head>
<body>
<canvas id="canvas" width="${width}" height="${height}"></canvas>
<script type="module">
  import { Application } from '/runtime.js';
  const canvas = document.getElementById('canvas');

  // Pre-create the context with preserveDrawingBuffer so readPixels() reads
  // the actually-rendered frame instead of a cleared buffer. Spline's
  // internal getContext() call reuses this same context (a canvas only
  // ever has one context per type), picking up the attribute for free.
  const gl = canvas.getContext('webgl2', { alpha: true, preserveDrawingBuffer: true, antialias: true })
    || canvas.getContext('webgl', { alpha: true, preserveDrawingBuffer: true, antialias: true });

  const app = new Application(canvas);
  await app.load('/scene.splinecode');
  const camera = app.scene?.activeCamera;
${framingScript}
  if (camera) {
    camera.position.x = ${cameraPosition.x};
    camera.position.y = ${cameraPosition.y};
    camera.position.z = ${cameraPosition.z};
    camera.rotation.x = ${cameraRotation.x};
    camera.rotation.y = ${cameraRotation.y};
    camera.rotation.z = ${cameraRotation.z};
${fovScript}
    app.setCamera(camera);
  }

  const width = ${width};
  const height = ${height};
  const frameBytes = width * height * 4;
  const maxFrames = ${maxFrames};
  const buffer = new Uint8Array(frameBytes * maxFrames);
  const timestamps = [];

  window.__startCapture = () => new Promise((resolve) => {
    const start = performance.now();
    const budgetMs = ${loopSeconds} * 1000;
    let count = 0;

    function tick() {
      const elapsed = performance.now() - start;
      if (elapsed >= budgetMs || count >= maxFrames) {
        resolve(count);
        return;
      }
      // No PNG encode, no IPC here — just the unavoidable GPU readback.
      // Subarray view (not an offset arg) so this works on both WebGL1 and
      // WebGL2 contexts identically.
      const dst = buffer.subarray(count * frameBytes, (count + 1) * frameBytes);
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, dst);
      timestamps.push(elapsed);
      count++;
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });

  // Single bulk transfer at the very end, chunked to avoid call-stack
  // limits on String.fromCharCode.
  window.__exportFrames = (count) => {
    const used = buffer.subarray(0, count * frameBytes);
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < used.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, used.subarray(i, i + chunkSize));
    }
    return { base64: btoa(binary), timestamps };
  };

  window.__splineReady = true;
</script>
</body></html>`;
}

async function bakeScene(browser, sceneConfig) {
  const { name, scene, viewport } = sceneConfig;
  const sceneFile = join(PUBLIC_DIR, '3d', scene);
  if (!existsSync(sceneFile)) {
    console.warn(`Skipping ${name}: ${sceneFile} not found`);
    return;
  }

  const tmpDir = join(TMP_ROOT, name);
  await mkdir(tmpDir, { recursive: true });

  const htmlPath = join(tmpDir, 'harness.html');
  await writeFile(htmlPath, buildHarnessHtml(sceneConfig, LOOP_SECONDS, MAX_FRAMES));

  const { server, port } = await startStaticServer({
    '/': htmlPath,
    '/runtime.js': RUNTIME_JS,
    '/scene.splinecode': sceneFile,
  });

  let frameCount = 0;
  let actualFps;
  const rawPath = join(tmpDir, 'frames.raw');

  try {
    const page = await browser.newPage({ viewport });
    page.on('console', (msg) => console.log(`[page:${msg.type()}]`, msg.text()));
    page.on('pageerror', (err) => console.error('[pageerror]', err));

    await page.goto(`http://localhost:${port}/`, { waitUntil: 'load' });
    await page.waitForFunction(() => window.__splineReady === true, { timeout: 30000 });
    // Let the scene settle before capturing the loop.
    await page.waitForTimeout(300);

    console.log(`Capturing ${name} for ${LOOP_SECONDS}s of real time (raw readPixels, bulk transfer)...`);
    frameCount = await page.evaluate(() => window.__startCapture());

    const { base64, timestamps } = await page.evaluate(
      (count) => window.__exportFrames(count),
      frameCount
    );
    await writeFile(rawPath, Buffer.from(base64, 'base64'));

    const elapsedSeconds = timestamps.length ? timestamps[timestamps.length - 1] / 1000 : LOOP_SECONDS;
    actualFps = frameCount / elapsedSeconds;
    console.log(
      `Captured ${frameCount} frames in ${elapsedSeconds.toFixed(2)}s -> encoding at ${actualFps.toFixed(2)}fps`
    );

    await page.close();
  } finally {
    server.close();
  }

  console.log(`Encoding ${name}.webm...`);
  await mkdir(OUT_DIR, { recursive: true });
  const webmOut = join(OUT_DIR, `${name}.webm`);
  const posterOut = join(OUT_DIR, `${name}-poster.png`);

  const encode = spawnSync(ffmpegPath, [
    '-y',
    '-f', 'rawvideo',
    '-pixel_format', 'rgba',
    '-video_size', `${viewport.width}x${viewport.height}`,
    '-framerate', actualFps.toFixed(3),
    '-i', rawPath,
    '-vf', 'vflip', // WebGL readPixels rows are bottom-up; flip to top-down for video
    '-c:v', 'libvpx-vp9',
    '-pix_fmt', 'yuva420p',
    '-b:v', '0',
    '-crf', '18', // high quality (VP9 crf scale: 0=lossless, 63=worst)
    '-deadline', 'good',
    '-cpu-used', '2',
    webmOut,
  ], { stdio: 'inherit' });

  if (encode.status !== 0) {
    throw new Error(`ffmpeg failed encoding ${name}.webm`);
  }

  // Extract the poster from the RAW capture, not by decoding webmOut: this
  // ffmpeg-static build's own WebM/VPx alpha *decoder* silently drops the
  // alpha channel on readback (confirmed by inspecting the decoded alpha
  // plane directly — always 255, i.e. opaque) even though what it *encodes*
  // is correct and plays back with real transparency in an actual browser
  // (verified via a real Chrome <video> test against a colored page
  // background). Going straight from the raw rgba source sidesteps that
  // decoder gap entirely.
  const posterEncode = spawnSync(ffmpegPath, [
    '-y',
    '-f', 'rawvideo',
    '-pixel_format', 'rgba',
    '-video_size', `${viewport.width}x${viewport.height}`,
    '-i', rawPath,
    '-vf', 'vflip',
    '-frames:v', '1',
    '-pix_fmt', 'rgba',
    posterOut,
  ], { stdio: 'inherit' });

  if (posterEncode.status !== 0) {
    throw new Error(`ffmpeg failed extracting poster for ${name}`);
  }

  if (process.env.KEEP_FRAMES !== '1') {
    await rm(tmpDir, { recursive: true, force: true });
  }

  console.log(`Done: public/3d/${name}.webm + ${name}-poster.png`);
}

async function main() {
  const executablePath = process.env.CHROME_PATH || findChrome();
  console.log(`Using browser: ${executablePath}`);

  const browser = await chromium.launch({ executablePath, headless: true });

  try {
    for (const sceneConfig of SCENES) {
      await bakeScene(browser, sceneConfig);
    }
  } finally {
    await browser.close();
    if (process.env.KEEP_FRAMES !== '1') {
      await rm(TMP_ROOT, { recursive: true, force: true });
    }
  }

  console.log('\nAll scenes baked. Still needed for full Safari/iOS support:');
  console.log('  On a Mac, from the kept raw frame dump (rerun with KEEP_FRAMES=1,');
  console.log('  scripts/.bake-tmp/<scene>/frames.raw, rgba, video_size as baked),');
  console.log('  run: ffmpeg -f rawvideo -pixel_format rgba -video_size WxH -framerate FPS');
  console.log('  -i frames.raw -vf vflip -c:v hevc_videotoolbox -alpha_quality 0.9 -tag:v hvc1 <name>-alpha.mov');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
