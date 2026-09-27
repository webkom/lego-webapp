import { LineSidebar } from '@webkom/lego-bricks';
import { usePageContext } from 'vike-react/usePageContext';
import { readmeIfy } from '~/components/ReadmeLogo';
import styles from './PageHierarchy.module.css';

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
  handleCloseSidebar?: () => void;
};

const PageHierarchy = ({ pageHierarchy, handleCloseSidebar }: Props) => {
  const { urlPathname } = usePageContext();
  const items = pageHierarchy
    .filter((section) => section.items.length > 0)
    .map((section) => ({
      label: section.title,
      children: section.items.map((item) => ({
        label: item.title,
        labelNode: readmeIfy(item.title),
        href: item.url,
      })),
    }));

  return (
    <LineSidebar
      items={items}
      currentHref={urlPathname}
      ariaLabel="Om Abakus"
      contextLabel="Om Abakus"
      className={styles.sidebar}
      onItemClick={handleCloseSidebar}
    />
  );
};

export default PageHierarchy;
