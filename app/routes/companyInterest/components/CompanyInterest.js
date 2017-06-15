import styles from './CompanyInterest.css';
import React, { Component } from 'react';
import Image from 'app/components/Image';
import { Link } from 'react-router';
import Modal from 'app/components/Modal';

export type Props = {
  group: Object
};

const eventTypes = group => {
  return [
    {
      value: group.companyPresentation,
      label: 'Bedriftspresentasjon'
    },
    {
      value: group.course,
      label: 'Kurs'
    },
    {
      value: group.lunchPresentation,
      label: 'Lunsjpresentasjon'
    },
    {
      value: group.readme,
      label: 'Annonsere i readme'
    },
    {
      value: group.collaboration,
      label: 'Samarbeid med andre linjeforeninger'
    },
    {
      value: group.itdagene,
      label: 'Ønsker stand på itDAGENE'
    }
  ];
};

const generateEvents = props => {
  return eventTypes(props.group).map(event => {
    return <p>{event.label}: {event.value ? 'Ja' : ''}</p>;
  });
};

export default class CompanyInterest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  props: Props;
  render() {
    const { group } = this.props;
    return (
      <div className={styles.companyInterest}>
        <div
          onClick={() => this.setState({ showModal: true })}
          className={styles.link}
        >
          <h2 className={styles.heading}>{group.name}</h2>
        </div>
        <div className={styles.content}>
          <div className={styles.paragraph}>
            <p>{group.contactPerson}</p>
            <p>{group.mail}</p>
          </div>
          <div onClick={() => this.setState({ showModal: true })}>
            <Image className={styles.interestPic} src={group.interestPic} />
          </div>
          <Modal
            keyboard={false}
            show={this.state.showModal}
            onHide={() => this.setState({ showModal: false })}
          >
            <p>
              {generateEvents(this.props)}
            </p>
          </Modal>
        </div>
      </div>
    );
  }
}
