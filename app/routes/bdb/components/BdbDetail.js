import React, { Component } from 'react';
import styles from './bdb.css';
import {
  getStatusString,
  selectColorCode,
  semesterCodeToName,
  sortStatusesByProminence,
  sortByYearThenSemester,
  selectMostProminentStatus
} from '../utils.js';
import BdbRightNav from './BdbRightNav';
import InfoBubble from 'app/components/InfoBubble';
import CommentView from 'app/components/Comments/CommentView';
import Time from 'app/components/Time';
import { Link } from 'react-router';
import LoadingIndicator from 'app/components/LoadingIndicator';

type Props = {
  company: Object,
  comments?: Array<Object>,
  companyEvents: Array<Object>,
  currentUser: any,
  deleteSemesterStatus: () => void,
  deleteCompanyContact: () => void,
  loggedIn: boolean
};

export default class BdbDetail extends Component {
  props: Props;

  deleteSemesterStatus = semesterId => {
    const { deleteSemesterStatus, company } = this.props;
    deleteSemesterStatus(company.id, semesterId);
  };

  deleteCompanyContact = companyContactId => {
    const { deleteCompanyContact, company } = this.props;
    deleteCompanyContact(company.id, companyContactId);
  };

  render() {
    const {
      company,
      comments,
      companyEvents,
      currentUser,
      loggedIn
    } = this.props;

    if (!company.semesterStatuses) {
      return <LoadingIndicator loading />;
    }

    const semesters = (company.semesterStatuses || [])
      .sort(sortByYearThenSemester)
      .map((status, i) => (
        <tr key={i}>
          <td>
            {status.year} {semesterCodeToName(status.semester)}
          </td>

          <td
            className={
              styles[
                selectColorCode(
                  selectMostProminentStatus(status.contactedStatus)
                )
              ]
            }
            style={{ padding: '5px', lineHeight: '18px' }}
          >
            {status.contactedStatus
              .sort(sortStatusesByProminence)
              .map(
                (statusCode, i) =>
                  getStatusString(statusCode) +
                  (i !== status.contactedStatus.length - 1 ? ', ' : '')
              )}
          </td>

          <td>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{status.contract || '-'}</span>
              <span style={{ display: 'flex', flexDirection: 'row' }}>
                <Link to={`/bdb/${company.id}/semesters/${status.id}`}>
                  <i
                    className="fa fa-pencil"
                    style={{ marginRight: '5px', color: 'orange' }}
                  />{' '}
                  e
                </Link>
                <a onClick={() => this.deleteSemesterStatus(status.id)}>
                  <i className="fa fa-times" style={{ color: '#d13c32' }} /> d
                </a>
              </span>
            </div>
          </td>
        </tr>
      ));

    let companyContacts = [];
    if (company.companyContacts) {
      companyContacts = company.companyContacts.map((contact, i) => (
        <tr key={i}>
          <td>{contact.name || '-'}</td>
          <td>{contact.role || '-'}</td>
          <td>{contact.mail || '-'}</td>
          <td style={{ display: 'flex', justifyContent: 'space-between' }}>
            {contact.phone || '-'}
            <span style={{ display: 'flex', flexDirection: 'row' }}>
              <Link to={`/bdb/${company.id}/company-contacts/${contact.id}`}>
                <i
                  className="fa fa-pencil"
                  style={{ marginRight: '5px', color: 'orange' }}
                />
              </Link>
              <a onClick={() => this.deleteCompanyContact(contact.id)}>
                <i className="fa fa-times" style={{ color: '#d13c32' }} />
              </a>
            </span>
          </td>
        </tr>
      ));
    }

    const events = companyEvents
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .map((event, i) => (
        <tr key={i}>
          <td>{event.title}</td>
          <td>{event.eventType}</td>
          <td>
            <Time time={event.startTime} format="DD.MM.YYYY" />
          </td>
        </tr>
      ));

    return (
      <div className={styles.root}>
        <div className={styles.detail}>
          <div className={styles.leftSection}>
            <h1>
              {company.name} {!company.active && 'Inaktiv'}
            </h1>
            <div className={styles.description}>
              {company.description || 'Ingen beskrivelse tilgjengelig.'}
            </div>

            <div className={styles.infoBubbles}>
              <InfoBubble
                icon={'briefcase'}
                data={company.companyType}
                meta={'Type bedrift'}
                style={{ order: 0 }}
              />
              <InfoBubble
                icon={'mail'}
                data={company.paymentMail}
                meta={'Fakturamail'}
                style={{ order: 1 }}
              />
              <InfoBubble
                icon={'call'}
                data={company.phone}
                meta={'Telefon'}
                style={{ order: 2 }}
              />
            </div>

            <div className={styles.infoBubbles}>
              <InfoBubble
                icon={'at'}
                data={company.website}
                meta={'Nettside'}
                style={{ order: 0 }}
              />
              <InfoBubble
                icon={'home'}
                data={company.address}
                meta={'Adresse'}
                style={{ order: 1 }}
              />
              <InfoBubble
                icon={'person'}
                data={`${company.studentContact
                  ? company.studentContact.firstName
                  : ''} ${company.studentContact
                  ? company.studentContact.lastName
                  : ''}`}
                meta={'Studentkontakt'}
                style={{ order: 2 }}
              />
            </div>

            <h3>Bedriftskontakter</h3>
            {companyContacts.length > 0 ? (
              <div
                className={styles.companyList}
                style={{ marginBottom: '10px' }}
              >
                <table className={styles.contactTable}>
                  <thead className={styles.categoryHeader}>
                    <tr>
                      <th>Navn</th>
                      <th>Rolle</th>
                      <th>E-post</th>
                      <th>Tlf</th>
                    </tr>
                  </thead>
                  <tbody>{companyContacts}</tbody>
                </table>
              </div>
            ) : (
              <i style={{ display: 'block' }}>
                Ingen bedriftskontakter registrert.
              </i>
            )}

            <Link
              to={`/bdb/${company.id}/company-contacts/add`}
              style={{ marginTop: '10px' }}
            >
              <i className="fa fa-plus-circle" /> Legg til bedriftskontakt
            </Link>

            <div style={{ clear: 'both', marginBottom: '30px' }} />

            <h3>Semesterstatuser</h3>
            {semesters.length > 0 ? (
              <div
                className={styles.companyList}
                style={{ marginBottom: '10px' }}
              >
                <table className={styles.detailTable}>
                  <thead className={styles.categoryHeader}>
                    <tr>
                      <th>Semester</th>
                      <th>Status</th>
                      <th>Kontrakt</th>
                    </tr>
                  </thead>
                  <tbody>{semesters}</tbody>
                </table>
              </div>
            ) : (
              <i style={{ display: 'block' }}>Ingen sememsterstatuser.</i>
            )}

            <div>
              <Link to={`/bdb/${company.id}/semesters/add`}>
                <i className="fa fa-plus-circle" /> Legg til nytt semester
              </Link>
            </div>

            <div className={styles.files}>
              <h3>Filer</h3>
              <ul>
                {!company.files ||
                (company.files && company.files.length === 0) ? (
                  <i>Ingen filer.</i>
                ) : (
                  company.files.map((file, i) => <li key={i}>{file}</li>)
                )}
              </ul>
              <Link to={`/bdb/${company.id}/semesters/add`}>
                <i className="fa fa-plus-circle" /> Legg til fil
              </Link>
            </div>

            <div className={styles.adminNote}>
              <h3>Notat fra Bedkom</h3>
              {company.adminComment || <i>Ingen notater</i>}
            </div>

            <h3>Bedriftens arrangementer</h3>
            {events.length > 0 ? (
              <div className={styles.companyList}>
                <table className={styles.eventsTable}>
                  <thead className={styles.categoryHeader}>
                    <tr>
                      <th>Tittel</th>
                      <th>Arrangementstype</th>
                      <th>Når</th>
                    </tr>
                  </thead>
                  <tbody>{events}</tbody>
                </table>
              </div>
            ) : (
              <i>Ingen arrangementer.</i>
            )}

            <div style={{ clear: 'both', marginBottom: '30px' }} />

            <CommentView
              user={currentUser}
              commentTarget={company.commentTarget}
              loggedIn={loggedIn}
              comments={comments}
            />
          </div>

          <BdbRightNav {...this.props} />
        </div>
      </div>
    );
  }
}
