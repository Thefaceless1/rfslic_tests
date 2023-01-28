import {Catalogs, TClubWorkers, TLicTypes, TOfi, TOrganization} from "./catalogs";
import {TestData} from "../helpers/test-data";
import {TProlicense} from "./prolicense";

export class License {
    public license : TLicense[]
    public catalogs = new Catalogs()
    constructor() {
        this.license = []
    }
    /**
     * Создание заявки на получение лицензии
     */
    public createLicense (prolicense : TProlicense[]) : TCreateLicense {
        const firstClubId : number = this.catalogs.organization[0].id;
        return {
            proLicId : prolicense[0].id as number,
            clubId : firstClubId
        }
    }
    /**
     * Добавление тела ответа от сервера в свойство license объекта класса
     */
    public addRespToLic(index : number,response : TLicense) : void {
        this.license[index] = response;
    }
    /**
     * Добавление документов и комментариев для заявки
     */
    public addCommentsAndDocuments () : TLicense {
        this.license[0].documents.forEach((document) => {
            document.comment = TestData.commentValue;
            document.files = TestData.files;
        })
        return this.license[0];
    }
    /**
     * Публикация заявки
     */
    public publishLicense () : TLicense {
        this.license[0].stateId = 1;
        this.license[0].state = "Новая";
        return this.license[0];
    }
    /**
     * Получение наименования статуса заявки по id статуса
     */
    public licStatusById(stateId : number) : string | null {
        if (!stateId) return null;
        else {
            const result  = this.catalogs.licStatus.find(value => value.id == stateId);
            return (result) ? result.name : "Статус по id не найден";
        }
    }
    /**
     * Получение наименования статуса документа по id статуса
     */
    public docStatusById(docStateId : number) : string {
        const result = this.catalogs.docStatus.find(value => value.id == docStateId);
        return (result) ? result.name : "Статус по id не найден";
    }
    /**
     * Добавление экспертов групп критериев и сотрудников клуба для группы критериев
     */
    public addClubWorkersToCritGrp () : TLicense {
        this.license[0].criteriaGroups.forEach((value, index) => {
            value.experts = this.catalogs.clubWorkersId;
            value.rfuExpert = this.catalogs.critGrpExperts[0].id;
        })
        return this.license[0];
    }
    /**
     * Добавление для документов критериев :
     * 1. Комментарии
     * 2. Если Тип документа != Cписок участников, ОФИ, Организация, то добавляем файлы
     * 3. Если Тип документа = Список участников, то добавляем участников
     * 4. Если тип документа = ОФИ, то добавляем офи
     * 5. Если тип документа = Организация, то добавляем организации
     */
    public addDataToCritDoc () {
        this.license[0].criteriaGroups.forEach((critGrp) => {
            critGrp.criterias.forEach((criterias) => {
                criterias.documents.forEach((documents) => {
                    documents.comment = TestData.commentValue;
                    switch (documents.docTypeId) {
                        case 5 : documents.externalIds = this.catalogs.clubWorkersId; break;
                        case 6 : documents.externalIds = this.catalogs.ofiId; break;
                        case 9 : documents.externalIds = this.catalogs.orgId; break;
                        default : documents.files = TestData.files;
                    }
                })
            })
        })
        return this.license[0];
    }
    /**
     * Добавление для  документов критериев :
     * 1.Комментарии
     * 2.Случайный статус
     */
    public addStatusToDocuments () : TLicense {
        this.license[0].documents.forEach((document) => {
            document.reviewComment = TestData.commentValue;
            document.stateId = this.catalogs.docStatus[TestData.randomIntForDocStat(this.catalogs.docStatus)].id;
        })
        this.license[0].criteriaGroups.forEach((criteriaGroup) => {
            criteriaGroup.criterias.forEach((criteria) => {
                criteria.documents.forEach((document) => {
                    document.reviewComment = TestData.commentValue;
                    document.stateId = this.catalogs.docStatus[TestData.randomIntForDocStat(this.catalogs.docStatus)].id;
                })
            })
        })
        return this.license[0];
    }
    /**
     * Расчет процентов заполнения лицензии после проставления решений по документам
     */
    public get licPercent () : number {
        let allDocsCount : number = 0;
        let checkedDocsCount : number = 0;
        this.license[0].documents.forEach((document) => {
            allDocsCount++;
            if (document.state == this.docStatusById(3) ||
                document.state == this.docStatusById(4) ||
                document.state == this.docStatusById(5))
                checkedDocsCount++;
        })
        this.license[0].criteriaGroups.forEach((criteriaGroup) => {
            criteriaGroup.criterias.forEach((criteria) => {
                criteria.documents.forEach((document) => {
                    allDocsCount++;
                    if (document.state == this.docStatusById(3) ||
                        document.state == this.docStatusById(4) ||
                        document.state == this.docStatusById(5))
                        checkedDocsCount++;
                })
            })
        })
        return Math.round((checkedDocsCount / allDocsCount) * 100);
    }
    /**
     * Проставление статуса "Выдана" для лицензии в целом
     */
    public addStatusToLicense () : TLicense {
        this.license[0].stateId = this.catalogs.issuedLicStatus.id;
        this.license[0].state = this.catalogs.issuedLicStatus.name;
        return this.license[0];
    }
    /**
     * Добавление отчета эксперта для групп критериев
     */
    public addExpertReport(grpId : number) : TExpertReport {
        return {
            groupId : grpId,
            conclusion : TestData.commentValue,
            recommendation : TestData.commentValue
        }
    }
    /**
     * Добавление участников и ОФИ для критериев с типами Участник и ОФИ
     */
    public addOfiAndUsers() : TLicense {
        this.license[0].criteriaGroups.forEach(critGrp => {
            critGrp.criterias[1].externalId = this.catalogs.clubWorkersId[0];
            critGrp.criterias[2].externalId = this.catalogs.ofiId[0];
            const iterationCount : number = 5;
            critGrp.criterias[iterationCount+1] = critGrp.criterias[2];
            for(let i=1; i<iterationCount; i++) {
                let newUser = {...critGrp.criterias[1]};
                let newOfi = {...critGrp.criterias[iterationCount+1]};
                const docCount : number = newUser.documents.length;
                for(let i = 0; i<docCount; i++) {
                    delete newUser.documents[i].id;
                    delete newOfi.documents[i].id
                }
                delete newUser.id;
                delete newOfi.id;
                newUser.orderNum = i;
                newOfi.orderNum = i;
                newUser.externalId = this.catalogs.clubWorkersId[i];
                newOfi.externalId = this.catalogs.ofiId[i];
                critGrp.criterias[i+1] = newUser;
                critGrp.criterias.push(newOfi);
            }
        })
        return this.license[0];
    }
}

