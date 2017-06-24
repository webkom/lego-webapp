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
      value: group.comment,
      label: 'Kommentar'
    },
    {
      value: group.companyPresentation,
      label: 'Bedriftspresentasjon'
    },
    {
      value: group.course,
      label: 'Kurs'
    },
    {
      value: group.lunchPresentation,
      label: 'Lunsjpresentasjon'
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
    }
  ];
};

const CompanyInterestList = (props: Props) => {
  const generateLabels = group => {
    return eventTypes(group).map((event, key) => {
      return <td className={styles.tableColumn}>{event.label}</td>;
    });
  };

  const generateValues = group => {
    return eventTypes(group).map((event, key) => {
      let value;
      switch (typeof event.value) {
        case 'boolean':
          value = event.value ? 'Ja' : '';
          break;
        case 'string':
          value = event.value;
          break;
        default:
      }
      return <td className={styles.tableColumn}>{value}</td>;
    });
  };

  const interests = props.CompanyInterestList.map((group, id) =>
    <tr>{generateValues(group)}</tr>
  );

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <div>
          <h1>Bedriftsinteresser</h1>
          <p>
            <strong>Her</strong>
            {' '}
            finner du all praktisk informasjon knyttet til
            bedriftsinteresser.
            {console.log()}
          </p>
        </div>
        <Link
          to={'/companyInterest/createCompanyInterest'}
          className={styles.link}
        >
          <Button>Opprett ny bedriftsinteresse</Button>
        </Link>
      </div>
      <table className="groups">
        <tr className={styles.tableRow}>
          {generateLabels(props.CompanyInterestList[0])}
        </tr>
        {interests}
      </table>
    </div>
  );
};

export default CompanyInterestList;
