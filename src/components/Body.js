import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'

const Body = () => {
    return (
        <div id="body">
            <Row>
                <Col sm={8} md={8} lg={8}>
                    <Button>Log into Spotify</Button>
                </Col>
            </Row>
        </div>
    )
}

export default Body;