import React, { MutableRefObject, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  renameProfile,
  selectProfileState,
} from '../features/profiles/profileReducer';

type useProfileEditOperationType = {
  activeProfileRef: MutableRefObject<HTMLDivElement | null>;
};

const useProfileEditOperation = ({
  activeProfileRef,
}: useProfileEditOperationType) => {
  const dispatch = useAppDispatch();
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditInputActive, setIsEditInputActive] = useState(false);
  const [previousName, setPreviousName] = useState<string>('');
  const { activeProfile } = useAppSelector(selectProfileState);

  const handleEditProfile = () => {
    if (isEditInputActive) {
      // if already active
      saveAndClose();
      return;
    }
    // if not active
    setPreviousName(activeProfile!.name);
    setIsEditInputActive(true);
    const input = editInputRef?.current as HTMLInputElement;
    input.value = activeProfileRef.current?.innerHTML as string;
    input.style.top = activeProfileRef.current?.offsetTop + 'px';
    setTimeout(() => {
      input.focus();
      input.select();
    }, 0);
  };

  const resetEditInput = () => {
    editInputRef!.current!.value = '';
  };

  const saveAndClose = () => {
    const newName = editInputRef?.current?.value.trim();
    if (newName === '' || newName === undefined) {
      escapeAndClose();
      return;
    }
    resetEditInput();
    dispatch(renameProfile(newName as string));
    setPreviousName(newName);
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
    resetEditInput();
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

  return {
    editInputRef,
    isEditInputActive,
    handleEditProfile,
    editInputOnChange,
    handleScroll,
    handleKeyUp,
    handleEditInputBlur,
  };
};

export default useProfileEditOperation;
