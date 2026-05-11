class Player{
  private:
    // senza & non funziona, perché crea una copia e non un riferimento (pointer type shi yk)
    Adafruit_SSD1306& display;

  public:
    bool side;
    int posx; int posy;
    int score = 0;

    // false = sinistra
    // true = destra
    // vedi -> https://stackoverflow.com/questions/6576109/
    Player(bool side, Adafruit_SSD1306& disp): display(disp){
      this->side = side;
      this->posy = ((int) DISPLAY_H - BAR_HEIGHT) / 2;
    };

    void show(){
      int x_pos = 8;
      if(side) x_pos = DISPLAY_W - 8; // mette la sbarra a destra yk
      this->posx = x_pos;

      this->display.fillRect(x_pos, this->posy, BAR_WIDTH, BAR_HEIGHT, 1);
    }
};