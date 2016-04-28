import React, { Component, PropTypes } from 'react';
import styles from './bdbPage.css';
import { Link } from 'react-router';
import CompanySingleRow from './CompanySingleRow';

export default class CompanyList extends Component {

  headerItems = [
    {
      title: 'Bedrifter',
      sortLink: 'nameSort'
    }, {
      title: 'Høst 2016',
      sortLink: 'sem0Sort'
    }, {
      title: 'Vår 2017',
      sortLink: 'sem1Sort'
    }, {
      title: 'Høst 2017',
      sortLink: 'sem2Sort'
    }, {
      title: 'Vår 2018',
      sortLink: 'sem3Sort'
    }, {
      title: 'Studentkontakt',
      sortLink: 'contactSort'
    }, {
      title: 'Kommentar',
      sortLink: 'commentSort'
    }
  ];

  findSortLink = (sortType) => {
    const { query } = this.props;
    // Seperate sorting for name because the url for default sorting is just /bdb/
    if (sortType === 'nameSort') {
      if (Object.keys(query).length !== 0) {
        return '/bdb/';
      } return `/bdb?${sortType}=ascending`;
    }
    if (query[sortType]) {
      const ascending = query[sortType] === 'ascending' ? 'descending' : 'ascending';
      return `/bdb?${sortType}=${ascending}`;
    } return `/bdb?${sortType}=descending`;
  };

  showOrHideSortIcon = (sortType, ascending) => {
    const { query } = this.props;
    // Special treatment for name sorting
    if (sortType === 'nameSort') {
      if (Object.keys(query).length === 0) {
        return ascending ? 'hidden' : 'showDescending';
      } else if (query[sortType] && query[sortType] === 'descending') {
        return ascending ? 'showAscending' : 'hidden';
      }
    } // The rest
    if (query[sortType] && query[sortType] === 'ascending') {
      return ascending ? 'showAscending' : 'hidden';
    } else if (query[sortType] && query[sortType] === 'descending') {
      return ascending ? 'hidden' : 'showDescending';
    } return 'hidden';
  };

  static propTypes = {
    companies: PropTypes.array.isRequired,
    query: PropTypes.object.isRequired
  };

  render() {
    const { companies } = this.props;

    const headers = this.headerItems.map((item, i) => (
      <th key={i}>
        <Link to={this.findSortLink(item.sortLink)}>
          <div className={styles.title}>{item.title}</div>

          <div className={styles[this.showOrHideSortIcon(item.sortLink, true)]}>
            <i className='fa fa-arrow-up' aria-hidden='true'></i>
          </div>
          <div className={styles[this.showOrHideSortIcon(item.sortLink, false)]}>
            <i className='fa fa-arrow-down' aria-hidden='true'></i>
          </div>

        </Link>
      </th>
    ));
    return (

      <div className={styles.companyList}>

      <table>
        <thead className={styles.categoryHeader}>
          <tr>
            {headers}
          </tr>
        </thead>

        <tbody>
            {companies.map((company) =>
              <CompanySingleRow
                company={company}
                key={company.id}
              />
            )}
        </tbody>

      </table>

      </div>
    );
  }
}
