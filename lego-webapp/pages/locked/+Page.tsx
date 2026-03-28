import { Flex, Button, Icon } from '@webkom/lego-bricks';
import { Lock, LockOpen } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TextInput } from '~/components/Form';
import { useCurrentUser } from '~/redux/slices/auth';

const STEP = 250;
const MAX_GOAL = 10000;
const MAX_HUMAN_CPS = 16;
const MIN_CLICK_INTERVAL = 1000 / MAX_HUMAN_CPS;
const EVENT_COUNT = 5;
const EVENT_WINDOW = 500;
const EVENT_TIME_LIMIT_MS = 20_000;

const milestoneTexts = [
  'Låsen ser helt upåvirket ut.',
  'Et nesten uhørbart knepp. Sannsynligvis innbilt.',
  'Metallet gir fra seg et lite sukk.',
  'Det føles som om noe snart skjer.',
  'En mikroskopisk sprekk. Kanskje.',
  'Låsen virker lettere stresset.',
  'Det knirker på en dramatisk måte.',
  'Du er nå i aktiv konflikt med mekanikken.',
  'Det må da snart løsne litt?',
  'Små tegn til panikk i hengslene.',
  'Låsen begynner å tvile på seg selv.',
  'Et nytt knepp. Helt sikkert ekte denne gangen.',
  'Strukturen virker... filosofisk svekket.',
  'Du har oppnådd mekanisk utholdenhet.',
  'Låsen later som den fortsatt har kontroll.',
  'Et kritisk nivå av symbolsk skade er nådd.',
  'Dette ser veldig lovende ut. Kanskje.',
  'Det høres ut som fremgang, men ingen vet.',
  'Metallet vurderer livsvalgene sine.',
  'Nå er det bare vilje mot vilje.',
  'Halvveis til absolutt ingenting.',
  'Låsen holder, men med dårlig holdning.',
  'Du har nesten overbevist fysikken.',
  'Merkbar dramatikk i hele konstruksjonen.',
  'Systemet rapporterer: nesten sikkert snart.',
  'Dette hadde fungert i et annet univers.',
  'Flere klikk må til. Mange flere.',
  'Låsen skjelver av ren teaterkraft.',
  'Du er nå profesjonell låseplager.',
  'Noe er i ferd med å skje. Neppe riktig noe.',
  'Kritisk stemning oppnådd.',
  'Det burde vært ulåst nå, egentlig.',
  'Låsen forhandler i ond tro.',
  'Den gir ikke opp. Ikke du heller.',
  'Overraskende robust for en så dramatisk lås.',
  'Det finnes nå mest sannsynlig imaginære sprekker.',
  'Nærmer seg total estetisk kollaps.',
  'Mekanisk tillit er fullstendig borte.',
  'Du har gått for langt til å stoppe nå.',
  '10 000 nærmer seg. Låsen er nervøs.',
  'Låsen knuste. Utrolig nok hjalp det ikke.',
];

const eventMessages = [
  'En drage dukker opp! Skynd deg, grip sverdet!',
  'En sint trollmann sperrer veien! Løs gåten før han forbanner deg!',
  'En mimikk-kiste hopper frem! Bevis at du er raskere enn tennene dens!',
  'Et gammelt runeseil blafrer opp! Knekk koden før det lukker seg!',
  'En goblin stikker av med nøkkelen! Regn fort før den forsvinner!',
  'En forbannet ridder peker på deg! Vis din verdighet med hoderegning!',
  'Et spøkelse hvisker i mørket! Svar riktig før det trekker deg inn!',
  'En vaktdrage gjesper ild! Grip sjansen og løs oppgaven!',
  'En portal åpner seg! Bare de kvikke slipper gjennom!',
  'En rusten automat våkner! Tast inn svaret før den nullstiller alt!',
  'En skygge løfter sverdet sitt! Bevis at du fortjener å passere!',
  'Et tordenskrall ryster skjermen! Regn riktig før stormen slår ned!',
  'En slu alv har gjemt låsens hemmelighet i et regnestykke!',
  'En isgolem knaker mot deg! Tin den med riktig svar!',
  'En gravrøver ler hånlig! Vis at hjernen din er skarpere enn dolken hans!',
  'Et kaosøye stirrer på deg! Bryt forbannelsen med PEMDAS!',
  'En mekanisk drage klikker i gang! Løs koden før den fyrer av!',
  'Et runesverd setter seg fast i steinen! Bare riktig svar løsner det!',
  'En mørk vokter stenger passasjen! Regn nå, eller begynn på nytt!',
  'Et urgammelt urverk våkner! Svar før tiden renner ut!',
];

type CaptchaChallenge = {
  expression: string;
  answer: number;
};

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickRandom = <T,>(items: T[], exclude?: T): T => {
  const pool =
    exclude === undefined ? items : items.filter((item) => item !== exclude);
  return pool[randomInt(0, pool.length - 1)];
};

