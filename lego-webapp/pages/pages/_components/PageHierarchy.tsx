import { Search } from 'lucide-react';
import { useState } from 'react';
import EmptyState from '~/components/EmptyState';
import { TextInput } from '~/components/Form';
import { readmeIfy } from '~/components/ReadmeLogo';
import styles from './PageHierarchy.module.css';
import SectionNav from './SectionNav';

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

const matches = (text: string, query: string) =>
  text.toLowerCase().includes(query);

const PageHierarchy = ({ pageHierarchy, handleCloseSidebar }: Props) => {
  const [search, setSearch] = useState('');
  const query = search.trim().toLowerCase();

  const sections = pageHierarchy
    .filter((section) => section.items.length > 0)
    .map((section) => ({
      label: section.title,
      pages: section.items
        .filter(
          (item) => matches(section.title, query) || matches(item.title, query),
        )
        .map((item) => ({
          label: item.title,
          labelNode: readmeIfy(item.title),
          href: item.url,
        })),
    }))
    .filter((section) => section.pages.length > 0);

  return (
    <SectionNav
      sections={sections}
      ariaLabel="Om Abakus"
      className={styles.sidebar}
      expandAll={query.length > 0}
      header={
        <TextInput
          prefixIconNode={<Search />}
          placeholder="Søk etter sider"
          aria-label="Søk etter sider"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Escape' || !search) return;
            // Clear the search first, so Escape doesn't also close the drawer
            e.stopPropagation();
            setSearch('');
          }}
        />
      }
      emptyState={<EmptyState body="Ingen treff" className={styles.empty} />}
      onNavigate={handleCloseSidebar}
    />
  );
};

export default PageHierarchy;
