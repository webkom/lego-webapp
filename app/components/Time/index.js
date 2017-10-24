// @flow

import React from 'react';
import moment from 'moment-timezone';
import config from 'app/config';

type Props = {
  format?: string,
  time?: string | Date | moment,
  wordsAgo?: boolean
};

function getFormattedDateTime(time: moment, format: string): string {
  if (format === 'timeAgoInWords') {
    return time.fromNow();
  } else if (format === 'nowToTimeInWords') {
    return moment().to(time);
  }
  return time.format(format);
}

/**
 * A wrapper for the HTML <time>-element
 * that automatically adds the datetime attribute and formats
 * the content according to the given props.
 */
function Time({
  format = 'YYYY-MM-d',
  time,
  wordsAgo = false,
  ...props
}: Props) {
  const formatted = getFormattedDateTime(
    moment.tz(time || moment(), config.timezone),
    wordsAgo ? 'timeAgoInWords' : format
  );

  return (
    <time dateTime={time} {...props}>
      {formatted}
    </time>
  );
}

export const FormatTime = ({
  time,
  format
}: {
  time: moment | string,
  format?: string
}) => {
  const dateTime = moment(time);

  if (!format) {
    const defaultFormat = moment().isSame(dateTime, 'year')
      ? 'dddd DD. MMM HH:mm'
      : 'dddd DD. MMM YYYY HH:mm';
    return <Time time={dateTime} format={defaultFormat} />;
  } else {
    return <Time time={dateTime} format={format} />;
  }
};

export const FromToTime = ({
  from,
  to
}: {
  from: moment | string,
  to: moment | string
}) => {
  const fromTime = moment(from);
  const toTime = moment(to);
  return fromTime.isSame(toTime, 'day') ? (
    <span>
      <FormatTime time={fromTime} format="dddd DD. MMMM, HH:mm" /> -{' '}
      <FormatTime time={toTime} format="HH:mm" />
    </span>
  ) : (
    <span>
      <FormatTime time={fromTime} /> - <FormatTime time={toTime} />
    </span>
  );
};

export default Time;
