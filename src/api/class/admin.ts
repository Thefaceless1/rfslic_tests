import {Catalogs, TCriteriaGroups, TOrganization} from "./catalogs";
import {TestData} from "../helpers/test-data";

export class Admin {
    public user: TUser[]
    public role: TRole[]
    public catalogs = new Catalogs()
    constructor() {
        this.user = []
        this.role = []
    }
    /**
     * 1. Add criteria groups to the user
     * 2. if user role have property value isClub=true then add clubs
     */
    public changeUser() : TUser {
        this.user[0].groups = [...this.catalogs.criteriaGrpId];
        if(this.catalogs.roles[1].isClub) this.user[0].clubs = [...this.catalogs.orgId];
        return this.user[0];
    }
    /**
     * Create new role
     */
    public addRole() : TRole {
        this.role.push({
            name : TestData.randomWord,
            isClub : true,
            description : TestData.descValue,
            rights : [...this.catalogs.rightsId]
        })
        return this.role[0];
    }
}

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