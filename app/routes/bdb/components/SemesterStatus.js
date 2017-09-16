import React, { Component } from 'react';
import styles from './bdb.css';
import {
  selectColorCode,
  statusStrings,
  getStatusString,
  selectMostProminentStatus,
  sortStatusesByProminence
} from '../utils.js';
import Dropdown from 'app/components/Dropdown';
import Icon from 'app/components/Icon';
import cx from 'classnames';

type Props = {
  semesterStatus: Object,
  editSemester: () => void,
  companyId: number,
  semIndex: number,
  changedStatuses: Array<any>,
  startYear: number,
  startSem: number,
  companySemesters: Array<Object>
};

export default class SemesterStatus extends Component {
  props: Props;

  state = {
    displayDropdown: false
  };

  render() {
    const { semesterStatus, companyId, semIndex } = this.props;

    const getContactedStatuses = statusString => {
      const contactedStatuses = semesterStatus.contactedStatus;

      const statusIsAlreadySelected =
        contactedStatuses.indexOf(statusString) !== -1;

      if (statusIsAlreadySelected) {
        contactedStatuses.splice(contactedStatuses.indexOf(statusString), 1);
      } else {
        contactedStatuses.push(statusString);
      }

      // Remove 'not contacted' if anything else is selected
      if (
        contactedStatuses.length > 1 &&
        contactedStatuses.indexOf('not_contacted') !== -1
      ) {
        contactedStatuses.splice(contactedStatuses.indexOf('not_contacted'), 1);
      }

      // Remove 'contacted', 'not_interested and 'interested'
      // as a statuses if any the others in that list are selected
      ['contacted', 'not_interested', 'interested'].map(status => {
        if (
          contactedStatuses.length > 1 &&
          contactedStatuses.indexOf(status) !== -1 &&
          status !== statusString
        ) {
          contactedStatuses.splice(contactedStatuses.indexOf(status), 1);
        }
      });

      return contactedStatuses;
    };

    const statusCodes = Object.keys(statusStrings)
      .sort(sortStatusesByProminence)
      .filter(code => code !== 'not_contacted');

    const dropDownItems = (
      <Dropdown.List style={{ overflow: 'scroll' }}>
        {statusCodes.map((statusString, j) => (
          <a
            key={j}
            onClick={() =>
              this.props.editSemester(
                companyId,
                semIndex,
                semesterStatus.id,
                getContactedStatuses(statusString)
              )}
          >
            <Dropdown.ListItem className={styles.dropDownItem}>
              <div>
                {semesterStatus.contactedStatus.indexOf(statusString) !== -1 ? (
                  <Icon
                    name="checkmark"
                    style={{
                      color: 'green',
                      marginRight: '5px'
                    }}
                    size={300}
                  />
                ) : (
                  <div
                    style={{
                      width: '10px',
                      height: '1px',
                      display: 'inline-block'
                    }}
                  >
                    {' '}
                  </div>
                )}
                {getStatusString(statusString)}
              </div>
              <div
                className={cx(
                  styles[selectColorCode(statusString)],
                  styles.lazyCircle
                )}
              />
            </Dropdown.ListItem>
            {j !== statusCodes.length - 1 && <Dropdown.Divider />}
          </a>
        ))}
      </Dropdown.List>
    );

    const statusesToRender = (
      <div style={{ width: '100%' }}>
        {semesterStatus.contactedStatus.length > 0 ? (
          semesterStatus.contactedStatus
            .sort(sortStatusesByProminence)
            .map(
              (status, i) =>
                getStatusString(status) +
                (i !== semesterStatus.contactedStatus.length - 1 ? ', ' : '')
            )
        ) : (
          getStatusString('not_contacted')
        )}
      </div>
    );

    return (
      <td
        className={
          styles[
            selectColorCode(
              selectMostProminentStatus(semesterStatus.contactedStatus)
            )
          ]
        }
        style={{ padding: 0 }}
      >
        <Dropdown
          show={this.state.displayDropdown}
          toggle={() =>
            this.setState(state => ({
              displayDropdown: !state.displayDropdown
            }))}
          style={{ width: '100%', textAlign: 'left' }}
          triggerComponent={statusesToRender}
        >
          {dropDownItems}
        </Dropdown>
      </td>
    );
  }
}
