// @flow
import { ListNavigation } from 'app/routes/bdb/utils';
import styles from './CompanyInterest.css';
import React from 'react';
import Button from 'app/components/Button';
import { Link } from 'react-router';
import Icon from 'app/components/Icon';
import { Content } from 'app/components/Content';
import Flex from 'app/components/Layout/Flex';

export type Props = {
  companyInterestList: Array<Object>,
  deleteCompanyInterest: number => void
};

const fields = company => {
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
  const generateValues = company =>
    fields(company).map((event, key) => (
      <td key={key} className={styles.companyInterestList}>
        <Link to={`/companyInterest/${company.id}/edit`}>{event.value}</Link>
      </td>
    ));

  const generateMobileValues = company =>
    fields(company).map((event, key) => (
      <tr key={key}>
        <td>{event.label}:</td>
        <td>
          <Link to={`/companyInterest/${company.id}/edit`}>{event.value}</Link>
        </td>
      </tr>
    ));

  const interests = props.companyInterestList.map((company, key) => (
    <tr key={key} className={styles.companyInterestList}>
      {generateValues(company)}
      <td className={styles.remove}>
        <Icon
          name="close-circle"
          onClick={() => props.deleteCompanyInterest(company.id)}
          className={styles.remove}
        />
      </td>
    </tr>
  ));

  const interestsMobile = props.companyInterestList.map((company, key) => (
    <table key={key} className={styles.companyInterestListMobile}>
      <Flex column>
        <thead>
          <tr className={styles.mobileHeader}>
            <td>
              <h3 className={styles.companyInterestListMobile}>
                {company.companyName}
              </h3>
            </td>
            <td>
              <Icon
                name="close-circle"
                onClick={() => props.deleteCompanyInterest(company.id)}
                className={styles.remove}
              />
            </td>
          </tr>
        </thead>
        <tbody className={styles.companyInterestListMobile}>
          {generateMobileValues(company)}
        </tbody>
      </Flex>
    </table>
  ));

  return (
    <Content>
      <ListNavigation title="Bedriftsinteresser" />
      <Flex className={styles.section}>
        <Flex column>
          <p>
            Her finner du all praktisk informasjon knyttet til
            <strong> bedriftsinteresser</strong>.
          </p>
        </Flex>
        <Link to={'/companyInterest/semesters'} className={styles.link}>
          <Button>Endre aktive semestre</Button>
        </Link>
        <Link to={'/companyInterest/create'} className={styles.link}>
          <Button>Opprett ny bedriftsinteresse</Button>
        </Link>
      </Flex>
      <table className={styles.companyInterestList}>
        <thead>
          <tr className={styles.companyInterestList}>
            <th className={styles.companyInterestList}>Bedriftsnavn</th>
            <th className={styles.companyInterestList}>Kontaktperson</th>
            <th className={styles.companyInterestList}>Mail</th>
            <th className={styles.companyInterestList} />
          </tr>
        </thead>
        <tbody>{interests}</tbody>
      </table>
      {interestsMobile}
    </Content>
  );
};

export default CompanyInterestList;
