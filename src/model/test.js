const type_map = {
    
}

// x (0 -4) y (0 - 9)   加载 x、y
function generateArray(xMax = 5, yMax = 9, maxType = 5) {
    let arr = [];
    for (let x = 0; x < xMax; x++) {
        for (let y = 0; y < yMax; y++) {
            arr.push({ 
                x,
                y,
            });
        }
    }
    return arr;
}

// 加载 type


  // 使用示例
  const arr = generateArray(5, 9, 5); // 使用默认参数

  console.log(arr,arr.length);