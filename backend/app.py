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
previous_games=[]
previous_points=[]
# previous_games=[0,0]
# previous_points=["0","0"]
# previous_tiebrake=[0,0]

# app = Flask(__name__)
# app.config['SECRET_KEY'] = 'Hier mag je om het even wat schrijven'

# socketio = SocketIO(app, cors_allowed_origins="*")
# CORS(app)

# mqtt broker **********************************************************************************************************************
def send_message(message):
    # data = 'pi hier'
    client.publish("/veld1", message,qos=2)

def send_scorebord(message):
    # data = 'pi hier'
    client.publish("/scorebord1", message,qos=2)

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
            menu(1)
        if bericht == "puntblauw":
            menu(2)
        if bericht == "minpunt":
            remove_point()
        if bericht == "nieuw":
            nieuw_game()
        # if bericht == "":
        #     set_name()

client = mqtt.Client() #maak een nieuwe mqtt client aan
def run_mqtt():
    # print("connecting")
     
    client.on_connect = on_connect 
    client.on_message = on_message
    # client.connect('192.168.10.10', 1883, 60) # mqtt broker py
    client.connect('127.0.0.1', 1883, 60) # test mqtt broker
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
    message = json.dumps(Json)
    send_scorebord(message)

def nieuw_game():
    global tiebrake,total_sets,game1,game2,game3,game_blauw,game_rood,set_blauw,set_rood,point_rood,point_blauw,tiebrake_blauw,tiebrake_rood,previous_games,previous_points,last_points
    tiebrake = False
    total_sets = 0
    game1 = {}
    game2 = {}
    game3 = {}
    game_blauw = 0
    game_rood = 0
    set_rood = 0
    set_blauw = 0
    tiebrake_blauw = 0
    tiebrake_rood = 0
    point_rood = "0"
    point_blauw = "0"
    Json = {"type" : "punten", "rood" : point_rood, "blauw" : point_blauw}
    message = json.dumps(Json)
    send_scorebord(message)
    message = json.dumps({"type" : "game", "rood" : game_rood, "blauw" : game_blauw })
    send_scorebord(message)
    message = json.dumps({"type" : "set", "rood" : set_rood, "blauw" : set_blauw })
    send_scorebord(message)
    message = json.dumps({"type" : "background", "background" : "Punten" })
    # send_scorebord(message)
    # message = json.dumps({"type" : "opslag", "side" : "geen"})
    send_scorebord(message)
    send_message("nieuw game")
    previous_games = []
    previous_points = []
    last_points=[]

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
        send_message("gedaan")
        message = json.dumps({"type" : "punten", "rood" : set_rood, "blauw" : set_blauw})
        send_scorebord(message)
        message = json.dumps({"type" : "gedaan", "side" : "rood"})
        send_scorebord(message)
    if set_blauw == 2:
        print("blauw wint")
        send_message("gedaan")
        message = json.dumps({"type" : "punten", "rood" : set_rood, "blauw" : set_blauw})
        send_scorebord(message)
        message = json.dumps({"type" : "gedaan", "side" : "blauw"})
        send_scorebord(message)
    message = json.dumps({"type" : "set", "rood" : set_rood, "blauw" : set_blauw })
    send_scorebord(message)

def check_game():
    global game_rood,game_blauw,set_rood,set_blauw,tiebrake,previous_games,point_rood,point_blauw
    if game_blauw == 6 and game_rood == 6:
        tiebrake = True
        print("tiebrake")
        message = json.dumps({"type" : "background", "background" : "Tiebrake" })
        send_scorebord(message)
    elif game_blauw >= 6:
        if game_rood < game_blauw-1:
            set_blauw += 1
            check_set(game_rood,game_blauw)
            game_blauw -= 1
            previous_games.append([game_rood,game_blauw])
            game_rood = 0
            game_blauw = 0      
    elif game_rood >= 6:
        if game_blauw < game_rood-1:
            # print(game_rood , " " , game_blauw)
            set_rood += 1
            check_set(game_rood,game_blauw)
            game_rood -= 1
            previous_games.append([game_rood,game_blauw])
            game_rood = 0
            game_blauw = 0 
    message = json.dumps({"type" : "game", "rood" : game_rood, "blauw" : game_blauw })
    send_scorebord(message)

