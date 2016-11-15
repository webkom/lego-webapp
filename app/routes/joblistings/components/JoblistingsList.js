import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './JoblistingsList.css';
import { getImage } from 'app/utils';
import Image from 'app/components/Image';
import Time from 'app/components/Time';
import { selectJobtype, sameYear } from '../utils.js';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';

function JoblistingItem({ joblisting }) {
  return (
    <div>
      <FlexRow className={styles.joblistingItem}>
        <FlexRow>
          <FlexColumn>
            <Link to={`/joblistings/${joblisting.id}/`}>
              <Image src={getImage(joblisting.id)} className={styles.companyLogo} />
            </Link>
          </FlexColumn>
          <FlexColumn>
            <Link to={`/joblistings/${joblisting.id}/`}>
              <h3 className={styles.joblistingItemTitle}>{joblisting.title}</h3>
            </Link>
            <div className={styles.companyJobtype}>
              {`${joblisting.company} • ${selectJobtype(joblisting.jobType)}`}
            </div>
            <div>{sameYear(joblisting) ? `${joblisting.fromYear}.` :
             `${joblisting.fromYear}. - ${joblisting.toYear}.`} klasse</div>
            <div>{joblisting.workplaces}</div>
          </FlexColumn>
        </FlexRow>
        <FlexColumn className={styles.deadLine}>
          <div>
            <Time
              time={joblisting.deadline}
              format='ll HH:mm'
            />
          </div>
        </FlexColumn>
      </FlexRow>
    </div>
  );
}

function JoblistingListGroup({ joblistings = [] }) {
  return (
    <div>
      <FlexRow className={styles.heading}>
        <FlexColumn>
          <h2 className={styles.headingText}>Jobbannonser</h2>
        </FlexColumn>
        <FlexColumn className={styles.headingDeadline}>
          Deadline:
        </FlexColumn>
      </FlexRow>
      {joblistings.map((joblisting, i) => (
        <JoblistingItem
          key={i}
          joblisting={joblisting}
        />
      ))}
    </div>
  );
}

class JoblistingsList extends Component {
  static propTypes = {
    joblistings: PropTypes.array.isRequired
  };

  render() {
    const { joblistings } = this.props;
    return (
      <JoblistingListGroup
        joblistings={joblistings}
      />
    );
  }
}

export default JoblistingsList;
