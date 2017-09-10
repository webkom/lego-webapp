import styles from './CompanyInterest.css';
import React from 'react';
import Image from 'app/components/Image';
import Icon from 'app/components/Icon';
import { Button } from 'app/components/Form';
import { FlexColumn, FlexRow } from 'app/components/FlexBox';
import { Link } from 'react-router';

type Props = {
  removeCompanyInterest: () => void,
  updateCompanyInterest: () => void,
  handleSubmit: () => void,
  company: Object
};

const getSemesters = semesters =>
  semesters.map((item, index) =>
    <div key={index} className={styles.detailList}>
      {item}
    </div>
  );

const CompanyInterestDetail = ({ company, ...props }: Props) => {
  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <h1 className={styles.detail}>
          {company.companyName}
        </h1>
        <div className={styles.content}>
          <p className={styles.paragraphDetail}>
            {company.contactPerson}
          </p>
          {console.log(company)}
          {/*getSemesters(company.semesters)*/}
          <Image
            className={styles.companyDetailPic}
            src={'https://i.redd.it/dz8mwvl4dgdy.jpg'}
          />
        </div>
      </div>
      <h2 className={styles.heading}>Kommentar</h2>
      <div className={styles.content}>
        <Icon
          name={'remove-circle'}
          onClick={() => props.removeCompanyInterest(company.id)}
          className={styles.delete}
        />
      </div>
    </div>
  );
};
export default CompanyInterestDetail;
