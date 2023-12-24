export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export function setResult(innerHTML: string) {
    let elem = document.querySelector("#result");
    if (elem) {
        elem!.innerHTML = innerHTML;
    } else {
        console.error('element with id result not found !')
    }
}

export function setButtonAction(action: () => any) {
    let elem: HTMLElement = document.querySelector("#start")!;
    if (elem) {
        elem.addEventListener('click', action);
    } else {
        console.error('element with id result not found !')
    }
}