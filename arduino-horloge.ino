
#include "config.h"

TTGOClass *ttgo;
char incomingString;


void setup()
{
  Serial.begin(9600);
  ttgo = TTGOClass::getWatch();
  ttgo->begin();
  ttgo->openBL();
  ttgo->motor_begin();
  ttgo->lvgl_begin();

   lv_obj_t *text = lv_label_create(lv_scr_act(), NULL);
    lv_label_set_text(text, "Padel");
    lv_obj_align(text, NULL, LV_ALIGN_CENTER, 0, 0);

}

void loop()
{
  lv_task_handler();
  if (Serial.available() > 0) {
    // read the incoming byte:
    incomingString = Serial.read();
    switch (incomingString){
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
      break;
    }
  }
  
  delay(5);
}
void chooseTeam(){
  whiteScreen();
   lv_obj_t *text = lv_label_create(lv_scr_act(), NULL);
    lv_label_set_text(text, "Select the team that starts");
    lv_obj_align(text, NULL, LV_ALIGN_CENTER, 0, -70);

    //btn 1
    lv_obj_t *label;
  lv_obj_t *btn1 = lv_btn_create(lv_scr_act(), NULL);
  //lv_obj_set_event_cb(btn1, event_handlerBLAUW);
  lv_obj_align(btn1, NULL,    LV_ALIGN_IN_LEFT_MID  , 10, 0);
  //label btn1
  label = lv_label_create(btn1, NULL);
  lv_label_set_text(label, "TEAM BLAUW");
  lv_obj_set_style_local_text_color(label, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_BLACK);

  //style btn1
  lv_color_t light_blue = lv_color_hex(0x1E1EFE);
  lv_color_t dark_blue = lv_color_hex(0x00007A);
  lv_obj_set_size(btn1, 105, 105);
  lv_obj_set_style_local_radius(btn1, 0, LV_STATE_DEFAULT, 105);
  lv_obj_set_style_local_border_color(btn1, 0, LV_STATE_DEFAULT, LV_COLOR_BLUE);
  lv_obj_set_style_local_border_color(btn1, 0, LV_STATE_PRESSED, LV_COLOR_BLUE);
  lv_obj_set_style_local_bg_color(btn1, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_BLUE);
  lv_obj_set_style_local_bg_color(btn1, LV_LABEL_PART_MAIN, LV_STATE_PRESSED, light_blue);

  // btn2
  lv_obj_t *btn2 = lv_btn_create(lv_scr_act(), NULL);
  //lv_obj_set_event_cb(btn2, event_handlerROOD);
  lv_obj_align(btn2, NULL,  LV_ALIGN_IN_RIGHT_MID , 15, 0);
  //label btn2
  label = lv_label_create(btn2, NULL);
  lv_label_set_text(label, "TEAM ROOD");
  lv_obj_set_style_local_text_color(label, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_BLACK);

  //style btn2
  lv_color_t light_red = lv_color_hex(0xFE1E1E);
  lv_color_t dark_red = lv_color_hex(0x7A0000);
  lv_obj_set_size(btn2, 105, 105);
  lv_obj_set_style_local_radius(btn2, 0, LV_STATE_DEFAULT, 105);
  lv_obj_set_style_local_border_color(btn2, 0, LV_STATE_DEFAULT, LV_COLOR_RED);
  lv_obj_set_style_local_border_color(btn2, 0, LV_STATE_PRESSED, LV_COLOR_RED);

  lv_obj_set_style_local_bg_color(btn2, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_RED);
  lv_obj_set_style_local_bg_color(btn2, LV_LABEL_PART_MAIN, LV_STATE_PRESSED, light_red);
}

void startStyle(){
  whiteScreen();
    lv_obj_t *label;
  lv_obj_t *btnStartGame = lv_btn_create(lv_scr_act(), NULL);
  //lv_obj_set_event_cb(btnStartGame, event_handlerStartGame);
  lv_obj_align(btnStartGame, NULL,  LV_ALIGN_CENTER, 0, 0);
  label = lv_label_create(btnStartGame, NULL);
  lv_label_set_text(label, "START GAME");
   lv_obj_t *text = lv_label_create(lv_scr_act(), NULL);
    lv_label_set_text(text, "Connected");
    lv_obj_align(text, NULL, LV_ALIGN_CENTER, 0, -70);
  lv_obj_set_style_local_text_color(text, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_GREEN);
}

