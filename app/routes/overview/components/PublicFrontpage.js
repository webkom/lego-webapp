import React from 'react';
import { Content, Flex } from 'app/components/Layout';
import Card from 'app/components/Card';
import styles from './PublicFrontpage.css';

function InfoBox({ children }) {
  return (
    <div className={styles.root}>
      {children}
    </div>
  );
}

function PublicFrontpage() {
  return (
    <Content>
      <p>This is the public frontpage</p>

      <Flex justifyContent='space-between'>
        <InfoBox>
          <p>Starte på data eller komtek?</p>
        </InfoBox>

        <InfoBox>
          <p>Hello World</p>
        </InfoBox>

        <InfoBox>
          <p>Hello World</p>
        </InfoBox>
      </Flex>
    </Content>
  );
}

export default PublicFrontpage;
