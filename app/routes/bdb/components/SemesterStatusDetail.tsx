import { Component } from 'react';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import FileUpload from 'app/components/Upload/FileUpload';
import type { CompanySemesterContactedStatus } from 'app/models';
import type { SemesterStatusEntity } from 'app/reducers/companies';
import truncateString from 'app/utils/truncateString';
import {
  selectColorCode,
  semesterCodeToName,
  selectMostProminentStatus,
} from '../utils';
import SemesterStatusContent from './SemesterStatusContent';
import styles from './bdb.css';

const FILE_NAME_LENGTH = 30;
type Props = {
  semesterStatus: SemesterStatusEntity;
  companyId: number;
  deleteSemesterStatus: (arg0: number) => Promise<any>;
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
type State = {
  editing: boolean;
};
export default class SemesterStatusDetail extends Component<Props, State> {
  state = {
    editing: false,
  };
  deleteSemesterStatus = () =>
    // $FlowFixMe
    this.props.deleteSemesterStatus(this.props.semesterStatus.id);
  semesterToHumanReadable = () => {
    const { year, semester } = this.props.semesterStatus;
    // $FlowFixMe
    const semesterName = semesterCodeToName(semester);
    return `${year} ${semesterName}`;
  };
  addFile = (fileName: string, fileToken: string, type: string) => {
    this.setState({
      editing: false,
    });
    return this.props.addFileToSemester(
      fileName,
      fileToken,
      type,
      this.props.semesterStatus
    );
  };
  removeFile = (type: string) =>
    this.props.removeFileFromSemester(this.props.semesterStatus, type);

  render() {
    const { semesterStatus, editFunction } = this.props;
    if (!semesterStatus) return <LoadingIndicator />;
    const humanReadableSemester = this.semesterToHumanReadable();
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
              addFile={this.addFile}
              removeFile={this.removeFile}
              editing={this.state.editing}
            />
          </td>
        ))}
        <td>
          <span
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <Button
              flat
              onClick={() =>
                this.setState((state) => ({
                  editing: !state.editing,
                }))
              }
            >
              <Icon name="pencil" edit size={20} />
            </Button>
            <ConfirmModalWithParent
              title="Slett semesterstatus"
              message={`Er du sikker på at du vil slette semesterstatusen for ${humanReadableSemester}? Alle filer for dette semesteret vil bli slettet.`}
              onConfirm={this.deleteSemesterStatus}
              closeOnConfirm
            >
              <Icon name="trash" danger size={20} />
            </ConfirmModalWithParent>
          </span>
        </td>
      </tr>
    );
  }
}
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
        <ConfirmModalWithParent
          title="Slett fil"
          message="Er du sikker på at du vil slette denne filen?"
          onConfirm={() => removeFile(type)}
          closeOnConfirm
        >
          <Icon name="trash" danger />
        </ConfirmModalWithParent>
      </span>
    );
  } else if (displayUploadButton) {
    return uploadButton(type);
  }

  return fileName;
};
