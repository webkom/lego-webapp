import React from 'react';
import styles from './bdb.css';
import { Link } from 'react-router';

type Props = {
  companyId: string
};

function BdbRightNav({ companyId }: Props) {
  return (
    <div className={styles.rightSection}>
      {companyId && (
        <div>
          <Link to={`/bdb/${companyId}`}>Til bedriftens side</Link>
          <Link to={`/bdb/${companyId}/edit`}>Endre bedrift</Link>
        </div>
      )}
      <Link to='/bdb/add'>Legg til bedrift</Link>
    </div>
  );
}

export default BdbRightNav;
