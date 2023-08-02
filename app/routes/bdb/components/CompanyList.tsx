import { LoadingIndicator } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import type { CompanySemesterContactedStatus } from 'app/models';
import type { CompanyEntity } from 'app/reducers/companies';
import { indexToSemester } from '../utils';
import CompanySingleRow from './CompanySingleRow';
import styles from './bdb.css';

type Props = {
  companies: Array<CompanyEntity>;
  startYear: number;
  startSem: number;
  query: Record<string, any>;
  fetching: boolean;
  navigateThroughTime: (arg0: Record<string, any>) => void;
  editChangedStatuses: (
    arg0: number,
    arg1: number,
    arg2: number | null | undefined,
    arg3: Array<CompanySemesterContactedStatus>
  ) => Promise<any> | null | undefined;
};
export default class CompanyList extends Component<Props> {
  findTitle = (index: number) => {
    const { startYear, startSem } = this.props;
    const result = indexToSemester(index, startYear, startSem);
    const sem = result.semester === 'spring' ? 'Vår' : 'Høst';
    return `${sem} ${result.year}`;
  };
  findSortLink = (sortType: string) => {
    const { query } = this.props;
    const ascending = query.ascending === 'true';

    // Seperate sorting for name because the url for default sorting is just /bdb/
    if (sortType === 'name' && Object.keys(query).length !== 0) {
      return '/bdb/';
    }

    if (sortType === 'name') {
      return '/bdb?sortBy=name&ascending=false';
    }

    // The rest
    if (query.sortBy === sortType) {
      return `/bdb?sortBy=${sortType}&ascending=${String(!ascending)}`;
    }

    return `/bdb?sortBy=${sortType}&ascending=true`;
  };
  showOrHideSortIcon = (sortType: string) => {
    const { query } = this.props;
    const ascending = query.ascending === 'true';

    // Special treatment for name sorting
    if (sortType === 'name' && Object.keys(query).length === 0) {
      return 'showAscending';
    }

    // The rest
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
      editChangedStatuses,
      fetching,
    } = this.props;

    /*
    **
    Could possibly move this constant to utils.tsx, but I didn't because it's dependent
    on the findTitle() function, which in turns needs the props in this file. Would have
    to send a lot of props to the utils file.
    **
    */
    const HEADER_ITEMS = [
      {
        title: 'Bedrifter',
        sortLink: 'name',
      },
      {
        title: this.findTitle(0),
        sortLink: 'sem0',
      },
      {
        title: this.findTitle(1),
        sortLink: 'sem1',
      },
      {
        title: this.findTitle(2),
        sortLink: 'sem2',
      },
      {
        title: 'Studentkontakt',
        sortLink: 'studentContact',
      },
      {
        title: 'Notat',
        sortLink: 'comment',
      },
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
              <Button
                flat
                className={styles.yearNavigator}
                onClick={() =>
                  navigateThroughTime({
                    direction: 'backward',
                  })
                }
              >
                <Icon
                  name="arrow-back"
                  style={{
                    marginRight: '5px',
                  }}
                  size={16}
                />
                Forrige år
              </Button>
              <td />
              <Button
                flat
                className={cx(styles.rightArrow, styles.yearNavigator)}
                onClick={() =>
                  navigateThroughTime({
                    direction: 'forward',
                  })
                }
              >
                Neste år
                <Icon
                  name="arrow-forward"
                  style={{
                    marginLeft: '5px',
                  }}
                  size={16}
                />
              </Button>
            </tr>

            <tr>{headers}</tr>
          </thead>

          <tbody>
            {companies.map((company, i) => (
              <CompanySingleRow
                company={company}
                startYear={startYear}
                startSem={startSem}
                key={i}
                editChangedStatuses={editChangedStatuses}
              />
            ))}
          </tbody>
        </table>
        {fetching && <LoadingIndicator loading />}
      </div>
    );
  }
}
