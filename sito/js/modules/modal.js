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

import { ButtonHandler } from "./buttons.js";

class Modal{
    #parent_element;
    /**
     * @type {HTMLDivElement?}
     */
    #modal_div;

    /**
     * Gestisce i modal nella pagina
     * @param {HTMLDivElement} parent_element L'elemento padre dove all'interno ci sarà il modal
     */
    constructor(parent_element){
        this.#parent_element = parent_element;
    }

    /**
     * Crea l'elemento del modal
     * @returns nulla
     */
    create(){
        const modal_div = document.createElement("div");
        modal_div.classList.add("modal");
        
        const title = document.createElement("p");
        title.classList.add("title");
        const desc = document.createElement("p");
        desc.classList.add("desc");

        title.style.display = "none";
        desc.style.display = "none";

        modal_div.append(title, desc);
        this.#parent_element.append(modal_div);

        this.#modal_div = modal_div;
        this.button_handler = new ButtonHandler(modal_div);
    }

    /**
     * Imposta il contenuto del modal
     * @param {Object} data I dati da impostare
     * @param {string} data.title Il titolo del modal 
     * @param {string?} data.desc La descrizione del modal 
     */
    set_content(data){
        if(!data){
            console.warn("Contenuto mancante");
            return;
        }

        const title = data?.title;
        const desc = data?.desc;

        if(!title){
            console.warn("Titolo mancante");
            return
        }

        const title_p = this.#modal_div.querySelector("p.title");
        const desc_p = this.#modal_div.querySelector("p.desc");
        
        if(desc){
            desc_p.textContent = desc;
            desc_p.style.display = "block";
        }else{
            desc_p.style.display = "none";
        }

        title_p.textContent = title;
        title_p.style.display = "block";
    }

    /**
     * Mostra il modal
     * @returns nulla
     */
    show(){
        this.#modal_div.style.display = "flex";
    }

    /**
     * Nasconde il modal
     * @returns nulla
     */
    hide(){
        this.#modal_div.style.display = "none";
    }
}

export { Modal };