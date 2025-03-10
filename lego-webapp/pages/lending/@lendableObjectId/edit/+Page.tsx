import { LoadingIndicator, Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { objectPermissionsToInitialValues } from '~/components/Form/ObjectPermissions';
import { useFetchedLendableObject } from '~/pages/lending/@lendableObjectId/useFetchedLendableObject';
import { LendableObjectEditor } from '~/pages/lending/LendableObjectEditor';
import { useParams } from '~/utils/useParams';

export default function LendableObjectEdit() {
  const { lendableObjectId } = useParams<{ lendableObjectId: string }>();
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
