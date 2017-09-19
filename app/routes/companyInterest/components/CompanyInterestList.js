import styles from './CompanyInterest.css';
import React from 'react';
import Button from 'app/components/Button';
import { Link } from 'react-router';
import { FlexRow, FlexItem } from 'app/components/FlexBox';
import Icon from 'app/components/Icon';

export type Props = {
  companyInterestList: Array
};

const eventTypes = company => {
  return [
    {
      value: company.companyName,
      label: 'Bedriftsnavn'
    },
    {
      value: company.contactPerson,
      label: 'Kontaktperson'
    },
    {
      value: company.mail,
      label: 'Mail'
    }
  ];
};

const CompanyInterestList = (props: Props) => {
  const generateValues = company => {
    return eventTypes(company).map((event, key) => {
      return (
        <td key={key} className={styles.tableColumn}>
          <Link to={`/companyInterest/${company.id}/edit`}>
            {event.value}
          </Link>
        </td>
      );
    });
  };

  const generateMobileValues = company => {
    return eventTypes(company).map((event, key) => {
      return (
        <tr key={key} className={styles.tableColumn}>
          <td>
            {event.label}:
          </td>
          <td>
            <b>
              <Link to={`/companyInterest/${company.id}/edit`}>
                {event.value}
              </Link>
            </b>
          </td>
          <td>
            <Icon
              name="close-circle"
              onClick={() => props.removeCompanyInterest(company.id)}
              className={styles.remove}
            />
          </td>
        </tr>
      );
    });
  };

  const interests = props.companyInterestList.map((company, key) => (
    <tr key={key} className={styles.companyInterestList}>
      {generateValues(company)}
      <td className={styles.toolContainer}>
        <Icon
          name="close-circle"
          onClick={() => props.removeCompanyInterest(company.id)}
          className={styles.remove}
        />
      </td>
    </tr>
  ));

  const interestsMobile = props.companyInterestList.map((company, key) => (
    <table key={key} className={styles.companyInterestListMobile}>
      <thead>
        <tr>
          <td>
            <h3 className={styles.companyInterestListMobile}>
              {company.companyName}
            </h3>
          </td>
        </tr>
      </thead>
      <tbody className={styles.companyInterestListMobile}>
        {generateMobileValues(company)}
      </tbody>
    </table>
  ));

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <div>
          <h1>Bedriftsinteresser</h1>
          <p>
            <strong>Her</strong> finner du all praktisk informasjon knyttet til
            bedriftsinteresser.
          </p>
        </div>
        <Link to={'/companyInterest/create'} className={styles.link}>
          <Button>Opprett ny bedriftsinteresse</Button>
        </Link>
      </div>
      <table className={styles.companyInterestList}>
        <thead>
          <tr className={styles.companyInterestList}>
            <th className={styles.tableColumn}>Bedriftsnavn</th>
            <th className={styles.tableColumn}>Kontaktperson</th>
            <th className={styles.tableColumn}>Mail</th>
            <th className={styles.tableColumn} />
          </tr>
        </thead>
        <tbody>{interests}</tbody>
      </table>
    </div>
  );
};

export default CompanyInterestList;
