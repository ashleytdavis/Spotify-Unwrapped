import { React, useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
//import '../Spotify'
import { Container, Row, Col, Button } from 'react-bootstrap'

const CLIENT_ID = "58359343c27240ac9df7338477111e8d"
const REDIRECT_URI = "http://localhost:3000/rewrapped"
const CLIENT_SECRET = "889b29e34e154cd9956319a52f8dcd4f"
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
        if(window.location.hash) {
           const {access_token, expires_in, token_type,} = getReturnedParamsFromSpotify(window.location.hash);

           localStorage.clear()
           localStorage.setItem("accessToken", access_token);
           localStorage.setItem("tokenType", token_type);
           localStorage.setItem("expiresIn", expires_in);
           
        }
    })
    //const [logged, setLogged] = useState(false) // Has the user logged in?
    //const [inputfields, setInputFields] = useState(false);
    
    const handleLogin = () => {
        window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL}&response_type=token&show_dialog=true`;
    };


    return (
        <div>
            <Header />
            <Container>
                <Row>
                    <Col sm={8} md={8} lg={8}>
                        <button onClick = {handleLogin}>Log into Spotify</button>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    )
}

export default Login;