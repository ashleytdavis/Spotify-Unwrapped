from flask import Flask, request, jsonify
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

app = Flask(__name__)

client_id = "58359343c27240ac9df7338477111e8d"
client_secret = 

@app.route('/fetch_tracks', methods=['Post'])
def fetch_tracks():
    data = request.json 
    playlist_id = data.get('playlist_id')

    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    results = sp.playlist_tracks(playlist_id)
    
    return jsonify({'tracks': results})


if __name__ == '__main__':
    app.run(debug=True, port=3000)