import React, { useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import PianoKeyboard from "../keyboard/PianoKeyboard";
import TimelineGrid from "./TimelineGrid";

export default function TimelineContainer() {
    const keyboardScrollRef = useRef<HTMLDivElement>(null);
    const timelineScrollRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Subscribe to app store changes without causing continuous React re-renders
        const unsubscribe = useAppStore.subscribe((state) => {
            if (!state.isPlaying || !timelineScrollRef.current) return;

            const container = timelineScrollRef.current;
            const playheadX = state.currentTime * state.zoomLevel;
            const { scrollLeft, clientWidth } = container;

            // Define bounds to keep the playhead visible
            const rightBound = scrollLeft + clientWidth - 150;
            const leftBound = scrollLeft;

            // If playhead moves past the right bound or goes before the left edge (e.g., repeating)
            if (playheadX > rightBound || playheadX < leftBound) {
                // Scroll the container so playhead sits at 10% of the screen width from the left edge
                container.scrollLeft = Math.max(
                    0,
                    playheadX - clientWidth * 0.1,
                );
            }
        });

        return () => unsubscribe();
    }, []);

    const handleTimelineScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (keyboardScrollRef.current) {
            // Sync vertical scroll from Timeline to Keyboard
            keyboardScrollRef.current.scrollTop = e.currentTarget.scrollTop;
        }
    };

    return (
        <div className="flex flex-1 overflow-hidden relative">
            {/* Keyboard Side Panel */}
            <aside
                ref={keyboardScrollRef}
                className="w-[72px] sm:w-[88px] shrink-0 overflow-hidden bg-slate-950 z-20 shadow-[4px_0_12px_rgba(0,0,0,0.4)] border-r border-slate-700/50"
            >
                <PianoKeyboard />
            </aside>

            {/* Scrollable Timeline Area */}
            <main
                ref={timelineScrollRef}
                className="flex-1 overflow-auto bg-slate-900/95 relative scroll-smooth styled-scrollbar"
                onScroll={handleTimelineScroll}
            >
                <TimelineGrid />
            </main>
        </div>
    );
}
