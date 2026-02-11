import { useEffect } from 'react';

interface UseVirtualScrollObserverProps {
    rootRef: React.RefObject<HTMLDivElement | null>;
    topRef: React.RefObject<HTMLDivElement | null>;
    bottomRef: React.RefObject<HTMLDivElement | null>;
    onLoadUp: () => void;
    onLoadDown: () => void;
    canLoadUp: boolean;
    canLoadDown: boolean;
    loadingRef: React.RefObject<boolean>;
    rootMargin?: string;
    threshold?: number;
}

export const useVirtualScrollObserver = ({
    rootRef,
    topRef,
    bottomRef,
    onLoadUp,
    onLoadDown,
    canLoadUp,
    canLoadDown,
    loadingRef,
    rootMargin = '100px',
    threshold = 0,
}: UseVirtualScrollObserverProps) => {
    useEffect(() => {
        const root = rootRef?.current;
        const top = topRef?.current;
        const bottom = bottomRef?.current;

        if (!root || !top || !bottom) return;

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting || loadingRef.current) {
                        return;
                    }

                    if (entry.target === bottom && canLoadDown) {
                        onLoadDown();
                    }

                    if (entry.target === top && canLoadUp) {
                        onLoadUp();
                    }
                });
            },
            {
                root,
                rootMargin,
                threshold,
            }
        );

        observer.observe(top);
        observer.observe(bottom);

        return () => observer.disconnect();
    }, [
        rootRef,
        topRef,
        bottomRef,
        canLoadUp,
        canLoadDown,
        onLoadUp,
        onLoadDown,
        loadingRef,
        rootMargin,
        threshold,
    ]);
};
