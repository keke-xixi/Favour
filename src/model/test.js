const type_map = {
    1: { name: '土', color: '#8B4513', price: 1 },
    2: { name: '石头', color: '#696969', price: 2 },
    3: { name: '铁', color: '#708090', price: 3 },
    4: { name: '黄金', color: '#FFD700', price: 4 },
    5: { name: '钻石', color: '#B9F2FF', price: 5 },
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

  // 生成 1-5 的随机整数
const randomNum = Math.floor(Math.random() * 5) + 1;

  console.log(arr,arr.length);