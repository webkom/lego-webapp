import { Helmet } from 'react-helmet-async';
import { Content } from 'app/components/Content';
import Paginator from 'app/components/Paginator';
import type { SurveyEntity } from 'app/reducers/surveys';
import { ListNavigation } from '../../utils';
import SurveyList from './SurveyList';

type Props = {
  surveys: Array<SurveyEntity>;
  fetching: boolean;
  push: (arg0: string) => void;
  hasMore: boolean;
  fetchAll: (arg0: Record<string, any>) => Promise<any>;
};

const SurveyPage = ({ surveys, fetching, hasMore, fetchAll }: Props) => {
  return (
    <Content>
      <Helmet title="Spørreundersøkelser" />
      <ListNavigation title="Spørreundersøkelser" />

      {fetchAll ? (
        <Paginator
          infiniteScroll={true}
          hasMore={hasMore}
          fetching={fetching}
          fetchNext={() => {
            fetchAll({
              next: true,
            });
          }}
        >
          <SurveyList surveys={surveys} fetching={fetching} />
        </Paginator>
      ) : (
        <SurveyList surveys={surveys} fetching={fetching} />
      )}
    </Content>
  );
};

export default SurveyPage;
