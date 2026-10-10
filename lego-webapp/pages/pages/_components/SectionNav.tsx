import cx from 'classnames';
import { ChevronRight } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import styles from './SectionNav.module.css';
import type { CSSProperties, MouseEvent, ReactNode, RefObject } from 'react';

type SectionNavPage = {
  label: string;
  labelNode?: ReactNode;
  href: string;
};

type SectionNavSection = {
  label: string;
  pages: SectionNavPage[];
};

type Props = {
  sections: SectionNavSection[];
  ariaLabel: string;
  header?: ReactNode;
  emptyState?: ReactNode;
  expandAll?: boolean;
  onNavigate?: () => void;
  className?: string;
};

const isPlainLeftClick = (event: MouseEvent) =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey;

/*
 * A sticky nav only reaches its sticky offset once the page has scrolled past
 * whatever is above it. Until then it has less room than the viewport, so its
 * max-height follows the space that is actually visible below it. That keeps
 * the whole list reachable by scrolling the nav itself.
 */
const useFitToViewport = (navRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let frame = 0;
    const fit = () => {
      frame = 0;
      const style = getComputedStyle(nav);
      if (style.position !== 'sticky') {
        nav.style.removeProperty('max-height');
        return;
      }
      const gap = parseFloat(style.top) || 0;
      const top = Math.max(nav.getBoundingClientRect().top, gap);
      nav.style.maxHeight = `${window.innerHeight - top - gap}px`;
    };
    const scheduleFit = () => {
      frame ||= requestAnimationFrame(fit);
    };

    fit();
    window.addEventListener('scroll', scheduleFit, { passive: true });
    window.addEventListener('resize', scheduleFit);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleFit);
      window.removeEventListener('resize', scheduleFit);
    };
  }, [navRef]);
};

const SectionNav = ({
  sections,
  ariaLabel,
  header,
  emptyState,
  expandAll = false,
  onNavigate,
  className,
}: Props) => {
  const sectionNavId = useId();
  const navRef = useRef<HTMLElement>(null);
  useFitToViewport(navRef);
  const { urlPathname } = usePageContext();

  // Move the bead as soon as a page is clicked, not when its data has loaded
  const [pendingHref, setPendingHref] = useState<string>();
  useEffect(() => setPendingHref(undefined), [urlPathname]);
  const activeHref = pendingHref ?? urlPathname;

  // Remember the page the bead came from, so it can leave its section towards
  // the new one and arrive there from the side it came from
  const [trail, setTrail] = useState({ current: activeHref, previous: '' });
  if (trail.current !== activeHref) {
    setTrail({ current: activeHref, previous: trail.current });
  }

  const sectionIndexOf = (href: string) =>
    sections.findIndex((section) =>
      section.pages.some((page) => page.href === href),
    );
  const activeSectionIndex = sectionIndexOf(activeHref);
  const previousSectionIndex = sectionIndexOf(trail.previous);
  const activeSection = sections[activeSectionIndex]?.label;

  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(activeSection ? [activeSection] : []),
  );
  useEffect(() => {
    if (!activeSection) return;
    setOpenSections((open) =>
      open.has(activeSection) ? open : new Set(open).add(activeSection),
    );
  }, [activeSection]);

  const toggleSection = (label: string) =>
    setOpenSections((open) => {
      const next = new Set(open);
      if (!next.delete(label)) next.add(label);
      return next;
    });

  const handleLinkClick = (event: MouseEvent, page: SectionNavPage) => {
    if (!isPlainLeftClick(event)) return;
    setPendingHref(page.href);
    onNavigate?.();
  };

  // Which end of its rod the bead exits to or enters from: start is the top
  const getBeadMotion = (index: number) => {
    const changedSection =
      activeSectionIndex >= 0 &&
      previousSectionIndex >= 0 &&
      activeSectionIndex !== previousSectionIndex;
    if (!changedSection) return undefined;
    if (index === activeSectionIndex) {
      return previousSectionIndex < index ? 'enter-start' : 'enter-end';
    }
    if (index === previousSectionIndex) {
      return activeSectionIndex < index ? 'exit-start' : 'exit-end';
    }
    return undefined;
  };

  return (
    <nav
      ref={navRef}
      aria-label={ariaLabel}
      className={cx(styles.sectionNav, className)}
    >
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.scroller}>
        {sections.length === 0 && emptyState}
        <ul className={styles.list}>
          {sections.map((section, index) => {
            const isOpen = expandAll || openSections.has(section.label);
            const panelId = `${sectionNavId}-${index}`;
            const indexOf = (href: string) =>
              section.pages.findIndex((page) => page.href === href);
            const activeIndex = indexOf(activeHref);
            // A leaving bead starts from the page it was on
            const beadIndex =
              activeIndex >= 0 ? activeIndex : indexOf(trail.previous);

            return (
              <li key={section.label}>
                <button
                  type="button"
                  className={cx(
                    styles.sectionButton,
                    index === activeSectionIndex && styles.activeSection,
                  )}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleSection(section.label)}
                >
                  <span className={styles.sectionLabel}>{section.label}</span>
                  <ChevronRight
                    aria-hidden="true"
                    size={16}
                    className={cx(styles.chevron, isOpen && styles.chevronOpen)}
                  />
                </button>

                <div
                  id={panelId}
                  className={cx(styles.panel, isOpen && styles.panelOpen)}
                >
                  <div
                    className={styles.pages}
                    style={
                      {
                        '--bead-index': Math.max(beadIndex, 0),
                      } as CSSProperties
                    }
                  >
                    <span
                      aria-hidden="true"
                      className={cx(
                        styles.bead,
                        activeIndex >= 0 && styles.beadOn,
                      )}
                      data-motion={getBeadMotion(index)}
                    />
                    <ul className={styles.pageList}>
                      {section.pages.map((page) => (
                        <li key={page.href} className={styles.page}>
                          <a
                            href={page.href}
                            title={page.label}
                            className={cx(
                              styles.pageLink,
                              page.href === activeHref && styles.activePageLink,
                            )}
                            aria-current={
                              page.href === urlPathname ? 'page' : undefined
                            }
                            onClick={(event) => handleLinkClick(event, page)}
                          >
                            <span className={styles.pageLabel}>
                              {page.labelNode ?? page.label}
                            </span>
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
      </div>
    </nav>
  );
};

export default SectionNav;
