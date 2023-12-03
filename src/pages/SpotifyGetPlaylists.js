import React, { useState, useEffect } from "react";
import "../components/AlbumCard.js"
import { Container, Row, Col, Button, Form, Carousel, Modal } from 'react-bootstrap';
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
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);
  // New state variable to track whether the user has won
  const [hasWon, setHasWon] = useState(false);

  const handleClose = () => { setShow(false) };
  const handleReplay = () => {
    //window.location.reload();
    setButtonClicked(false);
    setCount(0);
    setShow(false);
    setGameBegin(false);
    handleButtonClick();
    setHasWon(false);
    setGuessedSongs({});
    handleButtonClick();
  }

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
    } else {
      // Increment count for incorrect guesses
      setCount(count + 1);

      // Check if the game is over
      if (count + 1 === 3) {
        // Handle game over logic here
        setShow(true);
      }
    }

    // Check if all songs are guessed correctly and handle accordingly
    if (Object.values(guessedSongs).every((guessed) => guessed)) {
      setHasWon(true);
    }

    setInputValue('');
  };

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
        setHasWon(false);
        setCount(0);
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
          artist: item.track.artists[0].name,
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
  }, [])

  const handleWin = () => {
    console.log('You win!');
    setHasWon(true);
    // You can add further actions here if needed
  };

  useEffect(() => {
    // Check if all songs are guessed correctly
    if (gamebegin && Object.values(guessedSongs).every((guessed) => guessed)) {
      // Check if the user has not already won
      if (!hasWon) {
        handleWin();
      }
    }
  }, [guessedSongs, gamebegin, hasWon]);


  const handleLogin = (e) => {
    e.preventDefault();
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL}&response_type=token&show_dialog=true`;
  };

  return (
    <Container>

      {/* Initial Screen that Appears when Loading In! */}
      {!buttonClicked ? (

        <div id="login-area">

          <Button variant="dark" size="lg" onClick={handleLogin} id='login-button'>
            Log into Spotify
            <img src={spotify} alt="spotify logo" />
          </Button>

          <Button id='get-playlist-btn' variant='success' size="md" onClick={handleButtonClick}>
            Begin
          </Button>


        </div>)
        : (null)
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
                    artist={track.artist}
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
                name="guess"
                onChange={handleInputChange}
                required
              />
              <Button variant="success" type="submit">
                Submit
              </Button>


              {gamebegin && count > 0 && count < 3 && (
                <div className="strike-indicator">
                  {Array.from({ length: count }, (_, index) => (
                    <span key={index} className="strike">X </span>
                  ))}
                </div>
              )}
            </Form>
          </div>
        </div>
      ) : (null)
      }



      {
        show && (
          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>You Lose!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Better luck next time!</Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleReplay}>
                Play Again
              </Button>
            </Modal.Footer>
          </Modal>)
      }


      {
        count < 3 && hasWon && Object.values(guessedSongs).length === playlistTracks.length && (
          <Modal show={hasWon} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>You Win!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Congratulations! You know your music well!</Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleReplay}>
                Play Again
              </Button>
            </Modal.Footer>
          </Modal>
        )
      }



    </Container >
  );
};

export default SpotifyGetPlaylists;
