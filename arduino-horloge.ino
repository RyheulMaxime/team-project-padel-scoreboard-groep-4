
#include "config.h"
#include <WiFi.h>
#include "arduino_secrets.h"
#include <MQTT.h>

TTGOClass *ttgo;
String incomingString;
const char* ssid = SECRET_SSID;
const char* password = SECRET_PASS;
bool piConnected = false;
char charloop;

char charPage;
WiFiClient net;
MQTTClient client;
void setup()
{
  Serial.begin(115200);
  ttgo = TTGOClass::getWatch();
  ttgo->begin();
  ttgo->openBL();
  ttgo->motor_begin();
  ttgo->lvgl_begin();

  WiFi.begin(ssid, password);

  client.begin("192.168.10.10", net);
  client.onMessage(messageReceived);

  startStyle();
  connect();

  Serial.print("Connect to pi ");
  Serial.println(incomingString);
  charloop = '1';
  switch (charloop) {
    Serial.println("loop");
    case '1':
      if (incomingString != "check") {
        send_message("connect");
        incomingString = Serial.readString();
      }
      if (incomingString == "check") {
        piConnected = true;
        charloop = '2';
      }
    case '2':
      loop();

  }
}




void loop()
{
  //wifi--------------------------------------------------------------------------------------------------------
  client.loop();
  delay(10);
  if (!client.connected()) {
    connect();
  }

  // Watch ------------------------------------------------------------------------
  lv_task_handler();
  if (Serial.available() > 0) {
    // read the incoming byte:

    incomingString = Serial.readString();
    Serial.println("incomming-----------------------------------");
    Serial.println(incomingString);

  }
  if (incomingString == "gedaan") {
    Serial.println("het werkt hij ontvnagest");
    charPage = '5';
    incomingString = "";
  }
  if (incomingString == "check") {
    piConnected = true;
    startStyle();
    incomingString = "";

  }

  switch (charPage) {
    case '1':
      startStyle();
      break;
    case '2':
      gameStyle();
      break;
    case'3':
      titleStyle();
      break;
    case '4':
      chooseTeam();
    case '5':
      nieuwSpel();
      charPage = '0';
      Serial.println("hello");
      break;
  }


  delay(100);
}
// send message----------------------------------------------------------------------------------
void send_message(String msg) {
  client.publish("/veld1", msg);
}
//connect ----------------------------------------------------------------
void connect() {
  Serial.print("checking wifi...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  Serial.print("\nconnecting...");
  while (!client.connect("arduino")) {
    Serial.print(".");
    delay(1000);
  }

  Serial.println("\nconnected!");

  client.subscribe("/veld1");
  client.subscribe("/namen1");
  // client.unsubscribe("/hello");
}
// Receive ---------------------------------------------------------------------------------------

void messageReceived(String & topic, String & payload) {
  Serial.println("incoming: " + topic + " - " + payload);
  incomingString = payload;
  // Note: Do not use the client in the callback to publish, subscribe or
  // unsubscribe as it may cause deadlocks when other things arrive while
  // sending and receiving acknowledgments. Instead, change a global variable,
  // or push to a queue and handle it in the loop after calling `client.loop()`.
}

// STYLES ----------------------------------------------------------------------------------------------------

void chooseTeam() {
  whiteScreen();
  lv_obj_t *text = lv_label_create(lv_scr_act(), NULL);
  lv_label_set_text(text, "Selecteer het team dat start");
  lv_obj_align(text, NULL, LV_ALIGN_CENTER, 0, -90);

  //btn 1
  lv_obj_t *label;
  lv_obj_t *btn1 = lv_btn_create(lv_scr_act(), NULL);
  lv_obj_set_event_cb(btn1, teamRood);
  lv_obj_align(btn1, NULL, LV_ALIGN_IN_TOP_LEFT , 0, 60);
  //label btn1
  label = lv_label_create(btn1, NULL);
  lv_label_set_text(label, "TEAM ROOD");
  lv_obj_set_style_local_text_color(label, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_BLACK);

  //style btn1
  lv_color_t light_red = lv_color_hex(0xFE1E1E);
  lv_color_t dark_red = lv_color_hex(0x7A0000);
  lv_color_t light_blue = lv_color_hex(0x1E1EFE);
  lv_color_t dark_blue = lv_color_hex(0x00007A);
  lv_obj_set_size(btn1, 120, 190);
  lv_obj_set_style_local_radius(btn1, 0, LV_STATE_DEFAULT, 0);
  lv_obj_set_style_local_border_color(btn1, 0, LV_STATE_DEFAULT, LV_COLOR_RED);
  lv_obj_set_style_local_border_color(btn1, 0, LV_STATE_PRESSED, LV_COLOR_RED);

  lv_obj_set_style_local_bg_color(btn1, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_RED);
  lv_obj_set_style_local_bg_color(btn1, LV_LABEL_PART_MAIN, LV_STATE_PRESSED, light_red);

  // btn2
  lv_obj_t *btn2 = lv_btn_create(lv_scr_act(), NULL);
  lv_obj_set_event_cb(btn2, teamBlauw);
  lv_obj_align(btn2, NULL,  LV_ALIGN_IN_TOP_RIGHT , 10, 60);
  //label btn2
  label = lv_label_create(btn2, NULL);
  lv_label_set_text(label, "TEAM BLAUW");
  lv_obj_set_style_local_text_color(label, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_BLACK);

  //style btn2
  lv_obj_set_size(btn2, 120, 190);
  lv_obj_set_style_local_radius(btn2, 0, LV_STATE_DEFAULT, 0);
  lv_obj_set_style_local_border_color(btn2, 0, LV_STATE_DEFAULT, LV_COLOR_BLUE);
  lv_obj_set_style_local_border_color(btn2, 0, LV_STATE_PRESSED, LV_COLOR_BLUE);
  lv_obj_set_style_local_bg_color(btn2, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_BLUE);
  lv_obj_set_style_local_bg_color(btn2, LV_LABEL_PART_MAIN, LV_STATE_PRESSED, light_blue);
}
void nieuwSpel() {
  whiteScreen();
  lv_obj_t *text = lv_label_create(lv_scr_act(), NULL);
  lv_label_set_text(text, "Het spel is gedaan");
  lv_obj_align(text, NULL, LV_ALIGN_CENTER, 0, -60);

  lv_obj_t *label;
  lv_obj_t *btnNieuwGame = lv_btn_create(lv_scr_act(), NULL);
  lv_obj_align(btnNieuwGame, NULL,  LV_ALIGN_CENTER, 0, 0);
  label = lv_label_create(btnNieuwGame, NULL);
  lv_label_set_text(label, "NIEUW SPEL");
  lv_obj_set_event_cb(btnNieuwGame, event_handlerNieuwGame);

}
void startStyle() {
  whiteScreen();
  lv_obj_t *label;
  lv_obj_t *btnStartGame = lv_btn_create(lv_scr_act(), NULL);
  lv_obj_align(btnStartGame, NULL,  LV_ALIGN_CENTER, 0, 0);
  label = lv_label_create(btnStartGame, NULL);
  lv_label_set_text(label, "START SPEL");
  lv_obj_set_event_cb(btnStartGame, event_handlerStartGame);
  lv_obj_t *text = lv_label_create(lv_scr_act(), NULL);

  lv_obj_align(text, NULL, LV_ALIGN_CENTER, -27, -70);

  lv_label_set_text(text, "Connecting...");
  lv_obj_set_style_local_text_color(text, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_RED);
  if (piConnected == true) {

    lv_label_set_text(text, "Connected");
    lv_obj_set_style_local_text_color(text, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_GREEN);
  }
}

void whiteScreen() {

  lv_obj_t * screen = lv_obj_create(NULL, NULL);
  lv_scr_load(screen);
}
void titleStyle() {
  whiteScreen();
  lv_obj_t *text = lv_label_create(lv_scr_act(), NULL);
  lv_label_set_text(text, "Padel");
  lv_obj_align(text, NULL, LV_ALIGN_CENTER, 0, 0);


}

void gameStyle() {
  whiteScreen();

  lv_obj_t *text = lv_label_create(lv_scr_act(), NULL);
  lv_label_set_text(text, "Punt voor:");
  lv_obj_align(text, NULL, LV_ALIGN_CENTER, 0, -90);
  lv_obj_t *label;
  //btn 1
  lv_obj_t *btn1 = lv_btn_create(lv_scr_act(), NULL);
  lv_obj_set_event_cb(btn1, event_handlerROOD);
  lv_obj_align(btn1, NULL,  LV_ALIGN_IN_TOP_LEFT, 0, 60);
  //label btn1
  label = lv_label_create(btn1, NULL);
  lv_label_set_text(label, "TEAM 1");
  lv_obj_set_style_local_text_color(label, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_BLACK);

  //style btn1

  lv_color_t light_red = lv_color_hex(0xFE1E1E);
  lv_color_t dark_red = lv_color_hex(0x7A0000);
  lv_color_t light_blue = lv_color_hex(0x1E1EFE);
  lv_color_t dark_blue = lv_color_hex(0x00007A);
  lv_obj_set_size(btn1, 120, 190);
  lv_obj_set_style_local_radius(btn1, 0, LV_STATE_DEFAULT, 1);
  lv_obj_set_style_local_border_color(btn1, 0, LV_STATE_DEFAULT, LV_COLOR_RED);
  lv_obj_set_style_local_border_color(btn1, 0, LV_STATE_PRESSED, LV_COLOR_RED);

  lv_obj_set_style_local_bg_color(btn1, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_RED);
  lv_obj_set_style_local_bg_color(btn1, LV_LABEL_PART_MAIN, LV_STATE_PRESSED, light_red);

  // btn2
  lv_obj_t *btn2 = lv_btn_create(lv_scr_act(), NULL);
  lv_obj_set_event_cb(btn2, event_handlerBLAUW);
  lv_obj_align(btn2, NULL,  LV_ALIGN_IN_TOP_RIGHT, 10, 60);
  //label btn2
  label = lv_label_create(btn2, NULL);
  lv_label_set_text(label, "TEAM 2");
  lv_obj_set_style_local_text_color(label, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_BLACK);

  //style btn2
  lv_obj_set_size(btn2, 120, 190);
  lv_obj_set_style_local_radius(btn2, 0, LV_STATE_DEFAULT, 1);

  lv_obj_set_style_local_border_color(btn2, 0, LV_STATE_DEFAULT, LV_COLOR_BLUE);
  lv_obj_set_style_local_border_color(btn2, 0, LV_STATE_PRESSED, LV_COLOR_BLUE);
  lv_obj_set_style_local_bg_color(btn2, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_BLUE);
  lv_obj_set_style_local_bg_color(btn2, LV_LABEL_PART_MAIN, LV_STATE_PRESSED, light_blue);

}
//EVENT HANDLERS ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
void event_handlerNieuwGame(lv_obj_t *obj, lv_event_t event)
{ if (event == LV_EVENT_CLICKED)
  {
    ttgo->motor->onec();
    delay(100);
    send_message("nieuw");
    chooseTeam();

  }
}

void event_handlerStartGame(lv_obj_t *obj, lv_event_t event)
{
  if (event == LV_EVENT_CLICKED)
  {
    ttgo->motor->onec();
    delay(100);
    send_message("startgame");
    chooseTeam();

  }
}
void teamRood(lv_obj_t *obj, lv_event_t event)
{
  if (event == LV_EVENT_CLICKED)
  {
    printf("TEAM ROOD\n");
    ttgo->motor->onec();
    delay(100);
    charPage = '2';
    send_message("teamrood");
  }
}
void teamBlauw(lv_obj_t *obj, lv_event_t event)
{
  if (event == LV_EVENT_CLICKED)
  {
    printf("TEAM BLAUW\n");
    ttgo->motor->onec();
    delay(100);
    charPage = '2';
    send_message("teamblauw");
  }
}
void event_handlerROOD(lv_obj_t *obj, lv_event_t event)
{
  static uint32_t i = 0;
  i++;

  if ((event == LV_EVENT_CLICKED) && (i < 30)) {
    printf("PUNT ROOD\n");
    ttgo->motor->onec();
    delay(100);
    i = 0;
    send_message("puntrood");
  }
  if ( (event == LV_EVENT_CLICKED) && (i >= 30)) {
    Serial.println("MINPUT ROOD");
    ttgo->motor->onec();
    delay(300);
    ttgo->motor->onec();
    i = 0;
    send_message("minpunt");
  }
}

void event_handlerBLAUW(lv_obj_t *obj, lv_event_t event)
{
  static uint32_t i = 0;
  i++;
  if ((event == LV_EVENT_CLICKED) && (i < 30)) {
    printf("PUNT BLAUW\n");
    ttgo->motor->onec();
    delay(100);
    i = 0;
    send_message("puntblauw");
  }
  if ( (event == LV_EVENT_CLICKED) && (i >= 30)) {
    Serial.println("MINPUT BLAUW");
    ttgo->motor->onec();
    delay(300);
    ttgo->motor->onec();
    i = 0;
    send_message("minpunt");
  }
}