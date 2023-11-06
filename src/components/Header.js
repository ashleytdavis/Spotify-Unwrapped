import { Row, Col } from 'react-bootstrap'
import { React, useState } from 'react'

const Header = () => {

  const [title, setTitle] = useState('Spotify Unwind');

  return (
    <div id="header">
      <Row>
        <Col sm={12} md={12} lg={12}>
          <h1>{title}</h1>
        </Col>
      </Row>
    </div>
  )
}

export default Header