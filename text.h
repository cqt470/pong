class Text{
  private:
    Adafruit_SSD1306& display;
    
  public:
    Text(Adafruit_SSD1306& disp): display(disp){
      this->display.set
    };

    void show_loading(){
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

    void draw_score(int score1, int score2){
      // this->display.setTextAlignment(TEXT_ALIGN_CENTER);
      this->display.setCursor(0, 0);
      this->display.print("Testo centrato");
    }
};