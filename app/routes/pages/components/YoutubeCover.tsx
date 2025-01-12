import { LoadingIndicator, PageCover } from '@webkom/lego-bricks';
import cx from 'classnames';
import { isEmpty } from 'lodash-es';
import { useState } from 'react';
import Youtube from 'react-youtube';
import getParamsFromUrl from 'app/utils/getParamsFromUrl';
import styles from './YoutubeCover.module.css';
import type { ComponentProps } from 'react';

type Props = {
  youtubeUrl?: string;
} & Omit<ComponentProps<typeof PageCover>, 'children'>;

const YoutubeCover = ({ youtubeUrl, ...bannerProps }: Props) => {
  const [isClicked, click] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const youtubeParams = youtubeUrl && getParamsFromUrl(youtubeUrl);
  const hasYoutube = youtubeParams && !isEmpty(youtubeParams);

  return (
    <PageCover
      {...bannerProps}
      className={
        hasYoutube
          ? cx(styles.youtubeFrame, isClicked && styles.clicked)
          : undefined
      }
    >
      {hasYoutube ? (
        <div>
          <LoadingIndicator loading={isLoading} />
          <Youtube
            className={cx(isLoading && styles.hidden)}
            videoId={youtubeParams.v}
            opts={{
              playerVars: {
                start: youtubeParams.t,
              },
            }}
            onStateChange={() => click(true)}
            onReady={() => setIsLoading(false)}
          />
        </div>
      ) : undefined}
    </PageCover>
  );
};

export default YoutubeCover;
