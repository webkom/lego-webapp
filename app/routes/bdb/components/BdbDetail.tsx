import {
  Button,
  Card,
  ConfirmModal,
  Flex,
  Icon,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  deleteCompanyContact,
  editSemesterStatus,
  fetchAdmin,
  fetchEventsForCompany,
  fetchSemesters,
} from 'app/actions/CompanyActions';
import { getEndpoint } from 'app/actions/EventActions';
import CommentView from 'app/components/Comments/CommentView';
import { Content } from 'app/components/Content';
import { Image } from 'app/components/Image';
import InfoBubble from 'app/components/InfoBubble';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import {
  type SemesterStatusEntity,
  selectCompanyById,
  selectCommentsForCompany,
  selectEventsForCompany,
} from 'app/reducers/companies';
import { selectCompanySemesters } from 'app/reducers/companySemesters';
import { selectPagination } from 'app/reducers/selectors';
import { displayNameForEventType } from 'app/routes/events/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import createQueryString from 'app/utils/createQueryString';
import truncateString from 'app/utils/truncateString';
import {
  sortByYearThenSemester,
  getContactStatuses,
  DetailNavigation,
} from '../utils';
import SemesterStatusDetail from './SemesterStatusDetail';
import styles from './bdb.css';
import type { CompanySemesterContactStatus } from 'app/store/models/Company';
import type { PublicUser } from 'app/store/models/User';

const queryString = (companyId) =>
  createQueryString({
    company: companyId,
    ordering: '-start_time',
  });

