import styles from './CompanyInterest.css';
import React from 'react';
import Button from 'app/components/Button';
import { Link } from 'react-router';

export type Props = {
  companyInterestList: Array
};

const eventTypes = group => {
  return [
    {
      value: group.companyName
    },
    {
      value: group.contactName
    },
    {
      value: group.mail
    },
    {
      value: group.companyPresentation
    },
    {
      value: group.course
    },
    {
      value: group.lunchPresentation
    },
    {
      value: group.readme
    },
    {
      value: group.collaboration
    },
    {
      value: group.itdagene
    },
    {
      value: group.comment
    }
  ];
};

const CompanyInterestList = (props: Props) => {
  console.log('comp Props', props.companyInterestList);

  const generateLabels = group => {
    return eventTypes(group).map((event, key) => {
      return (
        <th key={key} className={styles.tableColumn}>
          {event.label}
        </th>
      );
    });
  };

  const generateValues = group => {
    return eventTypes(group).map((event, key) => {
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

  const generateMobileValues = group => {
    return eventTypes(group).map((event, key) => {
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

  const interests = props.companyInterestList.map((group, key) => (
    <tr key={key} className={styles.companyInterestList}>
      {generateValues(group)}
    </tr>
  ));

  const interestsMobile = props.companyInterestList.map((group, key) => (
    <table key={key} className={styles.companyInterestListMobile}>
      <thead>
        <tr>
          <h3 className={styles.companyInterestListMobile}>{group.name}</h3>
        </tr>
      </thead>
      <tbody className={styles.companyInterestListMobile}>
        {generateMobileValues(group)}
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
          </tr>
        </thead>
        <tbody>{interests}</tbody>
      </table>
    </div>
  );
};

export default CompanyInterestList;
