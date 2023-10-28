import { React, useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
//import '../Spotify'
import { Container, Row, Col, Button } from 'react-bootstrap'

const CLIENT_ID = "f0fa87358a7141a2bac1091e55d80a04"
const REDIRECT_URI = "http://localhost:3000/rewrapped"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"
const SPACE = "%20"
const SCOPES = ["playlist-read-private", "playlist-read-collaborative"];
const SCOPES_URL = SCOPES.join(SPACE)

const Login = () => {
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