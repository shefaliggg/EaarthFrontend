import { fadeIn, fadeOut } from "./audioUtils";

class SoundManager {
  constructor() {
    this.sounds = {
      ending: new Audio("/sounds/call-ending-tone.mp3"),
      incoming: new Audio("/sounds/incoming-call-ringtone.mp3"),
      connecting: new Audio("/sounds/call-connecting-tone.mp3"),
      ringing: new Audio("/sounds/outgoing-call-ringtone.mp3"),
    };

    // channel → currently playing sound
    this.channels = {
      call: null,
      notification: null,
      ui: null,
    };

    this.sounds.incoming.loop = true;
    this.sounds.connecting.loop = true;
    this.sounds.ringing.loop = true;

    this.sounds.ending.volume = 0.8;
    this.sounds.incoming.volume = 0.9;
    this.sounds.connecting.volume = 0.1;
    this.sounds.ringing.volume = 0.6;

    Object.values(this.sounds).forEach((a) => {
      a.preload = "auto";
    });
  }

  async play(name, { volume, duration = 250, channel = "ui" } = {}) {
    console.log("Play:", name, "Channel:", channel);
    const audio = this.sounds[name];
    if (!audio) return;

    const current = this.channels[channel];

    if (current === name) return;

    if (current) {
      const prevAudio = this.sounds[current];
      await fadeOut(prevAudio, 250);
    }

    audio.currentTime = 0;
    await fadeIn(audio, volume, duration);

    this.channels[channel] = name;
  }

  async stop(name) {
    const audio = this.sounds[name];
    if (!audio) return;

    await fadeOut(audio, 250);

    for (const ch in this.channels) {
      if (this.channels[ch] === name) {
        this.channels[ch] = null;
      }
    }
  }

  async stopChannel(channel) {
    const name = this.channels[channel];
    if (!name) return;

    const audio = this.sounds[name];
    await fadeOut(audio, 250);

    this.channels[channel] = null;
  }

  async stopAll() {
    await Promise.all(Object.values(this.sounds).map((a) => fadeOut(a, 250)));

    Object.keys(this.channels).forEach((c) => {
      this.channels[c] = null;
    });
  }
}

export const soundManager = new SoundManager();
