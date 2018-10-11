// @flow

import React, { Component } from 'react';
import { withSoundCloudAudio } from 'react-soundplayer/addons';
import {
  PlayButton,
  Progress,
  VolumeControl
} from 'react-soundplayer/components';

import 'react-soundplayer/styles/buttons.css';
import 'react-soundplayer/styles/cover.css';
import 'react-soundplayer/styles/icons.css';
import 'react-soundplayer/styles/progress.css';
import 'react-soundplayer/styles/volume.css';
import styles from './Podcast.css';
import moment from 'moment-timezone';

type Props = {
  track: any,
  currentTime: any,
  duration: any,
  createdAt: string
};

class ProgressSoundPlayer extends Component<Props, *> {
  render() {
    const { track, currentTime, duration, createdAt } = this.props;
    return (
      <div>
        <div className={styles.header}>
          <p className={styles.title}>{track ? track.title : ''}</p>
          <p>{moment(createdAt).format('MMM Do YY')}</p>
        </div>
        <div className={styles.progress}>
          <PlayButton className={styles.play} {...this.props} />
          <Progress value={currentTime / duration * 100 || 0} {...this.props} />
        </div>
        {duration !== 0 && (
          <div className={styles.controls}>
            <VolumeControl className={styles.volume} {...this.props} />
            {moment.utc(currentTime * 1000).format('HH:mm:ss')} av{' '}
            {moment.utc(duration * 1000).format('HH:mm:ss')}
          </div>
        )}
      </div>
    );
  }
}

export default withSoundCloudAudio(ProgressSoundPlayer);
