// const arr = [1, 2, 3];

// function generateSubsets(array) {
//     const subsets = [];
//     const numberOfCombinations = 2 ** array.length;
//     for (let i = 0; i < numberOfCombinations; i++) {
//         const subset = [];
//         for (let j = 0; j < array.length; j++) {
//             if ((i & (1 << j)) > 0) {
//                 subset.push(array[j]);
//             }
//         }
//         subsets.push(subset);
//     }
//     return subsets;
// }

// const allSubsets = generateSubsets(arr);
// // const allSubsetSums = allSubsets.map(subset => subset.reduce((acc, num) => acc + num, 0));

// console.log(allSubsets);





const arr = [1, 2, 3];


function getAllSubarrays(array) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        for (let j = i; j < array.length; j++) {
            const subArray = [];
            for (let k = i; k <= j; k++) {
                subArray.push(array[k]);
            }
            result.push(subArray);
        }
    }
    return result;
}


console.log(getAllSubarrays(arr))























// 

// const allSubarrays = getAllSubarrays(arr);

// console.log(allSubarrays);
