import { MutableRefObject } from 'react';

type EditInputType = {
  editInputRef: MutableRefObject<HTMLInputElement | null>;
  isEditInputActive: boolean;
  editInputOnChange: React.ChangeEventHandler<HTMLInputElement>;
  handleKeyUp: React.KeyboardEventHandler<HTMLInputElement>;
  handleEditInputBlur: () => void;
};

const EditInput = ({
  editInputRef,
  isEditInputActive,
  editInputOnChange,
  handleKeyUp,
  handleEditInputBlur,
}: EditInputType) => {
  return (
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
  );
};

export default EditInput;
