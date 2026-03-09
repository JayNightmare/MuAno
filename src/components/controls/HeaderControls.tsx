import { useRef, useState } from "react";
import { Play, Square, Settings, Download, Upload } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { exportTimeline, importTimeline } from "@/utils/importExport";
import SettingsModal from "./SettingsModal";

export default function HeaderControls() {
    const { isPlaying, setPlaying } = useAppStore();
    const { undo, redo, pastStates, futureStates } =
        useAppStore.temporal.getState();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                await importTimeline(file);
            } catch {
                alert(
                    "Failed to import timeline. Make sure it is a valid JSON file.",
                );
            }
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <header className="h-16 shrink-0 border-b border-slate-800/80 flex items-center px-6 shadow-sm bg-slate-900 z-30">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">M</span>
                </div>
                <h1 className="text-lg font-semibold text-slate-100 tracking-tight">
                    MuAno Timeline
                </h1>
            </div>

            <div className="flex-1 flex justify-center">
                {/* Playback Controls */}
                <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800/50 shadow-inner">
                    <button
                        onClick={() => {
                            undo();
                        }}
                        disabled={pastStates.length === 0}
                        className="px-3 py-1.5 rounded-md flex items-center text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-300"
                        title="Undo (Ctrl+Z)"
                    >
                        Undo
                    </button>
                    <button
                        onClick={() => {
                            redo();
                        }}
                        disabled={futureStates.length === 0}
                        className="px-3 py-1.5 rounded-md flex items-center text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 text-slate-300"
                        title="Redo (Ctrl+Y)"
                    >
                        Redo
                    </button>
                    <div className="w-px h-5 bg-slate-800 mx-1" />
                    <button
                        onClick={() => setPlaying(!isPlaying)}
                        className={`px-4 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${isPlaying ? "bg-indigo-500 text-white shadow-md" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}
                    >
                        {isPlaying ? (
                            <Square size={16} fill="currentColor" />
                        ) : (
                            <Play size={16} fill="currentColor" />
                        )}
                        {isPlaying ? "Stop" : "Play"}
                    </button>
                </div>

                <div className="ml-4 flex items-center gap-2">
                    <button
                        onClick={() => useAppStore.getState().setCurrentTime(0)}
                        className="px-3 py-1.5 rounded-md flex items-center text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300 border border-slate-700/50 hover:border-slate-600"
                        title="Return to Start"
                    >
                        Reset Head
                    </button>
                    <button
                        onClick={() => {
                            if (
                                confirm(
                                    "Are you sure you want to clear the entire timeline?",
                                )
                            ) {
                                useAppStore.setState({ notes: [] });
                            }
                        }}
                        className="px-3 py-1.5 rounded-md flex items-center text-sm font-medium transition-colors hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-900/30 hover:border-red-500/50"
                        title="Clear Timeline"
                    >
                        Clear All
                    </button>
                </div>

                <div className="ml-auto flex items-center gap-3">
                    <input
                        type="file"
                        accept="application/json"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                    <button
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
                        title="Import JSON"
                        onClick={handleImportClick}
                    >
                        <Upload size={18} />
                    </button>
                    <button
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
                        title="Export JSON"
                        onClick={exportTimeline}
                    >
                        <Download size={18} />
                    </button>
                    <div className="h-6 w-px bg-slate-800 mx-1"></div>
                    <button
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
                        title="Settings"
                        onClick={() => setIsSettingsOpen(true)}
                    >
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </header>
    );
}
