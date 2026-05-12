class Player{
  private:
    Adafruit_SSD1306& display;

  public:
    // false = sinistra
    // true = destra
    bool side;
    int posx; int posy;
    int score = 0;

    // vedi -> https://stackoverflow.com/questions/6576109/
    Player(bool side, Adafruit_SSD1306& disp): display(disp){
      this->side = side;
      this->posy = ((int) DISPLAY_H - BAR_HEIGHT) / 2;
    };

    void show(){
      int x_pos = BAR_OFFSET;
      if(side) x_pos = DISPLAY_W - BAR_OFFSET; // se side è true metto la barra a destra
      this->posx = x_pos;

      this->display.fillRect(x_pos, this->posy, BAR_WIDTH, BAR_HEIGHT, 1);
    }
};