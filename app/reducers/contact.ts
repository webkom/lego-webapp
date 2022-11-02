export type ContactForm = {
  recipient_group?: number;
  title: string;
  message: string;
  anonymous: boolean;
  captchaResponse: string;
};
