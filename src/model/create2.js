function calculateLevelDistribution(totalCount, maxLevel, probabilities, remainingLevel = 1) {
    // 参数验证
    if (!Array.isArray(probabilities) || probabilities.length !== maxLevel) {
        throw new Error('概率数组长度必须等于最大等级');
    }
    
    const sumProb = probabilities.reduce((sum, prob) => sum + prob, 0);
    if (Math.abs(sumProb - 1) > 0.0001) {
        throw new Error('概率总和必须为100%');
    }
    
    if (totalCount <= 0) {
        throw new Error('总数量必须大于0');
    }
    
    if (remainingLevel < 1 || remainingLevel > maxLevel) {
        throw new Error('剩余数量分配等级必须在有效范围内');
    }
    
    const distribution = new Array(maxLevel);
    let remainingCount = totalCount;
    
    // 先分配除了剩余等级之外的所有等级
    for (let level = maxLevel; level >= 1; level--) {
        if (level === remainingLevel) continue; // 跳过剩余等级
        
        const probability = probabilities[level - 1];
        const calculatedCount = Math.floor(totalCount * probability);
        const actualCount = Math.min(calculatedCount, remainingCount);
        
        distribution[level - 1] = {
            level: level,
            probability: probability * 100,
            count: actualCount
        };
        
        remainingCount -= actualCount;
    }
    
    // 最后分配剩余等级
    distribution[remainingLevel - 1] = {
        level: remainingLevel,
        probability: probabilities[remainingLevel - 1] * 100,
        count: remainingCount
    };
    
    return distribution;
}

// 使用示例
const probabilities = [0.1, 0, 0, 0, 0, 0, 0.9];  // 0.1是等级1的概率，0.9是等级7的概率
const distribution = calculateLevelDistribution(10, 7, probabilities, 1);
console.log('等级分布:', distribution);
distribution.forEach(item => {
    console.log(`等级 ${item.level}: 概率 ${item.probability.toFixed(2)}%, 数量 ${item.count}`);
});

console.log('验证总和:', distribution.reduce((sum, item) => sum + item.count, 0));