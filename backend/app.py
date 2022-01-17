from ctypes.wintypes import PINT
# from socket import socket
import sys
from traceback import print_last
# from flask import Flask, jsonify
# from flask_socketio import SocketIO, send, emit
# from flask_cors import CORS
import pandas
# import aedes
# from aedes.remote_sensing_utils import get_satellite_measures_from_AOI, reverse_geocode_points, reverse_geocode_points
# from aedes.remote_sensing_utils import perform_clustering, visualize_on_map
import time
import threading
from six.moves import input
import paho.mqtt.client as mqtt
import json

point_rood = "0"
point_blauw = "0"
tiebrake_rood = 0
tiebrake_blauw = 0
set_rood = 0
set_blauw = 0
game_rood = 0
game_blauw = 0
naam_blauw = "Team Blauw"
naam_rood = "Team Rood"

game1 = {}
game2 = {}
game3 = {}

total_sets = 0
tiebrake = False


last_points=[]

# red first then blue
previous_game=[0,0]
previous_points=["0","0"]
previous_tiebrake=[0,0]

# app = Flask(__name__)
# app.config['SECRET_KEY'] = 'Hier mag je om het even wat schrijven'

# socketio = SocketIO(app, cors_allowed_origins="*")
# CORS(app)

# mqtt broker **********************************************************************************************************************
def send_message(message):
    # data = 'pi hier'
    client.publish("/veld1", message)

def send_scorebord(message):
    # data = 'pi hier'
    client.publish("/scorebord1", message)

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc)) #als er een connectie is 
    client.subscribe("/veld1") #subscribe met een topic
    client.subscribe("/scorebord1") #subscribe met een topic

def on_message(client, userdata, msg):
    if msg.topic == "/veld1":
        print(msg.topic + " " + str(msg.payload.decode('utf-8'))) #als er iemand een bericht in de broker stuurt naar deze topic
        print("**")
        bericht = msg.payload.decode("utf-8")
        # dict = json.loads(bericht)
        print(bericht) 
        # print(dict) 

        if bericht == "connect":
            send_message("check")
        if bericht == "startgame":
            pass
        if bericht == "teamblauw":
            chose_side("blauw")
            # print("blauw")
        if bericht == "teamrood":
            chose_side("rood")
            # print("rood")
        if bericht == "puntrood":
            # menu(1)
            send_scorebord("rood")
        if bericht == "puntblauw":
            send_scorebord("blauw")
    

client = mqtt.Client() #maak een nieuwe mqtt client aan
def run_mqtt():
    # print("connecting")
    
    client.on_connect = on_connect 
    client.on_message = on_message
    # client.connect('172.30.248.57', 1883, 60) #geef hier het IP adres in
    client.connect('127.0.0.1', 1883, 60) #geef hier het IP adres in
    # send_scorebord("blauw")
    client.loop_forever()

# code met socket**************************************************************************************************************
# @app.route('/')
# def hallo():
#     return "Server is running, er zijn momenteel geen API endpoints beschikbaar."

# @socketio.on('connect')
# def connect():
#     print("A new client connects")

def chose_side(kleur):
    Json = {"type" : "opslag", "side" : kleur}
    # print(Json)
    message = json.dumps(Json)
    # print(message)
    send_scorebord(message)

    # socketio.emit("B2F_opstart_opslag", {'opslag':  kleur})

def nieuw_game():
    global tiebrake,total_sets,game1,game2,game3,game_blauw,game_rood,set_blauw,set_rood,point_rood,point_blauw,tiebrake_blauw,tiebrake_rood,previous_game,previous_points,previous_tiebrake
    tiebrake = False
    total_sets = 0
    game1 = 0
    game2 = 0
    game3 = 0
    game_blauw = 0
    game_rood = 0
    set_rood = 0
    set_blauw = 0
    tiebrake_blauw = 0
    tiebrake_rood = 0
    point_rood = "0"
    point_blauw = "0"
    # socketio.emit("B2F_verandering_punten", {'red':  point_rood, "blue": point_blauw })
    # socketio.emit("B2F_verandering_game", {'red':  game_rood, "blue": game_blauw })
    # socketio.emit("B2F_verandering_set", {'red':  set_rood, "blue": set_blauw })
    # socketio.emit("B2F_punten", )
    previous_game[game_rood,game_blauw]
    previous_points=[point_rood,point_blauw]
    previous_tiebrake=[tiebrake_rood,tiebrake_blauw]
    
