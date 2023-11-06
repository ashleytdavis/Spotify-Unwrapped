import { React, useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import spotify from '../assets/spotify_icon.png';
import SpotifyGetPlaylists from '../pages/SpotifyGetPlaylists';

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

const Login = () => {
    
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

    const handleLogin = () => {
        window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL}&response_type=token&show_dialog=true`;
    };


    return (
        <div>
            <Container>
                <Row>
                    <Col sm={4} md={4} lg={3}>
                        <Button variant="dark" size="lg" onClick={handleLogin} id='login-button'>
                                Log into Spotify
                                <img src={spotify} />
                            </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Login;