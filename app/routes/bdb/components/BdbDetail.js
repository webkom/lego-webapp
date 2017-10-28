// @flow

import React, { Component } from 'react';
import styles from './bdb.css';
import {
  sortByYearThenSemester,
  getContactedStatuses,
  DetailNavigation
} from '../utils.js';
import InfoBubble from 'app/components/InfoBubble';
import CommentView from 'app/components/Comments/CommentView';
import Time from 'app/components/Time';
import { Link } from 'react-router';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Image } from 'app/components/Image';
import SemesterStatusDetail from './SemesterStatusDetail';
import { eventTypes } from 'app/routes/events/utils';
import truncateString from 'app/utils/truncateString';
import type {
  CompanyEntity,
  BaseSemesterStatusEntity,
  SemesterStatusEntity
} from 'app/reducers/companies';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import Button from 'app/components/Button';
import type { CompanySemesterContactedStatus } from 'app/models';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';

type Props = {
  company: CompanyEntity,
  comments: Array<Object>,
  companyEvents: Array<Object>,
  currentUser: any,
  deleteSemesterStatus: (number, number) => Promise<*>,
  deleteCompanyContact: (number, number) => Promise<*>,
  loggedIn: boolean,
  companySemesters: Array<CompanySemesterEntity>,
  editSemesterStatus: (BaseSemesterStatusEntity, ?Object) => Promise<*>,
  companyEvents: Array<Object>,
  fetching: boolean,
  editCompany: Object => void,
  deleteCompany: number => ?Promise<*>
};

type State = {
  addingFiles: boolean,
  eventsToDisplay: number
};

