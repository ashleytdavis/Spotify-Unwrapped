import React, { useState } from "react";
import "../components/AlbumCard.js"
import { Container, Row, Col, Button } from 'react-bootstrap';
import AlbumCard from "../components/AlbumCard.js";

const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";


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
        localStorage.clear();
        const data = await response.json();
        const names = data.items.map(playlist => [playlist.name, playlist.images[0].url, playlist.id]);
        setPlaylistNames(names);
        setButtonClicked(true);
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

  return (
    <div>
      <Container>
        <Row>
          <Col sm={8} md={8} lg={8}>
            {buttonClicked ? (
              null // This will make the button disappear
            ) : (
              <Button id='get-playlist-btn' variant='success' onClick={handleButtonClick}>Get Playlist Names</Button>
            )}
          </Col>
        </Row>
        <Row className="grid">
          {buttonClicked &&
            playlistNames.map((playlist, index) => (
              <AlbumCard
                key={index}
                name={playlist[0]}
                imageUrl={playlist[1]} />
            ))}
        </Row>
      </Container>
    </div>
  );
};

export default SpotifyGetPlaylists;
