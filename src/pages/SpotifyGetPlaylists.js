import React, { useState, useEffect } from "react";
import "../components/AlbumCard.js"
import { Container, Row, Col, Button, Form, Carousel } from 'react-bootstrap';
import AlbumCard from "../components/AlbumCard.js";
import SongCard from "../components/SongCard.js";
import spotify from '../assets/spotify_icon.png';

const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

const CLIENT_ID = "58359343c27240ac9df7338477111e8d"
const REDIRECT_URI = "http://localhost:3000/rewrapped"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"
const SPACE = "%20"
const SCOPES = ["playlist-read-private", "playlist-read-collaborative",];
const SCOPES_URL = SCOPES.join(SPACE)

/* http://localhost:3000/rewrapped#access_token=BQD2ZBEy4ENbQKZUwlvJdCPMmAtcu8OFuaCPwrCLhre3WWQZC8BEZXzB6wLxzc1X4ZtCnnRsk0VjRuwABFzrcM2OC2j81CK3HqzvSArucGhyaUVN0nZXW-MpyqVyxn1R9PU7lkS5jSJVHUE_etGchciTPyvnqSHGaAQedADSGvnJKYfd5M8hPrvRVzpkRwc-Gb6evQZ4We74yALzZwk&token_type=Bearer&expires_in=3600*/
const getReturnedParamsFromSpotify = (hash) => {
  const stringAfterHashtag = hash.substring(1);
  const paramsInUrl = stringAfterHashtag.split('&');
  const paramsSplit = paramsInUrl.reduce((accumulater, currentValue) => {
    console.log(currentValue);
    const [key, value] = currentValue.split("=");
    accumulater[key] = value;
    return accumulater;
  }, {});

  return paramsSplit;
};



const SpotifyGetPlaylists = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [playlistNames, setPlaylistNames] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [gamebegin, setGameBegin] = useState(false);


  // Variables to handle guessing capabilities
  const [guessedSongs, setGuessedSongs] = useState({ songName: false });
  const [inputValue, setInputValue] = useState('')
  const [showWinText, setShowWinText] = useState(false);


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSongGuess = (songName) => {
    const updatedGuessedSongs = { ...guessedSongs, [songName]: true };
    setGuessedSongs(updatedGuessedSongs);
    setInputValue('');
  };

  const handleSubmitGuess = (e) => {
    e.preventDefault();
    // Check if the guessed song is correct and handle accordingly
    const selectedSong = playlistTracks.find((track) => track.name === inputValue);
    if (selectedSong) {
      handleSongGuess(selectedSong.name);
    }

    if (Object.values(guessedSongs).every((guessed) => guessed)) {
      setShowWinText(true);
    }
  };

  /*
  useEffect(() => {
    // Check if all songs have been guessed
    if (Object.values(guessedSongs).every((guessed) => guessed)) {
      setShowWinText(true);
    }
  }, [guessedSongs]);
*/




  const handleButtonClick = async () => {
    try {
      const response = await fetch(PLAYLISTS_ENDPOINT, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        localStorage.clear();
        const data = await response.json();
        const names = data.items.map(playlist => [playlist.name, playlist.images[0].url, playlist.id]);
        setPlaylistNames(names);
        setButtonClicked(true);
        setGuessedSongs({}); // Reset guessedSongs when selecting a new playlist
        setShowWinText(false);
      } else {
        if (response.status === 401) {
          // Handle unauthorized access
        }
        console.error('Error fetching user playlists');
      }
    } catch (error) {
      console.error('Error fetching user playlists:', error);
    }
  };

  const handleFetchTracks = async () => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${selectedAlbumId}/tracks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const tracks = data.items.map(item => ({
          name: item.track.name,
          artwork: item.track.album.images[0].url,
        }));

        console.log('Playlist Tracks:', tracks);

        setPlaylistTracks(tracks);

      } else {
        console.error('Error fetching playlist tracks');
      }
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAlbumId) {
      setGameBegin(true);
      handleFetchTracks();
    } else {
      console.error('No playlist selected');
    }
  };

  const handleSelect = selectedIndex => {
    // Check if playlistNames is not empty and the selected index is valid
    if (playlistNames.length > 0 && selectedIndex >= 0 && selectedIndex < playlistNames.length) {
      setSelectedAlbumId(playlistNames[selectedIndex][2]);
    } else {
      console.error('Invalid selectedIndex or playlistNames array is empty.');
    }
  }

  useEffect(() => {
    if (window.location.hash) {
      const { access_token, expires_in, token_type, } = getReturnedParamsFromSpotify(window.location.hash);
      localStorage.clear();
      localStorage.removeItem("accessToken");
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("tokenType", token_type);
      localStorage.setItem("expiresIn", expires_in);
    }
  })

  const handleLogin = (e) => {
    e.preventDefault();
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL}&response_type=token&show_dialog=true`;
  };

  return (
    <Container>

      {/* Initial Screen that Appears when Loading In! */}
      {!buttonClicked ? (
        <Row>
          <Col sm={12} md={6} lg={6} id="login-area">
            <Row>
              <Col sm={4} md={4} lg={3}>
                <Button variant="dark" size="lg" onClick={handleLogin} id='login-button'>
                  Log into Spotify
                  <img src={spotify} alt="spotify logo" />
                </Button>
              </Col>
            </Row>
            <Row>
              <Col sm={4} md={4} lg={3}>
                <Button id='get-playlist-btn' variant='success' onClick={handleButtonClick}>Begin</Button>
              </Col>
            </Row>
          </Col>
          <Col sm={12} md={6} lg={6} id="rule-area">
            <h5>How to Play:</h5>
            <ol>
              <li>Select a playlist</li>
            </ol>
          </Col>
        </Row>) : (null)
      }


      {
        buttonClicked && !gamebegin ? (<Form onSubmit={handleSubmit}>
          <Form.Group controlId="playlistSelect">
            <Form.Label>Select a playlist</Form.Label>
            <Carousel onSelect={handleSelect}>
              {buttonClicked &&
                playlistNames.map((playlist, index) => (
                  <Carousel.Item>
                    <Col sm={6} md={4} lg={4}>
                      <AlbumCard
                        name={playlist[0]}
                        imageUrl={playlist[1]}
                        id={playlist[2]}
                      />
                    </Col>
                  </Carousel.Item>
                ))}
            </Carousel>
          </Form.Group>
          <Button variant="success" type="submit">
            Select
          </Button>
        </Form>) : (null)
      }





      {gamebegin ? (
        <div>
          <h3>Can you guess all of the tracks in this playlist?</h3>
          <div className="tracklist">
            {playlistTracks.map((track, index) => (
              <Row sm={12} md={12} lg={12}>
                <div className={`track ${guessedSongs[track.name] ? 'guessed' : 'not-guessed'}`}>
                  <SongCard
                    name={track.name}
                    imageUrl={track.artwork}
                    id={track.name}
                  />
                </div>
              </Row>
            ))}
          </div>

          <div className="fixed-guessing">
            <Form onSubmit={handleSubmitGuess} className="submit-form">
              <Form.Control
                type="text"
                placeholder="Type the song name"
                value={inputValue}
                onChange={handleInputChange}
              />
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </div>
        </div>
      ) : (null)
      }

      {showWinText && (
        <div className="win-text">
          <p>Congratulations! You've guessed all the songs! 🎉</p>
        </div>
      )}



    </Container >
  );
};

export default SpotifyGetPlaylists;
