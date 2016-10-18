import React, { Component } from 'react';
import styles from './bdb.css';
import { statusStrings, selectColorCode, trueIcon, falseIcon } from '../utils.js';
import CompanyRightNav from './CompanyRightNav';
import InfoBubble from 'app/components/InfoBubble';
import CommentView from 'app/components/Comments/CommentView';
import Time from 'app/components/Time';
import { Link } from 'react-router';
import LoadingIndicator from 'app/components/LoadingIndicator';

type Props = {
  company: Object,
  comments?: Array<Object>,
  currentUser: any,
  deleteSemesterStatus: () => void
};

export default class CompanyDetail extends Component {

  props: Props;

  deleteSemesterStatus = (semesterId) => {
    this.props.deleteSemesterStatus(this.props.company.id, semesterId);
  }

  render() {
    const { company, comments, currentUser, loggedIn } = this.props;

    if (!company) {
      return <LoadingIndicator />;
    }

    const semesters = company.semesterStatuses
      .sort((a, b) => (a.year === b.year ? a.semester - b.semester : b.year - a.year))
      .map((status, i) => (
        <tr key={i}>
          <td>{status.year} {status.semester === 0 ? 'Vår' : 'Høst'}</td>
          <td className={styles[selectColorCode(status.contactedStatus)]}>
            {statusStrings[status.contactedStatus] || 6}
          </td>
          <td style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{status.contract || '-'}</span>
            <span style={{ display: 'flex', flexDirection: 'row' }}>
              <Link to={`/bdb/${company.id}/semesters/${status.id}`}>
                <i className='fa fa-pencil' style={{ marginRight: '5px', color: 'orange' }}></i>
              </Link>
              <a onClick={this.deleteSemesterStatus.bind(this, status.id)}>
                <i className='fa fa-times' style={{ color: '#d13c32' }}></i>
              </a>
            </span>
          </td>
        </tr>
      )
    );

    let companyContacts = [];
    if (company.companyContacts) {
      companyContacts = company.companyContacts.map((contact, i) => (
        <tr key={i}>
          <td>{contact.name}</td>
          <td>{contact.role}</td>
          <td>{contact.mail}</td>
          <td>{contact.phone}</td>
        </tr>
      ));
    }

    let events = [];
    if (company.events) {
      events = company.events
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .map((event, i) => (
        <tr key={i}>
          <td>{event.title}</td>
          <td>{event.eventType}</td>
          <td><Time time={event.startTime} format='DD.MM.YYYY' /></td>
        </tr>
      ));
    }

    return (
      <div className={styles.root}>
          <h1>{company.name}</h1>

          <div className={styles.detail}>
          <div className={styles.leftSection}>

            <div className={styles.description}>
              {company.description || 'Ingen beskrivelse tilgjengelig.'}
            </div>

            <div className={styles.infoBubbles}>
              <InfoBubble
                icon={'phone'}
                data={company.phone}
                meta={'Telefon'}
                style={{ order: 0 }}
              />
              <InfoBubble
                icon={'user'}
                data={company.studentContact}
                meta={'Studentkontakt'}
                style={{ order: 1 }}
              />
              <InfoBubble
                icon={'paper-plane'}
                data={company.website}
                meta={'Nettside'}
                style={{ order: 2 }}
              />
            </div>

            <h3>Bedriftskontakter</h3>
            <div className={styles.companyList} style={{ marginBottom: '30px' }}>
              <table className={styles.contactTable}>
                <thead className={styles.categoryHeader}>
                  <tr>
                    <th>Navn</th>
                    <th>Rolle</th>
                    <th>E-post</th>
                    <th>Tlf</th>
                  </tr>
                </thead>
                <tbody>
                  {companyContacts}
                </tbody>
              </table>
            </div>

            <h3>Semesterstatuser</h3>
            <div className={styles.companyList}>
              <table className={styles.detailTable}>
                <thead className={styles.categoryHeader}>
                  <tr>
                    <th>Semester</th>
                    <th>Status</th>
                    <th>Kontrakt</th>
                  </tr>
                </thead>
                <tbody>
                  {semesters}
                </tbody>
              </table>
            </div>
            <Link to={`/bdb/${company.id}/semesters/add`}>Legg til nytt semester</Link>

            <div className={styles.info}>
              <div style={{ order: 0 }}>
                <h3>Aktiv bedrift?</h3>
                {company.active ? trueIcon : falseIcon}
              </div>

              <div style={{ order: 1 }}>
                <h3>Kun for jobbtilbud?</h3>
                {company.jobOfferOnly ? trueIcon : falseIcon}
              </div>

              <div style={{ order: 2 }}>
                <h3>Bedex i år?</h3>
                {company.bedex ? trueIcon : falseIcon}
              </div>
            </div>

            <div className={styles.adminNote}>
              <h3>Notat fra Bedkom</h3>
              {company.adminComment || (<i>Ingen notater</i>)}
            </div>

            <h3>Bedriftens arrangementer</h3>
            <div className={styles.companyList} style={{ marginBottom: '40px' }}>
              <table className={styles.eventsTable}>
                <thead className={styles.categoryHeader}>
                  <tr>
                    <th>Tittel</th>
                    <th>Arrangementstype</th>
                    <th>Når</th>
                  </tr>
                </thead>
                <tbody>
                  {events}
                </tbody>
              </table>
            </div>

            <CommentView
              formEnabled
              user={currentUser}
              commentTarget={company.commentTarget}
              loggedIn={loggedIn}
              comments={comments}
            />
          </div>

          <CompanyRightNav
            {...this.props}
          />
        </div>
      </div>
    );
  }
}
