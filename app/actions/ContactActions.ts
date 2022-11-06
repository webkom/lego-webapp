import { Contact } from './ActionTypes';
import type { Thunk } from 'app/types';
import callAPI from './callAPI';
import type { ContactForm } from 'app/store/slices/contactSlice';
export function sendContactMessage(contactForm: ContactForm): Thunk<any> {
  return callAPI({
    types: Contact.SEND_MESSAGE,
    method: 'POST',
    endpoint: '/contact-form/',
    body: contactForm,
  });
}
