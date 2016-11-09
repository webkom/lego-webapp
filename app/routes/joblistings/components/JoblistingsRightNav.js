import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class JoblistingsRightNav extends Component {

  static propTypes = {
    query: PropTypes.object.isRequired
  };

  handleQuery = (type, value, remove = false) => {
    const query = { ...this.props.query };
    if (remove) {
      delete query[type];
    } else {
      query[type] = value;
    }
    return query;
  };

  option1 = this.handleQuery('sort', 'company');
  option2 = this.handleQuery('sort', 'deadline');

  render() {
    const path = this.props.query.filter;
    console.log(this.option2);
    return (
      <div>
        Sorter etter:
        <Link to={{ pathname: '/joblistings', query: this.option1 }}>Bedrift </Link>
        <Link to={{ pathname: '/joblistings', query: this.option2 }}>Frist</Link>
      </div>
    );
  }
}
