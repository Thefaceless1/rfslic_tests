import {randomInt} from "crypto";

export class InputData {
    /**
     * Получение сегодняшней даты
     */
    public static get todayDate () : string {
        return new Date().toDateString();
    }
    /**
     * Получение уникального наименования
     */
    public static get currentDate () : string {
        const dateNow : string = new  Date().toLocaleString();
        return `автотест|${dateNow}`;
    }
    /**
     * Случайное слово до 20 символов
     */
    public static get randomWord () : string {
        const alphabet: string = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
        let randomWord: string = "автотест|";
        while (randomWord.length < 20) {
            randomWord += alphabet[randomInt(0, alphabet.length)];

        }
        return randomWord;
    }
    /**
     * Случайное число для поля "Минимальное количество"
     */
    public static get randomIntForMulti () : string {
        return String(randomInt(2,10));
    }
}