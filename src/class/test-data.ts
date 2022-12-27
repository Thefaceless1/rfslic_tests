import * as fs from "fs";
import {RequestProp} from "./request-prop";
import {randomInt} from "crypto";
import {Catalogs} from "./catalogs";

export class TestData {
    public static files: TFiles[] = [];
    public static readonly fileNames = fs.readdirSync(RequestProp.fileDir);
    public static readonly dateNow: string = new Date().toLocaleDateString().split(".").reverse().join("-");
    public static readonly dateFuture: string = new Date(Date.now() + 5000000000).toLocaleDateString().split(".").reverse().join("-");
    public static readonly commentValue : string = "Тестовый комментарий";
    public static readonly descValue : string = "Тестовое описание";
    public static getRandomWord(): string {
        const alphabet: string = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
        let randomWord: string = "автотест|";
        while (randomWord.length < 20) {
            randomWord += alphabet[randomInt(0, alphabet.length)];

        }
        return randomWord;
    }
    public static addDataToFiles (name : string, id: string) : void {
        this.files.push(
            {
            name : name,
            storageId : id
            }
            )
    }
}
export type TFiles = {
    name : string,
    storageId : string
}