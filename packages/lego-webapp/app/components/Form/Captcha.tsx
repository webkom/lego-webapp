import cx from 'classnames';
import { useEffect, useState } from 'react';
import Turnstile from 'react-turnstile';
import { useTheme } from 'app/utils/themeUtils';
import usePrevious from 'app/utils/usePrevious';
import { appConfig } from '~/utils/appConfig';
import styles from './Captcha.module.css';
import { createField } from './Field';

type Props = {
  className?: string;
  onChange?: (token: string) => void;
  value: string;
};

const Captcha = ({ className, onChange = () => {}, value }: Props) => {
  const theme = useTheme();
  const [captchaKey, setCaptchaKey] = useState(0);

  // Reset the captcha when the form is reset
  const prevValue = usePrevious(value);
  useEffect(() => {
    if (value === '' && prevValue !== '') setCaptchaKey(captchaKey + 1);
  }, [prevValue, value, captchaKey]);

  return (
    <div className={cx(className, styles.captchaContainer)}>
      <Turnstile
        key={captchaKey}
        sitekey={appConfig.captchaKey}
        onVerify={onChange}
        theme={theme}
      />
    </div>
  );
};

Captcha.Field = createField(Captcha);

export default Captcha;
