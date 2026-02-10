import styles from './MedCardSkeleton.module.scss';

export const MedCardSkeleton = () => {
    return (
        <div className={styles.skeleton}>
            <div className={styles.shimmer} />
            <div className={styles.shimmer} />
            <div className={`${styles.shimmer} ${styles.small}`} />
        </div>
    );
};
