import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import Paginator from '~/components/Paginator';
import { fetchAll as fetchSurveys } from '~/redux/actions/SurveyActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { selectAllAttendedBySelfSurveys } from '~/redux/slices/surveys';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import SurveyList from '../SurveyList';
import type { DetailedSurvey } from '~/redux/models/Survey';

const SurveyListPage = () => {
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchSurveys',
    () => dispatch(fetchSurveys({ next: false })),
    [],
  );

  const surveys = useAppSelector(
    selectAllAttendedBySelfSurveys,
  ) as DetailedSurvey[];

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
        <SurveyList surveys={surveys} fetching={pagination.fetching} isMine />
      </Paginator>
    </>
  );
};

export default guardLogin(SurveyListPage);
