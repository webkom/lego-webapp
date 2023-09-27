import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import {
  fetchAll as fetchSurveys,
  fetchTemplates,
} from 'app/actions/SurveyActions';
import { Content } from 'app/components/Content';
import { LoginPage } from 'app/components/LoginForm';
import Paginator from 'app/components/Paginator';
import { selectIsLoggedIn } from 'app/reducers/auth';
import { selectPaginationNext } from 'app/reducers/selectors';
import { selectSurveys, selectSurveyTemplates } from 'app/reducers/surveys';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import { ListNavigation } from '../../utils';
import SurveyList from './SurveyList';

type Props = {
  templates?: boolean;
};
const SurveyListPage = ({ templates }: Props) => {
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const fetchAll = templates ? fetchTemplates : fetchSurveys;

  usePreparedEffect(
    'fetchSurveys',
    () => {
      loggedIn && dispatch(fetchAll());
    },
    [loggedIn, templates]
  );

  const surveys = useAppSelector((state) =>
    templates
      ? selectSurveyTemplates(state)
      : selectSurveys(state).filter((survey) => !survey.templateType)
  );

  const fetching = useAppSelector((state) => state.surveys.fetching);
  const { pagination } = useAppSelector(
    selectPaginationNext({
      endpoint: templates ? '/survey-templates/' : '/surveys/',
      entity: EntityType.Surveys,
      query: {},
    })
  );

  if (!loggedIn) {
    return <LoginPage />;
  }

  return (
    <Content>
      <Helmet title="Spørreundersøkelser" />
      <ListNavigation title="Spørreundersøkelser" />

      <Paginator
        hasMore={pagination.hasMore}
        fetching={fetching}
        fetchNext={() => {
          dispatch(
            fetchAll({
              next: true,
            })
          );
        }}
      >
        <SurveyList surveys={surveys} fetching={fetching} />
      </Paginator>
    </Content>
  );
};

export default SurveyListPage;
