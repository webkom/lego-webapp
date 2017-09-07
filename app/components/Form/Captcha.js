import React, { Component } from 'react';
import config from 'app/config';
import { createField } from './Field';
import ReCAPTCHA from 'react-google-recaptcha';

type Props = {
  className?: string,
  onChange?: void
};

class Captcha extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.value === '') {
      this.captcha.reset();
    }
  }

  render() {
    const { className, onChange }: Props = this.props;
    return (
      <div className={className}>
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
}

Captcha.Field = createField(Captcha);

export default Captcha;
