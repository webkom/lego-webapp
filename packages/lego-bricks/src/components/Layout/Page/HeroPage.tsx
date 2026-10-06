import cx from 'classnames';
import { BaseCard } from '../../Card/BaseCard';
import Flex from '../Flex';
import styles from './HeroPage.module.css';
import PageContainer from './PageContainer';
import { Sidebar, SidebarContext, SidebarTrigger } from './Sidebar';
import type { SidebarOptions } from './PageContainer';
import type { ReactNode } from 'react';

type HeroPageProps = {
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  className?: string;
  children?: ReactNode;
};

/**
 * Page without a card background, with a large hero heading and optional
 * aside, followed by sections (use `HeroPage.Section`).
 */
const HeroPage = ({
  title,
  lead,
  actions,
  aside,
  className,
  children,
}: HeroPageProps) => (
  <PageContainer card={false}>
    <Flex column className={cx(styles.page, className)}>
      <Flex
        component="section"
        wrap
        alignItems="flex-start"
        className={styles.hero}
      >
        <div className={styles.heroText}>
          <h1>{title}</h1>
          {lead && <p className={styles.lead}>{lead}</p>}
          {actions && (
            <Flex
              wrap
              alignItems="center"
              gap="var(--spacing-md)"
              className={styles.heroActions}
            >
              {actions}
            </Flex>
          )}
        </div>
        {aside && <div className={styles.aside}>{aside}</div>}
      </Flex>
      {children}
    </Flex>
  </PageContainer>
);

type HeroPageSectionProps = {
  title?: ReactNode;
  headerActions?: ReactNode;
  divider?: boolean;
  sidebar?: SidebarOptions;
  id?: string;
  className?: string;
  children: ReactNode;
};

const HeroPageSection = ({
  title,
  headerActions,
  divider = true,
  sidebar,
  id,
  className,
  children,
}: HeroPageSectionProps) => {
  const renderSidebar =
    sidebar &&
    ((props: { close?: () => void }) => (
      <Sidebar title={sidebar.title} close={props.close}>
        {sidebar.content}
      </Sidebar>
    ));

  return (
    <SidebarContext.Provider
      value={
        renderSidebar && {
          side: sidebar.side,
          icon: sidebar.icon,
          render: renderSidebar,
          title: sidebar.title,
        }
      }
    >
      <Flex
        column
        component="section"
        id={id}
        className={cx(styles.section, className)}
      >
        {(title || headerActions || sidebar) && (
          <Flex
            wrap
            alignItems="center"
            justifyContent="space-between"
            gap="var(--spacing-md)"
            className={cx(styles.sectionHeader, divider && styles.divider)}
          >
            {title && <h2>{title}</h2>}
            {sidebar ? (
              <Flex
                justifyContent="flex-end"
                wrap
                alignItems="center"
                gap="var(--spacing-sm)"
              >
                {headerActions}
                <SidebarTrigger />
              </Flex>
            ) : (
              headerActions
            )}
          </Flex>
        )}
        {renderSidebar ? (
          <div
            className={cx(
              styles.sectionBody,
              sidebar.side === 'left' && styles.sidebarLeft,
            )}
          >
            <Flex column gap="var(--spacing-lg)" className={styles.content}>
              {children}
            </Flex>
            <BaseCard shadow className={styles.sidebar}>
              {renderSidebar({})}
            </BaseCard>
          </div>
        ) : (
          children
        )}
      </Flex>
    </SidebarContext.Provider>
  );
};

HeroPage.Section = HeroPageSection;

export default HeroPage;