const buildCaptcha = (): CaptchaChallenge => {
  const mode = randomInt(0, 3);

  if (mode === 0) {
    const a = randomInt(2, 12);
    const b = randomInt(2, 12);
    const c = randomInt(1, 20);
    return {
      expression: `${a} + ${b} × ${c}`,
      answer: a + b * c,
    };
  }

  if (mode === 1) {
    const a = randomInt(2, 12);
    const b = randomInt(2, 12);
    const c = randomInt(2, 12);
    return {
      expression: `(${a} + ${b}) × ${c}`,
      answer: (a + b) * c,
    };
  }

  if (mode === 2) {
    const divisor = randomInt(2, 12);
    const quotient = randomInt(2, 12);
    const multiplied = divisor * quotient;
    const extra = randomInt(1, 15);
    return {
      expression: `${multiplied} ÷ ${divisor} + ${extra}`,
      answer: multiplied / divisor + extra,
    };
  }

  const a = randomInt(2, 8);
  const b = randomInt(2, 6);
  const c = randomInt(1, 12);
  const d = randomInt(1, 12);
  return {
    expression: `${a} × (${b} + ${c}) - ${d}`,
    answer: a * (b + c) - d,
  };
};

const createEventThresholds = () => {
  const thresholds: number[] = [];

  for (let i = 1; i <= EVENT_COUNT; i += 1) {
    const center = i * 2000;
    const min = Math.max(1, center - EVENT_WINDOW);
    const max = Math.min(MAX_GOAL - 1, center + EVENT_WINDOW);
    thresholds.push(randomInt(min, max));
  }

  return thresholds.sort((a, b) => a - b);
};

