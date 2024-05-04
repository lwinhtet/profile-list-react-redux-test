import '../assets/css/profile.css';
import { useAppDispatch, useAppSelector } from '../app/hooks';

import {
  addProfile,
  deleteProfile,
  moveProfileDown,
  moveProfileUp,
  renameProfile,
  selectProfile,
  selectProfileState,
} from '../features/profiles/profileReducer';
import usePopUpToggle from '../hooks/usePopUpToggle';
import { useRef, useState } from 'react';
import Profile from './Profile';

const ProfileList = () => {
  const profileListRef = useRef<HTMLDivElement | null>(null);
  const activeProfileRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const { profiles, activeProfile, activeProfileIndex } =
    useAppSelector(selectProfileState);
  const {
    ref: popupDeleteRef,
    togglePopup: toggleDeletePopup,
    isOpen: isDeletePopupOpen,
    setIsOpen: setIsDeletePopupOpen,
  } = usePopUpToggle();
  const [isEditInputActive, setIsEditInputActive] = useState(false);
  const [previousName, setPreviousName] = useState<string>('');
  const editInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectProfile = (id: number) => {
    dispatch(selectProfile(id));
  };

  const handleAddProfile = () => {
    dispatch(addProfile());
    setTimeout(() => {
      if (profileListRef.current) {
        profileListRef.current.scrollTo({
          top: profileListRef.current.scrollHeight,
          behavior: 'instant',
        });
      }
    }, 0);
  };

  const handleDeleteProfile = () => {
    dispatch(deleteProfile(activeProfile?.id));
    setIsDeletePopupOpen(false);
  };

  const handleMoveUp = () => {
    if (activeProfileIndex === undefined || activeProfileIndex === null) {
      throw new Error('error in handleMoveUp method');
    }

    if (activeProfileIndex > 0) {
      dispatch(moveProfileUp());
    }
  };

  const handleMoveDown = () => {
    if (activeProfileIndex === undefined || activeProfileIndex === null) {
      throw new Error('error in handleMoveUp method');
    }

    if (activeProfileIndex < profiles.length - 1) {
      dispatch(moveProfileDown());
    }
  };

  const handleEditProfile = () => {
    if (isEditInputActive) {
      // if already active
      saveAndClose();
      return;
    }
    // if not active
    setPreviousName(activeProfile!.name);
    setIsEditInputActive(true);
    const input = editInputRef.current as HTMLInputElement;
    input.value = activeProfileRef.current?.innerHTML as string;
    input.style.top = activeProfileRef.current?.offsetTop + 'px';
    setTimeout(() => {
      input.focus();
      input.select();
    }, 0);
  };

  const resetEditInput = () => {
    editInputRef.current!.value = '';
  };

  const saveAndClose = () => {
    const newName = editInputRef.current?.value.trim();
    if (newName === '' || newName === undefined) {
      escapeAndClose();
      return;
    }

    dispatch(renameProfile(newName as string));
    setPreviousName(newName);
    resetEditInput();
    setIsEditInputActive(false);
  };

  const escapeAndClose = () => {
    resetEditInput();
    setIsEditInputActive(false);
    liveUpdate(previousName);
  };

  const editInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    liveUpdate(event.target.value.trim());
  };

  const liveUpdate = (value: string) => {
    document.getElementById('eqTitle')!.innerText = value
      ? value
      : previousName;
  };

  const handleScroll = () => {
    saveAndClose();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.key === 'Enter') {
      saveAndClose();
    } else if (event.key === 'Escape') {
      escapeAndClose();
    } else {
      liveUpdate(event.currentTarget.value);
    }
  };

  const handleEditInputBlur = () => {
    // saveAndClose();
    handleEditProfile();
    setIsEditInputActive(false);
  };

  return (
    <div id="profileWrapper" className="drawer-select flex">
      <div
        id="profileList"
        className="scrollable"
        ref={profileListRef}
        onScroll={handleScroll}
      >
        {profiles.map((profile) => (
          <Profile
            key={profile.id}
            profile={profile}
            activeProfile={activeProfile}
            activeProfileRef={activeProfileRef}
            handleSelectProfile={handleSelectProfile}
          />
        ))}

        <input
          id="profileRename"
          className={`profile-item ${isEditInputActive ? 'show' : ''}`}
          placeholder="Enter Profile Name"
          maxLength={25}
          ref={editInputRef}
          onChange={editInputOnChange}
          onKeyUp={handleKeyUp}
          onBlur={handleEditInputBlur}
        />
      </div>
      <div className="toolbar flex">
        <div
          className="icon add"
          id="profileAdd"
          onClick={handleAddProfile}
        ></div>
        {!activeProfile?.default && (
          <>
            <div
              className={`icon edit ${activeProfile?.default ? '' : 'show'}`}
              id="profileEdit"
              onClick={handleEditProfile}
            ></div>

            <div
              className={`icon delete ${activeProfile?.default ? '' : 'show'}`}
              id="profileDelete"
              onClick={toggleDeletePopup}
            ></div>
          </>
        )}

        <div
          className={`icon down ${
            activeProfileIndex === profiles.length - 1 ? 'disabled' : ''
          }`}
          id="profileDown"
          onClick={handleMoveDown}
        ></div>
        <div
          className={`icon up ${activeProfileIndex === 0 ? 'disabled' : ''}`}
          id="profileUp"
          onClick={handleMoveUp}
        ></div>
      </div>
      <div
        id="profileDelCfm"
        className={`profile-del alert flex ${isDeletePopupOpen ? 'show' : ''}`}
        ref={popupDeleteRef}
      >
        <div className="title">delete eq</div>
        <div className="body-text t-center" id="delName">
          {activeProfile?.name || ''}
        </div>
        <div className="thx-btn" id="cfmDelete" onClick={handleDeleteProfile}>
          delete
        </div>
      </div>
    </div>
  );
};

export default ProfileList;
