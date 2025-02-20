import { Contact } from '~/redux/actionTypes';
import callAPI from './callAPI';
import type { ContactForm } from '~/redux/slices/contact';

export function sendContactMessage(contactForm: ContactForm) {
  return callAPI<ContactForm>({
    types: Contact.SEND_MESSAGE,
    method: 'POST',
    endpoint: '/contact-form/',
    body: contactForm,
    meta: {
      successMessage: 'Melding er sendt',
      errorMessage: 'Kunne ikke sende melding',
    },
  });
}
