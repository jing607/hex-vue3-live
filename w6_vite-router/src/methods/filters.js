// 在這裡定義 currency 和 date 的 filter
// 在 main.js註冊後，可在模板中可直接使用

export function date(time) {
    const localDate = new Date(time * 1000);
    return localDate.toLocaleDateString();
}

export function currency(num) {
    const n = parseInt(num, 10);
    return `${n.toFixed(0).replace(/./g, (c, i, a) => (i && c !== '.' && ((a.length - i) % 3 === 0) ? `, ${c}`.replace(/\s/g, '') : c))}`;
}