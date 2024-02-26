import type { Comment } from './Comment';
import type { PublicUser } from './User';
import type { ContentTarget } from '../utils/contentTarget';
import type { ActionGrant, Dateish } from 'app/models';
import type { ID } from 'app/store/models';

export interface CreateThread {
  title: string;
  content: string;
  forum: ID;
}

export interface UpdateThread extends CreateThread {
  id: ID;
}

export interface PublicThread {
  id: ID;
  title: string;
  content: string;
  createdAt: Dateish;
  forum: ID;
}

export interface DetailedThread extends PublicThread {
  comments?: Comment[];
  createdBy?: PublicUser;
  contentTarget: ContentTarget;
  actionGrant: ActionGrant;
}

export interface CreateForum {
  title: string;
  description: string;
}

export interface UpdateForum extends CreateForum {
  id: ID;
}

export interface PublicForum {
  id: number;
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
