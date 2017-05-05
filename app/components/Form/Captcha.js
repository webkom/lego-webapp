import React from 'react';
import config from 'app/config';
import { createField } from './Field';
import ReCAPTCHA from 'react-google-recaptcha';

type Props = {
  className?: string,
  onChange?: void
};

function Captcha({ className, onChange }: Props) {
  return (
    <div className={className}>
      <ReCAPTCHA sitekey={config.captchaKey} onChange={onChange} />
    </div>
  );
}

Captcha.Field = createField(Captcha);

export default Captcha;
