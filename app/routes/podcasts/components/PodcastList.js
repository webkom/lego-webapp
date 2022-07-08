// @flow

import { Component } from 'react';

import { Content } from 'app/components/Content';
import Icon from 'app/components/Icon';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Podcast from './Podcast.js';

import styles from './PodcastList.css';

type Props = {
  podcasts: Array<Object>,
  actionGrant: Array<String>,
};

type State = {
  items: number,
};

class PodcastList extends Component<Props, State> {
  state = {
    items: 5,
  };

  showMore = () => {
    this.setState((state) => ({ items: state.items + 5 }));
  };

  render() {
    const { podcasts, actionGrant } = this.props;
    const elements = podcasts
      .map((podcast) => {
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
