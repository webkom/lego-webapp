// @flow

import { Component } from 'react';
// eslint-disable-next-line import/no-named-as-default
import ReCAPTCHA from 'react-google-recaptcha';
import cx from 'classnames';

import config from 'app/config';
import { createField } from './Field';

import styles from './Captcha.css';

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
        <ReCAPTCHA
          ref={(ref) => {
            this.captcha = ref;
          }}
          sitekey={config.captchaKey}
          onChange={onChange}
          size={config.skipCaptcha && 'invisible'}
        />
      </div>
    );
  }

  static Field = createField(Captcha);
}

export default Captcha;
