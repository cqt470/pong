#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include "definitions.h"

// https://randomnerdtutorials.com/guide-for-oled-display-with-arduino/
Adafruit_SSD1306 display(DISPLAY_W, DISPLAY_H, &Wire, -1);
Player player_left(false, display);
Player player_right(true, display);

Ball ball(display, player_left, player_right);

Text text(display);

void setup(){
  Serial.begin(9600);
  pinMode(PIN_POTENTIOMETER, INPUT);

  // https://docs.arduino.cc/language-reference/en/functions/random-numbers/random/
  // uso A3 perché non è un pin usato nel progetto
  randomSeed(analogRead(A3));
  
  // dall'esempio della libreria
  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  ball.randomize_velocities();
  
  text.show_loading();
}

void loop(){
  int raw = analogRead(PIN_POTENTIOMETER);

  // noto che il valore non supera spesso 690.
  // il range sarebbe da 0 a 690 ma come è ora evita roba strana quando il potenziometro è tutto a destra o sinistra
  // - BAR_HEIGHT perché così non può uscire dallo schermo
  int val = map_number(raw, 20, 670, 0, 32 - BAR_HEIGHT);
  display.clearDisplay();

  player_left.posy = val;
  player_left.show();

  player_right.show();

  ball.move();

  text.draw_score(10, 2);

  display.display(); // aggiorna lo schermo solo quando serve
  delay(100);
}