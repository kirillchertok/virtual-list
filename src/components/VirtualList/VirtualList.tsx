import { useEffect, useRef, useState } from 'react';

import { fetchMedCards } from '@/api/mockApi';
import { TOTAL_COUNT } from '@/constants/api';
import { BUFFER, ROW_HEIGHT } from '@/constants/virtualisation';
import type { IMedCard } from '@/types/IMedCard';

import { MedCardRow } from '../MedCards/MedCardRow/MedCardRow';
import { MedCardSkeleton } from '../MedCards/MedCardSkeleton/MedCardSkeleton';
import styles from './VirtualList.module.scss';

export const VirtualList = () => {
    const listRef = useRef<HTMLDivElement>(null);
    const topTriggerRef = useRef<HTMLDivElement>(null);
    const bottomTriggerRef = useRef<HTMLDivElement>(null);

    const loadingRef = useRef(false);

    const [data, setData] = useState<IMedCard[]>([]);
    const [startIndex, setStartIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const visibleCount = Math.ceil((window.innerHeight * 0.9) / ROW_HEIGHT) + BUFFER * 2;

    const endIndex = Math.min(startIndex + visibleCount, TOTAL_COUNT);

    useEffect(() => {
        setLoading(true);
        fetchMedCards(0, visibleCount).then(res => {
            setData(res);
            setLoading(false);
        });
    }, [visibleCount]);

    useEffect(() => {
        if (!listRef.current) return;

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting || loadingRef.current) return;

                    if (entry.target === bottomTriggerRef.current && endIndex < TOTAL_COUNT) {
                        loadDown();
                    }

                    if (entry.target === topTriggerRef.current && startIndex > 0) {
                        loadUp();
                    }
                });
            },
            {
                root: listRef.current,
                rootMargin: '100px',
                threshold: 0,
            }
        );

        if (topTriggerRef.current) {
            observer.observe(topTriggerRef.current);
        }

        if (bottomTriggerRef.current) {
            observer.observe(bottomTriggerRef.current);
        }

        return () => observer.disconnect();
    }, [startIndex, endIndex]);

    const loadDown = () => {
        loadingRef.current = true;
        setLoading(true);

        const nextStart = startIndex + BUFFER;

        fetchMedCards(nextStart, visibleCount).then(res => {
            setData(res);
            setStartIndex(nextStart);
            setLoading(false);
            loadingRef.current = false;
        });
    };

    const loadUp = () => {
        loadingRef.current = true;
        setLoading(true);

        const nextStart = Math.max(0, startIndex - BUFFER);

        fetchMedCards(nextStart, visibleCount).then(res => {
            setData(res);
            setStartIndex(nextStart);
            setLoading(false);
            loadingRef.current = false;
        });
    };

    const topSpacerHeight = startIndex * ROW_HEIGHT;
    const bottomSpacerHeight = (TOTAL_COUNT - endIndex) * ROW_HEIGHT;

    return (
        <div className={styles.container}>
            <div
                className={styles.list}
                ref={listRef}
            >
                <div style={{ height: topSpacerHeight }} />

                <div ref={topTriggerRef} />

                {loading
                    ? Array.from({ length: visibleCount }).map((_, i) => (
                          <MedCardSkeleton key={`skeleton-${i}`} />
                      ))
                    : data.map(item => (
                          <MedCardRow
                              key={item.id}
                              data={item}
                          />
                      ))}

                <div ref={bottomTriggerRef} />

                <div style={{ height: bottomSpacerHeight }} />
            </div>
        </div>
    );
};
