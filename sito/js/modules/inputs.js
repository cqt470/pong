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
 * @typedef {Object} InputElement
 * @property {string} label Il testo da mostrare
 * @property {string} color Il colore da mostrare sul bordo e sul fill. Default: #0059ff
 * @property {"text"} type Il tipo di input
 */

class InputHandler{
    /**
     * @type {HTMLDivElement?}
     */
    #input_grid_element;
    #input_grid;
    #parent_element;

    /**
     * Gestisce i modal nella pagina
     * @param {HTMLDivElement} parent_element L'elemento padre dove all'interno ci sarà il modal
     */
    constructor(parent_element){
        this.#parent_element = parent_element;
        this.#input_grid = [];
    }

    /**
     * Aggiunge un bottone alla lista
     * @param {InputElement} input Il bottone
     * @returns {InputHandler} L'oggetto in esecuzione
     */
    add_input(input){
        if(!input){
            console.warn("Oggetto assente");
            return;
        }

        if(!input?.label){
            console.warn("Label assente");
            return;
        }

        if(!input?.color){
            console.log("Colore bottone assente, defaulting a #0059ff");
            input.color = "#0059ff";
        }

        if(!input?.action){
            input.action = function(){
                return;
            }
        }

        this.#input_grid.push(input);
        return this;
    }

    /**
     * Crea l'elemento della griglia di bottoni
     * @returns {InputHandler} L'oggetto in esecuzione
     */
    create(){
        const btn_grid = document.createElement("div");
        btn_grid.classList.add("inputs");
        btn_grid.style.display = "none";

        this.#input_grid.forEach((btn) => {
            const input = document.createElement("input");
            input.classList.add("btn");
            input.innerText = btn.label;
            input.style.borderColor = btn.color;
            
            input.addEventListener("click", btn.action);
            
            btn_grid.append(input);
        })

        this.#parent_element.append(btn_grid);

        this.#input_grid_element = btn_grid;

        return this;
    }

    show(){
        this.#input_grid_element.style.display = "block";
    }
}

export { InputHandler };