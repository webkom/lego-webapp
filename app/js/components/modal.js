/** @jsx React.DOM */

var React = require('react');

var Modal = module.exports = React.createClass({

  propTypes: {
    className: React.PropTypes.string,
    onClose: React.PropTypes.func,
    visible: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      visible: true,
      onClose: function() {},
    };
  },

  componentDidMount: function() {
    window.addEventListener('keydown', this._onKeyPress, true);
  },

  componentWillUnmount: function() {
    window.removeEventListener('keydown', this._onKeyPress, true);
  },

  _onKeyPress: function(event) {
    if (event.keyCode === 27) return this.props.onClose();
  },

  render: function() {
    var modal = this.transferPropsTo(
      <div tabIndex='-1' className='modal'>
        {this.props.children}
      </div>
    );

    return (
      <div className={'modal-container' + this.props.visible ? '' : ' hidden'}>
        <div className='backdrop'></div>
        {modal}
      </div>
    );
  }
});
