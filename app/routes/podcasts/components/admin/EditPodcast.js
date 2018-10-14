// @flow

import React, { Component } from 'react';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import styles from './admin.css';

type Props = {
  id: number,
  title: string,
  createdAt: string
};

class EditPodcast extends Component<Props, *> {
  render() {
    return (
      <Content>
        <NavigationTab title="Rediger Podcast">
          <NavigationLink to="/podcasts/">Tilbake</NavigationLink>
        </NavigationTab>
      </Content>
    );
  }
}

export default EditPodcast;
