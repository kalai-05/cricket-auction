import { Injectable, signal } from '@angular/core';

type SoundKind = 'bid' | 'sold' | 'unsold';

/**
 * Generates short synthesized tones via the Web Audio API instead of shipping
 * audio assets — keeps the app a pure static bundle with no binary files.
 */
@Injectable({ providedIn: 'root' })
export class SoundEffectsService {
  readonly enabled = signal(true);
  /** 0..1, scales the synth gain. */
  readonly volume = signal(0.7);
  private context: AudioContext | null = null;

  setEnabled(value: boolean): void {
    this.enabled.set(value);
  }

  toggle(): void {
    this.enabled.update((v) => !v);
  }

  setVolume(value: number): void {
    this.volume.set(Math.min(1, Math.max(0, value)));
  }

  play(kind: SoundKind): void {
    if (!this.enabled()) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    const patterns: Record<SoundKind, { freq: number; duration: number }[]> = {
      bid: [{ freq: 660, duration: 0.08 }],
      sold: [
        { freq: 523, duration: 0.12 },
        { freq: 784, duration: 0.18 },
      ],
      unsold: [
        { freq: 300, duration: 0.15 },
        { freq: 220, duration: 0.25 },
      ],
    };

    let offset = 0;
    for (const { freq, duration } of patterns[kind]) {
      this.playTone(ctx, freq, now + offset, duration);
      offset += duration;
    }
  }

  private playTone(ctx: AudioContext, freq: number, startAt: number, duration: number): void {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(freq, startAt);

    const peak = Math.max(0.001, 0.3 * this.volume());
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(peak, startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.02);
  }

  private getContext(): AudioContext {
    if (!this.context) {
      this.context = new AudioContext();
    }
    return this.context;
  }
}
