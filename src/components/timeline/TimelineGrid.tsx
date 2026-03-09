import React, { useRef, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import {
    PIANO_KEYS,
    ROW_HEIGHT,
    DEFAULT_NOTE_DURATION,
} from "@/utils/pianoUtils";
import NoteBlock from "./NoteBlock";

export default function TimelineGrid() {
    const { notes, zoomLevel, addNote, currentTime } = useAppStore();
    const containerRef = useRef<HTMLDivElement>(null);

    const [draftNote, setDraftNote] = useState<{
        keyId: string;
        startTime: number;
        duration: number;
        rowIndex: number;
    } | null>(null);

    const draftNoteRef = useRef<typeof draftNote>(null);
    const updateDraft = (val: typeof draftNote) => {
        draftNoteRef.current = val;
        setDraftNote(val);
    };

    // Basic duration calculation: 60 seconds minimum width, or max note end time + 10s padding
    const maxTime = notes.reduce(
        (max, note) => Math.max(max, note.startTime + note.duration),
        60,
    );
    const containerWidthStr = `${Math.max(maxTime + 10, 60) * zoomLevel}px`;
    const containerHeightStr = `${PIANO_KEYS.length * ROW_HEIGHT + 24}px`; // Add 24px pad for time scale header

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (!containerRef.current) return;
        if (target !== containerRef.current && target.id !== "notes-wrapper")
            return;

        const rect = containerRef.current.getBoundingClientRect();
        const startX = e.clientX - rect.left + containerRef.current.scrollLeft;
        const startY = e.clientY - rect.top;

        // Account for sticky header 24px offset when calculating row
        const effectiveY = Math.max(0, startY - 24);
        const rowIndex = Math.floor(effectiveY / ROW_HEIGHT);

        const pianoKey = PIANO_KEYS[rowIndex];
        if (!pianoKey) return;

        const initStartTime = startX / zoomLevel;

        const rowNotes = notes
            .filter((n) => n.keyId === pianoKey.id)
            .sort((a, b) => a.startTime - b.startTime);

        const initialDuration = DEFAULT_NOTE_DURATION;

        updateDraft({
            keyId: pianoKey.id,
            startTime: initStartTime,
            duration: initialDuration,
            rowIndex,
        });

        const pointerMoveHandler = (moveEvent: PointerEvent) => {
            const currentX =
                moveEvent.clientX -
                rect.left +
                containerRef.current!.scrollLeft;
            const dragDiffSeconds = (currentX - startX) / zoomLevel;

            if (dragDiffSeconds > 0 && draftNoteRef.current) {
                let newDuration = dragDiffSeconds;

                // Collision detection
                const collidingNote = rowNotes.find(
                    (n) =>
                        n.startTime > initStartTime &&
                        n.startTime < initStartTime + newDuration,
                );
                if (collidingNote) {
                    newDuration = collidingNote.startTime - initStartTime;
                }

                updateDraft({ ...draftNoteRef.current, duration: newDuration });
            }
        };

        const pointerUpHandler = () => {
            window.removeEventListener("pointermove", pointerMoveHandler);
            window.removeEventListener("pointerup", pointerUpHandler);

            const finalDraft = draftNoteRef.current;
            if (finalDraft) {
                let boundedDuration =
                    finalDraft.duration > 0.05
                        ? finalDraft.duration
                        : DEFAULT_NOTE_DURATION;

                const collidingNote = rowNotes.find(
                    (n) =>
                        n.startTime > finalDraft.startTime &&
                        n.startTime < finalDraft.startTime + boundedDuration,
                );
                if (collidingNote) {
                    boundedDuration =
                        collidingNote.startTime - finalDraft.startTime;
                }

                addNote({
                    keyId: finalDraft.keyId,
                    startTime: finalDraft.startTime,
                    duration: boundedDuration,
                    velocity: 100,
                });

                updateDraft(null);
            }
        };

        window.addEventListener("pointermove", pointerMoveHandler);
        window.addEventListener("pointerup", pointerUpHandler);
    };

    // Prepare time markers
    const totalSecondsToRender = Math.max(maxTime + 10, 60);
    const markers = [];
    for (let i = 0; i <= totalSecondsToRender; i++) {
        markers.push(
            <div
                key={i}
                className="absolute h-full border-l border-slate-700/50"
                style={{ left: `${i * zoomLevel}px` }}
            >
                <span className="absolute -left-2 top-0.5 text-[10px] text-slate-400 font-medium select-none bg-slate-900 px-1 rounded-sm leading-tight">
                    {i}s
                </span>
            </div>,
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative cursor-crosshair h-full"
            style={{
                width: containerWidthStr,
                height: containerHeightStr,
            }}
            onPointerDown={handlePointerDown}
        >
            {/* Sticky Time Scale Header */}
            <div
                className="sticky top-0 h-6 bg-slate-900/95 border-b border-slate-700/80 backdrop-blur-sm z-40 shrink-0 pointer-events-none"
                style={{ width: containerWidthStr }}
            >
                {markers}
            </div>

            {/* Background Grid Lines rendering */}
            <div
                className="absolute left-0 right-0 bottom-0 pointer-events-none"
                style={{
                    top: "24px",
                    backgroundSize: `${zoomLevel}px ${ROW_HEIGHT}px`,
                    backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
                }}
            />

            {/* Playhead Indicator */}
            <div
                className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] z-30 pointer-events-none"
                style={{ left: `${currentTime * zoomLevel}px` }}
            >
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rotate-45 bg-red-500" />
            </div>

            {/* Render Notes */}
            <div
                id="notes-wrapper"
                className="absolute left-0 right-0 bottom-0"
                style={{ top: "24px" }}
            >
                {notes.map((note) => (
                    <NoteBlock key={note.id} note={note} />
                ))}

                {/* Render Draft Note */}
                {draftNote && (
                    <div
                        className="absolute rounded-md border border-white/80 shadow-md flex items-center bg-white/30 z-[60] pointer-events-none"
                        style={{
                            left: `${draftNote.startTime * zoomLevel}px`,
                            top: `${draftNote.rowIndex * ROW_HEIGHT + 1}px`,
                            width: `${draftNote.duration * zoomLevel}px`,
                            height: `${ROW_HEIGHT - 2}px`,
                        }}
                    />
                )}
            </div>
        </div>
    );
}
