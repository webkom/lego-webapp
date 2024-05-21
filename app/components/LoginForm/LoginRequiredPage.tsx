import { Card, Page } from '@webkom/lego-bricks';
import AuthSection from 'app/components/AuthSection/AuthSection';

const LoginRequiredPage = () => (
  <Page title="Innlogging">
    <Card severity="danger">Denne siden krever innlogging</Card>
    <AuthSection />
  </Page>
);

export default LoginRequiredPage;
