import {TCriteriaGroups, TOrganization} from "./catalogs.type";

export type TUser = {
    id: number,
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
    groups: TCriteriaGroups[] | number[],
    clubs: TOrganization[] | number[],
    licTypes: []
}
export type TRole = {
    id?: number,
    name: string,
    description: string,
    isBase?: boolean,
    isClub: boolean,
    rights: string[]
}
export type TCritGroup = {
    id?: number,
    active?: boolean,
    name: string
}
export type TCritRank = {
    id?: number,
    code: string,
    description: string
}
export type TAddUser = {
    roleId: number,
    userId: number
}
export type TChangeUserRole = {
    roleId: number
}