// @flow
import type { Node } from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';

import Icon from 'app/components/Icon';
import { readmeIfy } from 'app/components/ReadmeLogo';

import styles from './PageHierarchy.css';

export type HierarchyEntity = {
  title: string,
  url: string,
};

export type HierarchySectionEntity = {
  title: string,
  items: HierarchyEntity[],
};

type Props = {
  pageHierarchy: Array<HierarchySectionEntity>,
  currentUrl: string,
  currentCategory: string,
  handleCloseSidebar: any,
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
  hierarchySection: HierarchySectionEntity,
  currentUrl: string,
  currentCategory: string,
  handleCloseSidebar: any,
}) => (
  <nav className={styles.pageList}>
    {items.length > 0 && (
      <AccordionContainer title={title} currentCategory={currentCategory}>
        {items.map((item, key) => (
          <div key={key} className={styles.links}>
            <Link
              onClick={handleCloseSidebar}
              className={
                item.url === currentUrl ? styles.selected : styles.nonSelected
              }
              to={item.url}
            >
              {readmeIfy(item.title)}
            </Link>
          </div>
        ))}
      </AccordionContainer>
    )}
  </nav>
);

type AccordionProps = {
  title: string,
  children: Node,
  currentCategory: string,
};

type AccordionState = {
  isOpen: boolean,
};

class AccordionContainer extends Component<AccordionProps, AccordionState> {
  state: AccordionState = {
    isOpen:
      this.props.currentCategory === this.props.title.toLowerCase() ||
      (this.props.currentCategory === undefined &&
        this.props.title.toLowerCase() === 'generelt')
        ? true
        : false,
  };

  handleClick = () => {
    this.setState((state) => ({ isOpen: !state.isOpen }));
  };

  render() {
    const { title, children }: AccordionProps = this.props;
    return (
      <div>
        <button className={styles.dropdownBtn} onClick={this.handleClick}>
          {title}{' '}
          {this.state.isOpen ? (
            <Icon className={styles.dropdownIcon} name="arrow-down" />
          ) : (
            <Icon className={styles.dropdownIcon} name="arrow-forward" />
          )}
        </button>{' '}
        {this.state.isOpen ? <div>{children}</div> : null}
      </div>
    );
  }
}
