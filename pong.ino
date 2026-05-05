#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include "definitions.h"

// https://randomnerdtutorials.com/guide-for-oled-display-with-arduino/
Adafruit_SSD1306 display(DISPLAY_W, DISPLAY_H, &Wire, -1);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(PIN_POTENTIOMETER, INPUT);

  display.display();
  delay(1000);

  display.clearDisplay();
  display.setCursor(0, 0);
  display.write("Ciao bro");
}

void loop() {
  // put your main code here, to run repeatedly:
  int raw = analogRead(PIN_POTENTIOMETER);

  // noto che il valore non supera spesso 690.
  float val = map_number(raw, 0, 690, 128, 0);
  Serial.println(val);



  delay(500);
}