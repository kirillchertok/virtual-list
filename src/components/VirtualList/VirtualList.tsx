import { useEffect, useRef, useState } from 'react';

import { fetchMedCards } from '@/api/mockApi';
import { BUFFER, ROW_HEIGHT, TOTAL } from '@/constants/virtualisation';
import type { IMedCard } from '@/types/IMedCard';

import { MedCardRow } from '../MedCards/MedCardRow/MedCardRow';
import { MedCardSkeleton } from '../MedCards/MedCardSkeleton/MedCardSkeleton';
import styles from './VirtualList.module.scss';

export function VirtualList() {
    const ref = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(0);
    const [data, setData] = useState<IMedCard[]>([]);

    useEffect(() => {
        if (ref.current) {
            setViewportHeight(ref.current.clientHeight);
        }
    }, []);

    const visibleCount = Math.ceil(viewportHeight / ROW_HEIGHT);
    const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
    const end = Math.min(TOTAL, start + visibleCount + BUFFER * 2);

    useEffect(() => {
        const missing = [];
        for (let i = start; i < end; i++) {
            if (!data[i]) missing.push(i);
        }
        if (!missing.length) return;

        fetchMedCards(missing[0], missing.length).then(items => {
            setData(prev => {
                const next = { ...prev };
                items.forEach(i => (next[i.id] = i));
                return next;
            });
        });
    }, [start, end]);

    return (
        <div
            className={styles.container}
            ref={ref}
            onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
        >
            <div className={styles.spacer}>
                <div
                    className={styles.window}
                    style={{ transform: `translateY(${start * ROW_HEIGHT}px)` }}
                >
                    {Array.from({ length: end - start }).map((_, i) => {
                        const index = start + i;
                        const item = data[index];

                        return item ? (
                            <MedCardRow
                                key={index}
                                data={item}
                            />
                        ) : (
                            <MedCardSkeleton key={index} />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
