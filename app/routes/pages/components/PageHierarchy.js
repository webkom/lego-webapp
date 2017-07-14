// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import { intersection } from 'lodash';
import { Link } from 'react-router';
import styles from './PageHierarchy.css';
import Modal, { ConfirmModal } from 'app/components/Modal';
import Icon from 'app/components/Icon';

type Props = {
  parent?: { slug: string, title: string },
  siblings: Object[],
  actionGrant: string[],
  selectedSlug: string
};

class PageHierarchy extends Component {
  props: Props;

  state = {
    showConfirmModal: false
  };

  onDelete = () => {
    this.setState({ showConfirmModal: !this.state.showConfirmModal });
  };

  render() {
    const { parent, siblings, selectedSlug, actionGrant } = this.props;

    return (
      <div className={styles.sidebar}>
        {intersection(actionGrant, ['update', 'destroy', 'create']).length >
          0 && (
          <ul className={styles.pageList}>
            {actionGrant.includes('update') && (
              <li className={styles.sibling}>
                <Link
                  className={styles.action}
                  to={`/pages/${selectedSlug}/edit?parent=${parent.slug}`}
                >
                  Edit
                </Link>
              </li>
            )}
            {actionGrant.includes('destroy') && (
              <li className={styles.sibling}>
                <Link className={styles.action} onClick={this.onDelete}>
                  Delete
                </Link>
              </li>
            )}
            {actionGrant.includes('create') && (
              <li className={styles.sibling}>
                <Link className={styles.action} to={'/pages/new'}>
                  Create
                </Link>
              </li>
            )}
          </ul>
        )}
        <ul className={styles.pageList}>
          <li>
            <Link className={styles.back} to={`/pages/${parent.slug}`}>
              <Icon name="chevron-left" />
              {parent.title}
            </Link>
          </li>
          {siblings.map(page => (
            <li
              key={page.pk}
              className={classNames(styles.sibling, {
                selected: page.slug === selectedSlug
              })}
            >
              <Link to={`/pages/${page.slug}`}>{page.title}</Link>
            </li>
          ))}
        </ul>
        <Modal show={this.state.showConfirmModal} hide={this.onDelete}>
          <ConfirmModal
            title="d,ad,as;l,das,d"
            message="dasdasdafs"
            onCancel={() => {
              console.log('cancel');
            }}
            onConfirm={() => {
              console.log('confirm');
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default PageHierarchy;
