// @flow

import { forwardRef } from 'react';
import type { Node } from 'react';
import styled, { keyframes } from 'styled-components';
import styles from '../Header.css';

type Props = {
  children: Node,
  animatingOut: boolean,
  direction: 'left' | 'right',
};

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
`;

const FadeContents = forwardRef<Props, FadeContainer>(
  ({ children, animatingOut, direction }: Props, ref) => (
    <FadeContainer
      className={styles.fadeContainer}
      style={{
        opacity: !animatingOut && direction ? 0 : 1,
      }}
      // Prevent screen readers from reading out hidden content
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