def check_set(rood,blauw):
    global set_blauw,set_rood,total_sets,game1,game2,game3
    total_sets += 1
    if total_sets == 1:
        game1 = {'red': rood, "blue": blauw }
        print(game1)
    elif total_sets == 2:
        game2 = {'red': rood, "blue": blauw }
        print(game1)
        print(game2)
    elif total_sets == 3:
        game3 = {'red': rood, "blue": blauw }
        print(game1)
        print(game2)
        print(game3)
    if set_rood == 2:
        print("rood wint")
    if set_blauw == 2:
        print("blauw wint")
    # socketio.emit("B2F_verandering_set", {'red':  set_rood, "blue": set_blauw })

def check_game():
    global game_rood,game_blauw,set_rood,set_blauw,tiebrake,previous_game,point_rood,point_blauw
    # print(game_rood , " " , game_blauw)
    if game_blauw == 6 and game_rood == 6:
        tiebrake = True
        print("tiebrake")
        # socketio.emit("B2F_tiebrake", )
    elif game_blauw >= 6:
        if game_rood < game_blauw-1:
            set_blauw += 1
            check_set(game_rood,game_blauw)
            previous_game = [game_rood,game_blauw]
            game_rood = 0
            game_blauw = 0
    elif game_rood >= 6:
        if game_blauw < game_rood-1:
            # print(game_rood , " " , game_blauw)
            set_rood += 1
            check_set(game_rood,game_blauw)
            previous_game = [game_rood,game_blauw]
            game_rood = 0
            game_blauw = 0
    # socketio.emit("B2F_verandering_game", {'red':  game_rood, "blue": game_blauw })

def remove_point():
    global last_points,point_rood,point_blauw,game_rood,game_blauw,set_rood,set_blauw,tiebrake_rood,tiebrake_blauw,tiebrake,previous_tiebrake,previous_game,previous_points
    print(last_points[-1])
    if tiebrake == True:
        if last_points[-1] == "red":
            if tiebrake_rood != 0:
                tiebrake_rood -= 1
            else:
                point_rood = previous_points[0]
                point_blauw = previous_points[1]
                game_rood = previous_game[0]
                game_blauw = previous_game[1]

                tiebrake = False
                # socketio.emit("B2F_punten", )
                # socketio.emit("B2F_verandering_game", {'red':  game_rood, "blue": game_blauw })
        elif last_points[-1] == "blue":
            if tiebrake_blauw != 0:
                tiebrake_blauw -= 1
            else:
                point_rood = previous_points[0]
                point_blauw = previous_points[1]
                game_rood = previous_game[0]
                game_blauw = previous_game[1]
                tiebrake = False
                # socketio.emit("B2F_punten", )
        #         socketio.emit("B2F_verandering_game", {'red':  game_rood, "blue": game_blauw })
        # socketio.emit("B2F_verandering_punten", {'red':  tiebrake_rood, "blue": tiebrake_blauw })
    elif last_points[-1] == "red":
        print("remove red")
        if point_rood == "adv":
            point_rood = "40"
        elif point_rood == "40":
            point_rood = "30"
        elif point_rood == "30":
            point_rood = "15"
        elif point_rood == "15":
            point_rood = "0"
        elif point_rood == "0":
            if game_rood != 0:
                game_rood -= 1
                point_rood = previous_points[0]
                point_blauw = previous_points[1]
            elif game_rood == 0:
                if set_rood != 0:
                    set_rood -= 1
                    point_rood = previous_points[0]
                    point_blauw = previous_points[1]
                    game_rood = previous_game[0]
                    game_blauw = previous_game[1]
        #         socketio.emit("B2F_verandering_set", {'red':  set_rood, "blue": set_blauw })
        #     socketio.emit("B2F_verandering_game", {'red':  game_rood, "blue": game_blauw })
        # socketio.emit("B2F_verandering_punten", {'red':  point_rood, "blue": point_blauw })
    elif last_points[-1] == "blue":
        print("remove blue")
        if point_blauw == "adv":
            point_blauw = "40"
        elif point_blauw == "40":
            point_blauw = "30"
        elif point_blauw == "30":
            point_blauw = "15"
        elif point_blauw == "15":
            point_blauw = "0"
        elif point_blauw == "0":
            if game_blauw != 0:
                game_blauw -= 1
                point_rood = previous_points[0]
                point_blauw = previous_points[1]
            elif game_blauw == 0:
                if set_blauw != 0:
                    set_blauw -= 1
                    point_rood = previous_points[0]
                    point_blauw = previous_points[1]
                    game_rood = previous_game[0]
                    game_blauw = previous_game[1]
        #         socketio.emit("B2F_verandering_set", {'red':  set_rood, "blue": set_blauw })
        #     socketio.emit("B2F_verandering_game", {'red':  game_rood, "blue": game_blauw })
        # socketio.emit("B2F_verandering_punten", {'red':  point_rood, "blue": point_blauw })
    
    last_points.pop()
    print(last_points)

