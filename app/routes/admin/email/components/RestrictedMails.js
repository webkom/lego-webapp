//@flow
import React, { Component } from 'react';

type Props = {
  fetching: boolean,
  hasMore: boolean,
  restrictedMails: Array<Object>,
  fetch: ({ filters?: Object, next?: boolean }) => Promise<*>
};

export default class RestrictedMails extends Component<Props> {
  render() {
    return (
      <div>
        <h2> Begrenset epost er dessverre midlertidig ute av drift. </h2>
        <i> - Webkom </i>
      </div>
    );
  }
}
