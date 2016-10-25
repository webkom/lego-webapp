import React, { Component, PropTypes } from 'react';

export default class Joblisting extends Component {

  static propTypes = {
    joblisting: PropTypes.object.isRequired
  };

  render() {
    const { joblisting } = this.props;
    return (
      <li>
        <h2><a href={`/joblistings/${joblisting.id}/`}>{joblisting.title}</a></h2>
        {joblisting.jobType}
        {joblisting.deadLine}
        {joblisting.fromYear}
        {joblisting.toYear}
        {joblisting.workplaces}
      </li>
    );
  }
}
