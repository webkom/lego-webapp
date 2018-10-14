// @flow

import React, { Component } from 'react';
import Podcast from './Podcast.js';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Icon from 'app/components/Icon';
import styles from './PodcastList.css';

type Props = {
  podcasts: Array<Object>
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
    const { podcasts } = this.props;
    const elements = podcasts
      .map(podcast => {
        return <Podcast key={podcast.id} {...podcast} />;
      })
      .reverse()
      .splice(0, this.state.items);

    return (
      <Content>
        <NavigationTab title="Podcasts">
          <NavigationLink to="/podcasts/create">Legg til ny</NavigationLink>
        </NavigationTab>

        {elements}

        {podcasts.length > this.state.items && (
          <div className={styles.showMore}>
            <Icon onClick={this.showMore} size={40} name="arrow-dropdown" />
          </div>
        )}
      </Content>
    );
  }
}

export default PodcastList;
