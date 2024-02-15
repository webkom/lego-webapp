import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import {
  Content,
  ContentMain,
  ContentSection,
  ContentSidebar,
} from 'app/components/Content';
import InfoList from 'app/components/InfoList';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { FromToTime } from 'app/components/Time';
import { lendableObject, request } from './fixtures';

type Params = {
  requestId: string;
};

const LendingRequest = () => {
  const { requestId } = useParams<Params>();

  const infoItems = [
    {
      key: 'Status',
      value: request.status,
    },
    {
      key: 'Tidspenn',
      value: <FromToTime from={request.startTime} to={request.endTime} />,
    },
    {
      key: 'Bruker',
      value: (
        <Link to={`/users/${request.user.username}`}>
          {request.user.fullName}
        </Link>
      ),
    },
  ];

  return (
    <Content>
      <Helmet title={`Forespørsel om utlån av ${lendableObject.title}`} />
      <NavigationTab
        title={`Forespørsel om utlån av ${lendableObject.title}`}
        back={{
          label: 'Tilbake',
          path: '/lending',
        }}
      >
        <NavigationLink to={`/lending/request/${requestId}/admin`}>
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
    </Content>
  );
};

export default LendingRequest;
