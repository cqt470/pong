class Text{
  private:
    Adafruit_SSD1306& display;
    
  public:
    Text(Adafruit_SSD1306& disp): display(disp){
      // codice
    };

    void show_loading(){
      // per qualche motivo se metto questo nel constructor non funziona, boh idk
      this->display.clearDisplay();
      this->display.setTextSize(1);
      this->display.setTextColor(SSD1306_WHITE);

      this->display.setCursor(0, 0);
      this->display.print("Caricando");
      this->display.display();
      delay(500);
      this->display.setCursor(0, 0);
      this->display.clearDisplay();
      this->display.print("Caricando.");
      this->display.display();
      delay(500);
      this->display.setCursor(0, 0);
      this->display.clearDisplay();
      this->display.print("Caricando..");
      this->display.display();
      delay(500);
      this->display.setCursor(0, 0);
      this->display.clearDisplay();
      this->display.print("Caricando...");
      this->display.display();
      delay(500);
      this->display.setCursor(0, 0);
      this->display.clearDisplay();
      this->display.display();
    }

    // https://forum.arduino.cc/t/adafruit-oled-how-to-center-text/617181/6
    void draw_centered_text(String string){
      int16_t x1, y1;
      uint16_t w, h;
      this->display.getTextBounds(string, 0, 0, &x1, &y1, &w, &h);

      int x = (this->display.width() - w) / 2;
      if (x < 0) x = 0;

      int y = (this->display.height() - h) / 2;
      if (y < 0) y = 0;

      this->display.setCursor(x, y);
      this->display.print(string);
    }

    void draw_score(int score1, int score2){
      String string = String(score1) + " | " + String(score2);
      
      this->draw_centered_text(string);
    }
};