export type TCreateLicense = {
    proLicId : number,
    clubId : number
}
export type TLicense = {
    id: number,
    proLicId: number,
    type: string,
    season: string,
    name: string,
    begin: string,
    end: string,
    clubId: number,
    requestBegin: string,
    requestEnd: string,
    docSubmitDate: string,
    dueDate: string,
    reviewDate: string,
    decisionDate: string,
    percent: number,
    stateId: number,
    state: string,
    docStateId: number,
    docState: string,
    documents: {
        id: number,
        proDocId: number,
        name: string,
        docTypeId: number,
        comment: string,
        reviewComment: string,
        stateId: number,
        state: string,
        templates: {
            id: number,
            name: string,
            storageId: string
        }[],
        files : {
            id?: number,
            name: string,
            storageId: string
        }[]
    }[],
    criteriaGroups : {
        groupId : number,
        name : string,
        percent : number,
        stateId : number,
        state : string,
        conclusion : string,
        recommendation : string,
        reportName : string,
        reportStorageId : string,
        experts : number[],
        rfuExpertChoice : number[],
        rfuExpert : number,
        details : {
            experts :TClubWorkers[],
            rfuExpertChoice : TClubWorkers[],
            rfuExpert : TClubWorkers
        }
        criterias : {
            id?: number,
            proCritId: number,
            number: string,
            categoryId: number,
            name: string,
            description: string,
            isMulti: number,
            typeId: number,
            orderNum: number,
            docSubmitDate: string,
            reviewDate: string,
            external : string,
            externalId: number,
            comment: string,
            percent: number,
            stateId: number,
            state: string,
            documents: {
                id?: number,
                proDocId: number,
                name: string,
                docTypeId: number,
                comment: string,
                reviewComment: string,
                externalIds : number[],
                externals : TOfi[] | TOrganization[],
                stateId: number,
                state: string,
                templates: {
                    id: number,
                    name: string,
                    storageId: string
                }[],
                files : {
                    id?: number,
                    name: string,
                    storageId: string
                }[]
            }[]
        }[]
    }[]
}
export type TExpertReport = {
    groupId: number,
    conclusion: string,
    recommendation: string
}

