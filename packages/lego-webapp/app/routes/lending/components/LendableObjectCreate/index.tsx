import { Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { objectPermissionsInitialValues } from 'app/components/Form/ObjectPermissions';
import { LendableObjectEditor } from 'app/routes/lending/components/LendableObjectEditor';

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
