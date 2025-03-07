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
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { navigate } from 'vike/client/router';
import CollapsibleDisplayContent from '~/components/CollapsibleDisplayContent';
import CommentView from '~/components/Comments/CommentView';
import {
  ContentMain,
  ContentSection,
  ContentSidebar,
} from '~/components/Content';
import EmptyState from '~/components/EmptyState';
import JoblistingItem from '~/components/JoblistingItem';
import joblistingStyles from '~/components/JoblistingItem/JoblistingItem.module.css';
import Table from '~/components/Table';
import TextWithIcon from '~/components/TextWithIcon';
import Time from '~/components/Time';
import Tooltip from '~/components/Tooltip';
import FileUpload from '~/components/Upload/FileUpload';
import UserLink from '~/components/UserLink';
import SemesterStatus from '~/pages/bdb/SemesterStatus';
import {
  semesterToHumanReadable,
  groupStudentContactsBySemester,
} from '~/pages/bdb/utils';
import companyStyles from '~/pages/companies/@companyId/Company.module.css';
import { displayNameForEventType } from '~/pages/events/utils';
import {
  deleteCompanyContact,
  deleteSemesterStatus,
  editSemesterStatus,
  fetchAdmin,
  fetchSemesters,
} from '~/redux/actions/CompanyActions';
import { fetchEvents } from '~/redux/actions/EventActions';
import { fetchAll as fetchAllJoblistings } from '~/redux/actions/JoblistingActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectCommentsByIds } from '~/redux/slices/comments';
import {
  selectEventsForCompany,
  selectJoblistingsForCompany,
  selectTransformedAdminCompanyById,
} from '~/redux/slices/companies';
import { selectPaginationNext } from '~/redux/slices/selectors';
import truncateString from '~/utils/truncateString';
import { useParams } from '~/utils/useParams';
import styles from '../bdb.module.css';
import type { ColumnProps } from '~/components/Table';
import type { GroupedStudentContactsBySemester } from '~/pages/bdb/utils';
import type { CompanyContact } from '~/redux/models/Company';
import type { ListEvent } from '~/redux/models/Event';
import type { TransformedSemesterStatus } from '~/redux/slices/companies';

type RenderFileProps = {
  semesterStatus: TransformedSemesterStatus;
  type: string;
  removeFile: (
    type: string,
    semesterStatus: TransformedSemesterStatus,
  ) => Promise<unknown>;
  addFile: (
    fileToken: string,
    type: string,
    semesterStatus: TransformedSemesterStatus,
  ) => Promise<unknown>;
};

export const RenderFile = ({
  type,
  semesterStatus,
  removeFile,
  addFile,
}: RenderFileProps) => {
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
              onPress={openConfirmModal}
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
      onChange={(fileToken) => addFile(fileToken, type, semesterStatus)}
    />
  );
};

const BdbDetail = () => {
  const { companyId } = useParams<{ companyId: string }>();
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

  const groupedStudentContacts = useMemo(
    () => groupStudentContactsBySemester(company?.studentContacts ?? []),
    [company?.studentContacts],
  );

  if (!company || !('semesterStatuses' in company)) {
    return <LoadingIndicator loading />;
  }

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
  ];

  const studentContactColumns: ColumnProps<GroupedStudentContactsBySemester>[] =
    [
      {
        title: 'Semester',
        dataIndex: 'semester',
        render: (_, studentContacts: GroupedStudentContactsBySemester) =>
          semesterToHumanReadable(
            studentContacts.semester.semester,
            studentContacts.semester.year,
          ),
      },
      {
        title: 'Studentkontakter',
        dataIndex: 'studentContacts',
        render: (_, studentContacts: GroupedStudentContactsBySemester) => (
          <Flex column gap="var(--spacing-sm)">
            {studentContacts.users.map((user) => (
              <UserLink key={user.id} user={user} />
            ))}
          </Flex>
        ),
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
      title: 'Oppdatert',
      dataIndex: 'updatedAt',
      render: (_, contact) => (
        <>{moment(contact.updatedAt).format('YYYY-MM-DD')}</>
      ),
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
                  onPress={openConfirmModal}
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
      render: (title, event) => <a href={`/events/${event.id}`}>{title}</a>,
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
      centered: false,
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
        semesterToHumanReadable(semesterStatus.semester, semesterStatus.year),
    },
    {
      title: 'Status',
      dataIndex: 'contactedStatus',
      padding: 0,
      render: (_, semesterStatus: TransformedSemesterStatus) => (
        <SemesterStatus
          semesterStatus={semesterStatus}
          company={company}
          semester={{
            semester: semesterStatus.semester,
            year: semesterStatus.year,
          }}
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
            semesterStatus.semester,
            semesterStatus.year,
          )}? Alle filer for dette semesteret vil bli slettet.`}
          onConfirm={() =>
            dispatch(deleteSemesterStatus(company.id, semesterStatus.id))
          }
          closeOnConfirm
        >
          {({ openConfirmModal }) => (
            <Icon
              onPress={openConfirmModal}
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
        <ContentMain>
          {company.description && (
            <CollapsibleDisplayContent
              content={company.description}
              skeleton={showSkeleton}
            />
          )}
        </ContentMain>

        <ContentSidebar>
          {showSkeleton
            ? companyInfo.map((info, index) => (
                <TextWithIcon
                  key={index}
                  iconName={info.icon}
                  content={<Skeleton className={companyStyles.companyInfo} />}
                />
              ))
            : companyInfo.some((info) => info.text) &&
              companyInfo.map(
                (info) =>
                  info.text && (
                    <TextWithIcon
                      key={info.text}
                      iconName={info.icon}
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

      <Flex column gap="var(--spacing-md)" margin="var(--spacing-md) 0 0 0">
        <Flex column gap="var(--spacing-sm)">
          <Flex wrap justifyContent="space-between" alignItems="center">
            <h3>Studentkontakter</h3>
            <LinkButton href={`/bdb/${company.id}/student-contacts/edit`}>
              Rediger studentkontakter
            </LinkButton>
          </Flex>
          {company.studentContacts && company.studentContacts.length > 0 ? (
            <Table
              columns={studentContactColumns}
              data={groupedStudentContacts}
              hasMore={false}
              loading={showSkeleton}
            />
          ) : (
            <EmptyState body="Ingen studentkontakter registrert" />
          )}
        </Flex>

        <Flex column gap="var(--spacing-sm)">
          <Flex wrap justifyContent="space-between" alignItems="center">
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
        </Flex>

        <Flex column gap="var(--spacing-sm)">
          <Flex wrap justifyContent="space-between" alignItems="center">
            <h3>Semesterstatuser</h3>
            <LinkButton href={`/bdb/${company.id}/semesters/add`}>
              Legg til nytt semester
            </LinkButton>
          </Flex>
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
        </Flex>

        <div>
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
        </div>

        <div>
          <h3>Bedriftens jobbannonser</h3>
          {fetchingJoblistings && !joblistings.length ? (
            <Skeleton className={joblistingStyles.joblistingItem} />
          ) : joblistings.length > 0 ? (
            <Flex column gap="var(--spacing-sm)">
              {joblistings.map((joblisting) => (
                <JoblistingItem key={joblisting.id} joblisting={joblisting} />
              ))}
            </Flex>
          ) : (
            <EmptyState body="Ingen tidligere jobbannonser" />
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
    </Page>
  );
};

export default BdbDetail;
