import type { Dateish } from 'app/models';
import type { PhotoConsent } from 'app/store/models/User';
import type { ID } from 'app/store/models/index';

export default interface Registration {
  id: ID;
  user: ID;
  createdBy: ID;
  updatedBy: ID;
  pool: ID;
  event: ID;
  presence: string; //TODO: enum
  feedback: string;
  status: string; //TODO: enum
  registrationDate: Dateish;
  unregistrationDate: Dateish;
  adminRegistrationReason: string;
  paymentIntentId: string | null;
  paymentStatus: string | null; //TODO: enum
  paymentAmount: number;
  paymentAmountRefunded: number;
  LEGACYPhotoConsent: string; //TODO: enum
  photoConsents: PhotoConsent[];
}
