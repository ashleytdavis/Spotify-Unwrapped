import { Col } from "react-bootstrap"

const AlbumCard = ({ name, imageUrl, index }) => {
    return (
        <Col sm={6} md={3} lg={4} key={index}>
            <div className="album-box">
                <img src={imageUrl} alt="album cover" />
                <h5>{name}</h5>
            </div>
        </Col >
    );
}

export default AlbumCard;