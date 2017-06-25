import styles from './CompanyInterest.css';
import React from 'react';
import Button from 'app/components/Button';
import { Link } from 'react-router';

export type Props = {
  CompanyInterestList: Array
};

const eventTypes = group => {
  return [
    {
      value: group.name,
      label: 'Bedriftsnavn'
    },
    {
      value: group.contactPerson,
      label: 'Kontaktperson'
    },
    {
      value: group.mail,
      label: 'Mail'
    },
    {
      value: group.companyPresentation,
      label: 'Bedrifts-presentasjon'
    },
    {
      value: group.course,
      label: 'Kurs'
    },
    {
      value: group.lunchPresentation,
      label: 'Lunsj-presentasjon'
    },
    {
      value: group.readme,
      label: 'Annonsere i readme'
    },
    {
      value: group.collaboration,
      label: 'Samarbeid med andre linjeforeninger'
    },
    {
      value: group.itdagene,
      label: 'Ønsker stand på itDAGENE'
    },
    {
      value: group.comment,
      label: 'Kommentar'
    }
  ];
};

const CompanyInterestList = (props: Props) => {
  const generateLabels = group => {
    return eventTypes(group).map((event, key) => {
      return <th className={styles.tableColumn}>{event.label}</th>;
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

  const interests = props.CompanyInterestList.map((group, id) => (
    <tr className={styles.companyInterestList}>{generateValues(group)}</tr>
  ));

  const interestsMobile = props.CompanyInterestList.map((group, id) => (
    <table className={styles.companyInterestListMobile}>
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
      <table className={styles.companyList}>
        <tr className={styles.companyList}>
          {generateLabels(props.CompanyInterestList[0])}
        </tr>
        {interests}
      </table>
    </div>
  );
};

export default CompanyInterestList;
