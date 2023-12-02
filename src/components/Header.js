import { Row, Col } from 'react-bootstrap'
import { React } from 'react'
import spotify from '../assets/spotify_unwrapped.png'

const Header = () => {


  return (
    <div id="header">
      <Row>
        <Col sm={12} md={12} lg={12}>
          <img src={spotify} alt="website title"/> 
        </Col>
      </Row>
    </div>
  )
}

export default Header