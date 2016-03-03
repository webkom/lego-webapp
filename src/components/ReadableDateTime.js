import React, { PropTypes } from 'react';
import moment from 'moment-timezone';

const TIMEZONE = 'Europe/Oslo';

/**
 * A wrapper for the HTML <time>-element
 * that shows the given time in a human readable
 * format.
 *
 * Example: "3 days ago"
*/

const ReadableDateTime = ({ dateTime }) => (
  <time dateTime={dateTime}>
    {moment.tz(dateTime, TIMEZONE).fromNow()}
  </time>
);

ReadableDateTime.propTypes = {
  dateTime: PropTypes.string.isRequired
};

export default ReadableDateTime;
