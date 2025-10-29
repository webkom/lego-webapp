import { Page, LinkButton, Image, Card } from '@webkom/lego-bricks';
import { Package } from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Dateish } from 'app/models';
import DisplayContent from '~/components/DisplayContent';
import TextWithIcon from '~/components/TextWithIcon';
import { useFetchedLendableObject } from '~/pages/lending/@lendableObjectId/useFetchedLendableObject';
import { useParams } from '~/utils/useParams';
import LendingCalendar from './LendingCalendar';
import LendingRequestEditor from './LendingRequestEditor';
import styles from './Page.module.css';

export const LendableObjectList = () => {
  const { lendableObjectId } = useParams<{ lendableObjectId: string }>();
  const { lendableObject, fetching } = useFetchedLendableObject(
    lendableObjectId!,
  );
  const [range, setRange] = useState<[Dateish, Dateish] | undefined>();

  const title = lendableObject ? `Utlån: ${lendableObject.title}` : undefined;
  return (
    <Page
      title={title}
      actionButtons={
        <>
          {!fetching && lendableObject.actionGrant.includes('edit') ? (
            <LinkButton href={`/lending/${lendableObjectId}/edit`}>
              Rediger
            </LinkButton>
          ) : undefined}
        </>
      }
      back={{ href: '/lending' }}
      skeleton={fetching}
    >
      <Helmet title={title || 'Utlån'} />
      {lendableObject && (
        <div className={styles.container}>
          <div className={styles.info}>
            <div className={styles.description}>
              {lendableObject && !lendableObject.canLend && (
                <Card severity="warning">
                  Du har ikke tilgang til å låne dette objektet, men kan se det
                  pga. admin-rettigheter.
                </Card>
              )}
              <DisplayContent content={lendableObject.description} />
              <TextWithIcon
                iconNode={<Package />}
                size={20}
                content={lendableObject.location}
              />
            </div>
            {lendableObject.image && (
              <Card className={styles.card}>
                <Image
                  className={styles.image}
                  alt="image of lendeable object"
                  src={lendableObject.image}
                />
              </Card>
            )}
          </div>
          <div className={styles.border} />
          <div>
            <LendingCalendar
              selectedRange={range}
              lendableObjectId={lendableObjectId}
            />
            <LendingRequestEditor onRangeChange={setRange} />
          </div>
        </div>
      )}
    </Page>
  );
};

export default LendableObjectList;
