import { ProfileEditor } from '../../components/profile-editor/profile-editor';
import { ProfileMenu } from '../../components/profile-menu/profile-menu';

import type React from 'react';

import styles from './profile.module.css';

export const ProfilePage: React.FC = () => {
  return (
    <div>
      <div className={styles.root}>
        <ProfileMenu />
        <ProfileEditor />
      </div>
    </div>
  );
};
