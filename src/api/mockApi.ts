import { API_DELAY, TOTAL_COUNT } from '@/constants/api';
import type { IMedCard } from '@/types/IMedCard';

export function fetchMedCards(startIndex: number, count: number): Promise<IMedCard[]> {
    return new Promise(resolve => {
        setTimeout(() => {
            const items: IMedCard[] = Array.from({ length: count }, (_, i) => {
                const id = startIndex + i;

                if (id >= TOTAL_COUNT) return null;

                return {
                    id,
                    patient: 'Иванов Иван',
                    phone: '+7 (999) 999-99-99',
                };
            }).filter(Boolean) as IMedCard[];

            resolve(items);
        }, API_DELAY);
    });
}
