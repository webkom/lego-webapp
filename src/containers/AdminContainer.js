import { Component, PropTypes } from 'react';

export default class AdminContainer extends Component {
  static propTypes = {
    children: PropTypes.any
  };

  render() {
    return this.props.children;
  }
}
