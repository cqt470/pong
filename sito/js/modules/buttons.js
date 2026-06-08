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
    /**
     * @type {HTMLDivElement?}
     */
    #button_grid_element;
    #button_grid;
    #parent_element;

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
     * @param {ButtonElement} button Il bottone
     * @returns {ButtonHandler} L'oggetto in esecuzione
     */
    add_button(button){
        if(!button){
            console.warn("Oggetto assente");
            return;
        }

        if(!button?.label){
            console.warn("Label assente");
            return;
        }

        if(!button.color){
            console.log("Colore bottone assente, defaulting a #0059ff");
            button.color = "#0059ff";
        }

        this.#button_grid.push(button);
        return this;
    }

    /**
     * Crea l'elemento della griglia di bottoni
     * @returns {ButtonHandler} L'oggetto in esecuzione
     */
    create(){
        const btn_grid = document.createElement("div");
        btn_grid.classList.add("buttons");
        btn_grid.style.display = "none";

        this.#button_grid.forEach((btn) => {
            const button = document.createElement("button");
            button.classList.add("btn");
            button.innerText = btn.label;
            button.style.borderColor = btn.color;
            
            btn_grid.append(button);
        })

        this.#parent_element.append(btn_grid);

        this.#button_grid_element = btn_grid;

        return this;
    }

    show(){
        this.#button_grid_element.style.display = "block";
    }
}

export { ButtonHandler };