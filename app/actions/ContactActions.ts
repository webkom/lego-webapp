import type { ContactForm } from 'app/reducers/contact';
import createLegoApiAction from 'app/store/utils/createLegoApiAction';

export const sendContactMessage = createLegoApiAction()(
  'Contact.SEND_MESSAGE',
  (_, contactForm: ContactForm) => ({
    method: 'POST',
    endpoint: '/contact-form/',
    body: contactForm,
  })
);
