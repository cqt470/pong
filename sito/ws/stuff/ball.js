/*

          © 2026 cqt470 - Gioele Cairo.

               (\
                ))         )  \ \
               ((         /    . (
                \\.-"```"'`   = _/=
                  >    ,       /
                   \   )__.\  |
                    > / /  || \\
                    \\ \\  \\  \\
                     `" `"  `"  `"

*/

const { utils } = require("./utils");
const { Player } = require("./player");

class Ball{
    /**
     * L'oggetto della pallina
     * @param {Object} players I giocatori
     * @param {Player} players.player_left Giocatore sinistra
     * @param {Player} players.player_right Giocatore destra
     * @see ball.h
     */
    constructor(players){
        this.#randomize_ball();

        this.display = {
            "x": 85,
            "y": 43,
            "paddle_offset": 8,
            "paddle_height": 8
        }

        this.players = {
            "left": players.player_left,
            "right": players.player_right,
        }
    }

    #randomize_ball(){
        this.position = {
            "x": utils.random_number(16, 70, true),
            "y": utils.random_number(4, 36, true)
        };

        this.velocity = {
            "x": utils.random_number(0, 1, true),
            "y": utils.random_number(0, 1, true)
        }
        if(this.velocity.x == 0) this.velocity.x = -1;
        if(this.velocity.y == 0) this.velocity.y = -1;
    }

    #check_single_bar_collisions(plr_x, plr_y, turn){
        // check collisione
        if(turn){
            if(
                this.position.x == plr_x &&
                (this.position.y > plr_y && this.position.y < (plr_y + 12))
            ){
                this.velocity.x *= -1;
            }
        }else{
            if(
                this.position.x == plr_x &&
                (this.position.y > plr_y && this.position.y < (plr_y + 12))
            ){
                this.velocity.x *= -1;
            }
        }

        // check punteggio
        if(turn){
            if(
                this.position.x < plr_x &&
                (this.position.y > plr_y && this.position.y < (plr_y + 12))
            ){
                this.players.right.score += 1;
            }
        }else{
            if(
                this.position.x > plr_x &&
                (this.position.y > plr_y && this.position.y < (plr_y + 12))
            ){
                this.players.left.score += 1;
            }
        }
    }

    #check_bar_collisions(){
        this.#check_single_bar_collisions(this.display.paddle_offset, this.players.left.position, true);
        this.#check_single_bar_collisions((this.display.x - this.display.paddle_offset), this.players.right.position, false);
    }

    #check_win_conditions(){
        if(this.position.x < this.display.paddle_offset){
            this.#randomize_ball();
            this.players.right.score += 1;
        }

        if(this.position.x > (this.display.x - this.display.paddle_offset)){
            this.#randomize_ball();
            this.players.left.score += 1;
        }
    }

    #check_margins(){
        if(this.position.x <= 0){
            this.position.x = 0;
            this.velocity.x *= -1;
        }else if(this.position.x >= this.display.x){
            this.position.x = this.display.x;
            this.velocity.x *= -1;
        }

        if(this.position.y <= 0){
            this.position.y = 0;
            this.velocity.y *= -1;
        }else if(this.position.y >= this.display.y){
            this.position.y = this.display.y;
            this.velocity.y *= -1;
        }
    }

    update_position(left_position, right_position){
        this.players.left.position = left_position;
        this.players.right.position = right_position;

        this.#check_win_conditions();
        this.#check_margins();
        this.#check_bar_collisions();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // utils.log(`${this.position.x}, ${this.position.y}`);
    }

    get_scores(){
        return {"l": this.players.left.score, "r": this.players.right.score}
    }
}

module.exports = { Ball };