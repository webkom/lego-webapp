import { Accordion, BaseCard, Button } from '@webkom/lego-bricks';
import cx from 'classnames';
import { gsap } from 'gsap';
import {
  ChevronDown,
  ClipboardCheck,
  Clock,
  HeartHandshake,
  Info,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import styles from './HowToSection.module.css';
import type { LucideIcon } from 'lucide-react';

type Step = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const steps: Step[] = [
  {
    icon: ClipboardCheck,
    title: 'Registrer lån og retur',
    body: 'Gjør det oversiktlig. Loggfør når du låner og når du leverer.',
  },
  {
    icon: ShieldCheck,
    title: 'Ta vare på utstyret',
    body: 'Behandle alt som om det var ditt eget.',
  },
  {
    icon: Clock,
    title: 'Lever til avtalt tid',
    body: 'Vær presis så neste låner slipper å vente.',
  },
  {
    icon: TriangleAlert,
    title: 'Meld fra om feil',
    body: 'Oppdager du skade? Si fra så fort som mulig.',
  },
];

const HowToTrigger = ({
  onClick,
  open,
}: {
  onClick: () => void;
  open: boolean;
}) => {
  const heartRef = useRef(null);

  useEffect(() => {
    if (!heartRef.current) return;

    // Resolve the brand red from the --lego-red-color token (set on the
    // wrapper) so the sweep stays on-system and theme-aware.
    const redColor = getComputedStyle(heartRef.current).color;

    const ctx = gsap.context(() => {
      const shapes = gsap.utils.toArray<SVGGeometryElement>(
        'svg path, svg line, svg polyline, svg polygon, svg circle, svg rect',
      );

      shapes.forEach((shape) => {
        const length = shape.getTotalLength();

        gsap.set(shape, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 1,
        });
      });

      const tl = gsap.timeline();

      tl.to(
        shapes,
        {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: 'power2.out',
          stagger: 0.06,
        },
        0,
      ).fromTo(
        shapes,
        { stroke: 'var(--lego-font-color)' },
        {
          stroke: redColor,
          duration: 2.3,
          ease: 'power2.out',
        },
        0,
      );
    }, heartRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.intro}>
        <div className={styles.heartIcon} ref={heartRef}>
          <HeartHandshake strokeWidth={1.6} />
        </div>
        <div>
          <h3 className={styles.title}>Hvordan bruke utlånssystemet?</h3>
          <p className={styles.subtitle}>
            Et digitalt lånesystem som gjør utlån enkelt og oversiktlig for
            alle.
          </p>
        </div>
      </div>
      <Button flat onPress={onClick} className={styles.toggle}>
        {open ? 'Skjul' : 'Les mer'}
        <ChevronDown
          className={cx(styles.chevron, open && styles.chevronOpen)}
          size={16}
        />
      </Button>
    </div>
  );
};

const HowToSection = () => (
  <BaseCard className={styles.card}>
    <div className={styles.body}>
      <Accordion triggerComponent={HowToTrigger}>
        <div className={styles.expanded}>
          <div className={styles.steps}>
            {steps.map(({ icon: StepIcon, title, body }) => (
              <div key={title} className={styles.step}>
                <div className={styles.iconTile}>
                  <StepIcon
                    className={styles.tileIcon}
                    size={22}
                    strokeWidth={1.7}
                  />
                </div>
                <div>
                  <h4 className={styles.stepTitle}>{title}</h4>
                  <p className={styles.stepBody}>{body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.footnote}>
            <Info className={styles.footnoteIcon} size={20} strokeWidth={1.7} />
            <p className={styles.footnoteText}>
              Hvert objekt tilhører en komité. Reglene kan derfor variere.
            </p>
          </div>
        </div>
      </Accordion>
    </div>
  </BaseCard>
);

export default HowToSection;
