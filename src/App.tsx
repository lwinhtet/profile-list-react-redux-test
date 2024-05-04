import '../src/assets/fonts/roboto.css';
import '../src/assets/fonts/razerf5.css';
import './App.css';
import '../src/assets/css/main.css';
import '../src/assets/css/tooltip.css';
import '../src/assets/js/main.js';
import EqContext from './components/EqContent';
import ProfileList from './components/ProfileList';

function App() {
  return (
    <div className="main-container">
      <div className="thx-wrapper flex">
        <div className="thx-drawer flex">
          <div className="main-title">Profile List</div>

          <ProfileList />
        </div>

        <div className="thx-window">
          <EqContext />
        </div>
      </div>
    </div>
  );
}

export default App;
