// @flow

// $FlowFixMe
import React, { type Node, useState } from 'react';
import cx from 'classnames';
import styles from './Content.css';
import { Image } from 'app/components/Image';
import Youtube from 'react-youtube';
import Flex from '../Layout/Flex';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { isEmpty } from 'lodash';
import getParamsFromUrl from 'app/utils/getParamsFromUrl';

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

function Content({ banner, youtubeUrl, children, className }: Props) {
  const [isClicked, click] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const youtubeParams = youtubeUrl && getParamsFromUrl(youtubeUrl);

  return (
    <Flex column alignItems="center">
      {!isEmpty(youtubeParams) ? (
        <div>
          <LoadingIndicator
            loading={isLoading}
            className={isLoading ? {} : styles.hidden}
          />
          <Flex
            justifyContent={'center'}
            style={{
              maxHeight: isLoading ? '0' : isClicked ? '619px' : '358px'
            }}
            className={cx(styles.youtubeFrame, isLoading ? styles.hidden : {})}
          >
            <Youtube
              videoId={youtubeParams.v}
              opts={{ playerVars: { start: youtubeParams.t } }}
              onStateChange={() => click(true)}
              onReady={() => setIsLoading(false)}
            />
          </Flex>
        </div>
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
    </Flex>
  );
}

export default Content;
