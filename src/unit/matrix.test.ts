import {describe, test} from "@jest/globals";
import {colSortData, sumProdDiagsData} from "./testdata";
import {Matrix} from "./matrix";

describe("class 'Matrix' ",() => {
    for(const data of sumProdDiagsData) {
        test(`sumProdDiags method with data : ${data.enteredData}`,() => {
            expect(Matrix.sumProdDiags(data.enteredData)).toBe(data.expectedResult);
        })
    }
    for(const data of colSortData) {
        test(`upDownColSort method with data : ${data.enteredData}`,() => {
            expect(Matrix.upDownColSort(data.enteredData)).toEqual(data.expectedResult);
        })
    }
})