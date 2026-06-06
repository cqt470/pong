#include "esp8226.h"

ESP8266 slave();

void setup(){
  Serial.begin(9600);
}

void loop(){
  Serial.println("Ciao");

  delay((int) 1 / FPS * 1000);
}