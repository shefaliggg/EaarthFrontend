export const fadeOut = (audio, duration = 300) => {
  return new Promise((resolve) => {
    if (!audio || audio.paused) return resolve();

    const startVolume = audio.volume;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = startVolume / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      if (currentStep < steps) {
        audio.volume = Math.max(0, audio.volume - volumeStep);
      } else {
        clearInterval(interval);
        audio.pause();
        audio.currentTime = 0;
        audio.volume = startVolume; // restore
        resolve();
      }
    }, stepTime);
  });
};

export const fadeIn = (audio, targetVolume = 1, duration = 300) => {
  return new Promise((resolve) => {
    if (!audio) return resolve();

    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = targetVolume / steps;

    audio.volume = 0;
    audio.play().catch(() => {});

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      if (currentStep < steps) {
        audio.volume = Math.min(targetVolume, audio.volume + volumeStep);
      } else {
        clearInterval(interval);
        audio.volume = targetVolume;
        resolve();
      }
    }, stepTime);
  });
};