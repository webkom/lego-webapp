import { Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { objectPermissionsInitialValues } from '~/components/Form/ObjectPermissions';
import { LendableObjectEditor } from '~/pages/lending/LendableObjectEditor';

export default function LendableObjectCreate() {
  const title = 'Nytt ulånsobjekt';

  return (
    <Page title={title} back={{ href: `/lending/` }}>
      <Helmet title={title} />
      <LendableObjectEditor
        initialValues={{
          ...objectPermissionsInitialValues,
        }}
      />
    </Page>
  );
}
