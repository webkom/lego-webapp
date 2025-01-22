import { Accordion, Button, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { ChevronRight } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import StaticSubmission from '../StaticSubmission';
import styles from '../surveys.module.css';
import type { SurveysRouteContext } from 'app/routes/surveys';

const SubmissionPage = () => {
  const { submissions, survey } = useOutletContext<SurveysRouteContext>();
  return (
    <>
      <ul>
        {submissions.map((submission, i) => (
          <li key={submission.id}>
            <Accordion 
              triggerComponent={({ onClick, rotateClassName }) => (
                <div 
                  className={styles.answerTrigger} 
                  onClick={onClick}
                >
                  <h3>Svar {i + 1}</h3>
                  <Icon
                    onPress={onClick}
                    iconNode={<ChevronRight />}
                    className={rotateClassName}
                  />
                </div>
          )}
            >
              <ul className={cx(styles.answers, styles.detailQuestions)}>
                {survey.questions && (
                  <StaticSubmission survey={survey} submission={submission} />
                )}
              </ul>
            </Accordion>
          </li>
        ))}
      </ul>

      <Button
        onPress={() => {console.log("Fetching more submissions")}}
      >
        Last inn mer
      </Button>
    </>
  );
};

export default SubmissionPage;
