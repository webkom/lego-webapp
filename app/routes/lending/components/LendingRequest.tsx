import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { fetchLendingRequest } from 'app/actions/LendingRequestActions';
import {
  Content,
  ContentMain,
  ContentSection,
  ContentSidebar,
} from 'app/components/Content';
import InfoList from 'app/components/InfoList';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { FromToTime } from 'app/components/Time';
import { selectLendingRequestById } from 'app/reducers/lendingRequests';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';

const LendingRequest = () => {
  const { lendingRequestId } = useParams<{ lendingRequestId: string }>();
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchRequest',
    () => lendingRequestId && dispatch(fetchLendingRequest(lendingRequestId)),
    [lendingRequestId],
  );

  const request = useAppSelector((state) =>
    selectLendingRequestById(state, Number(lendingRequestId)),
  );

  const requestFetching = useAppSelector(
    (state) => state.lendingRequests.fetching,
  );

  const infoItems = [
    {
      key: 'Status',
      value: request?.pending ? 'Venter på svar' : 'Godkjent',
    },
    {
      key: 'Tidsspenn',
      value: <FromToTime from={request?.startDate} to={request?.endDate} />,
    },
    {
      key: 'Bruker',
      value: (
        <Link to={`/users/${request?.author?.username}`}>
          {request?.author?.fullName}
        </Link>
      ),
    },
  ];

  const title = `Forespørsel om utlån av ${request?.lendableObject.title}`;
  return (
    <Content skeleton={requestFetching}>
      {request && (
        <>
          <Helmet title={title} />
          <NavigationTab
            title={title}
            back={{
              label: 'Tilbake',
              path: '/lending',
            }}
          >
            <NavigationLink to={`/lending/request/${lendingRequestId}/admin`}>
              Admin
            </NavigationLink>
          </NavigationTab>

          <ContentSection>
            <ContentMain>
              <div>
                <h3>Kommentar: </h3>
                {request.message}
              </div>
            </ContentMain>
            <ContentSidebar>
              <InfoList items={infoItems} />
            </ContentSidebar>
          </ContentSection>
        </>
      )}
    </Content>
  );
};

export default LendingRequest;
