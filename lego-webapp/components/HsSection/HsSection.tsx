import { Icon, Flex } from '@webkom/lego-bricks';
import { BookOpenText, FileText, MailWarning } from 'lucide-react';
import styles from './HsSection.module.css';

const HsSectionContent = () => {
  return (
    <div className={styles.container}>
      <Flex column gap="var(--spacing-xs)">
        <a
          href="https://recondite-physician-fe4.notion.site/Hovedstyret-1c05ae4fac2580b2bb12f5c3ca1093be"
          target="_blank"
          rel="noreferrer"
          className={`${styles.item} ${styles.accentNotion} ${styles.fullWidthButton}`}
        >
          <Icon iconNode={<BookOpenText size={18} />} />
          <div className={styles.textWrapper}>
            <h4 className={styles.title}>Notion</h4>
            <span className={`secondaryFontColor ${styles.subtext}`}>
              Dokumentasjon, rutiner og nyttig info
            </span>
          </div>
        </a>
        <a
          href="https://drive.google.com/drive/folders/0B81c-8ZaKBCgUjFPS2Nab3VpVWM?resourcekey=0-xn6rSLIJmRJk78ZFzym5sQ&usp=drive_link"
          target="_blank"
          rel="noreferrer"
          className={`${styles.item} ${styles.accentMinutes} ${styles.fullWidthButton}`}
        >
          <Icon iconNode={<FileText size={18} />} />
          <div className={styles.textWrapper}>
            <h4 className={styles.title}>Møtereferater</h4>
            <span className={`secondaryFontColor ${styles.subtext}`}>
              {' '}
              Møtereferater fra HS-møter
            </span>
          </div>
        </a>
        <a
          href="https://portal.mittvarsel.no/skjema/abakus/t3fMsqnZcCaeFX2u.9824?lang=no"
          target="_blank"
          rel="noreferrer"
          className={`${styles.item} ${styles.accentWarning} ${styles.fullWidthButton}`}
        >
          <Icon iconNode={<MailWarning size={18} />} />
          <div className={styles.textWrapper}>
            <h4 className={styles.title}>Varslingsportal</h4>
            <span className={`secondaryFontColor ${styles.subtext}`}>
              Send inn et anonymt varsel
            </span>
          </div>
        </a>
      </Flex>
    </div>
  );
};

export default HsSectionContent;
