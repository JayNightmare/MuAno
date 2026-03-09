export type NoteName =
    | "C"
    | "C#"
    | "D"
    | "D#"
    | "E"
    | "F"
    | "F#"
    | "G"
    | "G#"
    | "A"
    | "A#"
    | "B";

export interface PianoKey {
    id: string; // e.g., "C4"
    name: NoteName;
    octave: number;
    isBlack: boolean;
}

export interface TimelineNote {
    id: string;
    keyId: string; // Matches PianoKey.id
    startTime: number; // In seconds
    duration: number; // In seconds
    velocity: number; // 0-127
}

export interface TimelineExportState {
    version: string;
    pianoType: string;
    totalDurationSeconds: number;
    notes: TimelineNote[];
    settings: Record<string, unknown>;
}

export interface AppState {
    notes: TimelineNote[];
    isPlaying: boolean;
    currentTime: number; // seconds
    zoomLevel: number; // pixels per second

    // Actions
    addNote: (note: Omit<TimelineNote, "id">) => void;
    updateNote: (id: string, updates: Partial<TimelineNote>) => void;
    removeNote: (id: string) => void;
    setPlaying: (playing: boolean) => void;
    setCurrentTime: (time: number) => void;
    setZoomLevel: (zoom: number) => void;
}
