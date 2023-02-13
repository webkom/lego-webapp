import { Component } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Icon from 'app/components/Icon';
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
type AccordionState = {
  isOpen: boolean;
};

class AccordionContainer extends Component<AccordionProps, AccordionState> {
  state: AccordionState = {
    isOpen:
      this.props.currentCategory === this.props.title.toLowerCase() ||
      (this.props.currentCategory === undefined &&
        this.props.title.toLowerCase() === 'generelt'),
  };
  handleClick = () => {
    this.setState((state) => ({
      isOpen: !state.isOpen,
    }));
  };

  render() {
    const { title, children }: AccordionProps = this.props;
    return (
      <div>
        <button className={styles.dropdownBtn} onClick={this.handleClick}>
          {title}{' '}
          <Icon
            name="chevron-up-outline"
            className={styles.dropdownIcon}
            style={
              this.state.isOpen
                ? { transform: 'rotateX(0deg)' }
                : { transform: 'rotateX(180deg)' }
            }
          />
        </button>{' '}
        {this.state.isOpen ? (
          <div className={styles.dropdownContainer}>{children}</div>
        ) : null}
      </div>
    );
  }
}
