import callAPI from 'app/actions/callAPI';
import { quoteSchema } from 'app/reducers';
import { Quote } from './ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';
import type QuoteType from 'app/store/models/Quote';
import type { ParsedQs } from 'qs';

export function fetchAll({
  query,
  next = false,
}: {
  query?: ParsedQs;
  next?: boolean;
} = {}) {
  return callAPI<QuoteType[]>({
    types: Quote.FETCH,
    endpoint: '/quotes/',
    schema: [quoteSchema],
    query,
    pagination: {
      fetchNext: next,
    },
    meta: {
      errorMessage: 'Henting av sitater feilet',
    },
    propagateError: true,
  });
}

export function fetchQuote(quoteId: EntityId) {
  return callAPI<QuoteType>({
    types: Quote.FETCH,
    endpoint: `/quotes/${quoteId}/`,
    method: 'GET',
    meta: {
      quoteId,
      errorMessage: 'Henting av sitat feilet',
    },
    schema: quoteSchema,
    propagateError: true,
  });
}

export function fetchRandomQuote(seenQuotes: EntityId[] = []) {
  const queryString = `?seen=[${String(seenQuotes)}]`;
  return callAPI<QuoteType>({
    types: Quote.FETCH_RANDOM,
    endpoint: `/quotes/random/${queryString}`,
    method: 'GET',
    meta: {
      queryString,
      errorMessage: 'Henting av tilfeldig sitat feilet',
    },
    schema: quoteSchema,
  });
}

export function approve(quoteId: EntityId) {
  return callAPI({
    types: Quote.APPROVE,
    endpoint: `/quotes/${quoteId}/approve/`,
    method: 'PUT',
    meta: {
      errorMessage: 'Godkjenning av sitat feilet',
      quoteId: Number(quoteId),
    },
  });
}

export function unapprove(quoteId: EntityId) {
  return callAPI({
    types: Quote.UNAPPROVE,
    endpoint: `/quotes/${quoteId}/unapprove/`,
    method: 'PUT',
    meta: {
      errorMessage: 'Underkjenning av sitat feilet',
      quoteId: Number(quoteId),
    },
  });
}

export function addQuotes({ text, source }: { text: string; source: string }) {
  return callAPI<QuoteType>({
    types: Quote.ADD,
    endpoint: '/quotes/',
    method: 'POST',
    body: {
      text,
      source,
    },
    schema: quoteSchema,
    meta: {
      errorMessage: 'Kunne ikke legge til sitat',
    },
  });
}

export function deleteQuote(id: EntityId) {
  return callAPI({
    types: Quote.DELETE,
    endpoint: `/quotes/${id}/`,
    method: 'DELETE',
    meta: {
      id,
      errorMessage: 'Sletting av sitat feilet',
    },
  });
}
