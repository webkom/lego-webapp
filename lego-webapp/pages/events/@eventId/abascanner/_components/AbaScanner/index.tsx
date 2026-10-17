import { Flex, Icon } from '@webkom/lego-bricks';
import {
  IDetectedBarcode,
  Scanner,
  type TrackFunction,
} from '@yudiel/react-qr-scanner';
import { get } from 'lodash-es';
import { Scan, Search, X } from 'lucide-react';
import moment from 'moment-timezone';
import { useEffect, useRef, useState } from 'react';
import loadZXingWasm from '~/utils/loadZXingWasm';
import styles from './AbaScanner.module.css';
import AttendanceProgress from './AttendanceProgress';
import ManualRegistration from './ManualRegistration';
import RecentScans from './RecentScans';
import ScanResultSheet from './ScanResultSheet';
import { getScanStatus, type RecentScan } from './scanStatus';
import useScanSounds from './useScanSounds';
import type { RegistrationSearchResult } from '~/redux/actions/EventActions';
import type { SelectedAdminRegistration } from '~/redux/slices/events';

// TODO: This file should be client only

loadZXingWasm();

type MarkPresentResult = Promise<{ payload: RegistrationSearchResult }>;

const RESUME_DELAY_MS = 2000;
const CARD_GONE_MS = 2500;

const outlineCode: TrackFunction = (detectedCodes, ctx) => {
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  const radius = 10;
  for (const { cornerPoints } of detectedCodes) {
    const n = cornerPoints.length;
    ctx.beginPath();
    ctx.moveTo(
      (cornerPoints[0].x + cornerPoints[n - 1].x) / 2,
      (cornerPoints[0].y + cornerPoints[n - 1].y) / 2,
    );
    cornerPoints.forEach((curr, i) => {
      const next = cornerPoints[(i + 1) % n];
      ctx.arcTo(curr.x, curr.y, next.x, next.y, radius);
    });
    ctx.closePath();
  }
  ctx.fill();
  ctx.stroke();
};

type Props = {
  markPresent: (username: string) => MarkPresentResult;
  markPresentByQr: (qr: string) => MarkPresentResult;
  eventHref: string;
  eventTitle: string;
  presentCount: number;
  attendeeCount: number;
  registrations: SelectedAdminRegistration[];
};

const AbaScanner = ({
  markPresent,
  markPresentByQr,
  eventHref,
  eventTitle,
  presentCount,
  attendeeCount,
  registrations,
}: Props) => {
  const isScanning = useRef(false);
  const lastScanned = useRef<string | null>(null);
  const lastSeenAt = useRef(0);
  const [result, setResult] = useState<RecentScan | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const playScanSound = useScanSounds();

  const resultStatus = result && getScanStatus(result.status);
  const activeStatus = isResultOpen ? resultStatus : null;
  const StatusIcon = activeStatus?.icon;

  const recordScan = (username: string, status: string) => {
    const scan = { username, status, scannedAt: moment().toISOString() };
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

  const register = (request: MarkPresentResult, label: string) => {
    isScanning.current = true;
    request
      .then((res) => recordScan(res.payload.user.username, 'success'))
      .catch((error) =>
        recordScan(
          label,
          get(error, 'payload.response.jsonData.errorCode', 'unknown'),
        ),
      );
  };

  const onScan = (qr: string) => {
    if (qr === lastScanned.current) {
      lastSeenAt.current = Date.now();
      return;
    }
    if (qr.length === 0 || isScanning.current) {
      return;
    }
    lastScanned.current = qr;
    lastSeenAt.current = Date.now();
    register(markPresentByQr(qr), 'Ukjent bruker');
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
    register(markPresent(username), username);
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
        <Scanner
          formats={['qr_code']}
          onScan={(detectedCodes: IDetectedBarcode[]) => {
            if (detectedCodes.length > 0) {
              onScan(detectedCodes[0].rawValue);
            } else if (Date.now() - lastSeenAt.current > CARD_GONE_MS) {
              lastScanned.current = null;
            }
          }}
          allowMultiple
          tracker={outlineCode}
          components={{ finder: false }}
          sound={false}
          constraints={{
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          }}
          styles={{
            container: { width: '100%', height: 'var(--camera-height)' },
            video: { objectFit: 'cover' },
          }}
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
        <RecentScans registrations={registrations} />
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
