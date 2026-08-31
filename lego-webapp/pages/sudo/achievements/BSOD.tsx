import { useEffect, useState } from 'react';
import win95 from './win95.module.css';

export const BSOD_CHANCE = 0.065;
const BSOD_DURATION_MS = 10000;

export const BSOD = () => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setPercent(Math.min(100, Math.round((elapsed / BSOD_DURATION_MS) * 100)));
      if (elapsed >= BSOD_DURATION_MS) {
        clearInterval(interval);
        window.location.reload();
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={win95.bsod}>
      <div className={win95.bsodInner}>
        <p className={win95.bsodTitle}>Windows</p>
        <p className={win95.bsodText}>
          En fatal feil har oppstått i ACHIEVEMENTS.SYS. Systemet stenges ned
          for å forhindre skade på trofé-databasen.
        </p>
        <p className={win95.bsodText}>
          Hvis dette er første gang du ser denne feilen, prøv å gi noen et trofé
          på nytt. Hvis feilen vedvarer, kontakt Webkom.
        </p>
        <p className={win95.bsodStop}>
          *** STOP: 0x0000ABBA (0x00000420, 0xDEADBEEF, 0x00000000, 0x00000000)
        </p>
        <div className={win95.bsodBarTrack}>
          <div className={win95.bsodBarFill} style={{ width: `${percent}%` }} />
        </div>
        <p className={win95.bsodPercent}>Fullført: {percent}%</p>
        <p className={win95.bsodFooter}>
          Ikke slå av datamaskinen. Siden lastes inn på nytt automatisk.
        </p>
      </div>
    </div>
  );
};
