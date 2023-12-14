import {
  ConfirmModal,
  Icon,
  Flex,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import { useState } from 'react';
import { deleteSemesterStatus } from 'app/actions/CompanyActions';
import FileUpload from 'app/components/Upload/FileUpload';
import { useAppDispatch } from 'app/store/hooks';
import truncateString from 'app/utils/truncateString';
import {
  selectColorCode,
  semesterCodeToName,
  selectMostProminentStatus,
} from '../utils';
import SemesterStatusContent from './SemesterStatusContent';
import styles from './bdb.css';
import type { CompanySemesterContactedStatus } from 'app/models';
import type { SemesterStatusEntity } from 'app/reducers/companies';

const FILE_NAME_LENGTH = 30;
type Props = {
  semesterStatus: SemesterStatusEntity;
  companyId: number;
  editFunction: (
    semesterStatus: SemesterStatusEntity,
    statusString: CompanySemesterContactedStatus
  ) => Promise<any>;
  addFileToSemester: (
    arg0: string,
    arg1: string,
    arg2: string,
    arg3: Record<string, any>
  ) => Promise<any>;
  removeFileFromSemester: (
    arg0: SemesterStatusEntity,
    arg1: string
  ) => Promise<any>;
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
    j;
    return props.addFileToSemester(
      fileName,
      fileToken,
      type,
      props.semesterStatus
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
        className={
          styles[
            selectColorCode(
              selectMostProminentStatus(semesterStatus.contactedStatus)
            )
          ]
        }
        style={{
          padding: '5px',
          lineHeight: '18px',
        }}
      >
        <SemesterStatusContent
          semesterStatus={semesterStatus}
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
              <Icon onClick={openConfirmModal} name="trash" danger size={20} />
            )}
          </ConfirmModal>
        </Flex>
      </td>
    </tr>
  );
};

export default SemesterStatusDetail;

type RenderFileProps = {
  semesterStatus: SemesterStatusEntity;
  type: string;
  removeFile: (arg0: string) => Promise<any>;
  addFile: (arg0: string, arg1: string, arg2: string) => Promise<any>;
  editing: boolean;
};

const RenderFile = (props: RenderFileProps) => {
  const { semesterStatus, type, removeFile, addFile, editing } = props;

  const uploadButton = (type: string) => (
    <FileUpload
      onChange={(fileName, fileToken) => addFile(fileName, fileToken, type)}
      className={styles.uploadButton}
    />
  );

  const fileNameToShow = (name: string, url?: string) =>
    name ? <a href={url}>{truncateString(name, FILE_NAME_LENGTH)}</a> : '-';

  const fileName = fileNameToShow(
    semesterStatus[type + 'Name'],
    semesterStatus[type]
  );
  const displayDeleteButton = editing && semesterStatus[type];
  const displayUploadButton = editing && !semesterStatus[type];

  if (displayDeleteButton) {
    return (
      <span className={styles.deleteFile}>
        <span>{fileName}</span>
        <ConfirmModal
          title="Slett fil"
          message="Er du sikker på at du vil slette denne filen?"
          onConfirm={() => removeFile(type)}
          closeOnConfirm
        >
          {({ openConfirmModal }) => (
            <Icon onClick={openConfirmModal} name="trash" danger />
          )}
        </ConfirmModal>
      </span>
    );
  } else if (displayUploadButton) {
    return uploadButton(type);
  }

  return fileName;
};
