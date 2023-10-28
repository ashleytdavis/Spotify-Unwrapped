import { useEffect, useState } from 'react';

const CLIENT_ID = "f0fa87358a7141a2bac1091e55d80a04"
const REDIRECT_URI = "http://localhost:3000"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"
const SPACE = "%20"
const SCOPES = ["playlist-read-private", "playlist-read-collaborative"]
const SCOPES_URL = SCOPES.join(SPACE)
const Spotify = () => {

}

export default Spotify

