#include "esp32_master.h"

ESP32_Master master;

void setup() {
  Serial.begin(115200);
  master.setup();
}

void loop() {
  master.run();
}