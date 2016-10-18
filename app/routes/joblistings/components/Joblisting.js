import React, { Component, PropTypes } from 'react';
import styles from './joblistings.css';

export default class Joblisting extends Component {

  static propTypes = {
    joblisting: PropTypes.object.isRequired
  };

  render() {
    const { joblisting } = this.props;
    return (
      <li>
        {joblisting.title}
        {joblisting.jobType}
        {joblisting.deadLine}
        {joblisting.fromYear}
        {joblisting.toYear}
        {joblisting.workplaces}
      </li>
    );
  }
}
