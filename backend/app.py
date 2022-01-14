import sys
from flask import Flask, jsonify
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS
import time
import threading
from six.moves import input
import json

rood = 0
blauw = 0
set_rood = 0
set_blauw = 0
game1_rood = 0
game2_rood = 0
game3_rood = 0
game1_blauw = 0
game2_blauw = 0
game3_blauw = 0
naam_blauw = "Team Blauw"
naam_rood = "Team Rood"


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
    # run()

def menu(keuze):
    global rood,blauw,set_blauw,set_rood
    if keuze == 1:
        rood += 15
        socketio.emit("B2F_verandering_punten", {'red':  rood, "blue": blauw })
        print("item sent")
    if keuze == 2:
        if blauw == 45:

        blauw += 15
        socketio.emit("B2F_verandering_punten", {'red':  rood, "blue": blauw })
        print("item sent")
    if keuze == 9:
        exit() 
 

def run():    
    keuze = 0    
    while keuze  != 9:                
        print("Maak uw keuze:")        
        print("1. punt rood")        
        print("2. punt blauw")                
        print("9. Exit")        
        try:
            keuze = int(input())
            print(keuze)
            menu(keuze)
        except Exception as ex:
            print(ex)
            

if __name__ == '__main__':
    x = threading.Thread(target=run, args=())
    x.start()

    socketio.run(app, debug=False, host='0.0.0.0')

    
    