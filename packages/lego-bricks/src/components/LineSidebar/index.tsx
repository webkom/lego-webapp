import cx from 'classnames';
import { ChevronRight } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import styles from './LineSidebar.module.css';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';

export type LineSidebarItem = {
  /** Plain-text label, used for keys, callbacks and accessible names. */
  label: string;
  /** Optional rich rendering of the label, e.g. a wordmark. Falls back to `label`. */
  labelNode?: ReactNode;
  href?: string;
  children?: LineSidebarItem[];
};

export type LineSidebarProps = {
  items: Array<string | LineSidebarItem>;
  currentHref?: string;
  accentColor?: string;
  /** Show the number of pages next to each section title. */
  showCount?: boolean;
  onItemClick?: (label: string) => void;
  ariaLabel?: string;
  className?: string;
  contextLabel?: string;
};

const normalizeItem = (item: string | LineSidebarItem): LineSidebarItem =>
  typeof item === 'string' ? { label: item } : item;

const containsHref = (item: LineSidebarItem, href?: string): boolean =>
  !!href &&
  (item.href === href ||
    !!item.children?.some((child) => containsHref(child, href)));

const isPlainLeftClick = (event: MouseEvent) =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey;

/*
 * Layout only ever changes in response to a click or a route change. Hover and
 * focus are paint-only (colour/background), sections open independently so the
 * header you clicked never moves, and the width is fixed by the parent rather
 * than by the labels. Together that rules out expand/collapse feedback loops.
 *
 * Each section's pages sit along a rod, like an abacus, and the current page is
 * marked by a red bead (the dot from the logo). Navigating slides the bead to
 * the next page; it is a single absolutely positioned element moved with
 * transforms, so the animation never affects layout.
 */
export const LineSidebar = ({
  items,
  currentHref,
  accentColor = 'var(--lego-red-color)',
  showCount = true,
  onItemClick,
  ariaLabel = 'Sidebar navigation',
  className,
  contextLabel,
}: LineSidebarProps) => {
  const sidebarId = useId();
  const normalizedItems = items.map(normalizeItem);

  // Move the bead as soon as a page is clicked, not when its data has loaded.
  const [pendingHref, setPendingHref] = useState<string>();
  useEffect(() => setPendingHref(undefined), [currentHref]);
  const activeHref = pendingHref ?? currentHref;

  const currentSectionLabel = normalizedItems.find((item) =>
    containsHref(item, activeHref),
  )?.label;

  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(currentSectionLabel ? [currentSectionLabel] : []),
  );

  // Navigating to a page in a closed section opens it, but never closes others.
  useEffect(() => {
    if (!currentSectionLabel) return;
    setOpenSections((open) =>
      open.has(currentSectionLabel)
        ? open
        : new Set(open).add(currentSectionLabel),
    );
  }, [currentSectionLabel]);

  const toggleSection = (label: string) =>
    setOpenSections((open) => {
      const next = new Set(open);
      if (!next.delete(label)) next.add(label);
      return next;
    });

  const handleLinkClick = (event: MouseEvent, item: LineSidebarItem) => {
    if (isPlainLeftClick(event)) setPendingHref(item.href);
    onItemClick?.(item.label);
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cx(styles.sidebar, className)}
      style={{ '--accent-color': accentColor } as CSSProperties}
    >
      {contextLabel && (
        <div className={styles.contextHeader}>{contextLabel}</div>
      )}

      <ul className={styles.list} data-line-sidebar-layout="accordion">
        {normalizedItems.map((item) => {
          const { label, href, children } = item;
          const key = href || label;

          if (!children?.length) {
            return (
              <li key={key}>
                {href && (
                  <a
                    href={href}
                    className={styles.sectionLink}
                    aria-current={href === currentHref ? 'page' : undefined}
                    onClick={(event) => handleLinkClick(event, item)}
                  >
                    {item.labelNode ?? label}
                  </a>
                )}
              </li>
            );
          }

          const isOpen = openSections.has(label);
          const activeChild = children.findIndex(
            (child) => !!activeHref && child.href === activeHref,
          );
          const panelId = `${sidebarId}-${key}`;

          return (
            <li key={key}>
              <button
                type="button"
                className={cx(
                  styles.sectionButton,
                  label === currentSectionLabel && styles.currentSection,
                )}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleSection(label)}
              >
                <span className={styles.sectionLabel}>
                  {item.labelNode ?? label}
                </span>
                {showCount && (
                  <span aria-hidden="true" className={styles.count}>
                    {children.length}
                  </span>
                )}
                <ChevronRight
                  aria-hidden="true"
                  className={styles.chevron}
                  size={16}
                />
              </button>

              <div
                className={cx(styles.panel, isOpen && styles.panelOpen)}
                id={panelId}
              >
                <div
                  className={styles.tree}
                  style={
                    {
                      '--count': children.length,
                      '--active': Math.max(activeChild, 0),
                    } as CSSProperties
                  }
                >
                  <span
                    aria-hidden="true"
                    className={cx(
                      styles.bead,
                      activeChild >= 0 && styles.beadOn,
                    )}
                    data-line-sidebar-bead
                  />
                  <ul className={styles.childList}>
                    {children.map((child) => (
                      <li
                        key={child.href || child.label}
                        className={styles.branch}
                      >
                        <a
                          href={child.href}
                          className={styles.childLink}
                          title={child.label}
                          aria-current={
                            !!currentHref && child.href === currentHref
                              ? 'page'
                              : undefined
                          }
                          data-active={
                            child.href === activeHref ? '' : undefined
                          }
                          onClick={(event) => handleLinkClick(event, child)}
                        >
                          {child.labelNode ?? child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default LineSidebar;
