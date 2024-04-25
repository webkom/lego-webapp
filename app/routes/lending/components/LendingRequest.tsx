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

type Params = {
  lendingRequestId: string;
};

const LendingRequest = () => {
  const { lendingRequestId } = useParams<Params>();
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchRequest',
    () => dispatch(fetchLendingRequest(Number(lendingRequestId))),
    [],
  );

  const request = useAppSelector((state) =>
    selectLendingRequestById(state, lendingRequestId),
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
      key: 'Tidspenn',
      value: <FromToTime from={request?.startDate} to={request?.endDate} />,
    },
    {
      key: 'Bruker',
      value: (
        <Link to={`/users/${request?.user?.username}`}>
          {request?.author?.fullName}
        </Link>
      ),
    },
  ];

  return (
    <Content skeleton={requestFetching}>
      {request && (
        <>
          <Helmet title={`Forespørsel om utlån av ${request.lendableObject.title}`} />
          <NavigationTab
            title={`Forespørsel om utlån av ${request.lendableObject.title}`}
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
                <h3>Beskjed: </h3>
                {request.message}
              </div>
            </ContentMain>
            <ContentSidebar>
              <InfoList items={infoItems} />
            </ContentSidebar>
          </ContentSection>

          {/* <ContentSection>
        <ContentMain>
          <CommentView
            contentTarget={},
            comments={}
          />
        </ContentMain>
      </ContentSection> */}
        </>
      )}
    </Content>
  );
};

export default LendingRequest;
