const SongCard = ({ name, imageUrl, id, artist }) => {
    return (
        <div className="song-box">
            <img src={imageUrl} alt="album cover" />
            <div className="song-data">
                <h5>{name}</h5>
                <h6>By {artist}</h6>
            </div>
        </div>
    );
}

export default SongCard;