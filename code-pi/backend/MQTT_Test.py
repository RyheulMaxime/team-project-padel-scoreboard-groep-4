from glob import glob
import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO
import time
# value = input("Geef de eerste waarde: ")
# value2= input("Geef de tweede waarde: ")

triggerPIN = 21
GPIO.setmode(GPIO.BCM)
GPIO.setup(triggerPIN,GPIO.OUT)
# def button_callback():
#     print("druk")
#     send_message("nieuw")


# GPIO.add_event_detect(18,GPIO.RISING,callback=button_callback)


def on_connect(client, userdata, flags, rc):
    print('connected with result ' + str(rc))


def on_message(client, userdata, msg):
    print(msg.topic+' '+str(msg.payload.decode('utf-8')))
    msg =str(msg.payload.decode('utf-8'))
    print('***')
    if msg == "puntrood" or msg == "puntblauw":
        
        buzzer = GPIO.PWM(triggerPIN, 2300) # Set frequency to 1 Khz²
        buzzer.start(10)     
        time.sleep(0.2)
        buzzer.stop()     
    if msg == "minpunt": 
        buzzer = GPIO.PWM(triggerPIN, 1000)
        buzzer.start(10)     
        time.sleep(0.2)
        buzzer.stop()       
        # for i in range(1, len(song)): 
        #     buzzer.ChangeFrequency(song[i]) 
        #     time.sleep(beat[i]*0.13) 
    # if "test" in str(msg.payload.decode("utf-8")):
    #     print('Hello World')
    # else:
    #     print('Goodbye World')





client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("192.168.10.10", 1883, 60)
client.subscribe("/veld1")
# send_message()
client.loop_forever()
# while True:
    
#     if GPIO.input(knop) == GPIO.HIGH:
#         print("gedrkukt")
#         send_message("nieuw")
