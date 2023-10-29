import React, { useState } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';

const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
const CLIENT_ID = "58359343c27240ac9df7338477111e8d";
const REDIRECT_URI = "http://localhost:3000/rewrapped";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";

const SpotifyGetPlaylists = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [playlistNames, setPlaylistNames] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleButtonClick = async () => {
    try {
      const response = await fetch(PLAYLISTS_ENDPOINT, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const names = data.items.map(playlist => playlist.name);
        setPlaylistNames(names); // Update state with fetched playlist names
        setButtonClicked(true);
      } else {
        if (response.status === 401) {
          // Handle unauthorized access (expired token or other authentication issues)
        }
        console.error('Error fetching user playlists');
      }
    } catch (error) {
      console.error('Error fetching user playlists:', error);
    }
  };

  return (
    <div>
      <Container>
        <Row>
          <Col sm={8} md={8} lg={8}>
            <Button onClick={handleButtonClick}>Get Playlist Names</Button>
            {buttonClicked && (
              <div>
                <h2>Playlist Names</h2>
                  {playlistNames.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SpotifyGetPlaylists;
