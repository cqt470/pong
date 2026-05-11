class Ball{
  private:
    Adafruit_SSD1306& display;
    Player& player_left;
    Player& player_right;
    // turn = false (tocca a sinistra), turn = true (tocca a destra)
    bool turn = false;

    //                  pointer type shi
    void randomize_velocity(int& value){
      // ho notato che il robo non può generare numeri sotto 0, quindi se
      // in totale il range è -8, 8; io faccio generare numeri da 0 a 16.
      // poi, se il numero è sotto 8 gli metto semplicemente un meno
      //                                   se per qualche motivo è negativo
      int abs_random_value = abs(BALL_VEL_MIN) + abs(BALL_VEL_MAX);
      int random_value = random(abs_random_value + 1); // da 0 a abs_random_value. Numero massimo incluso
      int half_value = (int) (abs_random_value / 2);

      if(random_value < half_value){
        random_value -= random_value * 2; // 9 - 9 * 2 = 9 - 18 = -9
      }else{
        random_value -= half_value; // 15 - (es: 8) = 7. non esce dal range (es: -8 )
      }

      if(random_value == 0) random_value = 1; // così la velocità non è mai 0

      if(random_value < 0) this->turn = !this->turn;

      value = random_value;
    }

    void check_margins(){
      // premessa: la posizione è l'angolo in alto a sinistra
      
      if(this->posx <= 0){
        this->posx = 0;
        this->velx = -this->velx;
      }else if(this->posx >= DISPLAY_W - BALL_W){
        // considera le dimensioni per la collisione
        this->posx = DISPLAY_W - BALL_W;
        this->velx = -this->velx;
      }

      if(this->posy <= 0){
        this->posy = 0;
        this->vely = -this->vely;
      }else if(this->posy >= DISPLAY_H - BALL_H){
        this->posy = DISPLAY_H - BALL_H;
        this->vely = -this->vely;
      }
    }

    // la bar è il paddle, tipo la barra che si muove yk
    void check_single_bar_collisions(int plr_x, int plr_y){
      int ball_left = this->posx;
      int ball_right = this->posx + BALL_W - 1;
      int ball_top = this->posy;
      int ball_bottom = this->posy + BALL_H - 1;

      if(
        plr_x <= ball_right &&
        (plr_x + BAR_WIDTH - 1) >= ball_left &&
        plr_y <= ball_bottom &&
        (plr_y + BAR_HEIGHT - 1) >= ball_top
      ){
        this->velx = -this->velx;
        this->turn = !this->turn;
      }
    }

    void check_bar_collisions(){
      this->check_single_bar_collisions(this->player_left.posx, this->player_left.posy);
      this->check_single_bar_collisions(this->player_right.posx, this->player_right.posy);
    }

    void check_win_conditions(){
      if(
        this->posx < BAR_OFFSET && // dietro alla paddle
        (this->posy < this->player_left.posy ||                    // sopra la paddle
        this->posy > (this->player_left.posy + BAR_HEIGHT - 1))    // oppure sotto
      ){
        this->init();
        this->player_right.score++;
      }else if(
        this->posx > (DISPLAY_W - BAR_OFFSET) && // dietro alla paddle
        (this->posy < this->player_right.posy ||                    // sopra la paddle
        this->posy > (this->player_right.posy + BAR_HEIGHT - 1))    // oppure sotto
      ){
        this->init();
        this->player_left.score++;
      }
    }

  public:
    int posx; int posy;
    int velx; int vely;

    Ball(Adafruit_SSD1306& disp, Player& left, Player& right): display(disp), player_left(left), player_right(right){
      this->init();
    };

    void init(){
      // metto la ball al centro ykyk
      this->posx = (int) DISPLAY_W / 2; this->posy = (int) DISPLAY_H / 2;
      this->randomize_velocities();
    }

    void randomize_velocities(){
      this->randomize_velocity(this->velx);
      this->randomize_velocity(this->vely);
    }

    void move(){
      this->check_win_conditions();
      this->check_margins();
      this->check_bar_collisions();
      this->posx += this->velx; this->posy += this->vely;
      this->show();
    }

    void show(){
      this->display.drawRect(this->posx, this->posy, 2, 2, 1);
    }
};