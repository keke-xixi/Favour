// utils/qrcode.js - 优化版，去除细线，更清晰的二维码
class QRCode {
  constructor(options = {}) {
    this.text = options.text || '';
    this.size = options.size || 280;
    this.margin = options.margin || 4;
    this.backgroundColor = options.backgroundColor || '#FFFFFF';
    this.foregroundColor = options.foregroundColor || '#000000';
    this.errorCorrectionLevel = options.errorCorrectionLevel || 'M';
  }

  // 生成二维码到Canvas
  async makeCode(text, canvasId, componentInstance) {
    if (!text || text.length > 50) {
      throw new Error('内容长度必须在1-50个字符之间');
    }
    
    this.text = text;
    
    try {
      // 生成二维码数据
      const qrData = this.generateQRCodeData(text);
      
      // 获取Canvas上下文
      const ctx = uni.createCanvasContext(canvasId, componentInstance);
      
      // 绘制二维码
      this.drawQRCode(ctx, qrData);
      
      // 执行绘制
      return new Promise((resolve, reject) => {
        ctx.draw(false, () => {
          setTimeout(() => {
            resolve(true);
          }, 200);
        });
      });
    } catch (error) {
      console.error('生成二维码失败:', error);
      throw error;
    }
  }

  // 生成二维码数据 - 优化版，去除细线
  generateQRCodeData(text) {
    // 使用固定的版本2，确保一致的密度
    const version = 2;
    const size = version * 4 + 17; // 25x25
    
    const modules = [];
    
    // 初始化矩阵
    for (let i = 0; i < size; i++) {
      modules[i] = new Array(size).fill(false);
    }
    
    // 添加定位图案
    this.addPositionPatterns(modules, size);
    
    // 添加时序图案
    this.addTimingPatterns(modules, size);
    
    // 添加对齐图案
    this.addAlignmentPattern(modules, size);
    
    // 格式信息区域预留
    this.reserveFormatInfoArea(modules, size);
    
    // 基于文本生成数据图案 - 使用更密集的编码
    this.encodeDataDense(modules, text, size);
    
    return {
      moduleCount: size,
      modules: modules
    };
  }

  // 添加定位图案 - 优化版，更清晰
  addPositionPatterns(modules, size) {
    // 左上角定位图案
    this.drawSolidPositionPattern(modules, 3, 3);
    
    // 右上角定位图案
    this.drawSolidPositionPattern(modules, size - 4, 3);
    
    // 左下角定位图案
    this.drawSolidPositionPattern(modules, 3, size - 4);
  }

