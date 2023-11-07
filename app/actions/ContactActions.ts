import { Contact } from './ActionTypes';
import callAPI from './callAPI';
import type { ContactForm } from 'app/reducers/contact';
import type { Thunk } from 'app/types';

export function sendContactMessage(contactForm: ContactForm): Thunk<any> {
  return callAPI({
    types: Contact.SEND_MESSAGE,
    method: 'POST',
    endpoint: '/contact-form/',
    body: contactForm,
  });
}
