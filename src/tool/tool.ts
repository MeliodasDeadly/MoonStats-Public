interface TimeStamp {
    date: any;
}

export function timestamp(props: TimeStamp) {
    let date = props.date;
    date = date * 1000
    let b = (date + Date.now()) / 1000
    return `<t:${b}:R>`
}

export function codeGenerator() {
    let code = `${Math.floor(Math.random() * 1000000)}`;
    code = code.padStart(6, '0');
    code = code.replace(/(\d{3})(\d{3})/, '$1-$2');
    // add some special characters

    return code;
}