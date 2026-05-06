#define PIN_POTENTIOMETER     A0

#define DISPLAY_W             128
#define DISPLAY_H             32
#define PIN_SCL               A5
#define PIN_SDA               A4
#define SCREEN_ADDRESS        0x3C

#define BAR_HEIGHT            4
#define BAR_WIDTH             2

class Player{
  private:
    // senza & non funziona, perché crea una copia e non un riferimento (pointer type shi yk)
    Adafruit_SSD1306& display;

  public:
    bool side;
    int position;

    // false = sinistra
    // true = destra
    // vedi -> https://stackoverflow.com/questions/6576109/
    Player(bool side, Adafruit_SSD1306& disp): display(disp){
      this->side = side;
      this->position = (int) DISPLAY_H / 2; // lo mette in mezzo allo schermo type shi
    };

    void show(){
      Serial.println("we figaa");
      this->display.clearDisplay();
      this->display.writeFillRect(8, this->position, BAR_WIDTH, BAR_HEIGHT, 1);
      this->display.display();
      Serial.println("we figaa");
    }
};

float map_number(float value, float input_min, float input_max, float output_min, float output_max){
  float x = (value - input_min) / (input_max - input_min);
  return output_min + (output_max - output_min) * x;
}