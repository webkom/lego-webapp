import {
  ConfirmModal,
  Flex,
  Icon,
  LoadingIndicator,
  Skeleton,
  Page,
  LinkButton,
  PageCover,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash';
import { Trash2 } from 'lucide-react';
import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  deleteCompanyContact,
  deleteSemesterStatus,
  editSemesterStatus,
  fetchAdmin,
  fetchSemesters,
} from 'app/actions/CompanyActions';
import { fetchEvents } from 'app/actions/EventActions';
import { fetchAll as fetchAllJoblistings } from 'app/actions/JoblistingActions';
import CollapsibleDisplayContent from 'app/components/CollapsibleDisplayContent';
import CommentView from 'app/components/Comments/CommentView';
import {
  ContentMain,
  ContentSection,
  ContentSidebar,
} from 'app/components/Content';
import EmptyState from 'app/components/EmptyState';
import JoblistingItem from 'app/components/JoblistingItem';
import sharedStyles from 'app/components/JoblistingItem/JoblistingItem.css';
import Table from 'app/components/Table';
import TextWithIcon from 'app/components/TextWithIcon';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import FileUpload from 'app/components/Upload/FileUpload';
import { selectCommentsByIds } from 'app/reducers/comments';
import {
  selectEventsForCompany,
  selectJoblistingsForCompany,
  selectTransformedAdminCompanyById,
} from 'app/reducers/companies';
import { selectAllCompanySemesters } from 'app/reducers/companySemesters';
import { selectPaginationNext } from 'app/reducers/selectors';
import { selectUserById } from 'app/reducers/users';
import SemesterStatus from 'app/routes/bdb/components/SemesterStatus';
import {
  indexToCompanySemester,
  semesterToHumanReadable,
} from 'app/routes/bdb/utils';
import { displayNameForEventType } from 'app/routes/events/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import truncateString from 'app/utils/truncateString';
import styles from './bdb.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { ColumnProps } from 'app/components/Table';
import type { TransformedSemesterStatus } from 'app/reducers/companies';
import type {
  CompanyContact,
  CompanySemesterContactStatus,
} from 'app/store/models/Company';
import type { ListEvent } from 'app/store/models/Event';

type RenderFileProps = {
  semesterStatus: TransformedSemesterStatus;
  type: string;
  removeFile: (
    type: string,
    semesterStatus: TransformedSemesterStatus,
  ) => Promise<unknown>;
  addFile: (
    name: string,
    token: string,
    type: string,
    semesterStatus: TransformedSemesterStatus,
  ) => Promise<unknown>;
};

export const RenderFile = (props: RenderFileProps) => {
  const { semesterStatus, type, removeFile, addFile } = props;

  const name = semesterStatus[type + 'Name'];

  if (semesterStatus[type]) {
    return (
      <span className={styles.deleteFile}>
        <span>
          {name ? (
            <a href={semesterStatus[type]}>{truncateString(name, 30)}</a>
          ) : (
            <span className="secondaryFontColor">-</span>
          )}
        </span>
        <ConfirmModal
          title="Slett fil"
          message="Er du sikker på at du vil slette denne filen?"
          onConfirm={() => removeFile(type, semesterStatus)}
          closeOnConfirm
        >
          {({ openConfirmModal }) => (
            <Icon
              onClick={openConfirmModal}
              iconNode={<Trash2 />}
              size={20}
              danger
            />
          )}
        </ConfirmModal>
      </span>
    );
  }
  return (
    <FileUpload
      onChange={(fileName, fileToken) =>
        addFile(fileName, fileToken, type, semesterStatus)
      }
    />
  );
};