  // 绘制实心定位图案，避免细线
  drawSolidPositionPattern(modules, x, y) {
    // 外框 (7x7)
    for (let i = -3; i <= 3; i++) {
      for (let j = -3; j <= 3; j++) {
        const row = y + i;
        const col = x + j;
        
        if (row >= 0 && row < modules.length && col >= 0 && col < modules[0].length) {
          modules[row][col] = true;
        }
      }
    }
    
    // 内框 (5x5) - 挖空
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const row = y + i;
        const col = x + j;
        
        if (row >= 0 && row < modules.length && col >= 0 && col < modules[0].length) {
          modules[row][col] = false;
        }
      }
    }
    
    // 中心点 (3x3)
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const row = y + i;
        const col = x + j;
        
        if (row >= 0 && row < modules.length && col >= 0 && col < modules[0].length) {
          modules[row][col] = true;
        }
      }
    }
  }

  // 添加时序图案 - 优化版，避免细线
  addTimingPatterns(modules, size) {
    // 水平时序图案
    for (let i = 8; i < size - 8; i++) {
      modules[6][i] = (i % 2 === 0);
    }
    
    // 垂直时序图案
    for (let i = 8; i < size - 8; i++) {
      modules[i][6] = (i % 2 === 0);
    }
  }

  // 添加对齐图案
  addAlignmentPattern(modules, size) {
    // 版本2只有一个对齐图案在(18,18)
    const x = 18;
    const y = 18;
    
    // 外框 (5x5)
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const row = y + i;
        const col = x + j;
        
        if (row >= 0 && row < modules.length && col >= 0 && col < modules[0].length) {
          modules[row][col] = true;
        }
      }
    }
    
    // 内框 (3x3) - 挖空
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const row = y + i;
        const col = x + j;
        
        if (row >= 0 && row < modules.length && col >= 0 && col < modules[0].length) {
          modules[row][col] = false;
        }
      }
    }
    
    // 中心点
    modules[y][x] = true;
  }

  // 预留格式信息区域
  reserveFormatInfoArea(modules, size) {
    // 左上角格式信息区域
    for (let i = 0; i < 9; i++) {
      if (i !== 6) { // 跳过时序图案
        if (i < 8) modules[8][i] = null; // 预留位置
        if (i < 8) modules[i][8] = null; // 预留位置
      }
    }
    
    // 右上角格式信息区域
    for (let i = 0; i < 8; i++) {
      modules[8][size - 1 - i] = null;
    }
    
    // 左下角格式信息区域
    for (let i = 0; i < 7; i++) {
      modules[size - 1 - i][8] = null;
    }
  }

  // 密集数据编码 - 优化版，避免细线
  encodeDataDense(modules, text, size) {
    // 将文本转换为二进制数据
    const encodedData = this.encodeText(text);
    
    // 计算数据容量
    const dataCapacity = 152; // 版本2的容量
    
    // 添加模式指示器（8位字节模式）
    const modeIndicator = '0100';
    
    // 添加字符计数指示器
    const charCount = text.length;
    const charCountBits = 8; // 版本1-9使用8位
    const charCountIndicator = charCount.toString(2).padStart(charCountBits, '0');
    
    // 组合数据位
    let dataBits = modeIndicator + charCountIndicator + encodedData;
    
    // 填充数据到容量
    dataBits = this.padDataBitsDense(dataBits, dataCapacity);
    
    // 将数据放置到矩阵中
    this.placeDataBitsDense(modules, dataBits, size);
  }

  // 编码文本为二进制
  encodeText(text) {
    let binary = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      binary += charCode.toString(2).padStart(8, '0');
    }
    return binary;
  }

  // 密集数据填充 - 避免细线
  padDataBitsDense(dataBits, capacity) {
    // 添加终止符
    if (dataBits.length < capacity) {
      dataBits += '0000';
    }
    
    // 填充0直到达到容量（8的倍数）
    while (dataBits.length % 8 !== 0 && dataBits.length < capacity) {
      dataBits += '0';
    }
    
    // 填充填充字节 - 使用交替模式避免规律性
    const padBytes = ['11101100', '00010001']; // 236, 17
    let padIndex = 0;
    
    while (dataBits.length < capacity) {
      dataBits += padBytes[padIndex];
      padIndex = (padIndex + 1) % 2;
    }
    
    return dataBits;
  }

  // 密集数据放置 - 优化版，避免细线
  placeDataBitsDense(modules, dataBits, size) {
    let bitIndex = 0;
    
    // 使用Z字形放置数据，从右下角开始
    let row = size - 1;
    let col = size - 1;
    let direction = -1; // 向上移动
    
    while (col > 0 && bitIndex < dataBits.length) {
      // 跳过时序图案列
      if (col === 6) col--;
      
      // 处理两列
      for (let i = 0; i < 2; i++) {
        const currentCol = col - i;
        
        if (currentCol < 0) break;
        
        // 检查当前位置是否可用
        if (this.isDataPosition(row, currentCol, size) && modules[row][currentCol] === false) {
          if (bitIndex < dataBits.length) {
            modules[row][currentCol] = dataBits[bitIndex] === '1';
            bitIndex++;
          }
        }
      }
      
      // 移动到下一行
      row += direction;
      
      // 改变方向当到达边界
      if (row < 0 || row >= size) {
        direction = -direction;
        row += direction;
        col -= 2;
        
        if (col === 6) col--;
      }
    }
    
    // 填充剩余位置，避免细线
    this.fillRemainingPositions(modules, size);
  }

  // 填充剩余位置，确保没有细线
  fillRemainingPositions(modules, size) {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (this.isDataPosition(row, col, size) && modules[row][col] === false) {
          // 使用伪随机填充，避免规律性
          const shouldFill = this.pseudoRandom(row, col, size) > 0.6;
          modules[row][col] = shouldFill;
        }
      }
    }
    
    // 应用掩码模式减少大面积连续色块
    this.applyMaskPattern(modules, size);
  }

  // 伪随机数生成器
  pseudoRandom(row, col, size) {
    const x = (row * 127 + col * 311) % 1024;
    return (Math.sin(x) + 1) / 2;
  }

  // 应用掩码模式减少细线
  applyMaskPattern(modules, size) {
    // 使用掩码模式2: (col % 3 === 0)
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (this.isDataPosition(row, col, size) && modules[row][col] !== null) {
          if (col % 3 === 0) {
            modules[row][col] = !modules[row][col];
          }
        }
      }
    }
  }

  // 检查是否为数据位置
  isDataPosition(row, col, size) {
    // 跳过定位图案区域
    if ((row < 9 && col < 9) || 
        (row < 9 && col > size - 9) || 
        (row > size - 9 && col < 9)) {
      return false;
    }
    
    // 跳过时序图案
    if (row === 6 || col === 6) {
      return false;
    }
    
    // 跳过格式信息区域
    if ((row === 8 && col < 9) || (col === 8 && row < 9) ||
        (row === 8 && col > size - 9) || (col === 8 && row > size - 9)) {
      return false;
    }
    
    // 跳过对齐图案
    if ((row >= 16 && row <= 20) && (col >= 16 && col <= 20)) {
      return false;
    }
    
    return true;
  }

  // 绘制二维码 - 优化版，更清晰的显示
  drawQRCode(ctx, qrData) {
    const moduleCount = qrData.moduleCount;
    const moduleSize = Math.floor(this.size / moduleCount);
    const margin = this.margin;
    
    // 计算实际绘制尺寸（确保整数像素）
    const actualSize = moduleSize * moduleCount;
    
    // 绘制白色背景和边距
    ctx.setFillStyle(this.backgroundColor);
    ctx.fillRect(0, 0, this.size + margin * 2, this.size + margin * 2);
    
    // 绘制二维码模块 - 使用整数像素位置，避免模糊
    ctx.setFillStyle(this.foregroundColor);
    
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qrData.modules[row][col] === true) {
          const x = margin + Math.floor(col * moduleSize);
          const y = margin + Math.floor(row * moduleSize);
          
          // 确保绘制整数像素大小的矩形
          ctx.fillRect(
            x,
            y,
            moduleSize,
            moduleSize
          );
        }
      }
    }
  }

  // 保存二维码图片
  saveToPhotosAlbum(canvasId, componentInstance) {
    return new Promise((resolve, reject) => {
      uni.canvasToTempFilePath({
        canvasId: canvasId,
        success: (res) => {
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => resolve(res.tempFilePath),
            fail: (err) => reject(err)
          });
        },
        fail: (err) => reject(err)
      }, componentInstance);
    });
  }
}

export default QRCode;