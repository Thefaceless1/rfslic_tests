import {randomInt} from "crypto";

export class InputData {
    /**
     * Get current date
     */
    public static currentDate: string = new Date().toLocaleDateString('ru');
    /**
     * Test annotation date
     */
    public static testAnnotationDate: string = new Date().toLocaleString('ru');
    public static date1: string = new Date(Date.now() + 2000000000).toLocaleDateString();
    public static date2: string = new Date(Date.now() + 5000000000).toLocaleDateString();
    /**
     * Future date
     */
    public static get futureDate(): string {
        return new Date(Date.now() + 5000000000).toLocaleDateString();
    }
    /**
     * Random set of letters
     */
    public static get randomWord(): string {
        const alphabet: string = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
        let randomWord: string = "автотест|";
        const wordLength: number = 20;
        while(randomWord.length < wordLength) {
            randomWord += alphabet[randomInt(0, alphabet.length)];
        }
        return randomWord;
    }
}