import {
  Button,
  ConfirmModal,
  Icon,
  LoadingIndicator,
  Page,
} from '@webkom/lego-bricks';
import { Trash2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { navigate } from 'vike/client/router';
import { objectPermissionsToInitialValues } from '~/components/Form/ObjectPermissions';
import { useFetchedLendableObject } from '~/pages/lending/@lendableObjectId/useFetchedLendableObject';
import { LendableObjectEditor } from '~/pages/lending/LendableObjectEditor';
import { deleteLendableObject } from '~/redux/actions/LendableObjectActions';
import { useAppDispatch } from '~/redux/hooks';
import { LENDABLE_CATEGORY } from '~/utils/constants';
import { useParams } from '~/utils/useParams';

export default function LendableObjectEdit() {
  const { lendableObjectId } = useParams<{ lendableObjectId: string }>();
  const dispatch = useAppDispatch();
  const { lendableObject, fetching } = useFetchedLendableObject(
    lendableObjectId!,
  );

  const title = fetching ? undefined : `Redigerer: ${lendableObject.title}`;

  const onDelete = async () => {
    await dispatch(deleteLendableObject(lendableObjectId!));
    navigate('/lending');
  };

  return (
    <Page
      title={title}
      back={{ href: `/lending/${lendableObjectId}` }}
      skeleton={fetching}
      actionButtons={
        !fetching &&
        lendableObject.actionGrant.includes('delete') && (
          <ConfirmModal
            title="Slett utlånsobjekt"
            message="Er du sikker på at du vil slette dette utlånsobjektet?"
            onConfirm={onDelete}
            closeOnConfirm
          >
            {({ openConfirmModal }) => (
              <Button onPress={openConfirmModal} danger>
                <Icon iconNode={<Trash2 />} size={19} />
                Slett utlånsobjekt
              </Button>
            )}
          </ConfirmModal>
        )
      }
    >
      <Helmet title={title} />
      {fetching ? (
        <LoadingIndicator loading />
      ) : (
        <LendableObjectEditor
          initialValues={{
            ...lendableObject,
            category: {
              value: lendableObject.category,
              label: LENDABLE_CATEGORY[lendableObject.category],
            },
            ...objectPermissionsToInitialValues(lendableObject),
          }}
        />
      )}
    </Page>
  );
}