def menu(keuze):
    global point_rood,point_blauw,set_blauw,set_rood,game_rood,game_blauw,tiebrake_blauw,tiebrake_rood,tiebrake,last_points,previous_points
    if tiebrake:
        print("tiebrake")
        if keuze == 1:
            tiebrake_rood += 1
            if tiebrake_rood >= 7 and tiebrake_blauw < tiebrake_rood-1:
                previous_game[game_rood,game_blauw]
                previous_tiebrake=[tiebrake_rood,tiebrake_blauw]
                set_rood += 1
                game_rood += 1
                check_set(game_rood,game_blauw)
                tiebrake_rood=0
                tiebrake_blauw=0
                game_blauw = 0
                game_rood = 0
                tiebrake = False
                # socketio.emit("B2F_punten", )
                # socketio.emit("B2F_verandering_game", {'red':  game_rood, "blue": game_blauw })
            last_points.append("red") 
            print(last_points)
        elif keuze == 2:
            tiebrake_blauw += 1
            if tiebrake_blauw >= 7 and tiebrake_rood < tiebrake_blauw-1:
                previous_game[game_rood,game_blauw]
                previous_tiebrake=[tiebrake_rood,tiebrake_blauw]
                set_blauw += 1
                game_blauw += 1
                check_set(game_rood,game_blauw)
                tiebrake= False
                tiebrake_rood=0
                tiebrake_blauw=0
                game_blauw = 0
                game_rood = 0
                # socketio.emit("B2F_punten", )
                # socketio.emit("B2F_verandering_game", {'red':  game_rood, "blue": game_blauw })
            last_points.append("blue") 
            print(last_points)
        # socketio.emit("B2F_verandering_punten", {'red':  tiebrake_rood, "blue": tiebrake_blauw })
    elif keuze == 1:
        # rood += 15
        if point_rood == "adv":
            previous_points=[point_rood,point_blauw]
            point_rood = "0"
            point_blauw = "0"
            game_rood += 1
            check_game()
        elif point_blauw == "40" and point_rood == "40":
            # rood = "advantage"
            point_rood = "adv"
        elif point_rood == "40" and point_blauw == "adv":
            point_blauw = "40"
        elif point_rood == "40":
            previous_points=[point_rood,point_blauw]
            point_rood = "0"
            point_blauw = "0"
            game_rood += 1
            check_game()
        elif point_rood == "30":
            point_rood = "40"
        elif point_rood == "15":
            point_rood = "30"
        else:
            point_rood = "15"
        # socketio.emit("B2F_verandering_punten", {'red':  point_rood, "blue": point_blauw })
        print("item sent")
        last_points.append("red") 
        print(last_points)
    elif keuze == 2:
        if point_blauw == "adv":
            previous_points=[point_rood,point_blauw]
            point_rood = "0"
            point_blauw = "0"
            game_blauw += 1
            check_game()
        elif point_blauw == "40" and point_rood == "40":
            point_blauw = "adv"
            # blauw = "advantage"
        elif point_blauw == "40" and point_rood == "adv":
            point_rood = "40"
        elif point_blauw == "40":
            previous_points=[point_rood,point_blauw]
            point_rood = "0"
            point_blauw = "0"
            game_blauw += 1
            check_game()
        elif point_blauw == "30":
            point_blauw = "40"
        elif point_blauw == "15":
            point_blauw = "30"
        else:
            point_blauw = "15"
        # socketio.emit("B2F_verandering_punten", {'red':  point_rood, "blue": point_blauw })
        print("item sent")   
        last_points.append("blue") 
        print(last_points)
    if keuze == 3:
            nieuw_game()
    if keuze == 4:
        remove_point()
    elif keuze == 9:
        exit() 

def run():
    keuze = 0
    while keuze  != 9:       
        print("Maak uw keuze:")        
        print("1. punt rood")        
        print("2. punt blauw")                
        print("3. Nieuw Game")                
        print("4. remove last point")                
        print("9. Exit")        
        try:
            keuze = int(input())
            # print(keuze)
            menu(keuze)
        except Exception as ex:
            print(ex)

if __name__ == '__main__':
    # x = threading.Thread(target=run, args=())
    # x.start()
    # q = threading.Thread(target=run_mqtt, args=())
    # q.start()
    run_mqtt()
    # socketio.run(app, debug=False, host='0.0.0.0')
