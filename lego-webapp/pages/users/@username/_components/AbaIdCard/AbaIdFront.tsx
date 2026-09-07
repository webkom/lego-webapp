import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useMemo, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import abakusBall from '~/assets/abakus-ball.png';
import { Websockets as WebsocketsAT } from '~/redux/actionTypes';
import { PublicEvent } from '~/redux/models/Event';
import { useSocketTransientEvent } from '~/redux/websocketTransientEvent';
import useAttendanceCheckReveal from './useAttendanceCheckReveal';
import styles from './AbaIdCard.module.css';

type Props = {
  fullName: string;
  username: string;
  grade?: string;
  hidden: boolean;
};

const AbaIdFront = ({ fullName, username, grade, hidden }: Props) => {
  const qrCode = useMemo(
    () => (
      <QRCode
        value={username}
        ecLevel="H"
        size={236}
        quietZone={8}
        bgColor="#ffffff"
        fgColor="#000000"
        qrStyle="fluid"
        eyeRadius={{ outer: 20, inner: 5 }}
        logoImage={abakusBall}
        logoWidth={50}
        logoHeight={50}
        logoPadding={3}
        logoPaddingStyle="circle"
        removeQrCodeBehindLogo
      />
    ),
    [username],
  );
  const [registeredAttendance, setRegisteredAttendance] = useState<PublicEvent>();
  const { circleRef, checkRef, labelRef, play } = useAttendanceCheckReveal();

  useSocketTransientEvent<PublicEvent>(
    WebsocketsAT.TRANSIENT.ATTENDANCE_REGISTERED,
    (payload) => {
      setRegisteredAttendance(payload);
      play(() => setRegisteredAttendance(undefined));
    },
  );

  return (
    <Flex
      column
      className={cx(styles.face, styles.front)}
      aria-hidden={hidden}
      data-test-id="AbaId__front"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <img
          src="/logo-dark.png"
          alt="Abakus sin logo"
          className={cx(styles.wordmark, styles.wordmarkLightMode)}
        />
        <img
          src="/logo.png"
          alt="Abakus sin logo"
          className={cx(styles.wordmark, styles.wordmarkDarkMode)}
        />
        <span className={styles.eyebrow}>ABA-ID</span>
      </Flex>

      <Flex column justifyContent="center" className={styles.frontBody}>
        <div className={styles.qrPlate}>
          {qrCode}
          <div className={styles.attendanceCircle} ref={circleRef}>
            <svg
              ref={checkRef}
              className={styles.attendanceCheck}
              viewBox="0 0 52 52"
              aria-hidden
            >
              <polyline points="14,27 22,35 39,16" />
            </svg>
            <span className={styles.attendanceLabel} ref={labelRef}>
              Ankomst registrert
              <br />
              {registeredAttendance?.title}
            </span>
          </div>
        </div>
        <Flex column alignItems="center" gap="var(--spacing-sm)">
          <h2 className={styles.name}>{fullName}</h2>
          {grade && <span className={styles.gradePill}>{grade}</span>}
        </Flex>
      </Flex>

      <Flex
        alignItems="center"
        justifyContent="space-between"
        className={styles.faceFooter}
      >
        <span>abakus.no</span>
        <span>NTNU · TRONDHEIM</span>
      </Flex>

      <div className={styles.edge} />
      <div className={styles.foil} />
    </Flex>
  );
};

export default AbaIdFront;
