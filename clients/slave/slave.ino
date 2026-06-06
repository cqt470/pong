#include "slave_esp8266.h"

Slave_ESP8266 slave;

// ESP8266 supporta un solo pin analogico
#define PIN_POTENTIOMETER     A0
#define FPS                   24
#define IS_LEFT_PLR           false

float map_number(float value, float input_min, float input_max, float output_min, float output_max){
  float x = (value - input_min) / (input_max - input_min);
  return output_min + (output_max - output_min) * x;
}

const char PADDLE_SIDE = IS_LEFT_PLR ? 'l' : 'r';

void setup(){
  Serial.begin(9600);

  pinMode(PIN_POTENTIOMETER, INPUT);

  slave.setup();
}

void loop(){
  int raw = analogRead(PIN_POTENTIOMETER);
  int pos = map_number(raw, 20, 1000, 0, 32);
  char payload[64];

  snprintf(payload, sizeof(payload), "{\"t\":\"update\",\"%c\":%d}", PADDLE_SIDE, pos);

  web_socket.sendTXT(payload);
  // Serial.println(payload);
  slave.run();
  delay((int) 1000 / FPS);
}