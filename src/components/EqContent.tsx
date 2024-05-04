import { useAppSelector } from '../app/hooks';
import { selectProfileState } from '../features/profiles/profileReducer';

const EqContext = () => {
  const { activeProfile } = useAppSelector(selectProfileState);
  return (
    <div className="sub-title flex">
      <h1 id="eqTitle" className="eq-title">
        {activeProfile?.name || ''}
      </h1>
    </div>
  );
};

export default EqContext;
