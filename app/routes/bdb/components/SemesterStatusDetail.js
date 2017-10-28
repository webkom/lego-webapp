// @flow

import React, { Component } from 'react';
import styles from './bdb.css';
import {
  selectColorCode,
  semesterCodeToName,
  selectMostProminentStatus
} from '../utils.js';
import SemesterStatusContent from './SemesterStatusContent';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type { SemesterStatusEntity } from 'app/reducers/companies';
import FileUpload from 'app/components/Upload/FileUpload';
import truncateString from 'app/utils/truncateString';
import type { CompanySemesterContactedStatus } from 'app/models';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';

const FILE_NAME_LENGTH = 30;

type Props = {
  semesterStatus: SemesterStatusEntity,
  companyId: number,
  deleteSemesterStatus: number => Promise<*>,
  editFunction: (
    semesterStatus: SemesterStatusEntity,
    statusString: CompanySemesterContactedStatus
  ) => Promise<*>,
  addFileToSemester: (string, string, string, Object) => Promise<*>
};

type State = {
  editing: boolean
};

export default class SemesterStatusDetail extends Component<Props, State> {
  state = {
    editing: false
  };

  deleteSemesterStatus = () =>
    this.props.deleteSemesterStatus(this.props.semesterStatus.id);

  addFile = (fileName: string, fileToken: string, type: string) => {
    this.props.addFileToSemester(
      fileName,
      fileToken,
      type,
      this.props.semesterStatus
    );
    this.setState(state => ({ editing: false }));
  };

  uploadButton = (type: string) => (
    <FileUpload
      onChange={(fileName, fileToken) =>
        this.addFile(fileName, fileToken, type)}
      className={styles.uploadButton}
    />
  );

  fileNameToShow = (name: string, url?: string) =>
    name ? <a href={url}>{truncateString(name, FILE_NAME_LENGTH)}</a> : '-';

  semesterToHumanReadable = () => {
    const { year, semester } = this.props.semesterStatus;
    const semesterName = semesterCodeToName(semester);
    return `${year} ${semesterName}`;
  };

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
          style={{ padding: '5px', lineHeight: '18px' }}
        >
          <SemesterStatusContent
            semesterStatus={semesterStatus}
            editFunction={statusCode =>
              editFunction(semesterStatus, statusCode)}
          />
        </td>
        {['contract', 'statistics', 'evaluation'].map(type => (
          <td key={type}>
            <span>
              {this.state.editing
                ? this.uploadButton(type)
                : this.fileNameToShow(
                    semesterStatus[type + 'Name'],
                    semesterStatus[type]
                  )}
            </span>
          </td>
        ))}
        <td>
          <span style={{ display: 'flex', flexDirection: 'row' }}>
            <a
              onClick={() =>
                this.setState(state => ({
                  editing: !state.editing
                }))}
            >
              <i
                className="fa fa-pencil"
                style={{ marginRight: '5px', color: 'orange' }}
              />
            </a>
            <ConfirmModalWithParent
              title="Slett semesterstatus"
              message={`Er du sikker på at du vil slette semesterstatusen for ${humanReadableSemester}? Alle filer for dette semesteret vil bli slettet.`}
              onConfirm={this.deleteSemesterStatus}
              closeOnConfirm
            >
              <i className="fa fa-times" style={{ color: '#d13c32' }} />
            </ConfirmModalWithParent>
          </span>
        </td>
      </tr>
    );
  }
}
