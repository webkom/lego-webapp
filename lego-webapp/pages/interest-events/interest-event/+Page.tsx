import { Heart, Clock, MapPin } from 'lucide-react';
import styles from './event.module.css';



const interestEventPage = () => {
    return (
        <>
            <div className={styles.mainPage}>
                <img className={styles.titleImage} src={"../../../assets/ordinaergenfors2026_ZzXnBwJ.webp"} />
                <div className={styles.titleTop}>
                    <h1 className={styles.title}>Ordinær generalforsamling 2026</h1>
                    <Heart className={styles.heartIcon} />
                </div>
                <div className={styles.infoBarTop}>
                    <div className={styles.infoBarClock}>
                        <Clock className={styles.barIcon} />
                        <p>onsdag 18. feb., 16:15 - 23:00</p>
                    </div>
                    <div className={styles.infoBarMapPin}>
                        <MapPin className={styles.barIcon} />
                        <p>R7, Realfagbygget</p>
                    </div>
                </div>

            </div>
        </>
    )
}

export default interestEventPage