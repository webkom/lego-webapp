// @flow

import React, { forwardRef } from 'react';
import type { Node } from 'react';
import styled, { keyframes } from 'styled-components';
import styles from '../Header.css';

const getFadeContainerKeyFrame = ({ animatingOut, direction }) => {
  if (!direction) return;
  return keyframes`
  to {
    transform: translateX(0px);
    opacity: ${animatingOut ? 0 : 1};
  }
`;
};

const FadeContainer = styled.div`
  animation-name: ${getFadeContainerKeyFrame};
  opacity: ${(props) => (props.direction && !props.animatingOut ? 0 : 1)};
`;

type Props = {
  children: Node,
  animatingOut: boolean,
  direction: 'left' | 'right',
};

const FadeContents = forwardRef<Props, FadeContainer>(
  ({ children, animatingOut, direction }: Props, ref) => (
    <FadeContainer
      className={styles.fadeContainer}
      // prevent screen readers from reading out hidden content
      aria-hidden={animatingOut}
      animatingOut={animatingOut}
      direction={direction}
      ref={ref}
    >
      {children}
    </FadeContainer>
  )
);

FadeContents.displayName = 'FadeContents';

export default FadeContents;
