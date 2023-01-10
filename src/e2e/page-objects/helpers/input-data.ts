import {randomInt} from "crypto";

export class InputData {
    /**
     * Получение сегодняшней даты
     */
    public static todayDate  : string = new Date().toDateString();
    /**
     * Случайное число для поля "Минимальное количество"
     */
    public static randomIntForMulti : string = String(randomInt(2,10));
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
}