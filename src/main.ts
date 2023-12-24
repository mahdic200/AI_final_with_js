
import Boot from "./boot"
import { setButtonAction } from "./helpers";


document.addEventListener('DOMContentLoaded', () => {
    setButtonAction(() => {
        new Boot();
    });
});