void whiteScreen(){
  
lv_obj_t * screen = lv_obj_create(NULL, NULL);
lv_scr_load(screen);
}
void titleStyle(){
  whiteScreen();
   lv_obj_t *text = lv_label_create(lv_scr_act(), NULL);
    lv_label_set_text(text, "Padel");
    lv_obj_align(text, NULL, LV_ALIGN_CENTER, 0, 0);


}

void gameStyle(){
  whiteScreen();
    lv_obj_t *label;
  //btn 1
  lv_obj_t *btn1 = lv_btn_create(lv_scr_act(), NULL);
  lv_obj_set_event_cb(btn1, event_handlerBLAUW);
  lv_obj_align(btn1, NULL,  LV_ALIGN_IN_TOP_LEFT, 0, 0);
  //label btn1
  label = lv_label_create(btn1, NULL);
  lv_label_set_text(label, "TEAM BLAUW");
  lv_obj_set_style_local_text_color(label, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_BLACK);

  //style btn1
  lv_color_t light_blue = lv_color_hex(0x1E1EFE);
  lv_color_t dark_blue = lv_color_hex(0x00007A);
  lv_obj_set_size(btn1, 120, 250);
  lv_obj_set_style_local_radius(btn1, 0, LV_STATE_DEFAULT, 1);
  lv_obj_set_style_local_border_color(btn1, 0, LV_STATE_DEFAULT, LV_COLOR_BLUE);
  lv_obj_set_style_local_border_color(btn1, 0, LV_STATE_PRESSED, LV_COLOR_BLUE);
  lv_obj_set_style_local_bg_color(btn1, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_BLUE);
  lv_obj_set_style_local_bg_color(btn1, LV_LABEL_PART_MAIN, LV_STATE_PRESSED, light_blue);

  // btn2
  lv_obj_t *btn2 = lv_btn_create(lv_scr_act(), NULL);
  lv_obj_set_event_cb(btn2, event_handlerROOD);
  lv_obj_align(btn2, NULL,  LV_ALIGN_IN_TOP_RIGHT, 10, 0);
  //label btn2
  label = lv_label_create(btn2, NULL);
  lv_label_set_text(label, "TEAM ROOD");
  lv_obj_set_style_local_text_color(label, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_BLACK);

  //style btn2
  lv_color_t light_red = lv_color_hex(0xFE1E1E);
  lv_color_t dark_red = lv_color_hex(0x7A0000);
  lv_obj_set_size(btn2, 120, 250);
  lv_obj_set_style_local_radius(btn2, 0, LV_STATE_DEFAULT, 1);
  lv_obj_set_style_local_border_color(btn2, 0, LV_STATE_DEFAULT, LV_COLOR_RED);
  lv_obj_set_style_local_border_color(btn2, 0, LV_STATE_PRESSED, LV_COLOR_RED);

  lv_obj_set_style_local_bg_color(btn2, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, LV_COLOR_RED);
  lv_obj_set_style_local_bg_color(btn2, LV_LABEL_PART_MAIN, LV_STATE_PRESSED, light_red);
}

void event_handlerROOD(lv_obj_t *obj, lv_event_t event)
{
  static uint32_t i = 0;
  i++;
  Serial.println("i1");
  Serial.println(i);

  if ((event == LV_EVENT_CLICKED) && (i < 30)) {
    printf("PUNT ROOD\n");
    ttgo->motor->onec();
    delay(100);
    i = 0;
  }
  if ( (event == LV_EVENT_CLICKED) && (i >= 30)) {
    Serial.println("MINPUT ROOD");
    ttgo->motor->onec();
    delay(300);
    ttgo->motor->onec();;
    i = 0;
  }
}

void event_handlerBLAUW(lv_obj_t *obj, lv_event_t event)
{
  static uint32_t i = 0;
  i++;
  Serial.println("i1");
  Serial.println(i);
  if ((event == LV_EVENT_CLICKED) && (i < 30)) {
    printf("PUNT BLAUW\n");
    ttgo->motor->onec();
    delay(100);
    i = 0;
  }
  if ( (event == LV_EVENT_CLICKED) && (i >= 30)) {
    Serial.println("MINPUT BLAUW");
    ttgo->motor->onec();
    delay(300);
    ttgo->motor->onec();;
    i = 0;
  }
}