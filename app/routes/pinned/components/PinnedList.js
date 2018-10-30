import React from 'react';
import { Content } from 'app/components/Content';
import moment from 'moment-timezone';

const createPinnedLayout = pins => {
  const layers = [];
  for (let i = 0; i < pins.length; i++) {
    let layer = 0;
    for (
      let j = 0;
      j < (layers[layer] !== undefined ? layers[layer].length : 0);
      j++
    ) {
      if (
        layers[layer][j].pinnedFrom <= pins[i].pinnedTo &&
        pins[i].pinnedFrom <= layers[layer][j].pinnedTo
      ) {
        layer++;
        j = -1;
      }
    }
    if (layer === layers.length) {
      layers.push([]);
    }
    layers[layer].push(pins[i]);
  }
  return layers;
};

const DAYWIDTH = 100;

const getPeriodLength = (start, end) => end.diff(start, 'days') * DAYWIDTH;

const PinnedArticle = ({ article, pinnedFrom, pinnedTo, last }) => {
  const from = moment() > pinnedFrom ? moment() : pinnedFrom;
  const to = moment(pinnedTo).add(1, 'days');
  return (
    <div
      style={{
        width: getPeriodLength(from, to),
        minWidth: getPeriodLength(from, to),
        border: '1px solid black',
        marginLeft: getPeriodLength(last, from)
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
  const from = moment() > pinnedFrom ? moment() : pinnedFrom;
  const to = moment(pinnedTo).add(1, 'days');
  return (
    <div
      style={{
        width: getPeriodLength(from, to),
        minWidth: getPeriodLength(from, to),
        border: '1px solid black',
        marginLeft: getPeriodLength(last, from)
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

const List = ({ pins }) => (
  <Content>
    <div
      style={{
        overflowX: 'scroll'
      }}
    >
      <div
        style={{
          display: 'inline-block',
          background: `repeating-linear-gradient(90deg, #ffffff, #ffffff ${DAYWIDTH}px, #eeeeee ${DAYWIDTH}px, #eeeeee ${2 *
            DAYWIDTH}px)`
        }}
      >
        {createPinnedLayout(pins.filter(pin => pin.pinnedTo > moment())).map(
          (layer, i) => (
            <div
              key={i}
              style={{
                display: 'flex'
              }}
            >
              {layer.map(
                (pin, j) =>
                  pin.contentType === 'article' ? (
                    <PinnedArticle
                      key={pin.id}
                      {...pin}
                      last={
                        j > 0
                          ? moment(layer[j - 1].pinnedTo).add(1, 'days')
                          : moment()
                      }
                    />
                  ) : (
                    <PinnedEvent
                      key={pin.id}
                      {...pin}
                      last={
                        j > 0
                          ? moment(layer[j - 1].pinnedTo).add(1, 'days')
                          : moment()
                      }
                    />
                  )
              )}
            </div>
          )
        )}
      </div>
    </div>
  </Content>
);

export default List;
