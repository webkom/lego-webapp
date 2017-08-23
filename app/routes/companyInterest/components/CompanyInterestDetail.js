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
          <Image
            className={styles.companyDetailPic}
            src={'https://i.redd.it/dz8mwvl4dgdy.jpg'}
          />
        </div>
      </div>
      <h2 className={styles.heading}>Kommentar</h2>
      <div className={styles.content}>
        <FlexColumn>
          <div className={styles.button} />
          <FlexRow>
            <Link
              to={`/companyInterest/${company.id}/edit`}
              className={styles.delete}
            >
              <Icon name={'settings'} className={styles.settings} />
            </Link>
            <Icon
              name={'remove-circle'}
              onClick={() => props.removeCompanyInterest(company.id)}
              className={styles.delete}
            />
          </FlexRow>
        </FlexColumn>
      </div>
    </div>
  );
};
export default CompanyInterestDetail;
