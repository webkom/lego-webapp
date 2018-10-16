// @flow

import React, { Component } from 'react';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Button from 'app/components/Button';

type Props = {
  id: number,
  title: string,
  createdAt: string,
  description: string,
  source: string,
  deletePodcast: number => Promise<*>,
  push: string => void
};

class EditPodcast extends Component<Props, *> {
  render() {
    const deletePodcast = () => {
      const { deletePodcast, id, push } = this.props;
      deletePodcast(id).then(() => {
        push('/podcasts/');
      });
    };

    const { createdAt, description, source, title } = this.props;
    return (
      <Content>
        <NavigationTab title="Rediger Podcast">
          <NavigationLink to="/podcasts/">Tilbake</NavigationLink>
        </NavigationTab>
        <p>title: {title}</p>
        <p>createdAt: {createdAt} </p>
        <p>source: {source} </p>
        <p>desc: {description} </p>
        <Button onClick={deletePodcast}>Delete</Button>
      </Content>
    );
  }
}

export default EditPodcast;
