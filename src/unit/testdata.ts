type TDiagsData = {
    enteredData : number[][],
    expectedResult : number | string
}[]
export const sumProdDiagsData : TDiagsData = [
    {
        enteredData : [[ 1,  4, 7,  6,  5], [-3,  2, 8,  1,  3], [ 6,  2, 9,  7, -4], [ 1, -2, 4, -2,  6], [ 3,  2, 2, -4,  7]],
        expectedResult : 1098
    },
    {
        enteredData : [[1, 4, 7, 6], [-3, 2, 8, 1], [6, 2, 9, 7], [1, -2, 4, -2]],
        expectedResult : -11
    },
    {
        enteredData : [[1, 2, 3, 2, 1], [2, 3, 4, 3, 2], [3, 4, 5, 4, 3], [4, 5, 6, 5, 4], [5, 6, 7, 6, 5]],
        expectedResult : 0
    },
    {
        enteredData : [[1, 2, 3, 2, 1], [2, 3, 4, 3, 2], [3, 4, 5, 4, 3], [4, 5, 6, 5, 4], [5, 6, 7, 6, 5]],
        expectedResult : 0
    },
    {
        enteredData : [[2, 1, 5], [2, -3, -4], [3, 4, 5]],
        expectedResult : 34,
    },
    {
        enteredData : [[8, 1], [2, -8]],
        expectedResult : -63,
    },
    {
        enteredData : [[5]],
        expectedResult : 0,
    },
    {
        enteredData : [[-6]],
        expectedResult : 0,
    },
    {
        enteredData : [[ 5,  4, 9,  2,  1, -2], [-2,  2, 3,  5,  3, 8], [ 6,  5, 9,  1, -4, 1], [ 1, -2, 4, -2,  6, -1], [ 3,  2, 2, -4,  7, 5],[ 2,  3, 2, -4,  7, 1]],
        expectedResult : 354,
    },
    {
        enteredData : [[-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1]],
        expectedResult : 0,
    },
    {
        enteredData : [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
        expectedResult : 0,
    },
    {
        enteredData : [[9, -9,],[-9, 9]],
        expectedResult : -36,
    },
    {
        enteredData : [[1, Number(true), 1], [1, 1, 1], [1, 1, 1]],
        expectedResult : 0,
    },
    {
        enteredData : [[0]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[1.1]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[-2.3]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[10, 2, 1], [1, 5, -3], [1, 2, 1]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[9, 5, 1], [1, 5, -3], [1, 2, -10]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[9, 5, 1], [1, 5.3, -3], [1, 2.66, -1]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[9, NaN, 1], [1, 5, -3], [1, 2, -1]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[9, 5, 1], [1, 5, -3], [1, 0, -1]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[3, 3, 1], [1, 5, -3], [1, 5]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[6, 6, 1], [1, 6, -3]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[1], [1, 6, -3]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[ 5,  4, 9,  2,  1], [-2,  2, 3,  5,  3, 8], [ 6,  5, 9,  1, -4, 1], [ 1, -2, 4, -2,  6, -1], [ 3,  2, 2, -4,  7, 5],[ 2,  3, 2, -4,  7, 1]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[1, 1, 1], [1, Number(undefined), 1], [1, 1, 1]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[1, Number(null), 1], [1, 1, 1], [1, 1, 1]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[1, Number("53g"), 1], [1, 1, 1], [1, 1, 1]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[1, Number(false), 1], [1, 1, 1], [1, 1, 1]],
        expectedResult : "Invalid data",
    },
]

type TColSortData = {
    enteredData : number[][],
    expectedResult : number[][] | string
}[]
export const colSortData : TColSortData = [
    {
        enteredData : [[-20, -4, -1], [  1,  4,  7], [  8, 10, 12]],
        expectedResult : [[-20, 7, 8], [-4, 4, 10], [-1, 1, 12]],
    },
    {
        enteredData : [[1,-1,4, 1], [7,-20,12,0], [8,10,-4,-3]],
        expectedResult : [[-20, 1, 1, 12], [-4, 0, 4, 10], [-3, -1, 7, 8]],
    },
    {
        enteredData : [[1,-1,4, 1], [7,-20,12,0], [8,10,-4,-3], [5,6,6,8]],
        expectedResult : [[-20, 4, 5, 12], [-4, 1, 6, 10], [-3, 1, 6, 8], [-1, 0, 7, 8]],
    },
    {
        enteredData : [[-1.2, 5, -1], [  1,  4,  7], [  8, -232, 12]],
        expectedResult : [[ -232, 5, 7 ], [ -1.2, 4, 8 ], [ -1, 1, 12 ]],
    },
    {
        enteredData : [[-1.2, -500, -1], [  1,  4.23,  7], [  8, -232, -12], [-1.2, 5, -1]],
        expectedResult : [[ -500, 1, 4.23 ], [ -232, -1, 5 ], [ -12, -1, 7 ], [ -1.2, -1.2, 8 ]],
    },
    {
        enteredData : [[-132, -500, -1], [  1,  4.23,  -1.1], [  1000, -232, -12], [-1.2, 5, -1], [0, -500, -1]],
        expectedResult : [[ -500, -1, 0 ], [ -500, -1, 1 ], [ -232, -1, 4.23 ], [ -132, -1.1, 5 ], [ -12, -1.2, 1000 ]],
    },
    {
        enteredData : [[-132, -500, -1]],
        expectedResult : [[ -500, -132, -1 ]],
    },
    {
        enteredData : [[2.2, 2.21, 0]],
        expectedResult : [[ 0, 2.2, 2.21 ]],
    },
    {
        enteredData : [[0]],
        expectedResult : [[0]],
    },
    {
        enteredData : [[-5]],
        expectedResult : [[-5]],
    },
    {
        enteredData : [[Math.pow(5,3)]],
        expectedResult : [[125]],
    },
    {
        enteredData : [[-5],[2.2],[0]],
        expectedResult : [[ -5 ], [ 0 ], [ 2.2 ]],
    },
    {
        enteredData : [[-5,3.1325],[2.2,3.1333],[0,0.01]],
        expectedResult : [[ -5, 3.1333 ], [ 0, 3.1325 ], [ 0.01, 2.2 ]],
    },
    {
        enteredData : [[-5,Number(true)],[2.2,5],[0.31,Number(false)]],
        expectedResult : [[ -5, 5 ], [ 0, 2.2 ], [ 0.31, 1 ]],
    },
    {
        enteredData : [[-5,11],[2.6,51],[0.31,Number('')]],
        expectedResult : [[ -5, 51 ], [ 0, 11 ], [ 0.31, 2.6 ]],
    },
    {
        enteredData : [[-5,71],[2.6,51],[0.31,Number(null)]],
        expectedResult : [[ -5, 71 ], [ 0, 51 ], [ 0.31, 2.6 ]],
    },
    {
        enteredData : [[-5,11],[2.6,51],[0.31,Number('')]],
        expectedResult : [[ -5, 51 ], [ 0, 11 ], [ 0.31, 2.6 ]],
    },
    {
        enteredData : [[-5,71],[2.6,51],[0.31,parseFloat("1001kg")]],
        expectedResult : [[ -5, 1001 ], [ 0.31, 71 ], [ 2.6, 51 ]],
    },
    {
        enteredData : [[-132, -500, -1],[2,1,5],[-1,5]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[-132],[2,1,5],[-1,5]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[-132, -500, -1],[2,1,5],[]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[-132, Number('hello'), -1],[2,1,5],[-1,5]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[-132, -500, -1],[2,Number(Infinity),5],[-1,5]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[-132, -500, -1],[Number(undefined),1,5],[-1,5]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[-132, -500, -1],[parseFloat("kg-53"),1,5],[-1,5]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[-132, -500, -1], [  1,  4.23,  -1.1], [  1000, -232, -12], [-1.2, 5, -1], [0, -500]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[-132, -500, -1],[Number(NaN),1,5],[-1,5]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[NaN, -500, -1],[3,1,5],[-1,5]],
        expectedResult : "Invalid data",
    },
    {
        enteredData : [[-132, parseInt('number 5'), -1],[12,1,5],[-1,5]],
        expectedResult : "Invalid data",
    },
]