#!/usr/bin/env tsx

import "dotenv/config";
import { spawnSync } from "node:child_process";
import { mkdirSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL (or DIRECT_URL) is not set in .env.");
  process.exit(1);
}

function findPgDump(): string | null {
  if (spawnSync("pg_dump", ["--version"], { stdio: "ignore" }).status === 0) {
    return "pg_dump";
  }

  // Windows installer (postgresql.org / winget / EDB) doesn't put pg_dump on
  // PATH by default — look under the standard install root and pick the
  // newest version present.
  const pgRoot = "C:\\Program Files\\PostgreSQL";
  if (existsSync(pgRoot)) {
    const versions = readdirSync(pgRoot)
      .filter((v) => /^\d+$/.test(v))
      .sort((a, b) => Number(b) - Number(a));

    for (const version of versions) {
      const candidate = join(pgRoot, version, "bin", "pg_dump.exe");
      if (existsSync(candidate)) return candidate;
    }
  }

  return null;
}

const pgDump = findPgDump();
if (!pgDump) {
  console.error(
    "pg_dump was not found on your PATH or under C:\\Program Files\\PostgreSQL.\n" +
      "Install the PostgreSQL client tools:\n" +
      "  Windows: winget install PostgreSQL.PostgreSQL (or download client-only tools from postgresql.org)\n" +
      "  macOS:   brew install libpq && brew link --force libpq\n" +
      "  Linux:   apt-get install postgresql-client"
  );
  process.exit(1);
}

const backupDir = join(process.cwd(), "backups");
if (!existsSync(backupDir)) {
  mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outFile = join(backupDir, `db-backup-${timestamp}.dump`);

console.log(`Using ${pgDump}`);
console.log(`Backing up database to ${outFile} ...`);

const result = spawnSync(
  pgDump,
  [databaseUrl, "--format=custom", "--file", outFile, "--no-owner", "--no-privileges"],
  { stdio: "inherit" }
);

if (result.status !== 0) {
  console.error("pg_dump failed.");
  process.exit(result.status ?? 1);
}

console.log(`Backup complete: ${outFile}`);
console.log(`Restore with: pg_restore --clean --no-owner --dbname="$DATABASE_URL" "${outFile}"`);
