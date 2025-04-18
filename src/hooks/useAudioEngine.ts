import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { Sampler, Reverb, MetalSynth } from 'tone';

interface AudioSettings {
  volume?: number;
  reverb?: number;
  instrument?: string;
}

interface SoundBank {
  [key: string]: {
    baseUrl: string;
    files: { [key: string]: string };
  };
}

export const useAudioEngine = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const samplerRef = useRef<Sampler | null>(null);
  const reverbRef = useRef<Reverb | null>(null);
  const metronomeRef = useRef<MetalSynth | null>(null);
  const activeNotesRef = useRef<Set<string>>(new Set());

  // Define different piano sounds
  const soundBanks: SoundBank = {
    grand: {
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      files: {
        'A0': 'A0.mp3', 'A1': 'A1.mp3', 'A2': 'A2.mp3', 'A3': 'A3.mp3',
        'A4': 'A4.mp3', 'A5': 'A5.mp3', 'A6': 'A6.mp3',
        'C1': 'C1.mp3', 'C2': 'C2.mp3', 'C3': 'C3.mp3', 'C4': 'C4.mp3',
        'C5': 'C5.mp3', 'C6': 'C6.mp3', 'C7': 'C7.mp3',
        'D#1': 'Ds1.mp3', 'D#2': 'Ds2.mp3', 'D#3': 'Ds3.mp3',
        'D#4': 'Ds4.mp3', 'D#5': 'Ds5.mp3', 'D#6': 'Ds6.mp3',
        'F#1': 'Fs1.mp3', 'F#2': 'Fs2.mp3', 'F#3': 'Fs3.mp3',
        'F#4': 'Fs4.mp3', 'F#5': 'Fs5.mp3', 'F#6': 'Fs6.mp3'
      }
    },
    bright: {
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      files: {
        'A0': 'A0.mp3', 'A1': 'A1.mp3', 'A2': 'A2.mp3', 'A3': 'A3.mp3',
        'A4': 'A4.mp3', 'A5': 'A5.mp3', 'A6': 'A6.mp3'
      }
    },
    upright: {
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      files: {
        'A0': 'A0.mp3', 'A1': 'A1.mp3', 'A2': 'A2.mp3', 'A3': 'A3.mp3',
        'A4': 'A4.mp3', 'A5': 'A5.mp3', 'A6': 'A6.mp3'
      }
    }
  };

  // Initialize audio engine
  useEffect(() => {
    const initAudio = async () => {
      if (!samplerRef.current) {
        await Tone.start();
        
        // Create reverb effect
        reverbRef.current = new Tone.Reverb({
          decay: 2.5,
          wet: 0.2
        }).toDestination();
        
        // Create metronome
        metronomeRef.current = new Tone.MetalSynth({
          frequency: 200,
          envelope: {
            attack: 0.001,
            decay: 0.1,
            release: 0.1
          },
          volume: -10
        }).toDestination();

        // Create sampler with piano samples
        samplerRef.current = new Tone.Sampler({
          urls: soundBanks.grand.files,
          baseUrl: soundBanks.grand.baseUrl,
          onload: () => {
            setIsInitialized(true);
          },
          volume: -8
        }).connect(reverbRef.current);
      }
    };

    const handleInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      
      if (samplerRef.current) {
        samplerRef.current.dispose();
      }
      if (reverbRef.current) {
        reverbRef.current.dispose();
      }
      if (metronomeRef.current) {
        metronomeRef.current.dispose();
      }
    };
  }, []);

  const setAudioSettings = ({ volume, reverb, instrument }: AudioSettings) => {
    if (volume !== undefined && samplerRef.current) {
      samplerRef.current.volume.value = Tone.gainToDb(volume);
    }
    if (reverb !== undefined && reverbRef.current) {
      reverbRef.current.wet.value = reverb;
    }
    if (instrument && soundBanks[instrument] && samplerRef.current) {
      samplerRef.current.dispose();
      samplerRef.current = new Tone.Sampler({
        urls: soundBanks[instrument].files,
        baseUrl: soundBanks[instrument].baseUrl,
        volume: volume !== undefined ? Tone.gainToDb(volume) : -8
      }).connect(reverbRef.current!);
    }
  };

  const playNote = (note: string) => {
    if (!samplerRef.current || activeNotesRef.current.has(note)) return;
    
    const velocity = 0.5 + Math.random() * 0.3;
    samplerRef.current.triggerAttack(note, Tone.now(), velocity);
    activeNotesRef.current.add(note);
  };

  const stopNote = (note: string) => {
    if (!samplerRef.current || !activeNotesRef.current.has(note)) return;
    
    samplerRef.current.triggerRelease(note, Tone.now() + 0.05);
    activeNotesRef.current.delete(note);
  };

  const startMetronome = (bpm: number) => {
    if (!metronomeRef.current) return;
    
    Tone.Transport.bpm.value = bpm;
    Tone.Transport.scheduleRepeat((time) => {
      metronomeRef.current?.triggerAttackRelease('C6', '32n', time);
    }, '4n');
    Tone.Transport.start();
  };

  const stopMetronome = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
  };

  return {
    playNote,
    stopNote,
    setAudioSettings,
    startMetronome,
    stopMetronome,
    isInitialized
  };
};

export default useAudioEngine;