def remove_point():
    global last_points,point_rood,point_blauw,game_rood,game_blauw,set_rood,set_blauw,tiebrake_rood,tiebrake_blauw,tiebrake,previous_games,previous_points,total_sets,game1,game2,game3
    if last_points:
        print(last_points[-1])
        print(previous_games)
        print(previous_points)
        if tiebrake == True:
            if last_points[-1] == "red":
                if tiebrake_rood != 0:
                    tiebrake_rood -= 1
                    Json = {"type" : "punten", "rood" : tiebrake_rood, "blauw" : tiebrake_blauw }
                    message = json.dumps(Json)
                    send_scorebord(message)
                else:
                    point_rood = previous_points[-1][0]
                    point_blauw = previous_points[-1][1]
                    # game_rood = previous_games[-1][0]
                    # game_blauw = previous_games[-1][1]
                    game_rood -= 1

                    tiebrake = False
                    message = json.dumps({"type" : "background", "background" : "Punten" })
                    send_scorebord(message)
                    message = json.dumps({"type" : "game", "rood" : game_rood, "blauw" : game_blauw })
                    send_scorebord(message) 
                    message = json.dumps({"type" : "punten", "rood" : point_rood, "blauw" : point_blauw })
                    send_scorebord(message)
                    # previous_games.pop()
                    previous_points.pop()
            elif last_points[-1] == "blue":
                if tiebrake_blauw != 0:
                    tiebrake_blauw -= 1
                    Json = {"type" : "punten", "rood" : tiebrake_rood, "blauw" : tiebrake_blauw }
                    message = json.dumps(Json)
                    send_scorebord(message)
                else:
                    point_rood = previous_points[-1][0]
                    point_blauw = previous_points[-1][1]
                    # game_rood = previous_games[-1][0]
                    # game_blauw = previous_games[-1][1]
                    
                    game_blauw -= 1
                    tiebrake = False
                    # socketio.emit("B2F_punten", )
                    message = json.dumps({"type" : "background", "background" : "Punten" })
                    send_scorebord(message)
                    message = json.dumps({"type" : "game", "rood" : game_rood, "blauw" : game_blauw })
                    send_scorebord(message)
                    message = json.dumps({"type" : "punten", "rood" : point_rood, "blauw" : point_blauw })
                    send_scorebord(message)
                    # previous_games.pop()
                    previous_points.pop()
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
                    if previous_points[-1][2] == "tiebrake":
                        message = json.dumps({"type" : "background", "background" : "Tiebrake" })
                        send_scorebord(message)
                        tiebrake = True
                        tiebrake_rood = previous_points[-1][0]
                        tiebrake_blauw = previous_points[-1][1]
                    else:
                        message = json.dumps({"type" : "background", "background" : "Punten" })
                        send_scorebord(message)
                        tiebrake = False
                        point_rood = previous_points[-1][0]
                        point_blauw = previous_points[-1][1]
                elif game_rood == 0:
                    if set_rood != 0:
                        set_rood -= 1
                        if total_sets == 1:
                            game1 = {}
                        elif total_sets == 2:
                            game2 = {}
                        elif total_sets == 3:
                            game3 = {}
                        total_sets -= 1
                        if previous_points[-1][2] == "tiebrake":
                            message = json.dumps({"type" : "background", "background" : "Tiebrake" })
                            send_scorebord(message)
                            tiebrake = True
                            tiebrake_rood = previous_points[-1][0]
                            tiebrake_blauw = previous_points[-1][1]
                        else:
                            message = json.dumps({"type" : "background", "background" : "Punten" })
                            send_scorebord(message)
                            tiebrake = False
                            point_rood = previous_points[-1][0]
                            point_blauw = previous_points[-1][1]
                        game_rood = previous_games[-1][0]
                        game_blauw = previous_games[-1][1]
                        previous_games.pop()
                    message = json.dumps({"type" : "set", "rood" : set_rood, "blauw" : set_blauw })
                    send_scorebord(message)
                previous_points.pop()
                message = json.dumps({"type" : "game", "rood" : game_rood, "blauw" : game_blauw })
                send_scorebord(message)
            if tiebrake:
                Json = {"type" : "punten", "rood" : tiebrake_rood, "blauw" : tiebrake_blauw }
                message = json.dumps(Json)
                send_scorebord(message)
            else:    
                Json = {"type" : "punten", "rood" : point_rood, "blauw" : point_blauw}
                message = json.dumps(Json)
                send_scorebord(message)
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
                    if previous_points[-1][2] == "tiebrake":
                        message = json.dumps({"type" : "background", "background" : "Tiebrake" })
                        send_scorebord(message)
                        tiebrake = True
                    else:
                        message = json.dumps({"type" : "background", "background" : "Punten" })
                        send_scorebord(message)
                        tiebrake = False
                    point_rood = previous_points[-1][0]
                    point_blauw = previous_points[-1][1]
                elif game_blauw == 0:
                    if set_blauw != 0:
                        set_blauw -= 1
                        if total_sets == 1:
                            game1 = {}
                        elif total_sets == 2:
                            game2 = {}
                        elif total_sets == 3:
                            game3 = {}
                        total_sets -= 1
                        if previous_points[-1][2] == "tiebrake":
                            message = json.dumps({"type" : "background", "background" : "Tiebrake" })
                            send_scorebord(message)
                            tiebrake = True
                            tiebrake_rood = previous_points[-1][0]
                            tiebrake_blauw = previous_points[-1][1]
                        else:
                            message = json.dumps({"type" : "background", "background" : "Punten" })
                            send_scorebord(message)
                            tiebrake = False
                            point_rood = previous_points[-1][0]
                            point_blauw = previous_points[-1][1]
                        game_rood = previous_games[-1][0]
                        game_blauw = previous_games[-1][1]
                        previous_games.pop()
                    message = json.dumps({"type" : "set", "rood" : set_rood, "blauw" : set_blauw })
                    send_scorebord(message)
                previous_points.pop()
                message = json.dumps({"type" : "game", "rood" : game_rood, "blauw" : game_blauw })
                send_scorebord(message)
            if tiebrake_rood != 0 or tiebrake_blauw != 0:
                message = json.dumps({"type" : "punten", "rood" : tiebrake_rood, "blauw" : tiebrake_blauw})
                send_scorebord(message)
            else:
                Json = {"type" : "punten", "rood" : point_rood, "blauw" : point_blauw}
                message = json.dumps(Json)
                send_scorebord(message)
        last_points.pop()
        print(last_points)
    else:
        print("no points left")

