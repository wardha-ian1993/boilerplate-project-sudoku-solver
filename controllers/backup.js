const testStr = '.2..5.';

const testFunc = (string) => {
  const len = string.length;
  
  let testArr = [];
  let strArr = [];
  let outputStr = '';
  
  for (let i = 0; i < len; i++) {
    if(i === 0) outputStr = string;
    
    for (let j = 0; j < len; j++) {
      if (i >= j) {
        if (outputStr[j] !== '.') {
          strArr.push(outputStr[j]);
        } else {
          strArr.push(j+1);
        }
      } else {
        strArr.push(outputStr[j]);
      }
    }
    
    outputStr = strArr.join('');
    strArr = [];
    testArr.push(outputStr);
  }
  
  return testArr;
}

testFunc(testStr);