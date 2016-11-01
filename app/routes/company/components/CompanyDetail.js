import React, { Component } from 'react';
import styles from './company.css';
import moment from 'moment';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { EventItem } from 'app/routes/events/components/EventList';
import Image from 'app/components/Image';
import { getImage } from 'app/utils';

type Props = {
  company: Array<Object>
};

class CompanyDetail extends Component {
  props: Props;


  render() {
    const { company } = this.props;
    if (!company) {
      return <LoadingIndicator loading />;
    }
    return (
      <div className={styles.root}>
        <div>
          <Image src={getImage(company.id, 1000, 300)} />
        </div>

        <h2>{company.name}</h2>
        <div className={styles.card}>
          <p>{company.description}</p>
          <p>Address: {company.Address}</p>
          <p>Phone: {company.phone}</p>
          <p>Website: <a href={`https://www.${company.website}`}>{company.website}
          </a></p>
        </div>

        <div>
          <h3>Kommende arrangementer</h3>
          {company.events
            .filter((event) => (moment().isSameOrBefore(event.startTime)))
            .map((event, id) => (

              <EventItem
                key={id}
                event={event}
              />
          ))}
        </div>

        <div>
          <h3>Jobbannonser</h3>
          <ul>
            <p>joblisting 1</p>
            <p>joblisting 2</p>
            <p>...</p>
          </ul>
        </div>

        <div>
          <h3>Tidligere Events</h3>
          {company.events
            .filter((event) => (moment().isAfter(event.startTime)))
            .map((event, id) => (
              <div>
                <EventItem
                  key={id}
                  event={event}
                />
              </div>
          ))}
        </div>
      </div>
    );
  }
}

export default CompanyDetail;
