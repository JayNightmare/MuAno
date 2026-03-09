import type { NoteName, PianoKey } from "../types";

const NOTES: NoteName[] = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
];

/**
 * Generates an array of PianoKeys.
 * Standard behavior for piano rolls is high notes at the top (lowest index 0),
 * low notes at the bottom.
 */
export function generatePianoKeys(
    startOctave: number = 2,
    endOctave: number = 6,
): PianoKey[] {
    const keys: PianoKey[] = [];

    for (let octave = endOctave; octave >= startOctave; octave--) {
        for (let i = NOTES.length - 1; i >= 0; i--) {
            const name = NOTES[i];
            keys.push({
                id: `${name}${octave}`,
                name,
                octave,
                isBlack: name.includes("#"),
            });
        }
    }
    return keys;
}

// Pre-calculate standard keys for the timeline
export const PIANO_KEYS = generatePianoKeys();

// Constants for layout logic
export const ROW_HEIGHT = 32; // Height of each key row in pixels
export const DEFAULT_NOTE_DURATION = 0.5; // Seconds
