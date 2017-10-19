// @flow

import React from 'react';

import { Content } from 'app/components/Layout';
import Feed from 'app/components/Feed';
import LoadingIndicator from 'app/components/LoadingIndicator';

type Props = {
  feedItems: Array<any>,
  feed: Object
};

const TimelinePage = (props: Props) => {
  const { feed, feedItems } = props;

  return (
    <Content>
      <h1>Tidslinje</h1>

      {feed ? (
        <Feed items={feedItems} feed={feed} />
      ) : (
        <LoadingIndicator loading />
      )}
    </Content>
  );
};

export default TimelinePage;
