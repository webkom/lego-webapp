import React, { PropTypes, Component } from 'react';
import { Overlay } from 'react-overlays';
import cx from 'classnames';


export default class ButtonTriggeredDropdown extends Component {

  static propTypes = {
    iconName: PropTypes.string,
    toggle: PropTypes.func.isRequired,
    buttonClassName: PropTypes.string,
    contentClassName: PropTypes.string,
    show: PropTypes.bool,
    children: PropTypes.any
  }

  static defaultProps = {
    iconName: 'star'
  }

  render() {
    const { iconName, toggle, show, contentClassName, buttonClassName, children } = this.props;

    return (
      <button onClick={toggle} ref='target' className={buttonClassName}>
        <i className={`fa fa-${iconName}`} />

        <Overlay
          show={show}
          onHide={toggle}
          target={(props) => this.refs.target}
          placement='bottom'
          rootClose
        >
          <div className={cx('Dropdown__content', contentClassName)}>
            {children}
          </div>
        </Overlay>
      </button>
    );
  }
}
