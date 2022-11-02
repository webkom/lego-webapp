// @flow

import { Component } from 'react';
import config from 'app/config';
import { createField } from './Field';
// eslint-disable-next-line import/no-named-as-default
import Turnstile from 'react-turnstile';
import styles from './Captcha.css';
import cx from 'classnames';
import { getTheme } from 'app/utils/themeUtils';

type Props = {
  className?: string,
  onChange?: void,
  value: string,
};

class Captcha extends Component<Props> {
  captcha: ?{ reset: () => void, execute: () => void };

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.value === '') {
      this.captcha && this.captcha.reset();
    }
  }

  componentDidMount() {
    if (config.skipCaptcha) {
      this.captcha && this.captcha.execute();
    }
  }

  render() {
    const { className, onChange } = this.props;
    return (
      <div className={cx(className, styles.captchaContainer)}>
        <Turnstile
          ref={(ref) => {
            this.captcha = ref;
          }}
          sitekey={config.captchaKey}
          onVerify={onChange}
          theme={getTheme()}
        />
      </div>
    );
  }

  static Field = createField(Captcha);
}

export default Captcha;
