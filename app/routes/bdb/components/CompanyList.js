import React, { Component } from 'react';
import styles from './bdb.css';
import { Link } from 'react-router';
import CompanySingleRow from './CompanySingleRow';
import { indexToSemester } from '../utils.js';

type Props = {
  companies: Array<Object>,
  query: Object,
  startYear: number,
  startSem: number,
  changeSemesters: () => void,
  changedStatuses: Array<any>,
  companySemesters: Array<Object>
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
      changeSemesters,
      startYear,
      startSem,
      editSemester,
      changedStatuses,
      companySemesters
    } = this.props;
    console.log('i list');
    console.log(companies);
    console.log(companySemesters);

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
              <i className="fa fa-caret-up" aria-hidden="true" />
            </div>
            <div className={styles.downArrow}>
              <i className="fa fa-caret-down" aria-hidden="true" />
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
              <td>
                <i
                  onClick={() => changeSemesters(false)}
                  className="fa fa-arrow-left"
                />
              </td>
              <td />
              <td className={styles.rightArrow}>
                <i
                  onClick={() => changeSemesters(true)}
                  className="fa fa-arrow-right"
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
                changeSemesters={this.changeSemesters}
                key={i}
                editSemester={editSemester}
                changedStatuses={changedStatuses}
                companySemesters={companySemesters}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
