import { LoadingIndicator, Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { objectPermissionsToInitialValues } from 'app/components/Form/ObjectPermissions';
import { LendableObjectEditor } from 'app/routes/lending/components/LendableObjectEditor';
import { useFetchedLendableObject } from 'app/routes/lending/useFetchedLendableObject';

export default function LendableObjectEdit() {
  const { lendableObjectId } = useParams<'lendableObjectId'>();
  const { lendableObject, fetching } = useFetchedLendableObject(
    lendableObjectId!,
  );

  const title = fetching ? undefined : `Redigerer: ${lendableObject.title}`;

  return (
    <Page
      title={title}
      back={{ href: `/lending/${lendableObjectId}` }}
      skeleton={fetching}
    >
      <Helmet title={title} />
      {fetching ? (
        <LoadingIndicator loading />
      ) : (
        <LendableObjectEditor
          initialValues={{
            ...lendableObject,
            ...objectPermissionsToInitialValues(lendableObject),
          }}
        />
      )}
    </Page>
  );
}
