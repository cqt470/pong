#include "slave_esp8266.h"

Slave_ESP8266 slave;

// ESP8266 supporta un solo pin analogico
#define PIN_POTENTIOMETER     A0
#define FPS                   24
#define IS_LEFT_PLR           false

const unsigned long SEND_INTERVAL_MS = 40;

float map_number(float value, float input_min, float input_max, float output_min, float output_max){
  float x = (value - input_min) / (input_max - input_min);
  return output_min + (output_max - output_min) * x;
}

const char PADDLE_SIDE = IS_LEFT_PLR ? 'l' : 'r';
unsigned long last_send_ms = 0;
int last_sent_pos = -1;

void setup(){
  Serial.begin(9600);

  pinMode(PIN_POTENTIOMETER, INPUT);

  slave.setup();
}

void loop(){
  slave.run();

  if(!websocket_connected){
    delay(1);
    return;
  }

  const unsigned long now = millis();
  if(now - last_send_ms < SEND_INTERVAL_MS){
    delay(1);
    return;
  }

  int raw = analogRead(PIN_POTENTIOMETER);
  int pos = map_number(raw, 20, 1000, 0, 32);

  if(last_sent_pos >= 0 && abs(pos - last_sent_pos) < 1){
    last_send_ms = now;
    delay(1);
    return;
  }

  last_sent_pos = pos;
  last_send_ms = now;

  char payload[64];

  snprintf(payload, sizeof(payload), "{\"t\":\"update\",\"%c\":%d}", PADDLE_SIDE, pos);

  web_socket.sendTXT(payload);
  // Serial.println(payload);
  delay(1);
}