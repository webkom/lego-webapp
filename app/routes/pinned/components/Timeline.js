import React from 'react';
import moment from 'moment-timezone';

const createPinnedLayout = pins => {
  const layers = [];
  for (let i = 0; i < pins.length; i++) {
    let layer = 0;
    for (let j = 0; j < (layers[layer] || []).length; j++) {
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

const Container = ({ pin, draw, last }) => {
  const { pinnedFrom, pinnedTo } = pin;
  const from = moment() > pinnedFrom ? moment() : pinnedFrom;
  const to = moment(pinnedTo).add(1, 'days');
  return (
    <div
      style={{
        width: getPeriodLength(from, to),
        minWidth: getPeriodLength(from, to),
        marginLeft: getPeriodLength(last, from)
      }}
    >
      {draw(pin)}
    </div>
  );
};

const Timeline = ({ pins, drawEvent, drawArticle }) => (
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
            {layer.map((pin, j) => (
              <Container
                key={pin.id}
                pin={pin}
                draw={pin.contentType === 'article' ? drawArticle : drawEvent}
                last={
                  j > 0
                    ? moment(layer[j - 1].pinnedTo).add(1, 'days')
                    : moment()
                }
              />
            ))}
          </div>
        )
      )}
    </div>
  </div>
);

export default Timeline;
