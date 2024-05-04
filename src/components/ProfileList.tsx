import '../assets/css/profile.css';
import { useAppDispatch, useAppSelector } from '../app/hooks';

import {
  addProfile,
  deleteProfile,
  moveProfileDown,
  moveProfileUp,
  selectProfile,
  selectProfileState,
} from '../features/profiles/profileReducer';
import usePopUpToggle from '../hooks/usePopUpToggle';
import { useRef } from 'react';
import Profile from './Profile';
import useProfileEditOperation from '../hooks/useProfileEditOperation';
import EditInput from './EditInput';

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
  const {
    handleEditProfile,
    handleScroll,
    editInputRef,
    isEditInputActive,
    editInputOnChange,
    handleKeyUp,
    handleEditInputBlur,
  } = useProfileEditOperation({
    activeProfileRef,
  });

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
        {/* <input
          id="profileRename"
          className={`profile-item ${isEditInputActive ? 'show' : ''}`}
          placeholder="Enter Profile Name"
          maxLength={25}
          ref={editInputRef}
          onChange={editInputOnChange}
          onKeyUp={handleKeyUp}
          onBlur={handleEditInputBlur}
        /> */}

        <EditInput
          editInputRef={editInputRef}
          isEditInputActive={isEditInputActive}
          editInputOnChange={editInputOnChange}
          handleKeyUp={handleKeyUp}
          handleEditInputBlur={handleEditInputBlur}
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
