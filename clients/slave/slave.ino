#include "slave_esp8266.h"

Slave_ESP8266 slave;

void setup(){
  Serial.begin(9600);
  slave.setup();
}

void loop(){

  delay(1000);
}