import cx from 'classnames';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import CommentView from 'app/components/Comments/CommentView';
import { Content } from 'app/components/Content';
import { Image } from 'app/components/Image';
import InfoBubble from 'app/components/InfoBubble';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import type { CompanySemesterContactedStatus } from 'app/models';
import type {
  CompanyEntity,
  BaseSemesterStatusEntity,
  SemesterStatusEntity,
} from 'app/reducers/companies';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';
import type { UserEntity } from 'app/reducers/users';
import { EVENT_CONSTANTS } from 'app/routes/events/utils';
import type { ID } from 'app/store/models';
import type Comment from 'app/store/models/Comment';
import type { CurrentUser } from 'app/store/models/User';
import truncateString from 'app/utils/truncateString';
import {
  sortByYearThenSemester,
  getContactedStatuses,
  DetailNavigation,
} from '../utils';
import SemesterStatusDetail from './SemesterStatusDetail';
import styles from './bdb.css';

type Props = {
  company: CompanyEntity;
  comments: Comment[];
  companyEvents: Array<Record<string, any>>;
  currentUser: CurrentUser;
  deleteSemesterStatus: (arg0: number, arg1: number) => Promise<any>;
  deleteCompanyContact: (arg0: number, arg1: number) => Promise<any>;
  loggedIn: boolean;
  companySemesters: Array<CompanySemesterEntity>;
  editSemesterStatus: (
    arg0: BaseSemesterStatusEntity,
    arg1: Record<string, any> | null | undefined
  ) => Promise<any>;
  fetching: boolean;
  editCompany: (arg0: Record<string, any>) => void;
  deleteCompany: (arg0: number) => Promise<any>;
  deleteComment: (id: ID, contentTarget: string) => Promise<any>;
  showFetchMoreEvents: boolean;
  fetchMoreEvents: () => Promise<any>;
};
type State = {
  addingFiles: boolean;
  eventsToDisplay: number;
};
export default class BdbDetail extends Component<Props, State> {
  state = {
    addingFiles: false,
    eventsToDisplay: 3,
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
      ),
    };
    const companySemester = companySemesters.find(
      (companySemester) =>
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
      companyId: company.id,
    };
    return editSemesterStatus(sendableSemester, {
      detail: true,
    });
  };
  deleteSemesterStatus = (semesterStatusId: number) => {
    const { deleteSemesterStatus, company } = this.props;
    return deleteSemesterStatus(company.id, semesterStatusId);
  };
  deleteCompanyContact = (companyContactId: number) => {
    const { deleteCompanyContact, company } = this.props;
    return deleteCompanyContact(company.id, companyContactId);
  };
  addFileToSemester = (
    fileName: string,
    fileToken: string,
    type: string,
    semesterStatus: Record<string, any>
  ) => {
    const { editSemesterStatus, company } = this.props;
    const sendableSemester = {
      semesterStatusId: semesterStatus.id,
      companyId: company.id,
      contactedStatus: semesterStatus.contactedStatus,
      [type]: fileToken,
    };
    return editSemesterStatus(sendableSemester, {
      detail: true,
    });
  };
  removeFileFromSemester = (
    semesterStatus: SemesterStatusEntity,
    type: string
  ) => {
    const { editSemesterStatus, company } = this.props;
    const sendableSemester = {
      semesterStatusId: semesterStatus.id,
      contactedStatus: semesterStatus.contactedStatus,
      companyId: company.id,
      [type]: null,
    };
    return editSemesterStatus(sendableSemester, {
      detail: true,
    });
  };
  studentContactLink = (studentContact?: UserEntity): string => {
    return studentContact
      ? 'abakus.no/users/' + String(studentContact.username)
      : '';
  };

  render() {
    const {
      company,
      comments,
      currentUser,
      loggedIn,
      companyEvents,
      fetching,
      deleteCompany,
      deleteComment,
      showFetchMoreEvents,
      fetchMoreEvents,
    } = this.props;

    if (fetching || !company.semesterStatuses) {
      return <LoadingIndicator loading />;
    }

    const semesters = company.semesterStatuses
      .slice() // $FlowFixMe
      .sort(sortByYearThenSemester)
      .map((semesterStatus) => (
        <SemesterStatusDetail
          semesterStatus={semesterStatus}
          key={semesterStatus.id}
          companyId={company.id}
          deleteSemesterStatus={this.deleteSemesterStatus}
          editFunction={this.semesterStatusOnChange}
          addFileToSemester={this.addFileToSemester}
          removeFileFromSemester={this.removeFileFromSemester}
        />
      ));
    // CompanyContact in reverse order, latest comes first
    const companyContacts =
      company.companyContacts &&
      company.companyContacts
        .map((contact) => (
          <tr key={contact.id}>
            <td>{contact.name || '-'}</td>
            <td>{contact.role || '-'}</td>
            <td>{contact.mail || '-'}</td>
            <td>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                {contact.phone || '-'}
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <Link
                    to={`/bdb/${String(company.id)}/company-contacts/${String(
                      contact.id
                    )}`}
                  >
                    <i
                      className="fa fa-pencil"
                      style={{
                        marginRight: '5px',
                        color: 'orange',
                      }}
                    />
                  </Link>
                  <ConfirmModalWithParent
                    title="Slett bedriftskontakt"
                    message="Er du sikker på at du vil slette denne bedriftskontakten?"
                    onConfirm={() => this.deleteCompanyContact(contact.id)}
                    closeOnConfirm
                  >
                    <i
                      className="fa fa-times"
                      style={{
                        color: '#d13c32',
                        position: 'relative',
                        top: '5px',
                      }}
                    />
                  </ConfirmModalWithParent>
                </span>
              </div>
            </td>
          </tr>
        ))
        .reverse();
    const events =
      companyEvents &&
      companyEvents
        .sort((a, b) => Date.parse(b.startTime) - Date.parse(a.startTime))
        .slice(0, this.state.eventsToDisplay)
        .map((event) => (
          <tr key={event.id}>
            <td>
              <Link to={`events/${event.id}`}>{event.title}</Link>
            </td>
            <td>{EVENT_CONSTANTS[event.eventType]}</td>
            <td>
              <Time time={event.startTime} format="DD.MM.YYYY" />
            </td>
            <td>{truncateString(event.location, 50)}</td>
            <td>{truncateString(event.description, 70)}</td>
            <td>
              {event.survey && (
                <Tooltip content="Spørreundersøkelse">
                  <Link to={`/surveys/${event.survey}`}>
                    <i
                      className={cx(
                        'fa fa-bar-chart',
                        styles.surveyIcon,
                        styles.surveyContainer
                      )}
                    />
                  </Link>
                </Tooltip>
              )}
            </td>
          </tr>
        ));
    const title = (
      <span>
        {company.name}
        {!company.active && (
          <span
            style={{
              color: 'var(--danger-color)',
            }}
          >
            {' '}
            (Inaktiv)
          </span>
        )}
        <Link to={`/bdb/${company.id}/edit`}>
          <i
            className="fa fa-pencil"
            style={{
              marginLeft: '15px',
              color: 'orange',
              fontSize: '20px',
            }}
          />
        </Link>
      </span>
    );
    return (
      <Content>
        <div className={styles.detail}>
          {company.logo && (
            <Image
              src={company.logo}
              style={{
                height: 'inherit',
                border: '1px solid var(--border-gray)',
                marginBottom: '15px',
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
              style={{
                order: 0,
              }}
            />
            <InfoBubble
              icon="mail"
              data={company.paymentMail}
              meta="Fakturamail"
              style={{
                order: 1,
              }}
            />
            <InfoBubble
              icon="call"
              data={company.phone}
              meta="Telefon"
              style={{
                order: 2,
              }}
            />
            <InfoBubble
              icon="at"
              data={company.website}
              meta="Nettside"
              style={{
                order: 3,
              }}
              link={company.website}
            />
            <InfoBubble
              icon="home"
              data={company.address}
              meta="Adresse"
              style={{
                order: 4,
              }}
            />
            <InfoBubble
              icon="person"
              data={`${
                (company.studentContact && company.studentContact.fullName) ||
                '-'
              }`}
              meta="Studentkontakt"
              link={this.studentContactLink(company.studentContact)}
              style={{
                order: 5,
              }}
            />
          </div>
          <h3>
            Bedriftskontakter{' '}
            <span
              style={{
                fontSize: '15px',
              }}
            >
              (Nyest øverst)
            </span>
          </h3>
          {companyContacts && companyContacts.length > 0 ? (
            <div
              className={styles.companyList}
              style={{
                marginBottom: '10px',
              }}
            >
              <table className={styles.contactTable}>
                <thead>
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
            <i
              style={{
                display: 'block',
              }}
            >
              Ingen bedriftskontakter registrert.
            </i>
          )}
          <Link
            to={`/bdb/${company.id}/company-contacts/add`}
            style={{
              marginTop: '10px',
            }}
          >
            <i className="fa fa-plus-circle" /> Legg til bedriftskontakt
          </Link>
          <div
            style={{
              clear: 'both',
              marginBottom: '30px',
            }}
          />
          <h3>Semesterstatuser</h3>
          {semesters.length > 0 ? (
            <div
              className={styles.companyList}
              style={{
                marginBottom: '10px',
              }}
            >
              <p>Tips: Du kan endre semestere ved å trykke på dem i listen!</p>
              <table className={styles.detailTable}>
                <thead>
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
            <i
              style={{
                display: 'block',
              }}
            >
              Ingen sememsterstatuser.
            </i>
          )}
          <div>
            <Link to={`/bdb/${company.id}/semesters/add`}>
              <i className="fa fa-plus-circle" /> Legg til nytt semester
            </Link>
          </div>
          <div className={styles.files}>
            <h3>Filer</h3>
            <ul>
              {!company.files || company.files.length === 0 ? (
                <i>Ingen filer.</i>
              ) : (
                company.files.map((file) => (
                  <li key={file.id}>
                    <a href={file.file}>{truncateString(file.file, 100)}</a>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className={styles.adminNote}>
            <h3>Notat i listen</h3>
            {company.adminComment || <i>Ingen notater</i>}
          </div>
          <h3>Bedriftens arrangementer</h3>
          {events.length > 0 ? (
            <div className={styles.companyList}>
              <table className={styles.eventsTable}>
                <thead>
                  <tr>
                    <th>Tittel</th>
                    <th>Arrangementstype</th>
                    <th>Når</th>
                    <th>Hvor</th>
                    <th>Hva</th>
                    <th />
                  </tr>
                </thead>
                <tbody>{events}</tbody>
              </table>
              {this.state.eventsToDisplay === 3 ? (
                <Button
                  style={{
                    width: '100%',
                    marginTop: '20px',
                  }}
                  onClick={() =>
                    this.setState({
                      eventsToDisplay: 100,
                    })
                  }
                >
                  Vis alle arrangementer
                </Button>
              ) : (
                showFetchMoreEvents && (
                  <Button onClick={fetchMoreEvents}>Hent flere</Button>
                )
              )}
            </div>
          ) : (
            <i>Ingen arrangementer.</i>
          )}
          <div
            style={{
              clear: 'both',
              marginBottom: '30px',
            }}
          />

          {company.contentTarget && (
            <CommentView
              user={currentUser}
              contentTarget={company.contentTarget}
              loggedIn={loggedIn}
              comments={comments}
              newOnTop
              deleteComment={deleteComment}
            />
          )}
        </div>
      </Content>
    );
  }
}
