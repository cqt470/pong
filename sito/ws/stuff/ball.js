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

class Ball{
    /**
     * L'oggetto della pallina
     * @see ball.h
     */
    constructor(){
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

        this.display = {
            "x": 86,
            "y": 43,
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

    update_position(){
        this.#check_margins();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        utils.log(`${this.position.x}, ${this.position.y}`);
    }
}

module.exports = { Ball };