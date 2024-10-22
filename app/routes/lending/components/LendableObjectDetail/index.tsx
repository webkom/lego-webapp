import { Page, LinkButton, PageCover, Card } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Warehouse } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { fetchLendableObjectById } from 'app/actions/LendableObjectActions';
import {
  ContentMain,
  ContentSection,
  ContentSidebar,
} from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import TextWithIcon from 'app/components/TextWithIcon';
import { selectLendableObjectById } from 'app/reducers/lendableObjects';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';

export const LendableObjectList = () => {
  const { lendableObjectId } = useParams<'lendableObjectId'>();
  const dispatch = useAppDispatch();
  const fetching = useAppSelector((state) => state.lendableObjects.fetching);

  usePreparedEffect(
    'fetchLendableObjectById',
    () => dispatch(fetchLendableObjectById(lendableObjectId!)),
    [],
  );

  const lendableObject = useAppSelector((state) =>
    selectLendableObjectById(state, lendableObjectId!),
  );

  const title = lendableObject ? `Utlån: ${lendableObject.title}` : undefined;

  return (
    <Page
      title={title}
      cover={<PageCover image={lendableObject?.image} skeleton={fetching} />}
      actionButtons={
        lendableObject &&
        'actionGrant' in lendableObject &&
        lendableObject.actionGrant.includes('edit') ? (
          <LinkButton href={`/lending/${lendableObjectId}/edit`}>
            Rediger
          </LinkButton>
        ) : undefined
      }
      back={{ href: '/lending' }}
      skeleton={fetching}
    >
      <Helmet title={title || 'Utlån'} />
      {lendableObject && (
        <ContentSection>
          <ContentMain>
            {lendableObject && !lendableObject.canLend && (
              <Card severity="warning">
                Du har ikke tilgang til å låne dette objektet, men kan se det
                pga. admin-rettigheter.
              </Card>
            )}
            <DisplayContent content={lendableObject.description} />
          </ContentMain>
          <ContentSidebar>
            <TextWithIcon
              iconNode={<Warehouse />}
              size={20}
              content={lendableObject.location}
            />
          </ContentSidebar>
        </ContentSection>
      )}
    </Page>
  );
};

export default LendableObjectList;
