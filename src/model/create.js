// 传入 总数 等级数 最低等级概率
export function calculateLevelDistribution(total, levels, minProbability) {
    const result = [];
    
    // 计算等比数列的公比
    // 设最低等级概率为 p，则最高等级概率为 p * r^(levels-1)
    // 所有概率和为 1，即 p + p*r + p*r^2 + ... + p*r^(levels-1) = 1
    // p * (1 + r + r^2 + ... + r^(levels-1)) = 1
    // 等比数列求和公式：p * (1 - r^levels) / (1 - r) = 1
    
    // 由于直接解方程比较复杂，这里使用数值方法求公比 r
    let r = 2.0; // 初始猜测值
    const tolerance = 1e-10;
    const maxIterations = 1000;
    
    for (let iter = 0; iter < maxIterations; iter++) {
      const numerator = minProbability * (1 - Math.pow(r, levels));
      const denominator = 1 - r;
      const f = numerator / denominator - 1;
      
      if (Math.abs(f) < tolerance) {
        break;
      }
      
      // 数值微分求导数
      const dr = 0.0001;
      const f2 = minProbability * (1 - Math.pow(r + dr, levels)) / (1 - (r + dr)) - 1;
      const df = (f2 - f) / dr;
      
      r = r - f / df;
      
      // 防止 r 过小或过大
      if (r < 1.01) r = 1.01;
      if (r > 10) r = 10;
    }
    
    // 计算各等级的概率
    const probabilities = [];
    for (let i = 0; i < levels; i++) {
      const prob = minProbability * Math.pow(r, levels - 1 - i);
      probabilities.push(prob);
    }
    
    // 归一化概率（确保总和为1）
    const totalProb = probabilities.reduce((sum, prob) => sum + prob, 0);
    const normalizedProbabilities = probabilities.map(prob => prob / totalProb);
    
    // 计算各等级的数量
    let remaining = total;
    let sum = 0;
    
    for (let i = 0; i < levels; i++) {
      let count;
      if (i === levels - 1) {
        // 最后一个等级取剩余的所有
        count = remaining;
      } else {
        count = Math.round(total * normalizedProbabilities[i]);
        remaining -= count;
        sum += count;
      }
      result.push({
        level: i + 1,
        probability: normalizedProbabilities[i] * 100,
        count: count
      });
    }
    
    return result;
}
  
  // 使用示例
  const distribution = calculateLevelDistribution(45, 7, 0.01);
  console.log('等级分布:',distribution);
  distribution.forEach(item => {
    console.log(`等级 ${item.level}: 概率 ${item.probability.toFixed(2)}%, 数量 ${item.count}`);
  });
  
  console.log('验证总和:', distribution.reduce((sum, item) => sum + item.count, 0));