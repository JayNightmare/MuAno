import { z } from "zod";
import type { TimelineExportState } from "../types";
import { useAppStore } from "../store/useAppStore";

const NoteSchema = z.object({
    id: z.string(),
    keyId: z.string(),
    startTime: z.number(),
    duration: z.number(),
    velocity: z.number(),
});

const ExportSchema = z.object({
    version: z.string(),
    pianoType: z.string(),
    totalDurationSeconds: z.number(),
    notes: z.array(NoteSchema),
    settings: z.record(z.string(), z.unknown()),
});

export function exportTimeline() {
    const { notes } = useAppStore.getState();
    const exportData: TimelineExportState = {
        version: "1.0",
        pianoType: "standard_88",
        totalDurationSeconds: Math.max(
            ...notes.map((n) => n.startTime + n.duration),
            60,
        ),
        notes,
        settings: {},
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `muano-timeline-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

export function importTimeline(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                const parsed = ExportSchema.parse(json);

                useAppStore.setState({
                    notes: parsed.notes,
                    isPlaying: false,
                    currentTime: 0,
                });
                resolve();
            } catch (err) {
                console.error("Invalid timeline file", err);
                reject(new Error("Invalid timeline file format"));
            }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(file);
    });
}
