import './Root.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loginAutomaticallyIfPossible } from 'app/actions/UserActions';
import Header from 'app/components/Header';

class Root extends Component {
  static propTypes = {
    loginAutomaticallyIfPossible: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired
  };

  componentWillMount() {
    this.props.loginAutomaticallyIfPossible();
  }

  render() {
    return (
      <div className='Site'>
        <Header />
        {this.props.children}
      </div>
    );
  }
}

const mapDispatchToProps = { loginAutomaticallyIfPossible };

export default connect(
  null,
  mapDispatchToProps
)(Root);
