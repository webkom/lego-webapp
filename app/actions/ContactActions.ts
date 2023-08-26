import { Contact } from './ActionTypes';
import callAPI from './callAPI';
import type { ContactForm } from 'app/reducers/contact';

export function sendContactMessage(contactForm: ContactForm) {
  return callAPI<ContactForm>({
    types: Contact.SEND_MESSAGE,
    method: 'POST',
    endpoint: '/contact-form/',
    body: contactForm,
  });
}
