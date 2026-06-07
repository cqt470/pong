#include "master_esp32.h"

ESP32_Master master;

void setup() {
  Serial.begin(115200);
  master.setup();
}

void loop() {
  master.run();
}