const BdbDetail = () => {
  const { companyId } = useParams<{ companyId: string }>() as {
    companyId: string;
  };
  const company = useAppSelector((state) =>
    selectTransformedAdminCompanyById(state, companyId),
  );
  const fetchingCompany = useAppSelector((state) => state.companies.fetching);
  const showSkeleton = fetchingCompany && isEmpty(company);

  const eventsQuery = {
    company: companyId,
    ordering: '-start_time',
  };

  const comments = useAppSelector((state) =>
    selectCommentsByIds(state, company?.comments),
  );

  const companyEvents = useAppSelector((state) =>
    selectEventsForCompany(state, companyId),
  );
  const companySemesters = useAppSelector(selectAllCompanySemesters);
  const studentContact = useAppSelector((state) =>
    company?.studentContact !== null
      ? selectUserById(state, company?.studentContact as EntityId | undefined)
      : undefined,
  );
  const { pagination: eventsPagination } = useAppSelector(
    selectPaginationNext({
      endpoint: '/events/',
      entity: EntityType.Events,
      query: eventsQuery,
    }),
  );
  const showFetchMoreEvents = eventsPagination.hasMore;

  const joblistings = useAppSelector((state) =>
    selectJoblistingsForCompany(state, companyId),
  );
  const fetchingJoblistings = useAppSelector(
    (state) => state.joblistings.fetching,
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchBdbDetail',
    () =>
      companyId &&
      Promise.allSettled([
        dispatch(fetchSemesters()).then(() => dispatch(fetchAdmin(companyId))),
        dispatch(
          fetchEvents({
            query: eventsQuery,
          }),
        ),
        dispatch(fetchAllJoblistings({ company: companyId })),
      ]),
    [companyId],
  );

  const navigate = useNavigate();
  if (!company || !('semesterStatuses' in company)) {
    return <LoadingIndicator loading />;
  }

  const editChangedStatuses = async (
    companyId: EntityId,
    tableIndex: number,
    semesterStatusId: EntityId | undefined,
    contactedStatus: CompanySemesterContactStatus[],
  ) => {
    if (!semesterStatusId) {
      throw new Error('SemesterStatusId is undefined');
    }
    const startYear = moment().year();
    const startSemester = moment().month() > 6 ? 1 : 0;

    const companySemester = indexToCompanySemester(
      tableIndex,
      startYear,
      startSemester,
      companySemesters,
    );

    const id = companySemester?.id;
    const semesterStatus = {
      companyId,
      contactedStatus,
      semester: id,
    };
    return dispatch(
      editSemesterStatus({ ...semesterStatus, semesterStatusId }),
    );
  };

  const addFileToSemester = async (
    fileToken: string,
    type: string,
    semesterStatus,
  ) => {
    const sendableSemester = {
      semesterStatusId: semesterStatus.id,
      companyId: company.id,
      contactedStatus: semesterStatus.contactedStatus,
      [type]: fileToken,
    };
    await dispatch(editSemesterStatus(sendableSemester));
    navigate(`/bdb/${companyId}/`);
  };

  const removeFileFromSemester = async (type: string, semesterStatus) => {
    const sendableSemester = {
      semesterStatusId: semesterStatus.id,
      contactedStatus: semesterStatus.contactedStatus,
      companyId: company.id,
      [type]: null,
    };
    await dispatch(editSemesterStatus(sendableSemester));
    navigate(`/bdb/${companyId}/`);
  };

  const title = `BDB: ${company.name}`;

  const companyInfo = [
    {
      text: company.website,
      icon: 'globe-outline',
      link: true,
    },
    {
      text: company.address,
      icon: 'location-outline',
      link: false,
    },
    {
      text: company.phone,
      icon: 'call-outline',
      link: false,
    },
    {
      text: company.companyType,
      icon: 'briefcase-outline',
      link: false,
    },
    {
      text: company.paymentMail,
      icon: 'mail-outline',
      link: false,
    },
    {
      text: studentContact?.fullName || '-',
      icon: 'person-outline',
      link: studentContact
        ? `abakus.no/users/${studentContact.username}`
        : false,
    },
  ];

  const contactsColumns: ColumnProps<CompanyContact>[] = [
    {
      title: 'Navn',
      dataIndex: 'name',
    },
    {
      title: 'Rolle',
      dataIndex: 'role',
    },
    {
      title: 'E-post',
      dataIndex: 'mail',
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
    },
    {
      title: '',
      dataIndex: '',
      render: (_, contact) =>
        contact && (
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
                  iconNode={<Trash2 />}
                  danger
                  size={20}
                />
              )}
            </ConfirmModal>
          </Flex>
        ),
    },
  ];

  const eventColumns: ColumnProps<ListEvent>[] = [
    {
      title: 'Tittel',
      dataIndex: 'title',
      render: (title) => <Link to={`/events/${title.id}`}>{title}</Link>,
    },
    {
      title: 'Type',
      dataIndex: 'eventType',
      render: (eventType) => displayNameForEventType(eventType),
    },
    {
      title: 'Når',
      dataIndex: 'startTime',
      render: (startTime) => <Time time={startTime} format="DD.MM.YYYY" />,
    },
    {
      title: 'Sted',
      dataIndex: 'location',
    },
    {
      title: 'Beskrivelse',
      dataIndex: 'description',
    },
    {
      title: '',
      dataIndex: '',
      render: (_, event) =>
        event.survey && (
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
        ),
    },
  ];

  const semesterColumns: ColumnProps<TransformedSemesterStatus>[] = [
    {
      title: 'Semester',
      dataIndex: 'semester',
      render: (_, semesterStatus: TransformedSemesterStatus) =>
        semesterToHumanReadable(semesterStatus),
    },
    {
      title: 'Status',
      dataIndex: 'contactedStatus',
      render: (_, semesterStatus: TransformedSemesterStatus) => (
        <SemesterStatus
          semesterStatus={semesterStatus}
          companyId={company.id}
          editChangedStatuses={editChangedStatuses}
          semIndex={0}
        />
      ),
    },
    ...[
      ['Kontrakt', 'contract'],
      ['Statistikk', 'statistics'],
      ['Evaluering', 'evaluation'],
    ].map(([title, type]) => {
      return {
        title: title,
        dataIndex: type,
        render: (_, semesterStatus: TransformedSemesterStatus) => (
          <RenderFile
            semesterStatus={semesterStatus}
            type={type}
            addFile={addFileToSemester}
            removeFile={removeFileFromSemester}
          />
        ),
      };
    }),
    {
      title: '',
      dataIndex: '',
      render: (_, semesterStatus: TransformedSemesterStatus) => (
        <ConfirmModal
          title="Slett semesterstatus"
          message={`Er du sikker på at du vil slette semesterstatusen for ${semesterToHumanReadable(
            semesterStatus,
          )}? Alle filer for dette semesteret vil bli slettet.`}
          onConfirm={() =>
            dispatch(deleteSemesterStatus(company.id, semesterStatus.id))
          }
          closeOnConfirm
        >
          {({ openConfirmModal }) => (
            <Icon
              onClick={openConfirmModal}
              iconNode={<Trash2 />}
              danger
              size={20}
            />
          )}
        </ConfirmModal>
      ),
    },
  ];

  return (
    <Page
      cover={
        <PageCover
          image={company?.logo}
          imagePlaceholder={company?.logoPlaceholder}
          skeleton={showSkeleton}
        />
      }
      title={title}
      back={{
        href: '/bdb',
      }}
      actionButtons={
        <LinkButton key="edit" href={`/bdb/${companyId}/edit`}>
          Rediger
        </LinkButton>
      }
    >
      <Helmet title={title} />

      <ContentSection>
        <ContentMain className={styles.mainContent}>
          <CollapsibleDisplayContent
            content={company.description}
            skeleton={showSkeleton}
          />

          <Flex justifyContent="space-between" alignItems="center">
            <h3>Bedriftskontakter</h3>
            <LinkButton href={`/bdb/${company.id}/company-contacts/add`}>
              Legg til bedriftskontakt
            </LinkButton>
          </Flex>
          {company.companyContacts?.length > 0 ? (
            <Table
              columns={contactsColumns}
              data={company.companyContacts}
              hasMore={false}
              loading={showSkeleton}
            />
          ) : (
            <EmptyState body="Ingen bedriftskontakter registrert" />
          )}

          <h3>Semesterstatuser</h3>
          {company.semesterStatuses?.length > 0 ? (
            <Table
              columns={semesterColumns}
              data={company.semesterStatuses}
              hasMore={false}
              loading={showSkeleton}
            />
          ) : (
            <EmptyState body="Ingen semesterstatuser registrert" />
          )}

          <h3>Bedriftens arrangementer</h3>
          {companyEvents.length > 0 ? (
            <Table
              columns={eventColumns}
              data={companyEvents}
              hasMore={showFetchMoreEvents}
              loading={fetchingCompany}
            />
          ) : (
            <EmptyState body="Ingen arrangementer registrert" />
          )}

          <h3>Bedriftens jobbannonser</h3>
          {fetchingJoblistings && !joblistings.length ? (
            <Skeleton className={sharedStyles.joblistingItem} />
          ) : joblistings.length > 0 ? (
            <Flex column gap="var(--spacing-sm)">
              {joblistings.map((joblisting) => (
                <JoblistingItem key={joblisting.id} joblisting={joblisting} />
              ))}
            </Flex>
          ) : (
            <EmptyState body="Ingen tidligere jobbannonser" />
          )}

          {company.contentTarget && (
            <CommentView
              contentTarget={company.contentTarget}
              comments={comments}
              newOnTop
            />
          )}
        </ContentMain>
        <ContentSidebar>
          {showSkeleton
            ? companyInfo.map((info, index) => (
                <TextWithIcon
                  key={index}
                  iconName={info.icon}
                  content={<Skeleton className={styles.companyInfo} />}
                />
              ))
            : companyInfo.some((info) => info.text) &&
              companyInfo.map(
                (info) =>
                  info.text && (
                    <TextWithIcon
                      key={info.text}
                      iconName={info.icon}
                      className={styles.companyInfo}
                      content={
                        info.link ? (
                          <a href={info.text}>{company.name}</a>
                        ) : (
                          info.text
                        )
                      }
                    />
                  ),
              )}
        </ContentSidebar>
      </ContentSection>
    </Page>
  );
};

export default BdbDetail;
