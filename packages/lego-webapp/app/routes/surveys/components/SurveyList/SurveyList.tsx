import { Skeleton } from '@webkom/lego-bricks';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import { FolderOpen } from 'lucide-react';
import EmptyState from 'app/components/EmptyState';
import styles from '../surveys.module.css';
import SurveyItem from './SurveyItem';
import type { DetailedSurvey } from '~/redux/models/Survey';

type Props = {
  surveys: DetailedSurvey[];
  fetching: boolean;
  isTemplates?: boolean;
};

const SurveyList = ({ surveys, fetching, isTemplates }: Props) => {
  if (isEmpty(surveys) && !fetching) {
    return (
      <EmptyState
        iconNode={<FolderOpen />}
        body={`Ingen ${isTemplates ? 'maler' : 'spørreundersøkelser'} funnet`}
      />
    );
  }

  return (
    <div>
      {surveys.map((survey) => (
        <SurveyItem key={survey.id} survey={survey} />
      ))}
      {fetching && (
        <Skeleton
          array={7 - surveys.length}
          className={cx(styles.surveyItem, styles.surveySkeleton)}
        />
      )}
    </div>
  );
};

export default SurveyList;
