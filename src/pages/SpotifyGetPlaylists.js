import React, { useState } from "react";
import "../components/AlbumCard.js"
import { Container, Row, Col, Button, Form, FormControl, Carousel } from 'react-bootstrap';
import AlbumCard from "../components/AlbumCard.js";

const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";


const SpotifyGetPlaylists = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [playlistNames, setPlaylistNames] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [playlistTracks, setPlaylistTracks] = useState([]);


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


  return (
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
      <Form onSubmit={handleSubmit}>
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
                      unique_index={index}
                      id={playlist[2]}
                    />
                  </Col>
                </Carousel.Item>
              ))}
          </Carousel>
        </Form.Group>
        <Button variant="success" type="submit">
          Begin
        </Button>
      </Form>

      {/* Display fetched playlist tracks */}
      <div>
        <h3>Playlist Tracks</h3>
        <div className="tracklist">
          {playlistTracks.map((track, index) => (
            <div key={index} className="track">
              
            </div>
          ))}
        </div>
      </div>
      
    </Container>
  );
};

export default SpotifyGetPlaylists;
