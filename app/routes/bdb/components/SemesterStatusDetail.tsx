import {
  ConfirmModal,
  Icon,
  Flex,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deleteSemesterStatus } from 'app/actions/CompanyActions';
import FileUpload from 'app/components/Upload/FileUpload';
import { useAppDispatch } from 'app/store/hooks';
import truncateString from 'app/utils/truncateString';
import {
  getStatusColor,
  selectMostProminentStatus,
  semesterCodeToName,
} from '../utils';
import SemesterStatusContent from './SemesterStatusContent';
import styles from './bdb.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { TransformedSemesterStatus } from 'app/reducers/companies';
import type { CompanySemesterContactStatus } from 'app/store/models/Company';

const FILE_NAME_LENGTH = 30;
type Props = {
  semesterStatus: TransformedSemesterStatus;
  companyId: EntityId;
  editFunction: (
    semesterStatus: TransformedSemesterStatus,
    statusString: CompanySemesterContactStatus,
  ) => Promise<unknown>;
  addFileToSemester: (
    fileName: string,
    fileToken: string,
    type: string,
    semesterStatus: TransformedSemesterStatus,
  ) => Promise<unknown>;
  removeFileFromSemester: (
    semesterStatus: TransformedSemesterStatus,
    type: string,
  ) => Promise<unknown>;
};

const SemesterStatusDetail = (props: Props) => {
  const [editing, setEditing] = useState(false);

  const dispatch = useAppDispatch();

  const semesterToHumanReadable = () => {
    const { year, semester } = props.semesterStatus;
    const semesterName = semesterCodeToName(semester);
    return `${year} ${semesterName}`;
  };

  const addFile = (fileName: string, fileToken: string, type: string) => {
    setEditing(false);
    return props.addFileToSemester(
      fileName,
      fileToken,
      type,
      props.semesterStatus,
    );
  };

  const removeFile = (type: string) =>
    props.removeFileFromSemester(props.semesterStatus, type);

  const { semesterStatus, editFunction } = props;

  if (!semesterStatus) return <LoadingIndicator loading />;

  const humanReadableSemester = semesterToHumanReadable();
  return (
    <tr key={semesterStatus.id}>
      <td>{humanReadableSemester}</td>
      <td
        style={{
          padding: '5px',
          lineHeight: '18px',
          backgroundColor: getStatusColor(
            selectMostProminentStatus(semesterStatus.contactedStatus),
          ),
        }}
      >
        <SemesterStatusContent
          contactedStatus={semesterStatus.contactedStatus}
          editFunction={(statusCode) =>
            editFunction(semesterStatus, statusCode)
          }
        />
      </td>

      {['contract', 'statistics', 'evaluation'].map((type) => (
        <td key={type}>
          <RenderFile
            semesterStatus={semesterStatus}
            type={type}
            addFile={addFile}
            removeFile={removeFile}
            editing={editing}
          />
        </td>
      ))}
      <td>
        <Flex>
          <Icon
            onClick={() => setEditing(!editing)}
            name="pencil"
            edit
            size={20}
          />
          <ConfirmModal
            title="Slett semesterstatus"
            message={`Er du sikker på at du vil slette semesterstatusen for ${humanReadableSemester}? Alle filer for dette semesteret vil bli slettet.`}
            onConfirm={() =>
              dispatch(deleteSemesterStatus(props.companyId, semesterStatus.id))
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
      </td>
    </tr>
  );
};

export default SemesterStatusDetail;

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

  const fileNameToShow = (name: string, url?: string) =>
    name ? <a href={url}>{truncateString(name, FILE_NAME_LENGTH)}</a> : '-';

  const fileName = fileNameToShow(
    semesterStatus[type + 'Name'],
    semesterStatus[type],
  );

  if (semesterStatus[type]) {
    return (
      <span className={styles.deleteFile}>
        <span>{fileName}</span>
        <ConfirmModal
          title="Slett fil"
          message="Er du sikker på at du vil slette denne filen?"
          onConfirm={() => removeFile(type, semesterStatus)}
          closeOnConfirm
        >
          {({ openConfirmModal }) => (
            <Icon onClick={openConfirmModal} iconNode={<Trash2 />} danger />
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
