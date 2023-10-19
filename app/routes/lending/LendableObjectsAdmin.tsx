import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import Card from 'app/components/Card';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import styles from './LendableObjectsAdmin.css';

type LendingRequestProps = {
  pending: boolean;
  request: any;
};

const LendingRequest = ({ request }: LendingRequestProps) => {
  return (
    <Card>
      {request.lendableObject.title} - {request.user}
    </Card>
  );
};

const LendableObjectsAdmin = () => {
  const lendingRequests = [
    {
      id: 1,
      user: 'Test Testesen',
      startTime: moment().subtract({ hours: 2 }),
      endTime: moment(),
      approved: false,
      lendableObject: {
        id: 1,
        title: 'Grill',
        image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
      },
    },
    {
      id: 2,
      user: 'Test Testesen',
      startTime: moment().subtract({ hours: 2 }),
      endTime: moment(),
      approved: false,
      lendableObject: {
        id: 2,
        title: 'Grill',
        image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
      },
    },
  ];

  return (
    <Content>
      <Helmet title="Utlån" />
      <NavigationTab title="Utlånsforespørsler" />
      <h2 className={styles.heading}>Ventende utlånsforespørsler</h2>
      {lendingRequests
        .filter((request) => !request.approved)
        .map((request) => (
          <LendingRequest key={request.id} pending={true} request={request} />
        ))}
      <h2 className={styles.heading}>Godkjente utlånsforespørsler</h2>
      {lendingRequests
        .filter((request) => request.approved)
        .map((request) => (
          <LendingRequest key={request.id} pending={false} request={request} />
        ))}
    </Content>
  );
};

export default LendableObjectsAdmin;
