import { Icon } from '@webkom/lego-bricks';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import { readmeIfy } from '~/components/ReadmeLogo';
import { useParams } from '~/utils/useParams';
import styles from './PageHierarchy.module.css';
import type { ReactNode } from 'react';
import type { PageDetailParams } from '~/pages/pages/page/+Page';

export type HierarchyEntity = {
  title: string;
  url: string;
};
export type HierarchySectionEntity = {
  title: string;
  items: HierarchyEntity[];
};
type Props = {
  pageHierarchy: HierarchySectionEntity[];
  handleCloseSidebar: () => void;
};

const PageHierarchy = ({ pageHierarchy, handleCloseSidebar }: Props) => (
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

export default PageHierarchy;

type HierarchySectionProps = {
  hierarchySection: HierarchySectionEntity;
  handleCloseSidebar: () => void;
};
const HierarchySection = ({
  hierarchySection: { title, items },
  handleCloseSidebar,
}: HierarchySectionProps) => {
  const { urlPathname } = usePageContext();

  return (
    <nav className={styles.pageList}>
      {items.length > 0 && (
        <AccordionContainer title={title}>
          {items.map((item) => (
            <a href={item.url} key={item.url + item.title}>
              <div className={styles.links} onClick={handleCloseSidebar}>
                <div
                  className={
                    item.url === urlPathname
                      ? styles.selected
                      : styles.nonSelected
                  }
                >
                  {readmeIfy(item.title)}
                </div>
              </div>
            </a>
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
const AccordionContainer = ({ title, children }: AccordionProps) => {
  const { section } = useParams<PageDetailParams>() as PageDetailParams;

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
          iconNode={<ChevronDown />}
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
