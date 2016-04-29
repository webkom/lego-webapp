import { Bdb } from './ActionTypes';
import { callAPI } from '../utils/http';
import { bdbSchema } from 'app/reducers';
// import { arrayOf } from 'normalizr';

export function fetchAll() {
  // Using custom JSON object until back-end is up and running.
  // API call is commented below
  return {
    type: 'Bdb.FETCH_SUCCESS',
    payload: {
      result: [
        0, 1, 2
      ],
      entities: {
        companies: [
          {
            name: 'BEKK',
            id: 1,
            contacted: [
              'Kontaktet', 'Ikke kontaktet', 'Bedpres', 'Kurs'
            ],
            studentContact: 'Marius Kotlarz',
            comment: 'Partner',
            jobOfferOnly: false
          },
          {
            name: 'Facebook',
            id: 2,
            contacted: [
              'Kontaktet', 'Kontaktet', 'Ikke interessert', 'Bedpres'
            ],
            studentContact: 'Finn Smith',
            comment: 'Se mail',
            jobOfferOnly: false
          },
          {
            name: 'Itera',
            id: 3,
            contacted: [
              'Interessert, ikke tilbudt', 'Bedpres & kurs', 'Kurs', 'Ikke kontaktet'
            ],
            studentContact: 'Ingen',
            comment: '',
            jobOfferOnly: false
          }
        ]
      }
    }
  };
  /*
  return callAPI({
    types: [
      Bdb.FETCH_BEGIN,
      Bdb.FETCH_SUCCESS,
      Bdb.FETCH_FAILURE
    ],
    endpoint: '/bdb/',
    schema: arrayOf(bdbSchema)
  });
  */
}

export function fetch(companyId) {
  return callAPI({
    types: [
      Bdb.FETCH_BEGIN,
      Bdb.FETCH_SUCCESS,
      Bdb.FETCH_FAILURE
    ],
    endpoint: `/bdb/${companyId}/`,
    schema: bdbSchema
  });
}
