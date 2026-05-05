import { Flex, Image } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { gsap } from 'gsap';
import moment from 'moment-timezone';
import { useRef } from 'react';
import styles from './ModernFooter.module.css';
import { NAV_COLS, SOCIALS } from './constants';
import type { CSSProperties } from 'react';
import bekk from '~/assets/bekk_short_white.svg';
import { readmeIfy } from '~/components/ReadmeLogo';
import { fetchSystemStatus } from '~/redux/actions/StatusActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'operational':
      return 'var(--success-color)';
    case 'degraded':
      return 'var(--color-orange-6)';
    case 'major':
      return 'var(--danger-color)';
    default:
      return 'var(--color-gray-6)';
  }
};

const ModernFooter = () => {
  const dispatch = useAppDispatch();
  const systemStatus = useAppSelector((state) => state.status.systemStatus);
  const squareRef = useRef<HTMLSpanElement>(null);

  usePreparedEffect(
    'fetchSystemStatus',
    () => dispatch(fetchSystemStatus()),
    [],
  );

  const handleWatermarkEnter = () => {
    gsap.to(squareRef.current, {
      borderRadius: '50%',
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleWatermarkLeave = () => {
    gsap.to(squareRef.current, {
      borderRadius: '0%',
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const statusColor = getStatusColor(systemStatus?.status);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Image
              src="/logo.png"
              alt="Abakus sin logo"
              className={styles.logo}
            />
            <p className={styles.description}>
              Linjeforeningen for studentene ved Datateknologi og Cybersikkerhet
              og datakommunikasjon ved NTNU. Trondheim, Norge.
            </p>
            <p className={styles.address}>
              SEM SÆLANDS VEI 7-9 · 7491 TRONDHEIM
            </p>
            {systemStatus?.status && systemStatus?.message && (
              <a
                href="https://status.abakus.no"
                rel="noopener noreferrer"
                target="_blank"
                className={styles.statusLink}
                style={{ '--status-color': statusColor } as CSSProperties}
              >
                <span
                  className={styles.statusDot}
                  style={{ background: statusColor }}
                />
                <span className={styles.statusMessage}>
                  {systemStatus.message}
                </span>
              </a>
            )}
          </div>

          {NAV_COLS.map((col) => (
            <div key={col.heading} className={styles.navCol}>
              <p className={styles.colHeading}>{col.heading}</p>
              <ul className={styles.linkList}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={styles.navLink}
                      {...('external' in link && link.external
                        ? { rel: 'noopener noreferrer', target: '_blank' }
                        : {})}
                    >
                      {readmeIfy(link.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Flex
          justifyContent="space-between"
          alignItems="center"
          wrap
          className={styles.bottomBar}
        >
          <Flex column alignItems="flex-start" gap="var(--spacing-md)">
            <span className={styles.copyright}>
              <span className={styles.copyrightSymbol}>©</span> 1977—
              {moment().year()} ABAKUS LINJEFORENING
            </span>
          </Flex>
          <Flex gap="var(--spacing-lg)" alignItems="center">
            {SOCIALS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                rel="noopener noreferrer"
                target="_blank"
                className={styles.socialLink}
              >
                <span className={styles.socialLabel}>
                  {label} <span className={styles.socialArrow}>↗</span>
                </span>
              </a>
            ))}
          </Flex>
        </Flex>

        <div
          className={styles.watermark}
          aria-hidden
          onMouseEnter={handleWatermarkEnter}
          onMouseLeave={handleWatermarkLeave}
        >
          ABAKUS
          <span ref={squareRef} className={styles.watermarkSquare} />
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