def menu(keuze):
    global point_rood,point_blauw,set_blauw,set_rood,game_rood,game_blauw,tiebrake_blauw,tiebrake_rood,tiebrake,last_points,previous_points,previous_games
    if tiebrake:
        print("tiebrake")
        if keuze == 1:
            tiebrake_rood += 1
            if tiebrake_rood >= 7 and tiebrake_blauw < tiebrake_rood-1:
                set_rood += 1
                previous_games.append([game_rood,game_blauw])
                game_rood += 1
                tiebrake_rood -= 1
                previous_points.append([tiebrake_rood,tiebrake_blauw,"tiebrake"])
                check_set(game_rood,game_blauw)
                tiebrake_rood=0
                tiebrake_blauw=0
                game_blauw = 0
                game_rood = 0
                tiebrake = False
                # socketio.emit("B2F_punten", )
                message = json.dumps({"type" : "background", "background" : "Punten" })
                send_scorebord(message)
                message = json.dumps({"type" : "game", "rood" : game_rood, "blauw" : game_blauw })
                send_scorebord(message)
                # socketio.emit("B2F_verandering_game", {'red':  game_rood, "blue": game_blauw })
            last_points.append("red") 
            print(last_points)
        elif keuze == 2:
            tiebrake_blauw += 1
            if tiebrake_blauw >= 7 and tiebrake_rood < tiebrake_blauw-1:
                set_blauw += 1
                previous_games.append([game_rood,game_blauw])
                game_blauw += 1
                tiebrake_blauw -= 1
                previous_points.append([tiebrake_rood,tiebrake_blauw,"tiebrake"])
                check_set(game_rood,game_blauw)
                tiebrake= False
                tiebrake_rood=0
                tiebrake_blauw=0
                game_blauw = 0
                game_rood = 0
                message = json.dumps({"type" : "background", "background" : "Punten" })
                send_scorebord(message)
                message = json.dumps({"type" : "game", "rood" : game_rood, "blauw" : game_blauw })
                send_scorebord(message)
                # socketio.emit("B2F_verandering_game", {'red':  game_rood, "blue": game_blauw })
            last_points.append("blue")
            print(last_points)
        Json = {"type" : "punten", "rood" : tiebrake_rood, "blauw" : tiebrake_blauw }
        message = json.dumps(Json)
        send_scorebord(message)
    elif keuze == 1:
        # rood += 15
        if point_rood == "adv":
            previous_points.append([point_rood,point_blauw,"points"])
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
            previous_points.append([point_rood,point_blauw,"points"])
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
        # message = json.dumps({"type" : "punten", "rood" : point_rood, "blauw" : point_blauw})
        # send_scorebord(message)
        send_scorebord(json.dumps({"type" : "punten", "rood" : point_rood, "blauw" : point_blauw}))
        print("item sent")
        last_points.append("red") 
        print(last_points)
    elif keuze == 2:
        if point_blauw == "adv":
            previous_points.append([point_rood,point_blauw,"points"])
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
            previous_points.append([point_rood,point_blauw,"points"])
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
        Json = {"type" : "punten", "rood" : point_rood, "blauw" : point_blauw}
        message = json.dumps(Json)
        send_scorebord(message)
        print("item sent")   
        last_points.append("blue") 
        print(last_points)


if __name__ == '__main__':
    # x = threading.Thread(target=run, args=())
    # x.start()
    # q = threading.Thread(target=run_mqtt, args=())
    # q.start()
    run_mqtt()
    # socketio.run(app, debug=False, host='0.0.0.0')
