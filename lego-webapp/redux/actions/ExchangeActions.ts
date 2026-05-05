import { Exchange } from '~/redux/actionTypes'
import callAPI from '~/redux/actions/callAPI';
import { exchangeSchema } from '~/redux/schemas';

export function fetchExchanges({ query, next = false }) {
    return callAPI({
        types: Exchange.FETCH_ALL,
        endpoint: '/exchanges/',
        schema: [exchangeSchema],
        query,
        pagination: {
            fetchNext: next,
        },
        meta: {
            errorMessage: 'Henting av utvekslingsopphold feilet',
        },
        propagateError: true,
    });
}