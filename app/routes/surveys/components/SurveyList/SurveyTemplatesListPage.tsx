import pkg from '@webkom/react-prepare';
const { usePreparedEffect } = pkg;
import { Helmet } from 'react-helmet-async';
import { fetchTemplates } from 'app/actions/SurveyActions';
import Paginator from 'app/components/Paginator';
import { selectPaginationNext } from 'app/reducers/selectors';
import { selectSurveyTemplates } from 'app/reducers/surveys';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import SurveyList from './SurveyList';
import type { DetailedSurvey } from 'app/store/models/Survey';

const SurveyTemplatesListPage = () => {
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchSurveyTemplates',
    () => dispatch(fetchTemplates()),
    [],
  );

  const surveys = useAppSelector(selectSurveyTemplates) as DetailedSurvey[];

  const { pagination } = useAppSelector(
    selectPaginationNext({
      endpoint: '/survey-templates/',
      entity: EntityType.Surveys,
      query: {},
    }),
  );

  return (
    <>
      <Helmet title="Spørreundersøkelser (maler)" />

      <Paginator
        hasMore={pagination.hasMore}
        fetching={pagination.fetching}
        fetchNext={() => {
          dispatch(
            fetchTemplates({
              next: true,
            }),
          );
        }}
      >
        <SurveyList
          surveys={surveys}
          fetching={pagination.fetching}
          isTemplates
        />
      </Paginator>
    </>
  );
};

export default guardLogin(SurveyTemplatesListPage);
