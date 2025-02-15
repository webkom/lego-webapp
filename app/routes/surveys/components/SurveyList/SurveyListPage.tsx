import pkg from '@webkom/react-prepare';
const { usePreparedEffect } = pkg;
import { Helmet } from 'react-helmet-async';
import { fetchAll as fetchSurveys } from 'app/actions/SurveyActions';
import Paginator from 'app/components/Paginator';
import { selectPaginationNext } from 'app/reducers/selectors';
import { selectAllSurveys } from 'app/reducers/surveys';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import SurveyList from './SurveyList';
import type { DetailedSurvey } from 'app/store/models/Survey';

const SurveyListPage = () => {
  const dispatch = useAppDispatch();

  usePreparedEffect('fetchSurveys', () => dispatch(fetchSurveys()), []);

  const surveys = useAppSelector(selectAllSurveys) as DetailedSurvey[];

  const { pagination } = useAppSelector(
    selectPaginationNext({
      endpoint: '/surveys/',
      entity: EntityType.Surveys,
      query: {},
    }),
  );

  return (
    <>
      <Helmet title="Spørreundersøkelser" />

      <Paginator
        hasMore={pagination.hasMore}
        fetching={pagination.fetching}
        fetchNext={() => {
          dispatch(
            fetchSurveys({
              next: true,
            }),
          );
        }}
      >
        <SurveyList surveys={surveys} fetching={pagination.fetching} />
      </Paginator>
    </>
  );
};

export default guardLogin(SurveyListPage);
