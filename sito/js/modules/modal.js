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

class Modal{
    #parent_element;

    /**
     * Gestisce i modal nella pagina
     * @param {HTMLDivElement} parent_element L'elemento padre dove all'interno ci sarà il modal
     */
    constructor(parent_element){
        this.#parent_element = parent_element;
    }

    create(){
        const modal_div = document.createElement("div");

        this.#parent_element.append(modal_div);
    }
}

export { Modal };