import React, { Component, PropTypes } from 'react';
import { getImage } from 'app/utils';
import LoadingIndicator from 'app/components/LoadingIndicator/';
import Image from 'app/components/Image';
import styles from './JoblistingDetail.css';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import Markdown from 'app/components/Markdown';
import { selectJobtype, sameYear } from '../utils.js';
import Time from 'app/components/Time';


export default class JoblistingDetail extends Component {
  static propTypes = {
    joblisting: PropTypes.object.isRequired
  };

  render() {
    const { joblisting } = this.props;
    if (!joblisting) {
      return <LoadingIndicator loading />;
    }
    console.log(joblisting);
    return (
      <div className={styles.root}>
        <div className={styles.coverImage}>
          <Image src={getImage(joblisting.id, 1000, 300)} />
        </div>
        <h1>{joblisting.title}</h1>
        <FlexRow>
          <FlexColumn className={styles.description}>
            <Markdown>Hello</Markdown>
          </FlexColumn>
          <FlexColumn className={styles.meta}>
            <ul>
              <li>
                Frist:
                {' '}
                <strong>
                  <Time
                    time={joblisting.deadline}
                    format='ll HH:mm'
                  />
                </strong>
              </li>
              <br />
              <li>{selectJobtype(joblisting.jobType)}</li>
              <li>{sameYear(joblisting) ? `${joblisting.fromYear}.` :
               `${joblisting.fromYear}. - ${joblisting.toYear}.`} klasse</li>
              <li>{joblisting.workplaces}</li>
            </ul>
          </FlexColumn>
        </FlexRow>
      </div>
    );
  }
}
