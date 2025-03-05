import { Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { objectPermissionsInitialValues } from '~/components/Form/ObjectPermissions';
import { LendingRequestEditor } from '../LendingRequestCreate/LendingRequestEditor';

export default function LendingRequestCreate() {
  const title = 'Nytt lån';

  return (
    <Page title={title} back={{ href: `/lending/` }}>
      <Helmet title={title} />
      <LendingRequestEditor>
        initialValues=
        {{
          ...objectPermissionsInitialValues,
        }}
      </LendingRequestEditor>
    </Page>
  );
}
