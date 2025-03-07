import {
  EmailInfoField,
  InfoField,
  LinkInfoField,
  ProfileSection,
} from '~/pages/(migrated)/users/@username/_components/ProfileSection';

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

    <LinkInfoField name="URL" to="http://mail.abakus.no">
      mail.abakus.no
    </LinkInfoField>
    <EmailInfoField name="E-post" email={emailAddress} />
    <InfoField name="Passord">
      <i>Samme som på abakus.no</i>
    </InfoField>
  </ProfileSection>
);