export default class BdbDetail extends Component<Props, State> {
  state = {
    addingFiles: false,
    eventsToDisplay: 3
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  semesterStatusOnChange = (
    semesterStatus: SemesterStatusEntity,
    statusString: CompanySemesterContactedStatus
  ) => {
    const { companySemesters, editSemesterStatus, company } = this.props;

    const newStatus = {
      ...semesterStatus,
      contactedStatus: getContactedStatuses(
        semesterStatus.contactedStatus,
        statusString
      )
    };

    const companySemester = companySemesters.find(
      companySemester =>
        companySemester.year === newStatus.year &&
        companySemester.semester === newStatus.semester
    );

    if (!companySemester) {
      throw new Error('Could not find company semester');
    }

    const sendableSemester = {
      contactedStatus: newStatus.contactedStatus,
      semesterStatusId: newStatus.id,
      semester: companySemester.id,
      companyId: company.id
    };

    return editSemesterStatus(sendableSemester, { detail: true });
  };

  deleteSemesterStatus = (semesterId: number) => {
    const { deleteSemesterStatus, company } = this.props;
    return deleteSemesterStatus(company.id, semesterId);
  };

  deleteCompanyContact = (companyContactId: number) => {
    const { deleteCompanyContact, company } = this.props;
    return deleteCompanyContact(company.id, companyContactId);
  };

  addFileToSemester = (
    fileName: string,
    fileToken: string,
    type: string,
    semesterStatus: Object
  ) => {
    const { editSemesterStatus, company } = this.props;

    const sendableSemester = {
      semesterStatusId: semesterStatus.id,
      companyId: company.id,
      contactedStatus: [],
      [type]: fileToken
    };

    return editSemesterStatus(sendableSemester, { detail: true });
  };

  render() {
    const {
      company,
      comments,
      currentUser,
      loggedIn,
      companyEvents,
      fetching,
      deleteCompany
    } = this.props;

    if (fetching || !company.semesterStatuses) {
      return <LoadingIndicator loading />;
    }

    const semesters = company.semesterStatuses
      .sort(sortByYearThenSemester)
      .map((semesterStatus, i) => (
        <SemesterStatusDetail
          semesterStatus={semesterStatus}
          key={i}
          companyId={company.id}
          index={i}
          deleteSemesterStatus={this.deleteSemesterStatus}
          editFunction={this.semesterStatusOnChange}
          addFileToSemester={this.addFileToSemester}
        />
      ));

    const companyContacts =
      company.companyContacts &&
      company.companyContacts.map((contact, i) => (
        <tr key={i}>
          <td>{contact.name || '-'}</td>
          <td>{contact.role || '-'}</td>
          <td>{contact.mail || '-'}</td>
          <td>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {contact.phone || '-'}
              <span style={{ display: 'flex', flexDirection: 'row' }}>
                <Link
                  to={`/bdb/${String(company.id)}/company-contacts/${String(
                    contact.id
                  )}`}
                >
                  <i
                    className="fa fa-pencil"
                    style={{ marginRight: '5px', color: 'orange' }}
                  />
                </Link>
                <ConfirmModalWithParent
                  title="Slett bedriftskontakt"
                  message="Er du sikker på at du vil slette denne bedriftskontakten?"
                  onConfirm={() => this.deleteCompanyContact(contact.id)}
                >
                  <i className="fa fa-times" style={{ color: '#d13c32' }} />
                </ConfirmModalWithParent>
              </span>
            </div>
          </td>
        </tr>
      ));

    const events =
      companyEvents &&
      companyEvents
        .sort((a, b) => Date.parse(b.startTime) - Date.parse(a.startTime))
        .splice(0, this.state.eventsToDisplay)
        .map((event, i) => (
          <tr key={i}>
            <td>
              <Link to={`events/${event.id}`}>{event.title}</Link>
            </td>
            <td>{eventTypes[event.eventType]}</td>
            <td>
              <Time time={event.startTime} format="DD.MM.YYYY" />
            </td>
            <td>{truncateString(event.location, 50)}</td>
            <td>{truncateString(event.description, 70)}</td>
          </tr>
        ));

    const title = (
      <span>
        {company.name}
        {!company.active && <span style={{ color: 'red' }}> (Inaktiv)</span>}
        <Link to={`/bdb/${company.id}/edit`}>
          <i
            className="fa fa-pencil"
            style={{ marginLeft: '15px', color: 'orange', fontSize: '20px' }}
          />
        </Link>
      </span>
    );

    return (
      <div className={styles.root}>
        <div className={styles.detail}>
          {company.logo && (
            <Image
              src={company.logo}
              style={{
                height: 'inherit',
                border: '1px solid #ccc',
                marginBottom: '15px'
              }}
            />
          )}
          <DetailNavigation
            title={title}
            companyId={company.id}
            deleteFunction={deleteCompany}
          />
          <div className={styles.description}>
            {company.description || 'Ingen beskrivelse tilgjengelig.'}
          </div>
          <div className={styles.infoBubbles}>
            <InfoBubble
              icon="briefcase"
              data={company.companyType}
              meta="Type bedrift"
              style={{ order: 0 }}
            />
            <InfoBubble
              icon="mail"
              data={company.paymentMail}
              meta="Fakturamail"
              style={{ order: 1 }}
            />
            <InfoBubble
              icon="call"
              data={company.phone}
              meta="Telefon"
              style={{ order: 2 }}
            />
          </div>
          <div className={styles.infoBubbles}>
            <InfoBubble
              icon="at"
              data={company.website}
              meta="Nettside"
              style={{ order: 0 }}
              link={company.website}
            />
            <InfoBubble
              icon="home"
              data={company.address}
              meta="Adresse"
              style={{ order: 1 }}
            />
            <InfoBubble
              icon="person"
              data={`${(company.studentContact &&
                company.studentContact.fullName) ||
                '-'}`}
              meta="Studentkontakt"
              style={{ order: 2 }}
            />
          </div>
          <h3>Bedriftskontakter</h3>
          {companyContacts && companyContacts.length > 0 ? (
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
              <p>Tips: Du kan endre semestere ved å trykke på dem i listen!</p>
              <table className={styles.detailTable}>
                <thead className={styles.categoryHeader}>
                  <tr>
                    <th>Semester</th>
                    <th>Status</th>
                    <th>Kontrakt</th>
                    <th>Statistikk</th>
                    <th>Evaluering</th>
                    <th />
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
              {!company.files || company.length === 0 ? (
                <i>Ingen filer.</i>
              ) : (
                company.files.map((file, i) => (
                  <li key={i}>
                    <a href={file.file}>{truncateString(file.file, 100)}</a>
                  </li>
                ))
              )}
            </ul>
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
                    <th>Hvor</th>
                    <th>Hva</th>
                  </tr>
                </thead>
                <tbody>{events}</tbody>
              </table>
              {companyEvents.length > 3 && (
                <Button
                  style={{ width: '100%', marginTop: '20px' }}
                  onClick={() => this.setState({ eventsToDisplay: 100 })}
                >
                  Vis alle arrangementer
                </Button>
              )}
            </div>
          ) : (
            <i>Ingen arrangementer.</i>
          )}
          <div style={{ clear: 'both', marginBottom: '30px' }} />

          {company.commentTarget && (
            <CommentView
              user={currentUser}
              commentTarget={company.commentTarget}
              loggedIn={loggedIn}
              comments={comments.sort(
                (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
              )}
            />
          )}
        </div>
      </div>
    );
  }
}
