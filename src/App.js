import './App.css';
import GetPlaylist from './pages/SpotifyGetPlaylists';
import Login from './pages/Login'
import SpotifyGetPlaylists from './pages/SpotifyGetPlaylists';

const CLIENT_ID = "f0fa87358a7141a2bac1091e55d80a04";
const CLIENT_SECRET = "";

function App() {
  return (
    <div className="App">
      <Login />
      <SpotifyGetPlaylists />
    </div>
  );
}

export default App;
