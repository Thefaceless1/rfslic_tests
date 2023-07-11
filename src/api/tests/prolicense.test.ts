import {test, expect, describe} from "@jest/globals";
import {TestData} from "../helpers/test-data";
import {Prolicense} from "../helpers/prolicense";
import {ProlicenseStatus} from "../helpers/enums/prolicense-status";
import {Hooks} from "../helpers/hooks/hooks";
import {ProlicTypes} from "../helpers/enums/prolic-types";
import {InstanceApi} from "../helpers/api/instance.api";

describe("Prolicense", () => {
    const prolicense = new Prolicense();
    Hooks.beforeProlic(prolicense);

    test("Creating a prolicense", async () => {
        await prolicense.createProlicense();
        expect(prolicense.prolicense[0].id).toBeTruthy();
        expect(prolicense.prolicense[0].stateId).toBe(ProlicenseStatus.unpublished);
        expect(prolicense.prolicense[0].begin && prolicense.prolicense[0].requestBegin).toBe(TestData.currentDate);
        expect(
            prolicense.prolicense[0].end &&
            prolicense.prolicense[0].requestEnd &&
            prolicense.prolicense[0].docSubmitDate &&
            prolicense.prolicense[0].dueDate &&
            prolicense.prolicense[0].reviewDate &&
            prolicense.prolicense[0].decisionDate).
        toBe(TestData.futureDate);
    })
    test("Changing a prolicense", async () => {
        await prolicense.changeProlicense();
        expect(prolicense.prolicense[0].proLicType).toBe(ProlicTypes.finControl);
        expect(prolicense.prolicense[0].dueDate).toBeNull();
        expect(prolicense.prolicense[0].begin).toBeNull();
        expect(prolicense.prolicense[0].end).toBeNull();
    })
    test("Creating prolicense criteria groups", async () => {
        await prolicense.createCriteriaGroups();
        for(const group of prolicense.criterias) {
            expect(group.id).not.toBeNull();
            expect(group.experts.length).toBe(prolicense.critGrpExpertsId.length);
        }
    })
    test("Creating prolicense criterias", async () => {
        await prolicense.createCriterias();
        for(const group of prolicense.criterias) {
            expect(group.criterias).not.toBeNull();
        }
    })
    test("Changing prolicense criterias", async () => {
        await prolicense.changeCriterias();
    })
    test("Clone a prolicense", async () => {
        await prolicense.cloneProlicense();
        expect(prolicense.prolicense[1].id).not.toBe(prolicense.prolicense[0].id);
        expect(prolicense.prolicense[1].requestBegin).toBe(prolicense.prolicense[0].requestBegin);
        expect(prolicense.prolicense[1].requestEnd).toBe(prolicense.prolicense[0].requestEnd);
        expect(prolicense.prolicense[1].docSubmitDate).toBe(prolicense.prolicense[0].docSubmitDate);
        expect(prolicense.prolicense[1].reviewDate).toBe(prolicense.prolicense[0].reviewDate);
        expect(prolicense.prolicense[1].decisionDate).toBe(prolicense.prolicense[0].decisionDate);
        expect(prolicense.prolicense[1].dueDate).toBe(prolicense.prolicense[0].dueDate);
        expect(prolicense.prolicense[1].stateId).toBe(ProlicenseStatus.unpublished);
        for(const document of prolicense.prolicense[1].documents) {
            const docIndex: number = prolicense.prolicense[1].documents.indexOf(document);
            expect(document.name).toBe(prolicense.prolicense[0].documents[docIndex].name);
        }
    })
    test("Removing a prolicense", async () => {
        const responseStatus: string = await prolicense.deleteProlicense()
        expect(responseStatus).toBe(InstanceApi.successResponseStatus);
    })
    test("Removing prolicense criterias", async () => {
        await prolicense.deleteCriterias();
        for(const group of prolicense.criterias) {
            expect(group.criterias.length).toBe(0);
        }
    })
    test("Removing criteria groups", async () => {
        await prolicense.deleteCriteriaGroups();
        expect(prolicense.criterias.length).toBe(0);
    })
    test("Publish prolicense",async () => {
        await prolicense.publishProlicense();
        expect(prolicense.prolicense[0].stateId).toBe(ProlicenseStatus.published);
    })
    test("Unpublish a prolicense", async () => {
        await prolicense.unpublishProlicense();
        expect(prolicense.prolicense[0].stateId).toBe(ProlicenseStatus.unpublished);
    })
})