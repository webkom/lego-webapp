import { Flex, LoadingIndicator, Skeleton } from '@webkom/lego-bricks';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import Youtube from 'react-youtube';
import { Image } from 'app/components/Image';
import getParamsFromUrl from 'app/utils/getParamsFromUrl';
import styles from './Content.css';
import type { ReactNode } from 'react';

type Props = {
  banner?: string;
  bannerPlaceholder?: string;
  youtubeUrl?: string;
  className?: string;
  skeleton?: boolean;
  children: ReactNode;
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
function Content({
  banner,
  bannerPlaceholder,
  youtubeUrl,
  children,
  skeleton,
  className,
}: Props) {
  const [isClicked, click] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const youtubeParams = youtubeUrl && getParamsFromUrl(youtubeUrl);

  return (
    <Flex column alignItems="center">
      {!isEmpty(youtubeParams) ? (
        <div>
          <LoadingIndicator
            loading={isLoading}
            className={isLoading ? styles.hidden : undefined}
          />
          <Flex
            justifyContent="center"
            style={{
              maxHeight: isLoading ? '0' : isClicked ? '619px' : '358px',
            }}
            className={cx(styles.youtubeFrame, isLoading ? styles.hidden : {})}
          >
            <Youtube
              videoId={youtubeParams.v}
              opts={{
                playerVars: {
                  start: youtubeParams.t,
                },
              }}
              onStateChange={() => click(true)}
              onReady={() => setIsLoading(false)}
            />
          </Flex>
        </div>
      ) : skeleton ? (
        <Skeleton className={cx(styles.cover, className)} />
      ) : (
        banner && (
          <div className={cx(styles.cover, className)}>
            <Image
              src={banner}
              placeholder={bannerPlaceholder}
              width={1667}
              height={500}
              alt="Content banner"
            />
          </div>
        )
      )}

      <div
        className={cx(styles.content, className, {
          [styles.contentWithBanner]: banner,
        })}
      >
        {children}
      </div>
    </Flex>
  );
}

export default Content;
