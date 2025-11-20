let fontsReadyPromise: Promise<void> | null = null;

export function getFontsReady(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (!fontsReadyPromise) {
    fontsReadyPromise = document.fonts.ready.then(() => {
      return Promise.resolve();
    });
  }

  return fontsReadyPromise;
}

