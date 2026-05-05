#include <Adafruit_SSD1306.h>
#include "definitions.h"

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(PIN_POTENTIOMETER, INPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  int raw = analogRead(PIN_POTENTIOMETER);
  float val = map_number(raw, 0, 700, 0, 100);
  Serial.println(val);
  delay(500);
}