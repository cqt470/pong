#define PIN_POTENTIOMETER     A0

#define DISPLAY_W             128
#define DISPLAY_H             32
#define PIN_SCL               A5
#define PIN_SDA               A4
#define SCREEN_ADDRESS        0x3C

#define BAR_HEIGHT            4
#define BAR_WIDTH             2
#define BAR_OFFSET            8

#define BALL_VEL_MIN          -4
#define BALL_VEL_MAX          2
#define USE_RANDOM_SPEEDS     false // lowk è meglio se è fissa (yk?)
#define BALL_W                2
#define BALL_H                2

#define MAX_SCORE             16

#include "text.h"
#include "player.h"
#include "ball.h"

float map_number(float value, float input_min, float input_max, float output_min, float output_max){
  float x = (value - input_min) / (input_max - input_min);
  return output_min + (output_max - output_min) * x;
}