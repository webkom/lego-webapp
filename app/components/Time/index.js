// @flow

import React from 'react';
import moment from 'moment-timezone';
import config from 'app/config';

type Props = {
  format?: string,
  time: string,
  wordsAgo?: boolean
};

function getFormattedDateTime(time: moment, format: string): string {
  if (format === 'timeAgoInWords') {
    return time.fromNow();
  }
  return time.format(format);
}

/**
 * A wrapper for the HTML <time>-element
 * that automatically adds the datetime attribute and formats
 * the content according to the given props.
 */
function Time({ format = 'YYYY-MM-d', time, wordsAgo = false, ...props }: Props) {
  const formatted = getFormattedDateTime(
    moment.tz(time, config.timezone),
    wordsAgo ? 'timeAgoInWords' : format
  );

  return (
    <time dateTime={time} {...props}>
      {formatted}
    </time>
  );
}

export default Time;
