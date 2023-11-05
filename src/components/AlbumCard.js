import { Col, Row, Modal, Button, Container } from "react-bootstrap"
import { useState } from 'react';

const AlbumCard = ({ name, imageUrl, index }) => {
    return (
        <Col md={3} lg={3} key={index}>
            <img src={imageUrl} alt="album cover" />
            <h5>{name}</h5>
        </Col>
    );
}

export default AlbumCard;