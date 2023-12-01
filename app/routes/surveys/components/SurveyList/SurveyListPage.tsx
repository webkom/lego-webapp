import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import {
  fetchAll as fetchSurveys,
  fetchTemplates,
} from 'app/actions/SurveyActions';
import { Content } from 'app/components/Content';
import Paginator from 'app/components/Paginator';
import { selectPaginationNext } from 'app/reducers/selectors';
import { selectSurveys, selectSurveyTemplates } from 'app/reducers/surveys';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { ListNavigation } from '../../utils';
import SurveyList from './SurveyList';

type Props = {
  templates?: boolean;
};
const SurveyListPage = ({ templates }: Props) => {
  const dispatch = useAppDispatch();
  const fetchAll = templates ? fetchTemplates : fetchSurveys;

  usePreparedEffect(
    'fetchSurveys',
    () => {
      dispatch(fetchAll());
    },
    [templates]
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

export default guardLogin(SurveyListPage);
