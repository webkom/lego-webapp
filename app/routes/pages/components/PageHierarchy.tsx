import { Icon } from '@webkom/lego-bricks';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom-v5-compat';
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
  handleCloseSidebar: () => void;
};

const PageHierarchy = ({ pageHierarchy, handleCloseSidebar }: Props) => {
  return (
    <div className={styles.sidebar}>
      {pageHierarchy.map((section, key) => (
        <HierarchySection
          hierarchySection={section}
          key={key}
          handleCloseSidebar={handleCloseSidebar}
        />
      ))}
    </div>
  );
};

export default PageHierarchy;

const HierarchySection = ({
  hierarchySection: { title, items },
  handleCloseSidebar,
}: {
  hierarchySection: HierarchySectionEntity;
  handleCloseSidebar: () => void;
}) => {
  const { pathname } = useLocation();

  return (
    <nav className={styles.pageList}>
      {items.length > 0 && (
        <AccordionContainer title={title}>
          {items.map((item) => (
            <Link to={item.url} key={item.url + item.title}>
              <div className={styles.links} onClick={handleCloseSidebar}>
                <div
                  className={
                    item.url === pathname ? styles.selected : styles.nonSelected
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
