#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include "definitions.h"

// https://randomnerdtutorials.com/guide-for-oled-display-with-arduino/
Adafruit_SSD1306 display(DISPLAY_W, DISPLAY_H, &Wire, -1);

void setup() {
  Serial.begin(9600);
  pinMode(PIN_POTENTIOMETER, INPUT);
  
  // dall'esempio della libreria
  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.print("Caricando...");
  display.display();

  delay(100);
}

void loop() {
  int raw = analogRead(PIN_POTENTIOMETER);

  // noto che il valore non supera spesso 690.
  float val = map_number(raw, 0, 690, 128, 0);
  Serial.println(val);

  display.setCursor(0, 0);
  display.clearDisplay();
  display.print(val);

  display.display();
  delay(500);
}