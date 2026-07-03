// Procedural footstep audio — a soft filtered-noise thud, like shoes on carpet.
// No audio assets needed; everything is synthesized on the fly.

let ctx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;

const getContext = (): AudioContext | null => {
  try {
    if (!ctx) {
      ctx = new AudioContext();
    }
    if (ctx.state === 'suspended') {
      // Allowed here: footsteps only fire after the user has pressed keys
      void ctx.resume();
    }
    return ctx;
  } catch {
    return null;
  }
};

/**
 * Play one soft carpet footstep.
 * @param pan -1..1 stereo position (alternate feet feel wider)
 * @param volume 0..1 loudness
 */
export const playFootstep = (pan = 0, volume = 0.09) => {
  const ac = getContext();
  if (!ac) return;

  try {
    if (!noiseBuffer) {
      const length = Math.floor(ac.sampleRate * 0.09);
      noiseBuffer = ac.createBuffer(1, length, ac.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }

    const source = ac.createBufferSource();
    source.buffer = noiseBuffer;
    source.playbackRate.value = 0.85 + Math.random() * 0.3;

    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 420 + Math.random() * 180;
    filter.Q.value = 0.8;

    const gain = ac.createGain();
    const level = volume * (0.8 + Math.random() * 0.4);
    gain.gain.setValueAtTime(level, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12);

    const panner = new StereoPannerNode(ac, { pan });

    source.connect(filter).connect(gain).connect(panner).connect(ac.destination);
    source.start();
    source.stop(ac.currentTime + 0.15);
  } catch {
    // audio unavailable — stay silent
  }
};
