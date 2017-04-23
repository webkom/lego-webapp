import React from 'react';
import styles from './bdb.css';
import { Link } from 'react-router';
import { deleteCompany } from 'app/actions/CompanyActions';
import { connect } from 'react-redux';

type Props = {
  companyId: string,
  deleteCompany: () => void
};

function BdbRightNav({ companyId, deleteCompany }: Props) {
  return (
    <div className={styles.rightSection}>
      {companyId &&
        <div>
          <Link to={`/bdb/${companyId}`}>Til bedriftens side</Link>
          <Link to={`/bdb/${companyId}/edit`}>Endre bedrift</Link>
          <a onClick={() => deleteCompany(companyId)}>Slett bedrift</a>
        </div>}
      <Link to="/bdb/add">Legg til bedrift</Link>
    </div>
  );
}

const mapDispatchToProps = { deleteCompany };

export default connect(null, mapDispatchToProps)(BdbRightNav);
