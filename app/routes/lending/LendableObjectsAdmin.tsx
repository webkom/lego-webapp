import Card from 'app/components/Card';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import { Helmet } from 'react-helmet-async';
import styles from './LendableObjectsAdmin.css';

const PendingLendingRequest = () => {
  return <Card>test</Card>;
};

const ApprovedLendingRequest = () => {
  return <Card>test</Card>;
};

const LendableObjectsAdmin = () => {
  const lendingRequests = [
    { user: '', startTime: '', endTime: '', approved: false, bitch: true },
    { user: '', startTime: '', endTime: '', approved: false },
  ];

  return (
    <Content>
      <Helmet title="Utlån" />
      <NavigationTab title="Utlånsforespørsler" />
      <h2 className={styles.heading}>Ventende utlånsforespørsler</h2>
      {lendingRequests
        .filter((request) => !request.approved)
        .map((request) => (
          <PendingLendingRequest />
        ))}
      <h2 className={styles.heading}>Godkjente utlånsforespørsler</h2>
      {lendingRequests
        .filter((request) => request.approved)
        .map((request) => (
          <ApprovedLendingRequest />
        ))}
    </Content>
  );
};

export default LendableObjectsAdmin;
