import { Icon } from '@webkom/lego-bricks';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { readmeIfy } from 'app/components/ReadmeLogo';
import styles from './PageHierarchy.css';
import type { ReactNode } from 'react';

export type HierarchyEntity = {
  title: string;
  url: string;
};
export type HierarchySectionEntity = {
  title: string;
  items: HierarchyEntity[];
};
type Props = {
  pageHierarchy: Array<HierarchySectionEntity>;
  currentUrl: string;
  handleCloseSidebar: () => void;
};

const PageHierarchy = ({
  pageHierarchy,
  currentUrl,
  handleCloseSidebar,
}: Props) => {
  return (
    <div className={styles.sidebar}>
      {pageHierarchy.map((section, key) => (
        <HierarchySection
          hierarchySection={section}
          key={key}
          currentUrl={currentUrl}
          handleCloseSidebar={handleCloseSidebar}
        />
      ))}
    </div>
  );
};

export default PageHierarchy;

const HierarchySection = ({
  hierarchySection: { title, items },
  currentUrl,
  handleCloseSidebar,
}: {
  hierarchySection: HierarchySectionEntity;
  currentUrl: string;
  handleCloseSidebar: () => void;
}) => {
  return (
    <nav className={styles.pageList}>
      {items.length > 0 && (
        <AccordionContainer title={title}>
          {items.map((item) => (
            <Link to={item.url} key={item.url + item.title}>
              <div className={styles.links} onClick={handleCloseSidebar}>
                <div
                  className={
                    item.url === currentUrl
                      ? styles.selected
                      : styles.nonSelected
                  }
                >
                  {readmeIfy(item.title)}
                </div>
              </div>
            </Link>
          ))}
        </AccordionContainer>
      )}
    </nav>
  );
};

type AccordionProps = {
  title: string;
  children: ReactNode;
};

type PageParams = {
  section: string;
};

const AccordionContainer = ({ title, children }: AccordionProps) => {
  const { section } = useParams<PageParams>();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (
      section === title.toLowerCase() ||
      (section === 'info-om-abakus' && title.toLowerCase() === 'generelt')
    ) {
      setIsOpen(true);
    }
  }, [section, title]);

  return (
    <div>
      <button className={styles.dropdownBtn} onClick={() => setIsOpen(!isOpen)}>
        {title}
        <Icon
          name="chevron-down-outline"
          className={styles.dropdownIcon}
          style={
            isOpen
              ? { transform: 'rotate(0deg)' }
              : { transform: 'rotate(-90deg)' }
          }
        />
      </button>
      {isOpen && <div className={styles.dropdownContainer}>{children}</div>}
    </div>
  );
};
