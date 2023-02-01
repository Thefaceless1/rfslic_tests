import {TCriteriaGroups} from "./catalogs";

export class Admin {
    public user: TUser[];
    constructor() {
        this.user = []
    }
}

export type TUser = {
    id?: number,
    details: {
        id: number,
        rfsId: number,
        fio: string,
        firstName: string,
        middleName: string,
        lastName: string,
        birthDate: string,
        orgName: string,
        position: string,
        sportRole: string
    },
    roleId: number,
    active: boolean,
    rights: string[],
    groups: TCriteriaGroups[],
    clubs: [],
    licTypes: []
}