import { useState } from "react";
import type { TimelineNote } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { PIANO_KEYS, ROW_HEIGHT } from "@/utils/pianoUtils";
import { X, GripVertical } from "lucide-react";

export default function NoteBlock({ note }: { note: TimelineNote }) {
    const { zoomLevel, updateNote, removeNote } = useAppStore();
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const rowIndex = PIANO_KEYS.findIndex((k) => k.id === note.keyId);
    if (rowIndex === -1) return null;

    const handlePointerDown = (e: React.PointerEvent) => {
        e.stopPropagation();
        // Prevent dragging if clicking delete button
        if ((e.target as HTMLElement).closest("button")) return;

        setIsDragging(true);
        const startX = e.clientX;
        const startY = e.clientY;

        const handlePointerMove = (moveEvent: PointerEvent) => {
            setDragOffset({
                x: moveEvent.clientX - startX,
                y: moveEvent.clientY - startY,
            });
        };

        const handlePointerUp = (upEvent: PointerEvent) => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);

            const finalDeltaX = upEvent.clientX - startX;
            const finalDeltaY = upEvent.clientY - startY;

            const timeDelta = finalDeltaX / zoomLevel;
            const rowDelta = Math.round(finalDeltaY / ROW_HEIGHT);

            const newStartTime = Math.max(0, note.startTime + timeDelta);
            const targetRowIndex = Math.max(
                0,
                Math.min(PIANO_KEYS.length - 1, rowIndex + rowDelta),
            );
            const newKeyId = PIANO_KEYS[targetRowIndex].id;

            updateNote(note.id, {
                startTime: newStartTime,
                keyId: newKeyId,
            });

            setIsDragging(false);
            setDragOffset({ x: 0, y: 0 });
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
    };

    const isBlack = PIANO_KEYS[rowIndex].isBlack;

    const displayLeft = note.startTime * zoomLevel + dragOffset.x;
    const displayTop = rowIndex * ROW_HEIGHT + dragOffset.y;
    const width = note.duration * zoomLevel;

    return (
        <div
            onPointerDown={handlePointerDown}
            className={`absolute rounded-md border shadow-md flex items-center justify-between overflow-hidden group transition-colors duration-100 ${isDragging ? "z-50 opacity-80 cursor-grabbing border-white/50" : "z-10 cursor-grab hover:brightness-110 border-black/20"} ${isBlack ? "bg-indigo-500" : "bg-blue-400"}`}
            style={{
                left: `${displayLeft}px`,
                top: `${displayTop + 1}px`,
                width: `${width}px`,
                height: `${ROW_HEIGHT - 2}px`,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center flex-1 min-w-0">
                <GripVertical
                    size={12}
                    className="text-white/40 ml-0.5 shrink-0 group-hover:text-white/70 transition-colors"
                />
                <div className="px-1 text-[10px] font-semibold text-white/90 select-none truncate drop-shadow-sm">
                    {note.keyId}
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    removeNote(note.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-black/20 text-white/70 hover:text-white transition-all mr-1 rounded"
                aria-label="Delete note"
            >
                <X size={12} strokeWidth={3} />
            </button>

            {/* Resize Handle (Visual Only for now) */}
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-black/10 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}
