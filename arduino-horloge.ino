
#include "config.h"

TTGOClass *ttgo;

 void event_handlerROOD(lv_obj_t *obj, lv_event_t event)
{
  static uint32_t i = 0;
  if (event == LV_EVENT_CLICKED) {
    printf("ROOD\n");
  }
} 
void event_handlerBLAUW(lv_obj_t *obj, lv_event_t event)
{
  static uint32_t i = 0;
  if (event == LV_EVENT_CLICKED) {
    printf("BLAUW\n");
  }
}

void setup()
{
  Serial.begin(9600);
  ttgo = TTGOClass::getWatch();
  ttgo->begin();
  ttgo->openBL();
  ttgo->lvgl_begin();

  lv_obj_t *label;

  lv_obj_t *btn1 = lv_btn_create(lv_scr_act(), NULL);
  lv_obj_set_event_cb(btn1, event_handlerBLAUW);
  lv_obj_align(btn1, NULL, LV_ALIGN_CENTER, 0, -40);

  label = lv_label_create(btn1, NULL);
  lv_label_set_text(label, "TEAM BLAUW");

  lv_obj_t *btn2 = lv_btn_create(lv_scr_act(), NULL);
  lv_obj_set_event_cb(btn2, event_handlerROOD);
  lv_obj_align(btn2, NULL, LV_ALIGN_CENTER, 0, 40);

  label = lv_label_create(btn2, NULL);
  lv_label_set_text(label, "TEAM ROOD");

}

void loop()
{
  lv_task_handler();
  delay(5);
}