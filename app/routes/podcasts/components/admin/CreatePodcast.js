// @flow

import React, { Component } from 'react';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import styles from './admin.css';
import { addPodcast, deletePodcast } from 'app/actions/PodcastAction';

class CreatePodcast extends Component<*, *> {
  render() {
    console.log(
      addPodcast({
        title: 'randomtest',
        source: 'sor',
        description: 'desc'
      })
    );

    console.log(deletePodcast(26));
    return (
      <Content>
        <NavigationTab title="Ny Podcast">
          <NavigationLink to="/podcasts/">Tilbake</NavigationLink>
        </NavigationTab>
      </Content>
    );
  }
}

export default CreatePodcast;
