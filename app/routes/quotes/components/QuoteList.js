import React from 'react';
import Quote from './Quote';

type Props = {
  quotes: Array<Object>
};

export default function QuoteList({ quotes, ...props }: Props) {
  return (
    <ul>
      {quotes.map(quote => (
        <Quote {...this.props} quote={quote} key={quote.id} />
      ))}
    </ul>
  );
}
