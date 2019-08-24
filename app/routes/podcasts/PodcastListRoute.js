// @flow

import React, { Component } from 'react';
import Podcast from './components/Podcast.js';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Icon from 'app/components/Icon';
import styles from './components/PodcastList.css';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { selectPodcasts } from 'app/reducers/podcasts';
import { fetchPodcasts } from 'app/actions/PodcastAction';
import prepare from 'app/utils/prepare';

const mapStateToProps = (state, props) => {
  return {
    podcasts: selectPodcasts(state),
    actionGrant: state.podcasts.actionGrant
  };
};

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

export default compose(
  prepare((props, dispatch) => dispatch(fetchPodcasts())),
  connect(
    mapStateToProps,
    null
  )
)(PodcastList);
