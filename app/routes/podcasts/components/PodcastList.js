// @flow

import React, { Component } from 'react';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
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
    const { actionGrant } = this.props;

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
      </Content>
    );
  }
}

export default PodcastList;
