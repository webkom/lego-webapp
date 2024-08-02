import { LinkButton, LoadingPage, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { fetchLendingRequest } from 'app/actions/LendingRequestActions';
import {
  ContentMain,
  ContentSection,
  ContentSidebar,
} from 'app/components/Content';
import InfoList from 'app/components/InfoList';
import { FromToTime } from 'app/components/Time';
import { selectLendableObjectById } from 'app/reducers/lendableObjects';
import { selectLendingRequestById } from 'app/reducers/lendingRequests';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { statusToString } from 'app/store/models/LendingRequest';

const LendingRequest = () => {
  const { lendingRequestId } = useParams<{ lendingRequestId: string }>();
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchRequest',
    () => lendingRequestId && dispatch(fetchLendingRequest(lendingRequestId)),
    [lendingRequestId],
  );

  const lendingRequest = useAppSelector((state) =>
    selectLendingRequestById(state, Number(lendingRequestId)),
  );
  const lendableObject = useAppSelector((state) =>
    selectLendableObjectById(state, lendingRequest?.lendableObject),
  );

  const requestFetching = useAppSelector(
    (state) => state.lendingRequests.fetching,
  );

  if (!lendingRequest || !lendableObject) {
    return <LoadingPage loading={requestFetching} />;
  }

  const infoItems = [
    {
      key: 'Status',
      value: statusToString(lendingRequest.status),
    },
    {
      key: 'Tidsspenn',
      value: (
        <FromToTime
          from={lendingRequest.startDate}
          to={lendingRequest.endDate}
        />
      ),
    },
    {
      key: 'Bruker',
      value: (
        <Link to={`/users/${lendingRequest.author.username}`}>
          {lendingRequest.author.fullName}
        </Link>
      ),
    },
  ];

  const title = `Forespørsel om utlån av ${lendableObject.title}`;
  return (
    <Page
      title={title}
      back={{ href: '/lending' }}
      actionButtons={
        <LinkButton href={`/lending/request/${lendingRequestId}/admin`}>
          Admin
        </LinkButton>
      }
      skeleton={requestFetching}
    >
      {lendingRequest && (
        <>
          <Helmet title={title} />

          <ContentSection>
            <ContentMain>
              <div>
                <h3>Kommentar: </h3>
                {lendingRequest.message}
              </div>
            </ContentMain>
            <ContentSidebar>
              <InfoList items={infoItems} />
            </ContentSidebar>
          </ContentSection>
        </>
      )}
    </Page>
  );
};

export default LendingRequest;
