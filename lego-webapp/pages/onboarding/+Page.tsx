import cx from 'classnames';
import HTTPError from '~/components/errors/HTTPError';
import { useFeatureFlag } from '~/utils/useFeatureFlag';
import styles from './style.module.css';

type Member = {
  name: string;
  path: string;
};

const members: Member[] = [
  { name: 'Ane', path: '/onboarding/ane' },
  { name: 'Eli Anne', path: '/onboarding/eli-anne' },
  { name: 'Fredrik', path: '/onboarding/fredrik' },
  { name: 'Iris', path: '/onboarding/iris' },
  { name: 'Tobias', path: '/onboarding/tobias' },
];

const OnboardingPage = () => {
  const onboardingEnabled = useFeatureFlag('onboarding');
  if (!onboardingEnabled) return <HTTPError statusCode={404} />;

  return (
    <div>
      <ul>
        {members.map(({ name, path }) => (
          <li key={path}>
            <a href={path} className={cx(styles.blue)}>
              {name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnboardingPage;
