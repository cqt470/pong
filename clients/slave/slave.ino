#include "slave_esp8266.h"

Slave_ESP8266 slave;

#define PIN_POTENTIOMETER     A0
#define FPS                   24
#define IS_LEFT_PLR           true

const unsigned long SEND_INTERVAL_MS = 40;
#define DEADBAND              2       // Invia solo se la posizione cambia di almeno 2
#define SAMPLES               3       // Numero di letture da mediare

float map_number(float value, float input_min, float input_max, float output_min, float output_max){
  float x = (value - input_min) / (input_max - input_min);
  return output_min + (output_max - output_min) * x;
}

const char PADDLE_SIDE = IS_LEFT_PLR ? 'l' : 'r';
unsigned long last_send_ms = 0;
int last_sent_pos = -1;

// Legge il potenziometro con media mobile per ridurre il rumore
int readPotentiometer(){
  long sum = 0;
  for(int i = 0; i < SAMPLES; i++){
    sum += analogRead(PIN_POTENTIOMETER);
    delay(1);               // piccolo ritardo tra le letture
  }
  return sum / SAMPLES;
}

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

  int raw = readPotentiometer();
  int pos = (int)map_number(raw, 20, 1000, 0, 32);

  // Limita entro i range validi
  if(pos < 0) pos = 0;
  if(pos > 32) pos = 32;

  // Invia solo se la variazione supera la deadband
  if(last_sent_pos >= 0 && abs(pos - last_sent_pos) < DEADBAND){
    // Non invia, ma aggiorna il timer per evitare raffiche
    last_send_ms = now;
    delay(1);
    return;
  }

  last_sent_pos = pos;
  last_send_ms = now;

  char payload[64];
  snprintf(payload, sizeof(payload), "{\"t\":\"update\",\"%c\":%d}", PADDLE_SIDE, pos);
  web_socket.sendTXT(payload);
  delay(1);
}