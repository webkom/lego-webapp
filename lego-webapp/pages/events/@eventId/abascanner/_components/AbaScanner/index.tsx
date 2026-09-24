import { Flex, Icon } from '@webkom/lego-bricks';
import { get } from 'lodash-es';
import { Scan, Search, X } from 'lucide-react';
import moment from 'moment-timezone';
import { useEffect, useRef, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import styles from './AbaScanner.module.css';
import AttendanceProgress from './AttendanceProgress';
import ManualRegistration from './ManualRegistration';
import RecentScans from './RecentScans';
import ScanResultSheet from './ScanResultSheet';
import { getScanStatus, type RecentScan } from './scanStatus';
import useScanSounds from './useScanSounds';
import type { SelectedAdminRegistration } from '~/redux/slices/events';

const RESUME_DELAY_MS = 2000;
const CARD_GONE_MS = 2500;

type Props = {
  markPresent: (username: string) => Promise<unknown>;
  eventHref: string;
  eventTitle: string;
  presentCount: number;
  attendeeCount: number;
  registrations: SelectedAdminRegistration[];
};

const AbaScanner = ({
  markPresent,
  eventHref,
  eventTitle,
  presentCount,
  attendeeCount,
  registrations,
}: Props) => {
  const isScanning = useRef(false);
  const lastUsername = useRef<string | null>(null);
  const lastSeenAt = useRef(0);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [result, setResult] = useState<RecentScan | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const playScanSound = useScanSounds();

  const resultStatus = result && getScanStatus(result.status);
  const activeStatus = isResultOpen ? resultStatus : null;
  const StatusIcon = activeStatus?.icon;

  const recordScan = (username: string, status: string) => {
    const scan = { username, status, scannedAt: moment().toISOString() };
    setRecentScans((scans) => [scan, ...scans].slice(0, 4));
    setResult(scan);
    setIsResultOpen(true);
    playScanSound(getScanStatus(status).isSuccess);
  };

  const dismissResult = () => {
    setIsResultOpen(false);
    isScanning.current = false;
  };

  useEffect(() => {
    if (!isResultOpen || !resultStatus?.isSuccess) {
      return;
    }
    const timeout = setTimeout(dismissResult, RESUME_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [isResultOpen, resultStatus]);

  const register = (username: string) => {
    isScanning.current = true;
    lastUsername.current = username;
    lastSeenAt.current = Date.now();
    markPresent(username)
      .then(() => recordScan(username, 'success'))
      .catch((error) =>
        recordScan(
          username,
          get(error, 'payload.response.jsonData.errorCode', 'unknown'),
        ),
      );
  };

  const onScan = (username: string) => {
    if (username === lastUsername.current) {
      lastSeenAt.current = Date.now();
      return;
    }
    if (username.length === 0 || isScanning.current) {
      return;
    }
    register(username);
  };

  const openManual = () => {
    setIsResultOpen(false);
    isScanning.current = true;
    setIsManualOpen(true);
  };

  const onManualOpenChange = (isOpen: boolean) => {
    setIsManualOpen(isOpen);
    if (!isOpen) {
      isScanning.current = false;
    }
  };

  const registerManually = (username: string) => {
    setIsManualOpen(false);
    register(username);
  };

  return (
    <div className={styles.scanner}>
      <div className={styles.camera}>
        <Flex
          alignItems="center"
          padding="var(--spacing-md)"
          className={styles.navigationBar}
        >
          <a
            href={eventHref}
            aria-label="Lukk skanner"
            className={styles.navButton}
          >
            <Icon iconNode={<X />} size={25} strokeWidth={1.5} />
          </a>
          <Flex column alignItems="center" className={styles.title}>
            <h3>Scan ABA-ID</h3>
            <span>{eventTitle}</span>
          </Flex>
          <button
            type="button"
            aria-label="Registrer manuelt"
            className={styles.navButton}
            onClick={openManual}
          >
            <Icon iconNode={<Search />} size={22} strokeWidth={1.5} />
          </button>
        </Flex>
        <QrReader
          onResult={(res) => {
            if (res) {
              onScan(res.getText());
            } else if (Date.now() - lastSeenAt.current > CARD_GONE_MS) {
              lastUsername.current = null;
            }
          }}
          constraints={{
            facingMode: 'environment',
          }}
          containerStyle={{ width: '100%', height: 'var(--camera-height)' }}
          videoContainerStyle={{ height: '100%', paddingTop: 0 }}
          videoStyle={{ objectFit: 'cover' }}
        />
        {activeStatus && (
          <div
            className={styles.tint}
            style={{ backgroundColor: activeStatus.color }}
          />
        )}
        <Icon
          iconNode={<Scan />}
          size={250}
          strokeWidth={0.4}
          className={styles.scanIcon}
          style={activeStatus ? { color: activeStatus.color } : undefined}
        />
        {activeStatus && StatusIcon && result && (
          <Flex
            alignItems="center"
            justifyContent="center"
            className={styles.badgeLayer}
          >
            <Flex
              key={`${result.username}-${result.scannedAt}`}
              alignItems="center"
              justifyContent="center"
              className={styles.badge}
              style={{ backgroundColor: activeStatus.color }}
            >
              <StatusIcon size={52} strokeWidth={2} />
            </Flex>
          </Flex>
        )}
      </div>
      <Flex column gap="var(--spacing-lg)" className={styles.drawerContainer}>
        <AttendanceProgress
          presentCount={presentCount}
          attendeeCount={attendeeCount}
        />
        <RecentScans scans={recentScans} />
      </Flex>
      <ScanResultSheet
        result={result}
        isOpen={isResultOpen}
        resumeDelayMs={RESUME_DELAY_MS}
        onDismiss={dismissResult}
      />
      <ManualRegistration
        registrations={registrations}
        isOpen={isManualOpen}
        onOpenChange={onManualOpenChange}
        onRegister={registerManually}
      />
    </div>
  );
};

export default AbaScanner;
