import { React, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Container, Row, Col, Button } from 'react-bootstrap'

const Login = () => {
    const [logged, setLogged] = useState(false) // Has the user logged in?
    const [inputfields, setInputFields] = useState(false);


    return (
        <div>
            <Header />
            <Container>
                <Row>
                    <Col sm={8} md={8} lg={8}>
                        <Button>Log into Spotify</Button>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    )
}

export default Login;