import { Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import PollEditor from '~/pages/(migrated)/polls/PollEditor';

const PollCreator = () => {
  const title = 'Ny avstemning';
  return (
    <Page title={title} back={{ href: '/polls' }}>
      <Helmet title={title} />
      <PollEditor />
    </Page>
  );
};

export default PollCreator;
