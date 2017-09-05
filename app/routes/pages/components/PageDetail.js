/* eslint-disable react/no-danger */
// @flow

import React, { Component } from 'react';
import styles from './PageDetail.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Editor from 'app/components/Editor';
import PageButtons from './PageButtons';
import PageHierarchy from './PageHierarchy';

type Props = {
  updatePage: (string, Object) => void,
  page: {
    title: string,
    slug: string,
    content: string,
    permissions: Array<string>
  }
};

export default class PageDetail extends Component {
  state = {
    isEditing: false,
    content: ''
  };

  props: Props;

  handleEditorChange = (content: string) => {
    this.setState({
      ...this.state,
      content
    });
  };

  handleSave = () => {
    this.setState({ isEditing: false });
    this.props.updatePage(this.props.page.slug, {
      content: this.state.content
    });
  };

  toggleEditing = () => {
    this.setState({
      isEditing: !this.state.isEditing
    });
  };

  render() {
    const { page } = this.props;
    if (!page.content) {
      return <LoadingIndicator loading />;
    }

    const canEdit = page.permissions && page.permissions.includes('edit');
    return (
      <div className={styles.root}>
        <div className={styles.page}>
          <article className={styles.detail}>
            <div className={styles.header}>
              <h2 className={styles.title}>
                {page.title}
              </h2>
              {canEdit &&
                <PageButtons
                  isEditing={this.state.isEditing}
                  toggleEditing={this.toggleEditing}
                  handleSave={this.handleSave}
                />}
            </div>
            {this.state.isEditing
              ? <Editor
                  content={page.content}
                  onChange={this.handleEditorChange}
                />
              : <div dangerouslySetInnerHTML={{ __html: page.content }} />}
          </article>
          <aside className={styles.sidebar}>
            <PageHierarchy {...this.props} selectedSlug={page.slug} />
          </aside>
        </div>
      </div>
    );
  }
}
