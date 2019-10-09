// @flow

import React, { Component } from 'react';
import config from 'app/config';
import { createField } from './Field';
import ReCAPTCHA from 'react-google-recaptcha';
import styles from './Captcha.css';
import cx from 'classnames';

type Props = {
  className?: string,
  onChange?: void,
  value: string
};

class Captcha extends Component<Props> {
  captcha: ?ReCAPTCHA;

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.value === '') {
      this.captcha && this.captcha.reset();
    }
  }

  render() {
    const { className, onChange } = this.props;
    return (
      <div className={cx(className, styles.captchaContainer)}>
        <ReCAPTCHA
          ref={ref => {
            this.captcha = ref;
          }}
          sitekey={config.captchaKey}
          onChange={onChange}
        />
      </div>
    );
  }

  static Field = createField(Captcha);
}

export default Captcha;
