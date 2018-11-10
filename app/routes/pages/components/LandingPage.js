import React from 'react';
import { Link } from 'react-router';
import { DisplayVisionShort } from './DisplayVision';
import { Content } from 'app/components/Content';
import styles from './LandingPage.css';

const LandingPage = props => {
  return (
    <Content>
      <Link to={'/pages/info/17-strategidokument'}>-> Vision page</Link>

      <DisplayVisionShort />
    </Content>
  );
};

export default LandingPage;
