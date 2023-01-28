import {randomInt} from "crypto";
import {Catalogs, TDocTypes, TLicAndDocStatus} from "../class/catalogs";
import {Api} from "./api";
import {FileReader} from "./file-reader";
import superagent from "superagent";

export class TestData {
    public static files: TFiles[] = [];
    public static readonly commentValue : string = "Тестовый комментарий";
    public static readonly descValue : string = "Тестовое описание";
    /**
     * Текущая дата
     */
    public static get todayDate () : string {
        return new Date().toLocaleDateString().split(".").reverse().join("-");
    }
    /**
     * Будущая дата
     */
    public static get futureDate () : string {
        return new Date(Date.now() + 5000000000).toLocaleDateString().split(".").reverse().join("-");
    }
    /**
     * Случайный набор букв
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
     * Заполнение свойства files
     */
    private static addDataToFiles (name : string, id: string) : void {
        this.files.push({name : name, storageId : id})
    }
    /**
     * Загрузка файлов на сервер
     */
    public static async uploadFiles() {
        if (this.files.length == FileReader.fileNames.length) return;
        const api = new Api();
        for (const fileName of FileReader.fileNames) {
            const files = await superagent.post(api.basicUrl + api.upload.upload).
            set("Content-Type", "multipart/form-data; boundary=----WebKitFormBoundaryoI4AK63JZr8jUhAa").
            attach("file", FileReader.fileDir + fileName);
            TestData.addDataToFiles(fileName,files.body.data);
        }
    }
    /**
     * Получение случайного числа для поля Минимальное количество
     */
    public static get randomIntForMulti () : number {
        return randomInt(2,10);
    }
    /**
     * Получение случайного числа для Типа документа пролицензии
     */
    public static randomIntForDocs (docTypes : TDocTypes[]) : number {
        return randomInt(0,docTypes.length);
    }
    /**
     * Получение случайного числа для статуса документа заявки
     */
    public static randomIntForDocStat (docStatus : TLicAndDocStatus[]) : number {
        return randomInt(0,docStatus.length);
    }
}
export type TFiles = {
    name : string,
    storageId : string
}