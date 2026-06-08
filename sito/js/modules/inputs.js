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
 * @property {string} placeholder Il placeholder
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

        if(!input.placeholder){
            console.log("Placeholder assente, defaulting a \"Scrivi qualcosa\"");
            input.placeholder = "Scrivi qualcosa"
        }

        this.#input_grid.push(input);
        return this;
    }

    /**
     * Crea l'elemento della griglia di bottoni
     * @returns {InputHandler} L'oggetto in esecuzione
     */
    create(){
        const input_grid = document.createElement("div");
        input_grid.classList.add("inputs");
        input_grid.style.display = "none";

        this.#input_grid.forEach((inp) => {
            const input = document.createElement("input");
            input.classList.add("input");
            input.innerText = inp.label;
            input.style.borderColor = inp.color;
            input.placeholder = inp.placeholder;
            
            input.addEventListener("click", inp.action);
            
            input_grid.append(input);
        })

        this.#parent_element.append(input_grid);

        this.#input_grid_element = input_grid;

        return this;
    }

    show(){
        this.#input_grid_element.style.display = "block";
    }
}

export { InputHandler };