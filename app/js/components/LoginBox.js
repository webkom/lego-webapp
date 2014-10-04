/** @jsx React.DOM */

var React = require('react');
var Icon  = require('./icon');

var LoginBox = React.createClass({

  getInitialState: function() {
    return {
      loginOpen: false
    };
  },

  toggleLoginOpen: function() {
    this.setState({
      loginOpen: !this.state.loginOpen
    });
  },

  onLogin: function(event) {
    event.preventDefault();

    this.props.onLogin(
      this.refs.username.getDOMNode().value,
      this.refs.password.getDOMNode().value
    );

    this.setState({loginOpen: false});
  },

  render: function() {
    return (
      <div className='login-container'>
        <p className="login-status">
          {this.props.auth ?
            <div>
              <img className='gravatar' src='http://www.gravatar.com/avatar/279f5b4c5c781eb6aaa5c3f09c974acf.jpg?s=64&d=identicon' />
              <span>{this.props.auth.username}</span>
            </div>
            : <a onClick={this.toggleLoginOpen} className='login-button'><Icon name='lock'/>Logg inn</a>}
        </p>
        <div className={'login-form ' + (!this.state.loginOpen ? 'hidden' : '')}>
          <form onSubmit={this.onLogin}>
            <input type='text' ref='username' placeholder='Username' />
            <input type='password' ref='password' placeholder='Password' />
            <button type='submit'>Logg inn</button>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = LoginBox;
