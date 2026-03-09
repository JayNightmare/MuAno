import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { useAppStore } from "../store/useAppStore";

export type AudioEngineType = "polysynth" | "am_synth";

export function usePlaybackEngine() {
    const { isPlaying, notes, setCurrentTime } = useAppStore();
    const [engineType, setEngineType] = useState<AudioEngineType>("polysynth");

    // We only create the master synth on first interacting with the play button
    // (Browsers restrict audio context until user interaction)
    const synthRef = useRef<Tone.PolySynth | null>(null);
    const amSynthRef = useRef<Tone.PolySynth | null>(null);
    const requestRef = useRef<number | undefined>(undefined);
    const lastUpdateRef = useRef<number | undefined>(undefined);
    const scheduledNotesRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (isPlaying) {
            Tone.start();

            // Lazy load synths on first play interaction
            if (!synthRef.current) {
                synthRef.current = new Tone.PolySynth(Tone.Synth, {
                    envelope: { release: 0.2 },
                }).toDestination();
            }
            if (!amSynthRef.current) {
                amSynthRef.current = new Tone.PolySynth(Tone.AMSynth, {
                    envelope: { release: 0.2 },
                }).toDestination();
            }

            lastUpdateRef.current = performance.now();

            const animate = (time: number) => {
                if (!lastUpdateRef.current) lastUpdateRef.current = time;
                const delta = (time - lastUpdateRef.current) / 1000;
                lastUpdateRef.current = time;

                const nextTime = useAppStore.getState().currentTime + delta;
                setCurrentTime(nextTime);

                const targetSynth =
                    engineType === "polysynth"
                        ? synthRef.current
                        : amSynthRef.current;

                notes.forEach((note) => {
                    const isNotePlaying =
                        nextTime >= note.startTime &&
                        nextTime <= note.startTime + note.duration;

                    if (
                        isNotePlaying &&
                        !scheduledNotesRef.current.has(note.id)
                    ) {
                        targetSynth?.triggerAttack(note.keyId, Tone.now());
                        scheduledNotesRef.current.add(note.id);
                    } else if (
                        !isNotePlaying &&
                        scheduledNotesRef.current.has(note.id)
                    ) {
                        targetSynth?.triggerRelease(note.keyId, Tone.now());
                        scheduledNotesRef.current.delete(note.id);
                    }
                });

                requestRef.current = requestAnimationFrame(animate);
            };

            requestRef.current = requestAnimationFrame(animate);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            lastUpdateRef.current = undefined;
            // Release all currently playing notes when paused
            synthRef.current?.releaseAll();
            amSynthRef.current?.releaseAll();
            scheduledNotesRef.current.clear();
        }

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isPlaying, notes, setCurrentTime, engineType]);

    return { engineType, setEngineType };
}
