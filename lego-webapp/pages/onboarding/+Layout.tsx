import { PropsWithChildren } from 'react';
import HTTPError from '~/components/errors/HTTPError';
import { useFeatureFlag } from '~/utils/useFeatureFlag';

const OnboardingLayout = ({ children }: PropsWithChildren) => {
  const onboardingEnabled = useFeatureFlag('onboarding');
  if (!onboardingEnabled) return <HTTPError statusCode={404} />;

  return <>{children}</>;
};

export default OnboardingLayout;
