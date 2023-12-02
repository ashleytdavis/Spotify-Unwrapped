import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../src/components/Header.js'
import SpotifyGetPlaylists from './pages/SpotifyGetPlaylists';

const CLIENT_ID = "f0fa87358a7141a2bac1091e55d80a04";
const CLIENT_SECRET = "";

function App() {
  return (
    <div className="App">
      <Header />
      
      <br />
      <SpotifyGetPlaylists />
      <br />
    </div>
  );
}

export default App;
