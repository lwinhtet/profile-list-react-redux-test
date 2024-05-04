import React from 'react';
import { ProfileType } from '../features/profiles/profileReducer';

type ProfileT = {
  profile: ProfileType;
  activeProfile: ProfileType | undefined;
  activeProfileRef: React.MutableRefObject<HTMLDivElement | null>;
  handleSelectProfile: (id: number) => void;
};

const Profile = ({
  profile,
  activeProfile,
  activeProfileRef,
  handleSelectProfile,
}: ProfileT) => {
  const id = profile.default ? `profile${profile.id}` : `custom${profile.id}`;

  const classNames = `profile-item ${profile.icon} ${
    activeProfile?.id === profile.id ? 'active' : ''
  }`;

  return (
    <div
      key={profile.id}
      id={id}
      className={classNames}
      onClick={() => handleSelectProfile(profile.id)}
      ref={profile.id === activeProfile?.id ? activeProfileRef : null}
    >
      {profile.name}
    </div>
  );
};

export default Profile;
