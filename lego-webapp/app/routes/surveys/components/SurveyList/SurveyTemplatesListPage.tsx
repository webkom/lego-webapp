import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import Paginator from '~/components/Paginator';
import { fetchTemplates } from '~/redux/actions/SurveyActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { selectSurveyTemplates } from '~/redux/slices/surveys';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import SurveyList from './SurveyList';
import type { DetailedSurvey } from '~/redux/models/Survey';

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
