import { Icon } from '@webkom/lego-bricks';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  currentCategory: string;
  handleCloseSidebar: () => void;
};

const PageHierarchy = ({
  pageHierarchy,
  currentUrl,
  currentCategory,
  handleCloseSidebar,
}: Props) => {
  return (
    <div className={styles.sidebar}>
      {pageHierarchy.map((section, key) => (
        <HierarchySection
          hierarchySection={section}
          key={key}
          currentUrl={currentUrl}
          currentCategory={currentCategory}
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
  currentCategory,
  handleCloseSidebar,
}: {
  hierarchySection: HierarchySectionEntity;
  currentUrl: string;
  currentCategory: string;
  handleCloseSidebar: () => void;
}) => {
  return (
    <nav className={styles.pageList}>
      {items.length > 0 && (
        <AccordionContainer title={title} currentCategory={currentCategory}>
          {items.map((item, key) => (
            <Link to={item.url} key={key}>
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
  currentCategory: string;
};

const AccordionContainer = ({ title, children }: AccordionProps) => {
  const location = useLocation();
  const currentCategory = location.pathname.split('/')[2];

  const [isOpen, setIsOpen] = useState(
    currentCategory === title.toLowerCase() ||
      (currentCategory === 'info-om-abakus' &&
        title.toLowerCase() === 'generelt')
  );

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
