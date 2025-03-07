import { Accordion, Icon, Skeleton } from '@webkom/lego-bricks';
import cx from 'classnames';
import { ChevronRight } from 'lucide-react';
import { useContext, useState } from 'react';
import { SurveysRouteContext } from '~/pages/(migrated)/surveys/@surveyId/(wrapper)/SurveysRouteContext';
import StaticSubmission from '../../../../components/StaticSubmission';
import styles from '../../../../components/surveys.module.css';
import type { SurveySubmission } from '~/redux/models/SurveySubmission';

const SubmissionItem = ({
  submission,
  index,
}: {
  submission: SurveySubmission;
  index: number;
}) => {
  const [open, setOpen] = useState(false);
  const { survey } = useContext(SurveysRouteContext);
  return (
    <li key={submission.id}>
      <Accordion
        triggerComponent={({ onClick, rotateClassName }) => (
          <div
            className={styles.answerTrigger}
            onClick={() => {
              setOpen(!open);
              onClick();
            }}
          >
            <h3>Svar {index + 1}</h3>
            <Icon
              onPress={() => {
                setOpen(!open);
                onClick();
              }}
              iconNode={<ChevronRight />}
              className={rotateClassName}
            />
          </div>
        )}
      >
        <div className={cx(styles.answers, styles.detailQuestions)}>
          {open && survey.questions && (
            <StaticSubmission survey={survey} submission={submission} />
          )}
        </div>
      </Accordion>
    </li>
  );
};

const SubmissionPage = () => {
  const { submissions, fetchingSubmissions } = useContext(SurveysRouteContext);

  if (fetchingSubmissions) {
    return (
      <Skeleton
        array={5}
        className={cx(styles.answerTrigger, styles.submissionSkeleton)}
      />
    );
  }

  return (
    <ul>
      {submissions.map((submission, i) => (
        <SubmissionItem key={submission.id} submission={submission} index={i} />
      ))}
    </ul>
  );
};

export default SubmissionPage;
