const SongCard = ({ name, imageUrl, id }) => {
    return (
        <div className="song-box">
            <img src={imageUrl} alt="album cover" />
            <h5>{name}</h5>
        </div>
    );
}

export default SongCard;