const type_map = {
    1: { name: '土', color: '#8B4513', price: 1 },
    2: { name: '石头', color: '#696969', price: 2 },
    3: { name: '铁', color: '#708090', price: 3 },
    4: { name: '黄金', color: '#FFD700', price: 4 },
    5: { name: '钻石', color: '#B9F2FF', price: 5 },
}

// 区块信息
function getRange(y) {
    /*
      min、max区间范围  rate: 珍品概率，其它随机   level: 区间等级
    */
    const ranges = [
        { min: 9000, max: 10000, label: '9000-10000',rate: 0.1 },
        { min: 7000, max: 9000, label: '7000-9000' },
        { min: 5000, max: 7000, label: '5000-7000' },
        { min: 2000, max: 5000, label: '2000-5000' },
        { min: 500, max: 2000, label: '500-2000' },
        { min: 100, max: 500, label: '100-500' },
        { min: 1, max: 100, label: '1-100' }
    ];
    
    for (const range of ranges) {
        if (y >= range.min && y <= range.max) {
            return range;
        }
    }
    
    return '超出范围';
}

// 传入y
function createArea(y,direct) {
    switch (direct) {
     case 'left':
         
         break;
    
     case 'right':
 
         break;
     
     case 'up':
 
         break;
 
     case 'down':
 
         break;

     default:
        console.log(getRange(y),'y')
        break;
    }
 }

 createArea(100)