import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function useGlobalShortcuts() {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't intercept if user is typing in an input/textarea
            if (
                document.activeElement?.tagName === "INPUT" ||
                document.activeElement?.tagName === "TEXTAREA"
            ) {
                return;
            }

            const store = useAppStore.getState();

            switch (e.code) {
                case "Space":
                    e.preventDefault();
                    store.setPlaying(!store.isPlaying);
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    store.setCurrentTime(Math.max(0, store.currentTime - 0.5));
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    store.setCurrentTime(store.currentTime + 0.5);
                    break;
                case "KeyZ":
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        if (e.shiftKey) {
                            useAppStore.temporal.getState().redo();
                        } else {
                            useAppStore.temporal.getState().undo();
                        }
                    }
                    break;
                case "KeyY":
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        useAppStore.temporal.getState().redo();
                    }
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);
}
