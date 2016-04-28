import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  fetchAll
} from '../../actions/BdbActions';
import BdbPage from './components/BdbPage';


@connect((state) => ({
  companies: state.bdb.items.map((id) => state.entities.companies[id])
}), { fetchAll })
export default class BdbContainer extends Component {

  static propTypes = {
    fetchAll: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.fetchAll();
  }

  render() {
    return (
      <BdbPage
        {...this.props}
      />
    );
  }
}
