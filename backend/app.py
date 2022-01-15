import sys
from flask import Flask, jsonify
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS
import time
import threading
from six.moves import input
import json

rood = "0"
blauw = "0"
tiebrake_rood = 0
tiebrake_blauw = 0
set_rood = 0
set_blauw = 0
game_rood = 0
game_blauw = 0
naam_blauw = "Team Blauw"
naam_rood = "Team Rood"

game1_rood = 0
game2_rood = 0
game3_rood = 0
game1_blauw = 0
game2_blauw = 0
game3_blauw = 0

total_sets = 0
tiebrake = False

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

def check_set():
    global set_blauw,set_rood
    if set_rood == 2:
        print("rood wint")
    if set_blauw == 2:
        print("blauw wint")
    socketio.emit("B2F_verandering_set", {'red':  set_rood, "blue": set_blauw })

def check_game():
    global game_rood,game_blauw,set_rood,set_blauw,tiebrake
    if game_blauw == 6 and game_rood == 6:
        tiebrake = True
        print("tiebrake")
    elif game_blauw == 6:
        if game_rood < game_blauw-1:
            game_rood = 0
            game_blauw = 0
            set_blauw += 1
            check_set()
    elif game_rood == 6:
        if game_blauw < game_rood-1:
            game_rood = 0
            game_blauw = 0
            set_rood += 1
            check_set()
    socketio.emit("B2F_verandering_game", {'red':  game_rood, "blue": game_blauw })

def menu(keuze):
    global rood,blauw,set_blauw,set_rood,game_rood,game_blauw,tiebrake_blauw,tiebrake_rood,tiebrake
    if tiebrake:
        print("tiebrake")
        if keuze == 1:
            tiebrake_rood += 1
            if tiebrake_rood >= 7 and tiebrake_blauw < tiebrake_rood-1:
                tiebrake_rood=0
                tiebrake_blauw=0
                game_blauw = 0
                game_rood = 0
                set_rood += 1
                check_set()
                tiebrake = False
        elif keuze == 2:
            tiebrake_blauw += 1
            if tiebrake_blauw >= 7 and tiebrake_rood < tiebrake_blauw-1:
                tiebrake_rood=0
                tiebrake_blauw=0
                game_blauw = 0
                game_rood = 0
                set_blauw += 1
                check_set()
                tiebrake= False
        socketio.emit("B2F_verandering_punten", {'red':  tiebrake_rood, "blue": tiebrake_blauw })
    else:
        if keuze == 1:
            # rood += 15
            if rood == "adv":
                rood = "0"
                blauw = "0"
                game_rood += 1
                check_game()
            elif blauw == "40" and rood == "40":
                # rood = "advantage"
                rood = "adv"
            elif rood == "40" and blauw == "adv":
                blauw = "40"
            elif rood == "40":
                rood = "0"
                blauw = "0"
                game_rood += 1
                check_game()
            elif rood == "30":
                rood = "40"
            elif rood == "15":
                rood = "30"
            else:
                rood = "15"
            socketio.emit("B2F_verandering_punten", {'red':  rood, "blue": blauw })
            print("item sent")
        elif keuze == 2:
            if blauw == "adv":
                rood = "0"
                blauw = "0"
                game_blauw += 1
                check_game()
            elif blauw == "40" and rood == "40":
                blauw = "adv"
                # blauw = "advantage"
            elif blauw == "40" and rood == "adv":
                rood = "40"
            elif blauw == "40":
                rood = "0"
                blauw = "0"
                game_blauw += 1
                check_game()
            elif blauw == "30":
                blauw = "40"
            elif blauw == "15":
                blauw = "30"
            else:
                blauw = "15"
            # blauw += 15

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
            # print(keuze)
            menu(keuze)
        except Exception as ex:
            print(ex)
            

if __name__ == '__main__':
    x = threading.Thread(target=run, args=())
    x.start()

    socketio.run(app, debug=False, host='0.0.0.0')

    
    