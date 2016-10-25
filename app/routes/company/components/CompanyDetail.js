import React, { Component } from 'react';
import styles from './company.css';
import moment from 'moment';
import LoadingIndicator from 'app/components/LoadingIndicator';

type Props = {
  company: Array<Object>
};

export default class CompanyDetail extends Component {
  props: Props;


  render() {
    const { company } = this.props;
    if (!company) {
      return <LoadingIndicator loading/>;
    }
    return (
      <div className={styles.root}>
        <div>
          <h1>{company.name}</h1>
          <p>Description: {company.description}</p>
          <p>Address: {company.Address}</p>
          <p>Phone: {company.phone}</p>
          <p>Website: <a href={`https://www.${company.website}`} target='_blank'>{company.website}
          </a></p>
        </div>

        <div>
          <h3>Cummin&#39; Events</h3>
          {company.events
            .filter((Event) => (moment().isSameOrBefore(Event.startTime)))
            .map((Event) => (Event.title))
          }
        </div>

        <div>
          <h3>Previous Events</h3>
          {company.events
            .filter((Event) => (moment().isAfter(Event.startTime)))
            .map((Event, id) => (<p key={id}>{Event.title}</p>))
          }
        </div>

        <div>
          <h3>Joblistings</h3>
          <ul>
            <p>joblisting1</p>
            <p>joblisting2</p>
            <p>osv..</p>
          </ul>
        </div>
      </div>
    );
  }
}
