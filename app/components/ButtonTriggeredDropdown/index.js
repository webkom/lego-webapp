/** @flow */

import React, { Component } from 'react';
import { Overlay } from 'react-overlays';
import cx from 'classnames';

type Props = {
  iconName: string;
  toggle: () => any;
  buttonClassName?: string;
  contentClassName?: string|boolean;
  show: boolean;
  children?: any;
};

export default class ButtonTriggeredDropdown extends Component {
  props: Props;

  static defaultProps = {
    iconName: 'star'
  };

  render() {
    const {
      iconName,
      toggle,
      show,
      contentClassName,
      buttonClassName,
      children
    } = this.props;

    return (
      <button
        onClick={toggle}
        ref='target'
        className={buttonClassName}
      >
        <i className={`fa fa-${iconName}`} />

        <Overlay
          show={show}
          onHide={toggle}
          target={() => this.refs.target}
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
