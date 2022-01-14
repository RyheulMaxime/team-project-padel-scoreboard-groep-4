from flask import Flask, jsonify
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS
import time
import threading

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Hier mag je om het even wat schrijven'

socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

@app.route('/')
def hallo():
    return "Server is running, er zijn momenteel geen API endpoints beschikbaar."

@socketio.on('connect')
def connect():
    print("A new client connects")
    # socketio.emit("B2F_status_lampen", {'lampen': status})


if __name__ == '__main__':
    # socketio.run(app, debug=True, host='0.0.0.0')
    
    # Zet de debug op False zodat de threading correct werkt.
    socketio.run(app, debug=False, host='0.0.0.0')