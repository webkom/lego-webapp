import React, { Component } from 'react';
import { connect } from 'react-redux';

class SearchRoute extends Component {
  render() {
    return null;
  }
}

const mapStateToProps = (state, props) => {
  const { query } = props.location;
  return {
    query: query.q
  };
};

export default connect(mapStateToProps)(SearchRoute);
