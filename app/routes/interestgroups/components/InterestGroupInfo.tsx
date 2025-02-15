import { LinkButton, Page } from '@webkom/lego-bricks';
import pkg from '@webkom/react-prepare';
const { usePreparedEffect } = pkg;
import { Helmet } from 'react-helmet-async';
import { fetchPage } from 'app/actions/PageActions';
import DisplayContent from 'app/components/DisplayContent/index';
import { selectFlatpagePage, selectFlatpagePageInfo } from 'app/reducers/pages';
import { useAppDispatch, useAppSelector } from 'app/store/hooks/index';
import styles from './InterestGroup.module.css';

const pageSlug = '39-praktisk-informasjon';
const pageTitle = 'Praktisk informasjon om interessegrupper';

const InterestGroupQuestions = () => {
  const page = useAppSelector((state) => selectFlatpagePage(state, pageSlug));
  const pageInfo = useAppSelector((state) =>
    selectFlatpagePageInfo(state, pageSlug),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect('fetchPageDetail', () => dispatch(fetchPage(pageSlug)), []);

  const actionGrant = pageInfo?.actionGrant ?? [];

  return (
    <Page
      title={pageTitle}
      back={{ href: '/interestgroups', label: 'Interessegrupper' }}
      actionButtons={
        actionGrant.includes('edit') &&
        pageInfo?.editUrl && (
          <LinkButton href={pageInfo?.editUrl}>Rediger</LinkButton>
        )
      }
    >
      <Helmet title={pageTitle} />

      <div className={styles.interestGroupText}>
        <DisplayContent content={page?.content} skeleton={!page?.content} />
      </div>
    </Page>
  );
};

export default InterestGroupQuestions;
