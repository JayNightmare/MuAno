import TimelineContainer from "@/components/timeline/TimelineContainer";
import HeaderControls from "@/components/controls/HeaderControls";
import { usePlaybackEngine } from "@/hooks/usePlaybackEngine";
import { useGlobalShortcuts } from "./hooks/useGlobalShortcuts";

export default function App() {
    usePlaybackEngine();
    useGlobalShortcuts();

    return (
        <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30">
            <HeaderControls />
            <TimelineContainer />
        </div>
    );
}
