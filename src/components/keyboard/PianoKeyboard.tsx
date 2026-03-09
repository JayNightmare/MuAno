import { PIANO_KEYS, ROW_HEIGHT } from "@/utils/pianoUtils";
import { clsx } from "clsx";

export default function PianoKeyboard() {
    return (
        <div
            className="flex flex-col border-r border-slate-700/80 bg-slate-950 w-full relative select-none"
            // Height matches grid, meaning this will be scrollable alongside the timeline grid
        >
            {/* Header spacer to align with TimelineGrid time scale */}
            <div className="sticky top-0 h-6 bg-slate-900/95 border-b border-slate-700/80 backdrop-blur-sm z-50 shrink-0 w-full flex items-center justify-center pointer-events-none">
                <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">
                    Pitch
                </span>
            </div>
            {PIANO_KEYS.map((key) => {
                const isC = key.name === "C";
                return (
                    <div
                        key={key.id}
                        className={clsx(
                            "w-full flex items-center justify-end pr-2 text-xs border-b border-slate-800/60 transition-colors z-10",
                            isC
                                ? "border-t border-t-slate-600/50 -mt-[1px]"
                                : "",
                            key.isBlack
                                ? "bg-slate-900 text-slate-500 w-[65%] shadow-inner rounded-l-sm self-end border-r-0"
                                : "bg-slate-200 text-slate-800 w-full hover:bg-white",
                        )}
                        style={{ height: `${ROW_HEIGHT}px`, flexShrink: 0 }}
                    >
                        {isC || key.name.includes("#") ? (
                            <span
                                className={clsx(
                                    "font-medium text-[10px]",
                                    isC ? "text-slate-500" : "text-slate-600",
                                )}
                            >
                                {key.id}
                            </span>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
}
