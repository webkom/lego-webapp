import DividerWithDots from '~/components/DividerWithDots';
import Vision from '../Vision';
import styles from './DisplayVision.module.css';

type VisionType = {
  title: string;
  summary: string;
  paragraphs?: string[];
};

type Props = {
  title: string;
  vision1: VisionType;
  vision2: VisionType;
  vision3: VisionType;
  vision4: VisionType;
};

const DisplayVision = ({ vision1, vision2, vision3, vision4 }: Props) => (
  <div className={styles.vision}>
    <div className={styles.sectionLeft}>
      <Vision
        title={vision1.title}
        summary={vision1.summary}
        paragraphs={vision1.paragraphs}
        left
      />
      <Vision
        title={vision2.title}
        summary={vision2.summary}
        paragraphs={vision2.paragraphs}
        left
      />
    </div>

    <DividerWithDots />

    <div className={styles.sectionRight}>
      <Vision
        title={vision3.title}
        summary={vision3.summary}
        paragraphs={vision3.paragraphs}
      />
      <Vision
        title={vision4.title}
        summary={vision4.summary}
        paragraphs={vision4.paragraphs}
      />
    </div>
  </div>
);

DisplayVision.defaultProps = {
  title: 'Våre verdier',
  vision1: {
    title: 'Bærekraftig',
    summary:
      'Vi skal drive linjeforeningen for nåværende og fremtidige abakuler.',
    paragraphs: [
      'Vi forvalter vår eiendom på en måte som gjør at det kommer flest mulig abakuler til gode.',
      'Vi skriver erfaringsskriv for å lære av feil og forbedre det vi driver med.',
      'Vi skal drive linjeforeningen for nåværende og fremtidige abakuler.',
      'Vi skal prøve å gjenbruke fremfor å kjøpe nytt.',
      'Vi gjør trygge økonomiske valg som sikrer et best mulig studentmiljø for nåværende og fremtidige studenter.',
      'Vi tar våre studenters trivsel på alvor.',
    ],
  },
  vision2: {
    title: 'Attraktiv',
    summary:
      'Vi skal være en linjeforening som både studenter og bedrifter tiltrekkes av.',
    paragraphs: [
      'Vi tar vare på de som engasjerer seg i linjeforeningen slik at de føler det arbeidet de gjør er meningsfullt.',
      'Vi har et tilbud for alle våre studenter.',
      'Vi skal ha et variert tilbud av både faglig og ikke-faglige arrangementer.',
      'Vi skal skal være en linjeforening som både studenter og bedrifter tiltrekkes av.',
      'Vi tiltrekker oss et variert utvalg av bedrifter.',
      'Vi er kjent for vårt gode rykte og renomme før, under og etter studietiden.',
    ],
  },
  vision3: {
    title: 'Åpen',
    summary: 'Vi er inkluderende, transparente og dyrker initiativ.',
    paragraphs: [
      'Vi utfordrer bedriftene til å gi det beste tilbud til alle våre medlemmer.',
      'Vi hjelper gjerne og deler av vår kunnskap.',
      'Vi er ærlige overfor hverandre og snakker ikke bak hverandres rygg.',
      'Vi deler det vi kan, så fremt det ikke skader Abakus eller våre samarbeidspartnere.',
      'Vi er inkluderende, transparente og dyrker initiativ.',
      'Vi oppfordrer til tilbakemeldinger og er opptatt å gi det selv.',
    ],
  },
  vision4: {
    title: 'Proaktiv',
    summary:
      'Vi skal aktivt se etter nye muligheter, og være obs på nye utfordringer.',
    paragraphs: [
      'Vi skal aktivt se etter nye muligheter, og være obs på nye utfordringer.',
      'Vi skaffer oss overblikk og gjør tiltak.',
      'Vi jobber for et aktivt alumnimiljø som fortsetter å bidra til Abakus etter at de er ferdige.',
      'Vi klarer å engasjere studentmassen i de sakene som angår våre medlemmer.',
      'Vi skal støtte opp om initiativ og kreativitet.',
      'Vi søker etter samarbeidspartnere for både å lære og lære bort.',
    ],
  },
};

const DisplayVisionShort = ({ vision1, vision2, vision3, vision4 }: Props) => {
  return (
    <div>
      <h2 className={styles.visionTitle}>Våre verdier</h2>
      <div className={styles.vision}>
        <div className={styles.sectionLeft}>
          <Vision title={vision1.title} summary={vision1.summary} left />
          <Vision title={vision2.title} summary={vision2.summary} left />
        </div>

        <DividerWithDots />

        <div className={styles.sectionRight}>
          <Vision title={vision3.title} summary={vision3.summary} />
          <Vision title={vision4.title} summary={vision4.summary} />
        </div>
      </div>
    </div>
  );
};

DisplayVisionShort.defaultProps = {
  title: DisplayVision.defaultProps.title,
  vision1: {
    title: DisplayVision.defaultProps.vision1.title,
    summary: DisplayVision.defaultProps.vision1.summary,
  },
  vision2: {
    title: DisplayVision.defaultProps.vision2.title,
    summary: DisplayVision.defaultProps.vision2.summary,
  },
  vision3: {
    title: DisplayVision.defaultProps.vision3.title,
    summary: DisplayVision.defaultProps.vision3.summary,
  },
  vision4: {
    title: DisplayVision.defaultProps.vision4.title,
    summary: DisplayVision.defaultProps.vision4.summary,
  },
};
export { DisplayVisionShort };
export default DisplayVision;
