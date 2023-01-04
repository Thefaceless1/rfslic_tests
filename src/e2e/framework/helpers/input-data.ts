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
    public static get getRandomWord () : string {
        const dateNow : string = new  Date().toLocaleString();
        return `автотест|${dateNow}`;
    }
}