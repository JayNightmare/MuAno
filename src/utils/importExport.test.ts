import { describe, it, expect, beforeEach } from "vitest";
import { importTimeline } from "./importExport";
import { useAppStore } from "../store/useAppStore";
import type { TimelineExportState } from "../types";

describe("importExport utilities", () => {
    beforeEach(() => {
        // Reset store before each test
        useAppStore.setState({ notes: [], isPlaying: false, currentTime: 0 });
        useAppStore.temporal.getState().clear();
    });

    it("imports a valid timeline JSON correctly", async () => {
        const validData: TimelineExportState = {
            version: "1.0",
            pianoType: "standard_88",
            totalDurationSeconds: 100,
            notes: [
                {
                    id: "1",
                    keyId: "C4",
                    startTime: 0,
                    duration: 2,
                    velocity: 100,
                },
            ],
            settings: {},
        };

        const file = new File([JSON.stringify(validData)], "test.json", {
            type: "application/json",
        });

        await importTimeline(file);

        expect(useAppStore.getState().notes.length).toBe(1);
        expect(useAppStore.getState().notes[0].keyId).toBe("C4");
    });

    it("rejects an invalid timeline JSON", async () => {
        const invalidData = {
            version: "1.0",
            // missing expected properties
            notes: [{ wrongProp: "test" }],
        };

        const file = new File([JSON.stringify(invalidData)], "test.json", {
            type: "application/json",
        });

        await expect(importTimeline(file)).rejects.toThrow(
            "Invalid timeline file format",
        );
        expect(useAppStore.getState().notes.length).toBe(0);
    });
});
