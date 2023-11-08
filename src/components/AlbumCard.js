import { Col } from "react-bootstrap"

const AlbumCard = ({ name, imageUrl, id }) => {
    {/*
    return (
        <div className="album-box" onClick={() => onClick(id)}>
            <img src={imageUrl} alt="album cover" />
            <h5>{name}</h5>
        </div>
    );  
    */}
    return (
        <div className="album-box">
            <img src={imageUrl} alt="album cover" />
            <h5>{name}</h5>
        </div>
    );
}

export default AlbumCard;