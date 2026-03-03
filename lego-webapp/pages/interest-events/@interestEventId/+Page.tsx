import { Heart, Clock, MapPin } from 'lucide-react';
import { AdminSection } from './AdminSection';
import { AttendSection } from './AttendSection';
import { AttendeesSection } from './AttendeesSection';
import { OrganizerSection } from './OrganizerSection';
import styles from './interestEventDetail.module.css';

const interestEventPage = () => {
  return (
    <>
      <div className={styles.mainPage}>
        <img
          className={styles.titleImage}
          src="../../../assets/ordinaergenfors2026_ZzXnBwJ.webp"
        />
        <div className={styles.splitSection}>
          <div className={styles.leftSection}>
            <div className={styles.titleTop}>
              <h1 className={styles.title}>Ordinær general forsamling 2026</h1>
              <Heart className={styles.heartIcon} />
            </div>
            <div className={styles.infoBarTop}>
              <div className={styles.infoBarClock}>
                <Clock className={styles.barIcon} />
                <p>Onsdag 18. feb., 16:15 - 23:00</p>
              </div>
              <div className={styles.infoBarMapPin}>
                <MapPin className={styles.barIcon} />
                <p>R7, Realfagbygget</p>
              </div>
            </div>
            <div className={styles.description}>
              Hva gjør egentlig foreleserne når de ikke foreleser? Finn ut på
              Catch IDI!
              <br />
              <br />
              IDI, instituttet for datateknologi og informatikk, inviterer alle
              sine studenter til å delta på Catch IDI. En konferanse for hele
              IDI, med mål om å inspirere og motivere studenter og ansatte. Vi
              vil at alle på IDI skal få tilbringe en spennende dag på å finne
              ut hva som egentlig skjer på instituttet!
              <br />
              <br />
              I det faglige opplegget på dagen vil det holdes keynotes fra
              Professor Keith Downing og vår egen instituttleder Heri
              Ramampario. Vi får også et spennende foredrag fra Astar om deres
              reise fra San Francisco til Kyiv!
              <br />
              <br />
              Det vil bli servert lunsj, snacks og drikke i løpet av dagen. Det
              hele avsluttes med en tre-retters middag med underholdning.
              <br />
              <br />
              Dagarrangementet skjer på A-blokka, med oppstart I R1.
              Bankettmiddagen foregår på Scandic Nidelven! Du vil få et
              påmeldingsbevis ved registrering som må medbringes for å komme inn
              på kveldsarrangementet. Vi gleder oss til å se deg! Antrekk:
              Business Casual
              <br />
              <br />
              Program: 11:00 - Registrering ved R1, realfagsbygget 11:30 -
              Konferanseåpning og foredrag 13:00 - Lunsj og mingling 13:45 -
              Sesjon 1 14:30 - Sesjon 2 15:15 - Sesjon 3 16:00 - Oppsummering i
              storsalen 18:00 - Middag og underholdning på Scandic Nidelven
            </div>
          </div>
          <div className={styles.rightSection}>
            <AttendeesSection />
            <AttendSection />
            <OrganizerSection />
            <AdminSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default interestEventPage;
