import React, { PropTypes, Component } from 'react';
import { Overlay } from 'react-overlays';


export default class ButtonTriggeredDropdown extends Component {

  static propTypes = {
    iconName: PropTypes.string,
    toggle: PropTypes.func.isRequired
  }

  static defaultProps = {
    iconName: 'star'
  }

  render() {
    const { iconName, toggle, show, className } = this.props;

    return (
      <button onClick={toggle} ref='target' className={className}>
        <i className={`fa fa-${iconName}`} />

        <Overlay
          show={show}
          onHide={toggle}
          target={(props) => this.refs.target}
          placement='bottom'
          rootClose
        >
          <div className='Dropdown__content'>
            {this.props.children}
          </div>
        </Overlay>
      </button>
    );
  }
}
