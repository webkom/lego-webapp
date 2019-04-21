// @flow

import React, { Component } from 'react';
import Podcast from './Podcast.js';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Icon from 'app/components/Icon';
import styles from './PodcastList.css';
import awSnap from 'app/assets/sentry-aw-snap.svg';

type Props = {
  podcasts: Array<Object>,
  actionGrant: Array<String>
};

type State = {
  items: number
};

class PodcastList extends Component<Props, State> {
  state = {
    items: 5
  };

  showMore = () => {
    this.setState(state => ({ items: state.items + 5 }));
  };

  render() {
    const { podcasts, actionGrant } = this.props;
    const elements = podcasts
      .map(podcast => {
        return (
          <Podcast key={podcast.id} {...podcast} actionGrant={actionGrant} />
        );
      })
      .reverse()
      .splice(0, this.state.items);

    return (
      <Content>
        <NavigationTab title="Podcasts">
          {actionGrant.includes('create') && (
            <NavigationLink to="/podcasts/create">Legg til ny</NavigationLink>
          )}
        </NavigationTab>

        <div className={styles.container}>
          <div className={styles.snap}>
            <img src={awSnap} alt="snap" />
            <div className={styles.message}>
              <h3>Denne siden opplever litt problemer</h3>
              <p>Webkom jobber saken</p>
            </div>
          </div>
        </div>
        {/*
        {elements}
        {podcasts.length > this.state.items && (
          <div className={styles.showMore}>
            <Icon onClick={this.showMore} size={40} name="arrow-dropdown" />
          </div>
        )}
        */}
      </Content>
    );
  }
}

export default PodcastList;
