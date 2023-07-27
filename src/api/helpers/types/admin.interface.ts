import {CriteriaGroupInterface, OrganizationInterface} from "./catalogs.interface";

export interface UserInterface  {
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
    groups: CriteriaGroupInterface[] | number[],
    clubs: OrganizationInterface[] | number[],
    licTypes: []
}

export interface RoleInterface {
    id?: number,
    name: string,
    description: string,
    isBase?: boolean,
    isClub: boolean,
    rights: string[]
}

export interface CritGroupInterface {
    id?: number,
    active?: boolean,
    name: string
}

export interface CritRankInterface {
    id?: number,
    code: string,
    description: string
}

export interface AddUserInterface {
    roleId: number,
    userId: number
}

export interface ChangeRoleInterface {
    roleId: number
}