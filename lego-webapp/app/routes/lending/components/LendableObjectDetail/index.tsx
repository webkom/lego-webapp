import { Page, LinkButton, PageCover, Card } from '@webkom/lego-bricks';
import { Warehouse } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { useFetchedLendableObject } from 'app/routes/lending/useFetchedLendableObject';
import {
  ContentMain,
  ContentSection,
  ContentSidebar,
} from '~/components/Content';
import DisplayContent from '~/components/DisplayContent';
import TextWithIcon from '~/components/TextWithIcon';

export const LendableObjectList = () => {
  const { lendableObjectId } = useParams<'lendableObjectId'>();
  const { lendableObject, fetching } = useFetchedLendableObject(
    lendableObjectId!,
  );

  const title = lendableObject ? `Utlån: ${lendableObject.title}` : undefined;

  return (
    <Page
      title={title}
      cover={<PageCover image={lendableObject?.image} skeleton={fetching} />}
      actionButtons={
        !fetching && lendableObject.actionGrant.includes('edit') ? (
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
