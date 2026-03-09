import { create } from "zustand";
import { temporal } from "zundo";
import type { AppState } from "../types";

export const useAppStore = create<AppState>()(
    temporal(
        (set) => ({
            notes: [],
            isPlaying: false,
            currentTime: 0,
            zoomLevel: 100, // 100 pixels = 1 second

            addNote: (noteData) =>
                set((state) => ({
                    notes: [
                        ...state.notes,
                        { ...noteData, id: crypto.randomUUID() },
                    ],
                })),

            updateNote: (id, updates) =>
                set((state) => ({
                    notes: state.notes.map((note) =>
                        note.id === id ? { ...note, ...updates } : note,
                    ),
                })),

            removeNote: (id) =>
                set((state) => ({
                    notes: state.notes.filter((note) => note.id !== id),
                })),

            setPlaying: (isPlaying) => set({ isPlaying }),
            setCurrentTime: (currentTime) => set({ currentTime }),
            setZoomLevel: (zoomLevel) => set({ zoomLevel }),
        }),
        {
            partialize: (state) => ({ notes: state.notes }),
            limit: 100,
        },
    ),
);
