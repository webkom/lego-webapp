// @flow

import React, { Component, Children, createRef } from 'react';
import type { Node } from 'react';
import { Flipped } from 'react-flip-toolkit';
import styled, { keyframes } from 'styled-components';
import FadeContents from './FadeContents';
import styles from '../Header.css';
import { any } from 'prop-types';

type Props = {
  children: Node,
  animatingOut: boolean,
  direction: 'left' | 'right',
};

const getFirstDropdownSectionHeight = (el) => {
  if (
    !el ||
    !el.querySelector ||
    !el.querySelector('*[data-first-dropdown-section]')
  )
    return 0;
  return el.querySelector('*[data-first-dropdown-section]').offsetHeight;
};

const updateAltBackground = ({
  altBackground,
  prevDropdown,
  currentDropdown,
}) => {
  const prevHeight = getFirstDropdownSectionHeight(prevDropdown);
  const currentHeight = getFirstDropdownSectionHeight(currentDropdown);

  const immediateSetTranslateY = (el, translateY) => {
    el.style.transform = `translateY(${translateY}px)`;
    el.style.transition = 'transform 0s';
    requestAnimationFrame(() => (el.style.transitionDuration = ''));
  };

  if (prevHeight) {
    // transition the grey ("alt") background from its previous height to its current height
    immediateSetTranslateY(altBackground, prevHeight);
    requestAnimationFrame(() => {
      altBackground.style.transform = `translateY(${currentHeight}px)`;
    });
  } else {
    // just immediately set the background to the appropriate height
    // since we don't have a stored value
    immediateSetTranslateY(altBackground, currentHeight);
  }
};

const getDropdownRootKeyFrame = ({ animatingOut, direction }) => {
  if (!animatingOut && direction) return null;
  return keyframes`
  from {
    transform: ${animatingOut ? 'rotateX(0)' : 'rotateX(-15deg)'};
    opacity: ${animatingOut ? 1 : 0};
  }
  to {
    transform: ${animatingOut ? 'rotateX(-15deg)' : 'rotateX(0)'};
    opacity: ${animatingOut ? 0 : 1};
  }
`;
};

const DropdownRoot = styled.div`
  animation-name: ${getDropdownRootKeyFrame};
`;

class DropdownContainer extends Component<Props> {
  altBackgroundEl = any; // ????
  currentDropdownEl = createRef<any>();
  prevDropdownEl = createRef<any>();

  componentDidMount() {
    updateAltBackground({
      altBackground: this.altBackgroundEl,
      prevDropdown: this.prevDropdownEl.current,
      currentDropdown: this.currentDropdownEl.current,
    });
  }

  render() {
    const { children, animatingOut, direction } = this.props;
    const [currentDropdown, prevDropdown] = Children.toArray(children);

    return (
      <DropdownRoot
        animatingOut={animatingOut}
        direction={direction}
        className={styles.dropdownRoot}
      >
        <Flipped flipId="dropdown-caret">
          <div className={styles.caret} />
        </Flipped>
        <Flipped flipId="dropdown">
          <div className={styles.dropdownBackground}>
            <Flipped inverseFlipId="dropdown">
              <div className={styles.invertedDiv}>
                <div
                  className={styles.altBackground}
                  ref={(el) => (this.altBackgroundEl = el)}
                />
                <FadeContents
                  animatingOut={false} // ???
                  direction={direction}
                  ref={this.currentDropdownEl}
                >
                  {currentDropdown}
                </FadeContents>
              </div>
            </Flipped>

            <Flipped inverseFlipId="dropdown" scale>
              <div
                className={styles.invertedDiv}
                style={{ position: 'absolute' }}
              >
                {prevDropdown && (
                  <FadeContents
                    animatingOut
                    direction={direction}
                    ref={this.prevDropdownEl}
                  >
                    {prevDropdown}
                  </FadeContents>
                )}
              </div>
            </Flipped>
          </div>
        </Flipped>
      </DropdownRoot>
    );
  }
}

export default DropdownContainer;
