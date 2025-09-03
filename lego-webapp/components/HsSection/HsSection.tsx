import { Icon, Flex, Card } from "@webkom/lego-bricks";
import { BookOpenText, FileText, ShieldAlert } from "lucide-react";
import styles from './HsSection.module.css';

const HsSectionContent = () => {
    return (
      <Card hideOverflow className={styles.container}>

        <Flex column gap="var(--spacing-xs)">
          <a
            href="https://recondite-physician-fe4.notion.site/Hovedstyret-1c05ae4fac2580b2bb12f5c3ca1093be"
            target="_blank"
            rel="noreferrer"
            className={`${styles.item} ${styles.accentNotion} ${styles.fullWidthButton}`}
          >
            <Icon iconNode={<BookOpenText size={18} />} />
            Notion
          </a>
          <a
            href="https://drive.google.com/drive/folders/1UB6lU3tWvSRK3qIWHasSGCysfD1DLPSA?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className={`${styles.item} ${styles.accentMinutes} ${styles.fullWidthButton}`}
          >
            <Icon iconNode={<FileText size={18} />} />
            Møtereferater
          </a>
          <a
            href="https://portal.mittvarsel.no/skjema/abakus/t3fMsqnZcCaeFX2u.9824?lang=no"
            target="_blank"
            rel="noreferrer"
            className={`${styles.item} ${styles.accentWarning} ${styles.fullWidthButton}`}
          >
            <Icon iconNode={<ShieldAlert size={18} />} />
            Varslingsportal
          </a>
        </Flex>
      </Card>
    )
}

export default HsSectionContent;

