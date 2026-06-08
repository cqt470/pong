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

/**
 * Elemento bottone
 * @typedef {Object} ButtonElement
 * @property {string} label Il testo da mostrare
 * @property {string} color Il colore da mostrare sul bordo e sul fill. Default: #0059ff
 */

class ButtonHandler{
    #parent_element; #button_grid;

    /**
     * Gestisce i modal nella pagina
     * @param {HTMLDivElement} parent_element L'elemento padre dove all'interno ci sarà il modal
     */
    constructor(parent_element){
        this.#parent_element = parent_element;
        this.#button_grid = [];
    }

    /**
     * Aggiunge un bottone alla lista
     * @param {ButtonElement} button 
     */
    add_button(button){
        if(!button?.label){
            console.warn("Label assente");
            return;
        }

        if(!button.color){
            console.warn("Colore assente, defaulting a #0059ff");
            button.color = "#0059ff";
        }

        this.#button_grid.push(button);
    }

    /**
     * Crea l'elemento della griglia di bottoni
     * @returns nulla
     */
    create(){
        console.log("ciao")
    }
}

export { ButtonHandler };