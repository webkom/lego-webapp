import React from 'react';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { Content } from 'app/components/Content';
import Timeline from './Timeline';

const PinnedArticle = ({ article, pinnedFrom, pinnedTo, last }) => {
  return (
    <div
      style={{
        border: '1px dotted red',
        padding: '0 20px',
        borderRadius: '10px'
      }}
    >
      <div>Artikkel</div>
      <div>{article.title}</div>
      <div>{`Tidstom: ${pinnedFrom.format('DD-MM-YYYY')} - ${pinnedTo.format(
        'DD-MM-YYYY'
      )}`}</div>
    </div>
  );
};
const PinnedEvent = ({ event, pinnedFrom, pinnedTo, last }) => {
  return (
    <div
      style={{
        border: '1px dotted orange',
        padding: '0 20px',
        borderRadius: '10px'
      }}
    >
      <div>Arrangement</div>
      <div>{event.title}</div>
      <div>{`Tidstom: ${pinnedFrom.format('DD-MM-YYYY')} - ${pinnedTo.format(
        'DD-MM-YYYY'
      )}`}</div>
    </div>
  );
};

const List = ({ pins, actionGrant }) => (
  <Content>
    <NavigationTab title="Pinned">
      {actionGrant.includes('create') && (
        <NavigationLink to="/pinned/create">Legg til ny</NavigationLink>
      )}
    </NavigationTab>
    <Timeline
      pins={pins}
      drawArticle={pin => <PinnedArticle {...pin} />}
      drawEvent={pin => <PinnedEvent {...pin} />}
    />
  </Content>
);

export default List;
