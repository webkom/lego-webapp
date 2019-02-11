// @flow
import { readmeIfy } from 'app/components/ReadmeLogo';

import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './PageHierarchy.css';
import Icon from 'app/components/Icon';

export type HierarchyEntity = {
  title: string,
  url: string
};

export type HierarchySectionEntity = {
  title: string,
  items: HierarchyEntity[]
};

type Props = {
  pageHierarchy: Array<HierarchySectionEntity>,
  currentUrl: string
};

const HierarchySection = ({
  hierarchySection: { title, items },
  currentUrl
}: {
  hierarchySection: HierarchySectionEntity,
  currentUrl: string
}) => (
  <nav className={styles.pageList}>
    {items.length > 0 && (
      <AccordionContainer title={title}>
        {items.map((item, key) => (
          <div key={key} className={styles.links}>
            <Link
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

class AccordionContainer extends Component {
  state = {
    isOpen: true
  };

  handleClick = () => {
    this.setState(state => ({ isOpen: !state.isOpen }));
  };

  render() {
    const { title, children } = this.props;
    return (
      <div>
        <button className={styles.dropdownBtn} onClick={this.handleClick}>
          {title} <Icon className={styles.dropdownIcon} name="arrow-down" />
        </button>{' '}
        {this.state.isOpen ? <div>{children}</div> : null}
      </div>
    );
  }
}

const PageHierarchy = ({ pageHierarchy, currentUrl }: Props) => {
  return (
    <div className={styles.sidebar}>
      {pageHierarchy.map((section, key) => (
        <HierarchySection
          hierarchySection={section}
          key={key}
          currentUrl={currentUrl}
        />
      ))}
    </div>
  );
};

export default PageHierarchy;
