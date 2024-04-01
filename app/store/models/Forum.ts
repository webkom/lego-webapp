import type { PublicUser } from './User';
import type { ContentTarget } from '../utils/contentTarget';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant, Dateish } from 'app/models';

export interface CreateThread {
  title: string;
  content: string;
  forum: EntityId;
}

export interface UpdateThread extends CreateThread {
  id: EntityId;
}

export interface PublicThread {
  id: EntityId;
  title: string;
  content: string;
  createdAt: Dateish;
  forum: EntityId;
}

export interface DetailedThread extends PublicThread {
  comments?: EntityId[];
  createdBy?: PublicUser;
  contentTarget: ContentTarget;
  actionGrant: ActionGrant;
}

export type UnknownThread = (PublicThread | DetailedThread) & {
  comments?: EntityId[];
};

export interface CreateForum {
  title: string;
  description: string;
}

export interface UpdateForum extends CreateForum {
  id: EntityId;
}

export interface PublicForum {
  id: EntityId;
  title: string;
  description: string;
  createdAt: Dateish;
  actionGrant: ActionGrant;
}

export interface DetailedForum extends PublicForum {
  threads?: PublicThread[];
  created_by?: PublicUser;
  contentTarget: string;
  actionGrant: ActionGrant;
}

export type UnknownForum = PublicForum | DetailedForum;
