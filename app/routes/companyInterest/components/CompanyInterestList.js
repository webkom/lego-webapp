import styles from './CompanyInterest.css';
import React from 'react';
import Button from 'app/components/Button';
import { Link } from 'react-router';

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
      value: company.contactName,
      label: 'Kontaktperson'
    },
    {
      value: company.mail,
      label: 'Mail'
    },
    {
      value: company.companyPresentation,
      label: 'Bedriftspresentasjon'
    },
    {
      value: company.course,
      label: 'Kurs'
    },
    {
      value: company.lunchPresentation,
      label: 'Lunsjpresentasjon'
    },
    {
      value: company.readme,
      label: 'readme'
    },
    {
      value: company.collaboration,
      label: 'Samardbeid med andre linjeforeninger'
    },
    {
      value: company.itdagene,
      label: 'itDAGENE'
    },
    {
      value: company.comment,
      label: 'Kommentar'
    }
  ];
};

const CompanyInterestList = (props: Props) => {
  const generateValues = company => {
    return eventTypes(company).map((event, key) => {
      let value;
      switch (typeof event.value) {
        case 'boolean':
          value = event.value ? 'Ja' : 'Nei';
          break;
        case 'string':
          value = event.value;
          break;
        default:
      }
      return <td className={styles.tableColumn}>{value}</td>;
    });
  };

  const generateMobileValues = company => {
    return eventTypes(company).map((event, key) => {
      let value;
      switch (typeof event.value) {
        case 'boolean':
          value = event.value ? 'Ja' : 'Nei';
          break;
        case 'string':
          value = event.value;
          break;
        default:
      }
      return (
        <tr className={styles.tableColumn}>
          <td>{event.label}:</td>
          <td>
            <b>{value}</b>
          </td>
        </tr>
      );
    });
  };

  const interests = props.companyInterestList.map((company, key) => (
    <tr key={key} className={styles.companyInterestList}>
      {generateValues(company)}
      <td>
        <a onClick={() => props.removeCompanyInterest(company.id)}>
          <i className="fa fa-times" style={{ color: '#d13c32' }} />
        </a>
      </td>
    </tr>
  ));

  const interestsMobile = props.companyInterestList.map((company, key) => (
    <table key={key} className={styles.companyInterestListMobile}>
      <thead>
        <tr>
          <h3 className={styles.companyInterestListMobile}>
            {company.companyName}
          </h3>
        </tr>
      </thead>
      <tbody className={styles.companyInterestListMobile}>
        {generateMobileValues(company)}
        <td>
          <a onClick={() => props.removeCompanyInterest(company.id)}>
            <i className="fa fa-times" style={{ color: '#d13c32' }} />
          </a>
        </td>
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
        <Link
          to={'/companyInterest/createCompanyInterest'}
          className={styles.link}
        >
          <Button>Opprett ny bedriftsinteresse</Button>
        </Link>
      </div>
      <table className={styles.companyInterestList}>
        <thead>
          <tr className={styles.companyInterestList}>
            <th className={styles.tableColumn}>Bedriftsnavn</th>
            <th className={styles.tableColumn}>Kontaktperson</th>
            <th className={styles.tableColumn}>Mail</th>
            <th className={styles.tableColumn}>Bedrifts-presentasjon</th>
            <th className={styles.tableColumn}>Kurs</th>
            <th className={styles.tableColumn}>Lunch-presentasjon</th>
            <th className={styles.tableColumn}>Annonsere i readme</th>
            <th className={styles.tableColumn}>
              Samarbeid med andre linjeforeninger
            </th>
            <th className={styles.tableColumn}>Ønsker stand på itDAGENE</th>
            <th className={styles.tableColumn}>Kommentar</th>
            <th className={styles.tableColumn} />
          </tr>
        </thead>
        <tbody>{interests}</tbody>
      </table>
    </div>
  );
};

export default CompanyInterestList;
