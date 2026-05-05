import { Page, LinkButton, Image, Card } from '@webkom/lego-bricks';
import { Package, Contact, Tag } from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Dateish } from 'app/models';
import DisplayContent from '~/components/DisplayContent';
import { readmeIfy } from '~/components/ReadmeLogo';
import TextWithIcon from '~/components/TextWithIcon';
import { useFetchedLendableObject } from '~/pages/lending/@lendableObjectId/useFetchedLendableObject';
import { useAppSelector } from '~/redux/hooks';
import { selectGroupsByIds } from '~/redux/slices/groups';
import { LENDABLE_CATEGORY } from '~/utils/constants';
import truncateString from '~/utils/truncateString';
import { useParams } from '~/utils/useParams';
import LendingCalendar from './LendingCalendar';
import LendingRequestEditor from './LendingRequestEditor';
import styles from './Page.module.css';

export const formatGroups = (groups: { name: string }[]) => {
  return groups.length > 0 ? groups.map((g) => g.name).join(', ') : 'Ukjent';
};

export const LendableObjectList = () => {
  const { lendableObjectId } = useParams<{ lendableObjectId: string }>();
  const { lendableObject, fetching } = useFetchedLendableObject(
    lendableObjectId!,
  );

  const responsibleGroups = useAppSelector((state) =>
    selectGroupsByIds(state, lendableObject?.responsibleGroups),
  );

  const formattedGroups = formatGroups(responsibleGroups) || '';

  const [range, setRange] = useState<[Dateish, Dateish] | undefined>();

  const title = lendableObject ? `Utlån: ${lendableObject.title}` : undefined;
  return (
    <Page
      title={title}
      actionButtons={
        <>
          {!fetching && lendableObject?.actionGrant.includes('edit') ? (
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
            </div>
            {lendableObject.image && (
              <div className={styles.infoRight}>
                <Card className={styles.imageCard}>
                  <Image
                    className={styles.image}
                    alt="image of lendeable object"
                    src={lendableObject.image}
                  />
                </Card>
                <Card className={styles.practicalInfo}>
                  <h4>Praktisk Info:</h4>
                  <TextWithIcon
                    iconNode={<Contact />}
                    size={20}
                    gap={'var(--spacing-xs)'}
                    content={readmeIfy(truncateString(formattedGroups, 15))}
                  />
                  <TextWithIcon
                    iconNode={<Package />}
                    size={20}
                    gap={'var(--spacing-xs)'}
                    content={lendableObject.location}
                  />
                  <TextWithIcon
                    iconNode={<Tag />}
                    size={20}
                    gap={'var(--spacing-xs)'}
                    content={LENDABLE_CATEGORY[lendableObject.category]}
                  />
                </Card>
              </div>
            )}
          </div>
          <div className={styles.border}></div>
          <div className={styles.lendingCalendar}>
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
