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

class Score{
    /**
     * @type {HTMLDivElement}
     */
    #element;

    constructor(element){
        this.#element = element;
        this.scores = null;
    }

    /**
     * Aggiorna i punteggi dei due giocatori
     * @param {Object} player_scores 
     * @param {Object} player_scores.left Giocatore di sinistra
     * @param {string} player_scores.left.username Il nome utente
     * @param {Object} player_scores.right Giocatore di destra
     * @param {string} player_scores.right.username Il nome utente
     */
    set(player_scores){
        const plr_left_container = this.#element.querySelector(".left");
        const plr_right_container = this.#element.querySelector(".right");

        plr_left_container.querySelector(".username").innerText = player_scores.left.username;
        plr_left_container.querySelector(".val").innerText = this.scores.left;

        plr_right_container.querySelector(".username").innerText = player_scores.right.username;
        plr_right_container.querySelector(".val").innerText = this.scores.right;

        return this;
    }

    show(){
        this.#element.style.display = "flex";
    }

    hide(){
        this.#element.style.display = "none";
    }
}

export { Score };