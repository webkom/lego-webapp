import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useMemo } from 'react';
import { QRCode } from 'react-qrcode-logo';
import abakusBall from '~/assets/abakus-ball.png';
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
        <div className={styles.qrPlate}>{qrCode}</div>
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
