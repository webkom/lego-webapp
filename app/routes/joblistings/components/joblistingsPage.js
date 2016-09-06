import React, { Component, PropTypes } from 'react';

export default class JoblistingsPage extends Component {

  static propTypes = {
    joblistings: PropTypes.array.isRequired
  };

  render() {
    return (
      <div>
        Hello world!
      </div>
    );
  }
}
