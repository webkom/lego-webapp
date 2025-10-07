import { LinkButton, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import DisplayContent from '~/components/DisplayContent';
import { fetchPage } from '~/redux/actions/PageActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import {
  selectFlatpagePage,
  selectFlatpagePageInfo,
} from '~/redux/slices/pages';
import styles from '../InterestGroup.module.css';

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
      back={{ href: '/interest-groups', label: 'Interessegrupper' }}
      actionButtons={
        actionGrant.includes('edit') &&
        pageInfo?.editUrl && (
          <LinkButton href={pageInfo?.editUrl}>Rediger</LinkButton>
        )
      }
    >
      <Helmet title={pageTitle} />

      <div className={styles.interestGroupText}>
        <DisplayContent content={page?.content || ""} skeleton={!page?.content} />
      </div>
    </Page>
  );
};

export default InterestGroupQuestions;