const Locked = () => {
  const currentUser = useCurrentUser();

  const [inputValue, setInputValue] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [lockClicks, setLockClicks] = useState(0);
  const [cps, setCps] = useState(0);
  const [peakCps, setPeakCps] = useState(0);

  const [pop, setPop] = useState(false);
  const [flash, setFlash] = useState(false);
  const [breakPulse, setBreakPulse] = useState(false);
  const [isBroken, setIsBroken] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  const acceptedClickTimesRef = useRef<number[]>([]);
  const lastAcceptedClickRef = useRef(0);
  const eventThresholdsRef = useRef<number[]>(createEventThresholds());
  const triggeredEventIndexesRef = useRef<Set<number>>(new Set());
  const lastEventMessageRef = useRef<string | undefined>(undefined);

  const runRandomEvent = () => {
    const message = pickRandom(eventMessages, lastEventMessageRef.current);
    lastEventMessageRef.current = message;

    const challenge = buildCaptcha();
    const start = Date.now();

    window.alert(
      `${message}\n\nDu har 20 sekunder på å løse denne:\n${challenge.expression}. Trykk Ok for å skrive inn svaret...`,
    );

    const response = window.prompt(
      `Hva er svaret?\n\n${challenge.expression}`,
      '',
    );

    const elapsed = Date.now() - start;
    const parsed = Number(response?.trim());

    if (
      response === null ||
      elapsed > EVENT_TIME_LIMIT_MS ||
      Number.isNaN(parsed) ||
      parsed !== challenge.answer
    ) {
      window.alert('For treg eller feil svar. Siden lastes inn på nytt.');
      window.location.reload();
      return false;
    }

    window.alert('Riktig! Du unnslapp så vidt.');
    return true;
  };

  const handleSubmit = () => {
    if (!currentUser) return;

    if (inputValue.trim() === String(currentUser.id)) {
      setIsAuthorized(true);
      setFlash(true);
      setBreakPulse(true);
      setIsBroken(false);
      return;
    }

    setWrongAttempt(true);
  };

  const handleLockClick = () => {
    if (isAuthorized || isBroken) return;

    const now = performance.now();
    const timeSinceLastAccepted = now - lastAcceptedClickRef.current;

    if (
      lastAcceptedClickRef.current !== 0 &&
      timeSinceLastAccepted < MIN_CLICK_INTERVAL
    ) {
      return;
    }

    lastAcceptedClickRef.current = now;

    const recentClicks = [...acceptedClickTimesRef.current, now].filter(
      (time) => now - time <= 1000,
    );
    acceptedClickTimesRef.current = recentClicks;

    const currentCps = recentClicks.length;
    setCps(currentCps);
    setPeakCps((prev) => Math.max(prev, currentCps));

    const next = lockClicks + 1;

    const eventIndex = eventThresholdsRef.current.findIndex(
      (threshold, index) =>
        next >= threshold && !triggeredEventIndexesRef.current.has(index),
    );

    if (eventIndex !== -1) {
      triggeredEventIndexesRef.current.add(eventIndex);
      const survived = runRandomEvent();

      if (!survived) {
        return;
      }
    }

    setLockClicks(next);
    setPop(true);

    if (next % STEP === 0) {
      setFlash(true);
    }

    if (next > 3000) {
      setBreakPulse(true);
    }

    if (next >= MAX_GOAL) {
      setIsBroken(true);
      setFlash(true);
      setBreakPulse(true);
    }
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = performance.now();
      const recentClicks = acceptedClickTimesRef.current.filter(
        (time) => now - time <= 1000,
      );
      acceptedClickTimesRef.current = recentClicks;
      setCps(recentClicks.length);
    }, 100);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!pop) return;
    const timeout = window.setTimeout(() => setPop(false), 120);
    return () => window.clearTimeout(timeout);
  }, [pop]);

  useEffect(() => {
    if (!flash) return;
    const timeout = window.setTimeout(() => setFlash(false), 260);
    return () => window.clearTimeout(timeout);
  }, [flash]);

  useEffect(() => {
    if (!breakPulse) return;
    const timeout = window.setTimeout(() => setBreakPulse(false), 180);
    return () => window.clearTimeout(timeout);
  }, [breakPulse]);

  useEffect(() => {
    if (!wrongAttempt) return;
    const timeout = window.setTimeout(() => setWrongAttempt(false), 420);
    return () => window.clearTimeout(timeout);
  }, [wrongAttempt]);

  const boundedClicks = Math.min(lockClicks, MAX_GOAL);
  const milestoneIndex = Math.min(
    Math.floor(boundedClicks / STEP),
    milestoneTexts.length - 1,
  );

  const currentMilestone = isAuthorized ? 'INF' : milestoneIndex * STEP;
  const nextMilestone = isAuthorized
    ? '∞'
    : isBroken
      ? 'For sent'
      : Math.min((milestoneIndex + 1) * STEP, MAX_GOAL);

  const currentText = isAuthorized
    ? 'Identitet bekreftet. Låsen ga opp umiddelbart.'
    : milestoneTexts[milestoneIndex];

  const fakeDamage = isAuthorized
    ? 'INF'
    : Math.min(100, Math.round((boundedClicks / MAX_GOAL) * 100));

  const stageLabel = useMemo(() => {
    if (isAuthorized) return 'Fullstendig transcendert lås';
    if (isBroken) return 'Fullstendig mekanisk kollaps';
    if (lockClicks < 1000) return 'Stabil lås';
    if (lockClicks < 2500) return 'Overflatisk skade';
    if (lockClicks < 5000) return 'Økende struktursvikt';
    if (lockClicks < 7500) return 'Kritisk belastning';
    return 'Nær total kollaps';
  }, [isAuthorized, isBroken, lockClicks]);

  const iconColor = useMemo(() => {
    if (isAuthorized) {
      return 'hsl(140 85% 40%)';
    }

    const progress = Math.min(boundedClicks / MAX_GOAL, 1);
    const hue = 120 - progress * 120;
    return `hsl(${hue} 85% 45%)`;
  }, [boundedClicks, isAuthorized]);

  const iconStyle = useMemo(() => {
    if (isAuthorized) {
      return {
        color: iconColor,
        transform: 'scale(1.08) rotate(-8deg)',
        transition: 'transform 180ms ease, filter 180ms ease, color 180ms ease',
        filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.45))',
      } as const;
    }

    if (isBroken) {
      return {
        color: iconColor,
        transform: 'scale(1.12) rotate(-18deg) translateY(6px)',
        transition: 'transform 180ms ease, filter 180ms ease, color 180ms ease',
        filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.5))',
      } as const;
    }

    const intensity = Math.min(lockClicks / 1000, 10);
    const rotate =
      lockClicks === 0
        ? 0
        : ((lockClicks % 2 === 0 ? 1 : -1) * Math.min(8, intensity)) / 1.5;

    const translateX =
      lockClicks < 500
        ? 0
        : (lockClicks % 3 === 0 ? -1 : 1) * Math.min(10, intensity * 1.2);

    const scale = pop ? 1.12 : flash ? 1.18 : breakPulse ? 1.08 : 1;

    return {
      color: iconColor,
      transform: `translateX(${translateX}px) rotate(${rotate}deg) scale(${scale})`,
      transition: wrongAttempt
        ? 'transform 60ms ease, color 180ms ease'
        : flash
          ? 'transform 70ms ease, color 180ms ease'
          : breakPulse
            ? 'transform 90ms ease, color 180ms ease'
            : 'transform 120ms ease, color 180ms ease',
      filter: wrongAttempt
        ? 'drop-shadow(0 0 10px rgba(255,80,80,0.55))'
        : flash
          ? 'drop-shadow(0 0 14px rgba(255,255,255,0.8))'
          : breakPulse
            ? 'drop-shadow(0 0 8px rgba(255,255,255,0.35))'
            : 'none',
    } as const;
  }, [
    breakPulse,
    flash,
    iconColor,
    isAuthorized,
    isBroken,
    lockClicks,
    pop,
    wrongAttempt,
  ]);

  const crackStyle = useMemo(() => {
    if (isAuthorized) {
      return {
        width: '115px',
        height: '2px',
        background: 'currentColor',
        opacity: 1,
        transform: 'rotate(-10deg) scaleX(1.08)',
        transition: 'all 140ms ease',
        borderRadius: '999px',
        color: iconColor,
      } as const;
    }

    const opacity = isBroken ? 1 : Math.min(lockClicks / 4000, 0.8);
    const width = isBroken
      ? '110px'
      : `${Math.min(90, 20 + lockClicks / 180)}px`;

    return {
      width,
      height: '2px',
      background: 'currentColor',
      opacity,
      transform: isBroken
        ? 'rotate(-18deg) scaleX(1.2)'
        : flash || breakPulse
          ? 'rotate(-12deg) scaleX(1.08)'
          : 'rotate(-12deg)',
      transition: 'all 140ms ease',
      borderRadius: '999px',
      color: iconColor,
    } as const;
  }, [breakPulse, flash, iconColor, isAuthorized, isBroken, lockClicks]);

  return (
    <Flex alignItems="center" column gap="1rem">
      <style>
        {`
          @keyframes wrong-unlock-shake {
            0% { transform: translateX(0); }
            15% { transform: translateX(-10px); }
            30% { transform: translateX(10px); }
            45% { transform: translateX(-8px); }
            60% { transform: translateX(8px); }
            75% { transform: translateX(-4px); }
            100% { transform: translateX(0); }
          }

          @keyframes unlocked-bob {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
            100% { transform: translateY(0px); }
          }

          @keyframes egg-pop {
            0% { transform: scale(0.96); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          animation: wrongAttempt ? 'wrong-unlock-shake 420ms ease' : undefined,
        }}
      >
        <button
          type="button"
          onClick={handleLockClick}
          aria-label={isAuthorized ? 'Åpen lås' : 'Lås'}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: isAuthorized || isBroken ? 'default' : 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <div
            style={{
              ...iconStyle,
              animation: isAuthorized
                ? 'unlocked-bob 2s ease-in-out infinite'
                : undefined,
            }}
          >
            <Icon iconNode={isAuthorized ? <LockOpen /> : <Lock />} size={80} />
          </div>

          {(lockClicks >= 1000 || isAuthorized) && <div style={crackStyle} />}

          {(lockClicks >= 3000 || isAuthorized) && (
            <div
              style={{
                ...crackStyle,
                width: isAuthorized ? '90px' : isBroken ? '90px' : '60px',
                transform: isAuthorized
                  ? 'rotate(16deg) scaleX(1.06)'
                  : isBroken
                    ? 'rotate(22deg) scaleX(1.15)'
                    : flash || breakPulse
                      ? 'rotate(16deg) scaleX(1.06)'
                      : 'rotate(16deg)',
              }}
            />
          )}

          {isBroken && !isAuthorized && (
            <>
              <div
                style={{
                  ...crackStyle,
                  width: '70px',
                  transform: 'rotate(55deg) translateY(-8px)',
                }}
              />
              <div
                style={{
                  ...crackStyle,
                  width: '75px',
                  transform: 'rotate(-48deg) translateY(-6px)',
                }}
              />
            </>
          )}
        </button>

        {isAuthorized && (
          <img
            src="../../assets/interest-group-logos/9184e9e6028eb484b8782b9f0cf60190.png"
            alt="An image was supposed to be here but is not"
            width={200}
            style={{
              animation:
                'egg-pop 240ms ease, unlocked-bob 2.4s ease-in-out infinite',
            }}
          />
        )}
      </div>

      <p>Du har det, men sier det sjelden. Andre bruker det hele tiden.</p>

      <TextInput
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <Button onPress={handleSubmit}>Lås opp</Button>

      <Flex alignItems="center" column gap="0.2rem">
        <small>{stageLabel}</small>
        <small>{currentText}</small>
        <small>Klikk: {isAuthorized ? 'INF' : lockClicks}</small>
        <small>CPS: {isAuthorized ? 'INF' : cps}</small>
        <small>Topp CPS: {isAuthorized ? 'INF' : peakCps}</small>
        <small>Skade: {isAuthorized ? 'INF/100' : `${fakeDamage}%`}</small>
        <small>
          Milepæl: {currentMilestone} / {MAX_GOAL}
        </small>
        <small>Neste terskel: {nextMilestone}</small>
      </Flex>
    </Flex>
  );
};

export default Locked;
