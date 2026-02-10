import { useEffect } from 'react';

import { fetchMedCards } from '@/api/mockApi';
import { BUFFER, ROW_HEIGHT } from '@/constants/virtualisation';
import type { IMedCard } from '@/types/IMedCard';

export const useUpdateCards = (
    data: IMedCard[],
    setData: (any) => void,
    scrollTop: number,
    viewportHeight: number
) => {
    const visibleCount = Math.ceil(viewportHeight / ROW_HEIHT);
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
};
