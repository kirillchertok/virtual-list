import type { IMedCard } from '@/types/IMedCard';

import styles from './MedCardRow.module.scss';

interface MedCardRowProps {
    data: IMedCard;
}

export const MedCardRow = ({ data }: MedCardRowProps) => {
    return (
        <div className={styles.row}>
            <div className={styles.cell}>{data.patient}</div>
            <div className={styles.cell}>{data.phone}</div>
            <div className={`${styles.cell} ${styles.id}`}>{data.id}</div>
        </div>
    );
};
