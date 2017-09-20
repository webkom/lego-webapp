import React, { Component } from 'react';
import styles from './bdb.css';
import {
  selectColorCode,
  semesterCodeToName,
  selectMostProminentStatus
} from '../utils.js';
import SemesterStatusContent from './SemesterStatusContent';

type Props = {
  status: Object,
  index: number,
  deleteSemesterStatus: number => void,
  editFunction: () => void
};

export default class SemesterStatusDetail extends Component {
  props: Props;

  state = {
    editing: false
  };

  render() {
    const { status, index, deleteSemesterStatus, editFunction } = this.props;

    return (
      <tr key={index}>
        <td>
          {status.year} {semesterCodeToName(status.semester)}
        </td>

        <td
          className={
            styles[
              selectColorCode(selectMostProminentStatus(status.contactedStatus))
            ]
          }
          style={{ padding: '5px', lineHeight: '18px' }}
        >
          <SemesterStatusContent
            semesterStatus={status}
            editFunction={statusCode => editFunction(status, statusCode)}
          />
        </td>

        <td>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              {this.state.editing ? 'Last opp' : status.contract || '-'}
            </span>
            <span style={{ display: 'flex', flexDirection: 'row' }}>
              <a
                onClick={() =>
                  this.setState(state => ({ editing: !state.editing }))}
              >
                <i
                  className="fa fa-pencil"
                  style={{ marginRight: '5px', color: 'orange' }}
                />{' '}
                e
              </a>
              <a onClick={() => deleteSemesterStatus(status.id)}>
                <i className="fa fa-times" style={{ color: '#d13c32' }} /> d
              </a>
            </span>
          </div>
        </td>
      </tr>
    );
  }
}
