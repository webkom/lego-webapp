import { ProfileSection } from 'app/routes/users/components/UserProfile/ProfileSection';

interface Props {
  emailAddress: string;
}

export const GSuiteInfo = ({ emailAddress }: Props) => (
  <ProfileSection title="Google G Suite">
    <p>
      Din konto er linket opp mot Abakus sitt domene i Google GSuite. E-post
      sendes til denne brukeren og ikke til e-posten du har oppgitt i din
      profil.
    </p>

    <ul>
      <li>
        <b>URL:</b> <a href="http://mail.abakus.no">mail.abakus.no</a>
      </li>
      <li>
        <b>E-post:</b> {emailAddress}
      </li>
      <li>
        <b>Passord:</b> <i>Samme som på abakus.no</i>
      </li>
    </ul>
  </ProfileSection>
);
