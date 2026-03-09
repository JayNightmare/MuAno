import { useEffect } from "react";
import { X, Volume2, MonitorSpeaker, Settings } from "lucide-react";
import { usePlaybackEngine } from "@/hooks/usePlaybackEngine";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { engineType, setEngineType } = usePlaybackEngine();

    // Handle escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-slate-900 border border-slate-700/60 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                    <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                        <Settings size={20} className="text-indigo-400" />
                        Workspace Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">
                            Audio Synthesis Engine
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setEngineType("polysynth")}
                                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${engineType === "polysynth" ? "border-indigo-500 bg-indigo-500/10 text-indigo-300" : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:bg-slate-800"}`}
                            >
                                <MonitorSpeaker size={24} strokeWidth={1.5} />
                                <span className="text-sm font-medium">
                                    Digital PolySynth
                                </span>
                            </button>

                            <button
                                onClick={() => setEngineType("am_synth")}
                                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${engineType === "am_synth" ? "border-amber-500 bg-amber-500/10 text-amber-300" : "border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600 hover:bg-slate-800"}`}
                            >
                                <Volume2 size={24} strokeWidth={1.5} />
                                <span className="text-sm font-medium">
                                    Analog AM Synth
                                </span>
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Changes the underlying Tone.js synthesis method for
                            rendering active notes.
                        </p>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-medium text-sm transition-colors shadow-sm"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
