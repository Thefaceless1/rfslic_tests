
export class Matrix {

    public static sumProdDiags (matrix: number[][]): number {
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
}
console.log(Matrix.sumProdDiags([
    [1, 2, 3, 2, 1],
    [2, 3, 4, 3, 2],
    [3, 4, 5, 4, 3],
    [4, 5, 6, 5, 4],
    [5, 6, 7, 6, 5]]))