const BdbDetail = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const company = useAppSelector((state) =>
    selectCompanyById(state, { companyId }),
  );
  const comments = useAppSelector((state) =>
    selectCommentsForCompany(state, { companyId }),
  );
  const companyEvents = useAppSelector((state) =>
    selectEventsForCompany(state, { companyId }),
  );
  const companySemesters = useAppSelector(selectCompanySemesters);
  const fetching = useAppSelector((state) => state.companies.fetching);
  const showFetchMoreEvents = useAppSelector((state) =>
    selectPagination('events', {
      queryString: queryString(companyId),
    })(state),
  );
  const pagination = useAppSelector((state) => state.events.pagination);
  const endpoint = getEndpoint(pagination, queryString(companyId));

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchBdbDetail',
    () =>
      companyId &&
      Promise.allSettled([
        dispatch(fetchSemesters()).then(() => dispatch(fetchAdmin(companyId))),
        dispatch(
          fetchEventsForCompany({
            endpoint: `/events/${queryString(companyId)}`,
            queryString: queryString(companyId),
          }),
        ),
      ]),
    [companyId],
  );

  const navigate = useNavigate();

  const [eventsToDisplay, setEventsToDisplay] = useState(3);

  const fetchMoreEvents = () => {
    dispatch(
      fetchEventsForCompany({
        endpoint,
        queryString: queryString(companyId),
      }),
    );
  };

  const semesterStatusOnChange = (
    semesterStatus: SemesterStatusEntity,
    status: CompanySemesterContactStatus,
  ) => {
    const newStatus = {
      ...semesterStatus,
      contactedStatus: getContactStatuses(
        semesterStatus.contactedStatus,
        status,
      ),
    };
    const companySemester = companySemesters.find(
      (companySemester) =>
        companySemester.year === newStatus.year &&
        companySemester.semester === newStatus.semester,
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
    return dispatch(editSemesterStatus(sendableSemester)).then(() => {
      navigate(`/bdb/${companyId}/`);
    });
  };

  const addFileToSemester = (
    fileName: string,
    fileToken: string,
    type: string,
    semesterStatus: Record<string, any>,
  ) => {
    const sendableSemester = {
      semesterStatusId: semesterStatus.id,
      companyId: company.id,
      contactedStatus: semesterStatus.contactedStatus,
      [type]: fileToken,
    };
    return dispatch(editSemesterStatus(sendableSemester)).then(() => {
      navigate(`/bdb/${companyId}/`);
    });
  };

  const removeFileFromSemester = (
    semesterStatus: SemesterStatusEntity,
    type: string,
  ) => {
    const sendableSemester = {
      semesterStatusId: semesterStatus.id,
      contactedStatus: semesterStatus.contactedStatus,
      companyId: company.id,
      [type]: null,
    };
    return dispatch(editSemesterStatus(sendableSemester)).then(() => {
      navigate(`/bdb/${companyId}/`);
    });
  };

  const studentContactLink = (studentContact?: PublicUser): string => {
    return studentContact
      ? 'abakus.no/users/' + String(studentContact.username)
      : '';
  };

  if ((fetching && !company) || !company.semesterStatuses) {
    return <LoadingIndicator loading={fetching} />;
  }

  const semesters = company.semesterStatuses
    .slice()
    .sort(sortByYearThenSemester)
    .map((semesterStatus) => (
      <SemesterStatusDetail
        semesterStatus={semesterStatus}
        key={semesterStatus.id}
        companyId={company.id}
        editFunction={semesterStatusOnChange}
        addFileToSemester={addFileToSemester}
        removeFileFromSemester={removeFileFromSemester}
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
          <td>{contact.phone || '-'}</td>
          <td>
            <Flex>
              <Icon
                to={`/bdb/${String(company.id)}/company-contacts/${String(
                  contact.id,
                )}`}
                name="pencil"
                edit
                size={20}
              />
              <ConfirmModal
                title="Slett bedriftskontakt"
                message="Er du sikker på at du vil slette denne bedriftskontakten?"
                onConfirm={() =>
                  dispatch(deleteCompanyContact(company.id, contact.id))
                }
                closeOnConfirm
              >
                {({ openConfirmModal }) => (
                  <Icon
                    onClick={openConfirmModal}
                    name="trash"
                    danger
                    size={20}
                  />
                )}
              </ConfirmModal>
            </Flex>
          </td>
        </tr>
      ))
      .reverse();

  const events =
    companyEvents &&
    companyEvents
      .sort((a, b) => Date.parse(b.startTime) - Date.parse(a.startTime))
      .slice(0, eventsToDisplay)
      .map((event) => (
        <tr key={event.id}>
          <td>
            <Link to={`events/${event.id}`}>{event.title}</Link>
          </td>
          <td>{displayNameForEventType(event.eventType)}</td>
          <td>
            <Time time={event.startTime} format="DD.MM.YYYY" />
          </td>
          <td>{truncateString(event.location, 50)}</td>
          <td>{truncateString(event.description, 70)}</td>
          <td>
            {event.survey && (
              <Tooltip
                content="Spørreundersøkelse"
                className={styles.surveyContainer}
              >
                <Icon
                  to={`/surveys/${event.survey}`}
                  name="bar-chart-outline"
                  size={20}
                />
              </Tooltip>
            )}
          </td>
        </tr>
      ));

  const title = (
    <Flex alignItems="center" gap="var(--spacing-xs)">
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
      <Icon to={`/bdb/${company.id}/edit`} name="pencil" edit size={20} />
    </Flex>
  );

  return (
    <Content>
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

      <DetailNavigation title={title} companyId={company.id} />

      <Flex column gap="var(--spacing-md)">
        <p
          className={cx(
            styles.description,
            !company.description && 'secondaryFontColor',
          )}
        >
          {company.description || 'Ingen beskrivelse tilgjengelig'}
        </p>

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
              (company.studentContact && company.studentContact.fullName) || '-'
            }`}
            meta="Studentkontakt"
            link={studentContactLink(company.studentContact)}
            style={{
              order: 5,
            }}
          />
        </div>

        <div>
          <h3>
            Bedriftskontakter{' '}
            <span className={styles.newestFirst}>(Nyest øverst)</span>
          </h3>
          {companyContacts && companyContacts.length > 0 ? (
            <div className={styles.companyList}>
              <table className={styles.contactTable}>
                <thead>
                  <tr>
                    <th>Navn</th>
                    <th>Rolle</th>
                    <th>E-post</th>
                    <th>Telefonnummer</th>
                    <th />
                  </tr>
                </thead>
                <tbody>{companyContacts}</tbody>
              </table>
            </div>
          ) : (
            <span
              className="secondaryFontColor"
              style={{
                display: 'block',
              }}
            >
              Ingen bedriftskontakter registrert
            </span>
          )}
          <Link
            to={`/bdb/${company.id}/company-contacts/add`}
            style={{
              marginTop: '10px',
            }}
          >
            <i className="fa fa-plus-circle" /> Legg til bedriftskontakt
          </Link>
        </div>

        <div>
          <h3>Semesterstatuser</h3>
          {semesters.length > 0 ? (
            <div
              className={styles.companyList}
              style={{
                marginBottom: '10px',
              }}
            >
              <Card severity="info">
                <Card.Header>Tips</Card.Header>
                Du kan endre semestere ved å trykke på dem i listen!
              </Card>
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
            <span
              className="secondaryFontColor"
              style={{
                display: 'block',
              }}
            >
              Ingen sememsterstatuser
            </span>
          )}
          <Link to={`/bdb/${company.id}/semesters/add`}>
            <i className="fa fa-plus-circle" /> Legg til nytt semester
          </Link>
        </div>

        <div>
          <h3>Filer</h3>
          <ul>
            {!company.files || company.files.length === 0 ? (
              <span className="secondaryFontColor">Ingen filer</span>
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
          {company.adminComment || (
            <span className="secondaryFontColor">Ingen notater</span>
          )}
        </div>

        <div>
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
              {eventsToDisplay === 3 ? (
                <Button
                  className={styles.showAllButton}
                  onClick={() => setEventsToDisplay(100)}
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
            <span className="secondaryFontColor">Ingen arrangementer</span>
          )}
        </div>

        {company.contentTarget && (
          <CommentView
            contentTarget={company.contentTarget}
            comments={comments}
            newOnTop
          />
        )}
      </Flex>
    </Content>
  );
};

export default BdbDetail;
