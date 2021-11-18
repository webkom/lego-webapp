// @flow
import { Link } from 'react-router-dom';
import { Component } from 'react';
import Button from 'app/components/Button';
import styles from './AnnouncementInLine.css';
import type { ID } from 'app/models';

type Props = {
  placeholder?: string,
  event?: ID,
  meeting?: ID,
  group?: ID,
  createAnnouncement: (CreateAnnouncement) => Promise<*>,
  handleSubmit: (Function) => void,
  actionGrant: boolean,
  hidden?: boolean,
  button?: boolean,
  className?: string,
};

class AnnouncementInLine extends Component<Props> {
  
  render() {
    const {
      actionGrant,
      event,
      meeting,
      group,
    } = this.props;


    return (
      <div>
      {actionGrant && (event || meeting || group) && (
        <div>
            <Link to={"/announcements"} state={{event, meeting}}>
            <Button
              className={styles.announcementButton}
            >
              Ny kunngjøring
            </Button>
            </Link>
         
        </div>
      )}
    </div>
    );
  }
}



export default AnnouncementInLine;
