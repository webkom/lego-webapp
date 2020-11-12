// @flow

import React from 'react';
import moment from 'moment-timezone';
import config from 'app/config';
import { type Dateish } from 'app/models';

type Props = {
  format?: string,
  time?: Dateish,
  wordsAgo?: boolean,
};

function getFormattedDateTime(time: Dateish, format: string): string {
  if (format === 'timeAgoInWords') {
    return moment(time).fromNow();
  } else if (format === 'nowToTimeInWords') {
    return moment().to(time);
  }
  return moment(time).format(format);
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
    <time dateTime={time} {...(props: Object)}>
      {formatted}
    </time>
  );
}

export const FormatTime = ({
  time,
  format,
}: {
  time: Dateish,
  format?: string,
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

export const FromToTime = ({ from, to }: { from: Dateish, to: Dateish }) => {
  const fromTime = moment(from);
  const toTime = moment(to);
  const fromFormat =
    moment().isSame(fromTime, 'year') && 'dddd DD. MMMM, HH:mm';
  const toFormat = fromTime.isSame(toTime, 'day') ? 'HH:mm' : fromFormat;

  return (
    <span>
      <FormatTime time={fromTime} format={fromFormat} /> -{' '}
      <FormatTime time={toTime} format={toFormat} />
    </span>
  );
};

export default Time;
