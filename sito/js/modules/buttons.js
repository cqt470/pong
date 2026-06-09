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
 * @property {() => string|number|null} [action] Cosa fare al click, opzionale
 * @see https://stackoverflow.com/questions/44146018/jsdoc-how-to-assign-a-function-as-a-property-of-another-function
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

        if(!button?.color){
            console.log("Colore bottone assente, defaulting a #0059ff");
            button.color = "#0059ff";
        }

        if(!button?.action){
            button.action = function(){
                return;
            }
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
            
            button.addEventListener("click", btn.action);
            
            btn_grid.append(button);
        })

        this.#parent_element.append(btn_grid);

        this.#button_grid_element = btn_grid;

        return this;
    }

    show(){
        if(!this.#button_grid_element) return;
        this.#button_grid_element.style.display = "block";
    }

    hide(){
        if(!this.#button_grid_element) return;
        this.#button_grid_element.style.display = "none";
    }

    reset(){
        this.#button_grid = [];
    }
}

export { ButtonHandler };