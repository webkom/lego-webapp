import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { useRouteMatch } from 'react-router-dom';
import {
  fetchAll,
  fetchTemplate,
  fetchTemplates,
} from 'app/actions/SurveyActions';
import { Content } from 'app/components/Content';
import { LoginPage } from 'app/components/LoginForm';
import Paginator from 'app/components/Paginator';
import { selectSurveys, selectSurveyTemplates } from 'app/reducers/surveys';
import { useUserContext } from 'app/routes/app/AppRoute';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { ListNavigation } from '../../utils';
import SurveyList from './SurveyList';

const SurveyPage = () => {
  const { path } = useRouteMatch();
  const isTemplatesRoute = path.includes('templates');

  const { loggedIn } = useUserContext();
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchSurveys',
    () => {
      loggedIn && dispatch(isTemplatesRoute ? fetchTemplates() : fetchAll());
    },
    [loggedIn]
  );

  const surveys = useAppSelector((state) =>
    isTemplatesRoute
      ? selectSurveyTemplates(state)
      : selectSurveys(state).filter((survey) => !survey.templateType)
  );
  const fetching = useAppSelector((state) => state.surveys.fetching);
  const hasMore = useAppSelector((state) => state.surveys.hasMore);

  if (!loggedIn) {
    return <LoginPage />;
  }

  return (
    <Content>
      <Helmet title="Spørreundersøkelser" />
      <ListNavigation title="Spørreundersøkelser" />

      <LoadingIndicator loading={fetching}>
        <Paginator
          infiniteScroll={true}
          hasMore={!!hasMore}
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
      </LoadingIndicator>
    </Content>
  );
};

export default SurveyPage;
