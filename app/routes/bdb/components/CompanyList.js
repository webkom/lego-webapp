import React, { Component } from 'react';
import styles from './bdb.css';
import { Link } from 'react-router';
import CompanySingleRow from './CompanySingleRow';
import { indexToSemester } from '../utils.js';
import Icon from 'app/components/Icon';
import cx from 'classnames';

type Props = {
  companies: Array<Object>,
  query: Object,
  startYear: number,
  startSem: number,
  navigateThroughTime: () => void,
  changedStatuses: Array<any>,
  companySemesters: Array<Object>,
  editSemester: () => void
};

export default class CompanyList extends Component {
  props: Props;

  findTitle = index => {
    const { startYear, startSem } = this.props;
    const result = indexToSemester(index, startYear, startSem);
    const sem = result.semester === 'spring' ? 'Vår' : 'Høst';
    return `${sem} ${result.year}`;
  };

  findSortLink = sortType => {
    const { query } = this.props;
    const ascending = query.ascending === 'true';
    // Seperate sorting for name because the url for default sorting is just /bdb/
    if (sortType === 'name' && Object.keys(query).length !== 0) {
      return '/bdb/';
    }
    if (sortType === 'name') {
      return '/bdb?sortBy=name&ascending=false';
    } // The rest
    if (query.sortBy === sortType) {
      return `/bdb?sortBy=${sortType}&ascending=${!ascending}`;
    }
    return `/bdb?sortBy=${sortType}&ascending=true`;
  };

  showOrHideSortIcon = sortType => {
    const { query } = this.props;
    const ascending = query.ascending === 'true';
    // Special treatment for name sorting
    if (sortType === 'name' && Object.keys(query).length === 0) {
      return 'showAscending';
    } // The rest
    if (sortType === query.sortBy) {
      return ascending ? 'showAscending' : 'showDescending';
    }
    return 'hidden';
  };

  render() {
    const {
      companies,
      navigateThroughTime,
      startYear,
      startSem,
      editSemester,
      changedStatuses
    } = this.props;

    /*
    **
    Could possibly move this constant to utils.js, but I didn't because it's dependent
    on the findTitle() function, which in turns needs the props in this file. Would have
    to send a lot of props to the utils file.
    **
    */
    const HEADER_ITEMS = [
      {
        title: 'Bedrifter',
        sortLink: 'name'
      },
      {
        title: this.findTitle(0),
        sortLink: 'sem0'
      },
      {
        title: this.findTitle(1),
        sortLink: 'sem1'
      },
      {
        title: this.findTitle(2),
        sortLink: 'sem2'
      },
      {
        title: 'Studentkontakt',
        sortLink: 'studentContact'
      },
      {
        title: 'Kommentar',
        sortLink: 'comment'
      }
    ];

    const headers = HEADER_ITEMS.map((item, i) => (
      <th key={i}>
        <Link to={this.findSortLink(item.sortLink)}>
          <div className={styles.title}>{item.title}</div>

          <div className={styles[this.showOrHideSortIcon(item.sortLink)]}>
            <div className={styles.upArrow}>
              <Icon name="arrow-up" size={16} />
            </div>
            <div className={styles.downArrow}>
              <Icon name="arrow-down" size={16} />
            </div>
          </div>
        </Link>
      </th>
    ));

    return (
      <div className={styles.companyList}>
        <table>
          <thead>
            <tr className={styles.invisRow}>
              <td />
              <td
                className={styles.yearNavigator}
                onClick={() => navigateThroughTime(false)}
              >
                <Icon
                  name="arrow-back"
                  style={{ marginRight: '5px' }}
                  size={16}
                />
                Forrige år
              </td>
              <td />
              <td
                className={cx(styles.rightArrow, styles.yearNavigator)}
                onClick={() => navigateThroughTime(true)}
              >
                Neste år
                <Icon
                  name="arrow-forward"
                  style={{ marginLeft: '5px' }}
                  size={16}
                />
              </td>
            </tr>

            <tr className={styles.categoryHeader}>{headers}</tr>
          </thead>

          <tbody>
            {companies.map((company, i) => (
              <CompanySingleRow
                company={company}
                startYear={startYear}
                startSem={startSem}
                navigateThroughTime={this.navigateThroughTime}
                key={i}
                editSemester={editSemester}
                changedStatuses={changedStatuses}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
