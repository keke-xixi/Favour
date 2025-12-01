// 打印Pdf
const toPdf = () => {
    state.waitShowPdf = true;
    if(state.printData && Object.keys(state.printData).length === 0) {
        setTimeout(() => {
            state.waitShowPdf = false;
        }, 500);
        return;
    }

    // 如果 hiprint 有设置样式的内部方法，尝试修改它
    if (state.hiprintTemplate.setStyle) {
        // 设置全局样式，强制移除合并单元格边框
        state.hiprintTemplate.setStyle({
            'table td[rowspan]': {
                'border': '0 !important',
                'border-top': '0 !important',
                'border-right': '0 !important', 
                'border-bottom': '0 !important',
                'border-left': '0 !important'
            },
            'table td[colspan]': {
                'border': '0 !important',
                'border-top': '0 !important',
                'border-right': '0 !important',
                'border-bottom': '0 !important', 
                'border-left': '0 !important'
            }
        });
    }

    // 使用最激进的配置
    const pdfOptions = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        onclone: function(clonedDoc) {
            // 创建样式彻底覆盖
            const style = clonedDoc.createElement('style');
            style.innerHTML = `
                /* 彻底移除所有边框 */
                table { border-collapse: collapse !important; }
                td[rowspan] { border: 0 !important; border: none !important; }
                td[colspan] { border: 0 !important; border: none !important; }
                /* 使用通配符选择器 */
                [rowspan] { border: 0 !important; }
                [colspan] { border: 0 !important; }
                /* 移除所有可能的边框 */
                * { border: 0 !important; }
                td, th { border: 1px solid #000 !important; }
                td[rowspan], td[colspan] { border: 0 !important; }
            `;
            clonedDoc.head.appendChild(style);
            
            // 直接操作DOM
            clonedDoc.querySelectorAll('td[rowspan], td[colspan]').forEach(cell => {
                cell.style.cssText = 'border: 0 !important; border-width: 0 !important;';
                cell.removeAttribute('border');
                cell.removeAttribute('style');
                cell.setAttribute('style', 'border: 0 !important;');
            });
        }
    };

    state.hiprintTemplate.toPdf(state.printData, state.pdfPrintName, pdfOptions);
    setTimeout(() => {
        state.waitShowPdf = false;
    }, 2000);
};