// @flow

import React, { type Node } from 'react';
import cx from 'classnames';
import styles from './Content.css';
import { Image } from 'app/components/Image';
import Youtube from 'react-youtube';
import Flex from '../Layout/Flex';
import { FlexColumn } from '../FlexBox';

type Props = {
  banner?: string,
  youtubeUrl?: string,
  className?: string,
  children: Node
};

/**
 * A white container which should be used for most pages.
 * Usuaully used with the other components in this folder:
 *
 * ```
 * <Content>
 *   <ContentHeader>Title</ContentHeader>
 *   <ContentSection>
 *     <ContentMain>
 *     </ContentMain>
 *     <ContentSidebar>
 *     </ContentSidebar>
 *   </ContentSection>
 * </Content>
 * ```
 */

class Content extends React.Component<Props> {
  state = {
    isClicked: false
  };

  render() {
    const { banner, youtubeUrl, children, className } = this.props;
    const { isClicked } = this.state;
    return (
      <FlexColumn alignItems={'center'}>
        {youtubeUrl ? (
          <Flex
            justifyContent={'center'}
            className={styles.youtubeFrame}
            style={{ height: isClicked ? '620px' : '310px', width: '1100px' }}
          >
            <Youtube
              videoId={'2g811Eo7K8U'}
              onPlay={() => this.setState({ isClicked: true })}
              style={{ width: '100%' }}
            />
          </Flex>
        ) : (
          banner && (
            <div className={cx(styles.cover, className)}>
              <Image src={banner} />
            </div>
          )
        )}

        <div
          className={cx(styles.content, className, {
            [styles.contentWithBanner]: banner
          })}
        >
          {children}
        </div>
      </FlexColumn>
    );
  }
}

export default Content;
