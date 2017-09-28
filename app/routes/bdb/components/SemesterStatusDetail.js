import React, { Component } from 'react';
import styles from './bdb.css';
import {
  selectColorCode,
  semesterCodeToName,
  selectMostProminentStatus
} from '../utils.js';
import SemesterStatusContent from './SemesterStatusContent';
import LoadingIndicator from 'app/components/LoadingIndicator';
import FileUpload from 'app/components/Upload/FileUpload';

type Props = {
  semesterStatus: Object,
  index: number,
  deleteSemesterStatus: number => void,
  editFunction: () => void,
  addFileToSemester: (fileName, type) => void
};

export default class SemesterStatusDetail extends Component {
  props: Props;

  state = {
    editing: false
  };

  deleteSemesterStatus = id => {
    if (confirm('Er du sikker?')) {
      this.props.deleteSemesterStatus(id);
    }
  };

  addFile = (fileName, fileToken, type) => {
    this.props.addFileToSemester(
      fileName,
      fileToken,
      type,
      this.props.semesterStatus
    );
    this.setState(state => ({ editing: false }));
  };

  uploadButton = type => (
    <FileUpload
      onChange={(fileName, fileToken) =>
        this.addFile(fileName, fileToken, type)}
      className={styles.uploadButton}
    />
  );

  FILE_NAME_LENGTH = 15;

  fileNameToShow = (name, url) => {
    if (!name) return '-';
    const shortened =
      name.length > this.FILE_NAME_LENGTH
        ? name.substring(0, this.FILE_NAME_LENGTH) + '...'
        : name;

    return <a href={url}>{shortened}</a>;
  };

  render() {
    const { semesterStatus, index, editFunction } = this.props;

    if (!status) return <LoadingIndicator />;

    return (
      <tr key={index}>
        <td>
          {semesterStatus.year} {semesterCodeToName(semesterStatus.semester)}
        </td>

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
            <a onClick={() => this.deleteSemesterStatus(semesterStatus.id)}>
              <i className="fa fa-times" style={{ color: '#d13c32' }} />
            </a>
          </span>
        </td>
      </tr>
    );
  }
}
