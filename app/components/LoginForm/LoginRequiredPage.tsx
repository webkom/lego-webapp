import { Card } from '@webkom/lego-bricks';
import AuthSection from 'app/components/AuthSection/AuthSection';
import { Content } from 'app/components/Content';

const LoginRequiredPage = () => (
  <Content>
    <Card severity="danger">Denne siden krever innlogging</Card>
    <AuthSection />
  </Content>
);

export default LoginRequiredPage;
