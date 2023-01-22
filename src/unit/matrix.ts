
export class Matrix {
    // Условия задачи на данный метод https://www.codewars.com/kata/590bb735517888ae6b000012
    public static sumProdDiags (matrix: number[][]): number | string {
        if(matrix.length == 0) return "Invalid data";
        for(const i of matrix) {
            if (
                (i.some(element => element == 0 || element > 9 || element < -9 || !Number.isInteger(element)))
                || (i.length != matrix.length)
            ) return "Invalid data";
        }
        const sum1 : number = this.sumDiags(matrix);
        const reverseMatrix = matrix.map(value => value.reverse());
        const sum2 : number = this.sumDiags(reverseMatrix);
        return sum1-sum2;
    }
    private static sumDiags (matrix : number[][]) : number {
        let sum : number = 0
        matrix.forEach((value, index, array) => {
            if(index != 0) value = value.slice(0,1);
            value.forEach((elem, elemIndex) => {
                let semiSum : number = elem;
                for(let i = 1; i<array.length-elemIndex; i++) {
                    if (index == 0)
                        semiSum *= array[i][i + elemIndex];
                    else {
                        if (i + index == array.length - elemIndex)
                            break;
                        semiSum *= array[i + index][i + elemIndex];
                    }
                }
                sum+=semiSum;
            })
        })
        return sum;
    }
    //Условия задачи на данный метод https://www.codewars.com/kata/590b8d5cee471472f40000aa
    public static upDownColSort(matrix: number[][]): number[][] | string {
        if(matrix.length == 0 || matrix.some(value => value.length ==0)) return "Invalid data";
        let countRowNumb : number = 0
        for(const i of matrix) {
            const index : number = matrix.indexOf(i);
            if(i.some(number => isNaN(number) || number == Infinity)) return "Invalid data";
            if(index == 0) countRowNumb = i.length
            if(index>0 && countRowNumb != i.length) return "Invalid data";
        }
        let i : number = matrix.length - 1;
        const result : number[][] = []
        const ascNumbers : number[] = matrix.flat().sort((a : number, b : number) => a-b);
        ascNumbers.forEach((value, index) => {
            if(index<matrix.length) result.push([value]);
            else if( i>= 0 && result[0].length <= result[result.length-1].length) {
                result[i].push(value);
                i--;
            }
            else {
                i++;
                result[i].push(value);
            }
        })
        return result;
    }
}