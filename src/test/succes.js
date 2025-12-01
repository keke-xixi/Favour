// 打印Pdf   几乎接近成功版
const toPdf = () => {
    state.waitShowPdf = true;
    if(state.printData && Object.keys(state.printData).length === 0) {
        setTimeout(() => {
            state.waitShowPdf = false;
        }, 500);
        return;
    }

    const pdfOptions = {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        onclone: function(clonedDoc) {
            // 方法：在合并单元格上覆盖白色线条来隐藏内部线
            clonedDoc.querySelectorAll('td[rowspan], td[colspan]').forEach(cell => {
                const rowspan = parseInt(cell.getAttribute('rowspan')) || 1;
                const colspan = parseInt(cell.getAttribute('colspan')) || 1;
                
                // 创建覆盖元素
                if (rowspan > 1) {
                    // 创建水平覆盖线
                    const horizontalOverlay = clonedDoc.createElement('div');
                    horizontalOverlay.style.cssText = `
                        position: absolute;
                        left: -1px;
                        right: -1px;
                        height: 2px;
                        background: white;
                        z-index: 1000;
                        pointer-events: none;
                    `;
                    
                    // 在合并单元格中间位置添加覆盖
                    for (let i = 1; i < rowspan; i++) {
                        const overlay = horizontalOverlay.cloneNode(true);
                        const topPosition = (i / rowspan * 100) + '%';
                        overlay.style.top = `calc(${topPosition} - 1px)`;
                        cell.style.position = 'relative';
                        cell.appendChild(overlay);
                    }
                }
                
                if (colspan > 1) {
                    // 创建垂直覆盖线
                    const verticalOverlay = clonedDoc.createElement('div');
                    verticalOverlay.style.cssText = `
                        position: absolute;
                        top: -1px;
                        bottom: -1px;
                        width: 2px;
                        background: white;
                        z-index: 1000;
                        pointer-events: none;
                    `;
                    
                    // 在合并单元格中间位置添加覆盖
                    for (let i = 1; i < colspan; i++) {
                        const overlay = verticalOverlay.cloneNode(true);
                        const leftPosition = (i / colspan * 100) + '%';
                        overlay.style.left = `calc(${leftPosition} - 1px)`;
                        cell.style.position = 'relative';
                        cell.appendChild(overlay);
                    }
                }
                
                // 确保单元格有正确的边框
                cell.style.border = '1px solid #000';
                cell.style.boxSizing = 'border-box';
            });
            
            // 添加基础样式
            const style = clonedDoc.createElement('style');
            style.innerHTML = `
                table { border-collapse: collapse; }
                td, th { border: 1px solid #000; position: relative; }
                td[rowspan], td[colspan] { overflow: hidden; }
            `;
            clonedDoc.head.appendChild(style);
        }
    };

    state.hiprintTemplate.toPdf(state.printData, state.pdfPrintName, pdfOptions);
    setTimeout(() => {
        state.waitShowPdf = false;
    }, 1500);
};

// 消除了样式问题，但仍然存在其他问题，如表格单元格重叠
const toPdf = () => {
    state.waitShowPdf = true;
    if(state.printData && Object.keys(state.printData).length === 0) {
        setTimeout(() => {
            state.waitShowPdf = false;
        }, 500);
        return;
    }

    const pdfOptions = {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        onclone: function(clonedDoc) {
            // 最简单的方案：使用background-clip和透明边框
            const style = clonedDoc.createElement('style');
            style.innerHTML = `
                /* 关键：使用透明内部边框，只显示外边框 */
                table {
                    border-collapse: collapse !important;
                    border-spacing: 0 !important;
                }
                
                /* 所有单元格都有透明边框 */
                td, th {
                    border: 1px solid transparent !important;
                    background-clip: padding-box !important;
                    position: relative;
                }
                
                /* 普通单元格显示黑色边框 */
                td:not([rowspan]):not([colspan]),
                th:not([rowspan]):not([colspan]) {
                    border-color: #000 !important;
                }
                
                /* 合并单元格：只显示最外层的边框 */
                td[rowspan], td[colspan] {
                    border-color: transparent !important;
                }
                
                /* 使用伪元素显示合并单元格的外边框 */
                td[rowspan]::before,
                td[colspan]::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border: 1px solid #000 !important;
                    pointer-events: none;
                    z-index: 1;
                }
                
                /* 确保文字在伪元素之上 */
                td[rowspan] > *,
                td[colspan] > * {
                    position: relative;
                    z-index: 2;
                }
            `;
            clonedDoc.head.appendChild(style);
            
            // 确保所有合并单元格的内容有正确的z-index
            clonedDoc.querySelectorAll('td[rowspan], td[colspan]').forEach(cell => {
                // 如果单元格直接包含文本，包装它
                if (cell.childNodes.length === 1 && cell.childNodes[0].nodeType === 3) {
                    const text = cell.textContent;
                    cell.textContent = '';
                    const span = clonedDoc.createElement('span');
                    span.textContent = text;
                    span.style.position = 'relative';
                    span.style.zIndex = '10';
                    cell.appendChild(span);
                }
            });
        }
    };

    state.hiprintTemplate.toPdf(state.printData, state.pdfPrintName, pdfOptions);
    setTimeout(() => {
        state.waitShowPdf = false;
    }, 1500);
};


<div class="hiprint-printElement hiprint-printElement-table"
    style="position: absolute; width: 990pt; font-family: inherit; left: 22.5pt; top: 144pt;">
    <div class="hiprint-printElement-table-handle"></div>
    <div class="hiprint-printElement-table-content" style="height:100%;width:100%">
        <div class="hi-grid-row table-grid-row">
            <div class="tableGridColumnsGutterRow hi-grid-col" style="width:100%;">
                <table class="hiprint-printElement-tableTarget"
                    style="border-collapse: collapse; border: 1px solid; font-family: inherit;">
                    <colgroup>
                        <col column-id="undefined" width="103.7252572200281pt">
                        <col column-id="undefined" width="104.11815079627235pt">
                        <col column-id="undefined" width="114.23203895002223pt">
                        <col column-id="undefined" width="110.0814006833769pt">
                        <col column-id="undefined" width="117.70451222503472pt">
                    </colgroup>
                    <tbody>
                        <tr class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all"
                            style="background: rgb(255, 255, 255);">
                            <td id="70" column-id="NAME" rowspan="2" haswidth="haswidth"
                                style="text-align: center; vertical-align: middle; width: 106.746pt;">单号</td>
                            <td id="71" rowspan="2" haswidth="haswidth"
                                style="text-align: center; vertical-align: middle; width: 108.085pt;">车号</td>
                            <td id="72" style="text-align: center; vertical-align: middle;">毛重</td>
                            <td id="73" rowspan="2" haswidth="haswidth"
                                style="text-align: center; vertical-align: middle; width: 114.098pt;">毛重时间</td>
                            <td id="74" style="text-align: center; vertical-align: middle;">皮重</td>
                            <td id="75" rowspan="2" haswidth="haswidth"
                                style="text-align: center; vertical-align: middle; width: 111.209pt;">皮重时间</td>
                            <td id="76" style="text-align: center; vertical-align: middle;">净重</td>
                            <td id="77" column-id="SL" style="text-align: center;">扣吨</td>
                            <td id="78" column-id="DJ" style="text-align: center;">验收量</td>
                        </tr>
                        <tr class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all"
                            style="background: rgb(255, 255, 255);">
                            <td id="85" haswidth="haswidth"
                                style="text-align: center; vertical-align: middle; width: 103.725pt;">吨</td>
                            <td id="86" haswidth="haswidth"
                                style="text-align: center; vertical-align: middle; width: 104.118pt;">吨</td>
                            <td id="87" haswidth="haswidth"
                                style="text-align: center; vertical-align: middle; width: 114.232pt;">吨</td>
                            <td id="88" haswidth="haswidth" style="text-align: center; width: 110.081pt;">吨</td>
                            <td id="89" haswidth="haswidth" style="text-align: center; width: 117.705pt;">吨</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">渝A11116</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">28.1</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">28.1</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">0</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">28.1</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">渝A11132</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">50.1</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">10</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">40.1</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">1</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">39.1</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">渝A11133</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">36.11</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">80</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">43.89</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">0</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">43.89</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">渝A11142</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">29.42</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">1</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">28.42</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">2</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">26.42</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">渝A11168</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">28.1</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">28.1</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">0</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">28.1</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">渝A11165</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">1050</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">70</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">7</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">63</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">晋JU2422</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">36.11</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">80</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">3.89</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">0</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">3.89</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">湘A66666</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">50.1</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">10</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">40.1</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">1</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">39.1</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">湘A77777</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">1050</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">362</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">7</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">355</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">渝A11175</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">100</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">0</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">100</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">湘A12350</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">100</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">0</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">100</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">渝A11159</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">36.11</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">80</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">43.89</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">0</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">43.89</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">渝A11164</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">100</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">2</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">98</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">渝A11158</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">50.1</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">10</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">40.1</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">1</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">39.1</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">渝A11149</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">100</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">0</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">100</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">渝A11151</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">100</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">0</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">100</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">渝A11157</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">100</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">0</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">100</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">湘A12331</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">100</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">0</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">100</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">湘A456789</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">100</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">0</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">100</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">湘A55664</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">100</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">0</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">100</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">湘C25825</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-05
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">100</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">2</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">98</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">湘A88888</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">100</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">0</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">100</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">湘C58585</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-05
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">100</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">0</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">100</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">湘R45454</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-05
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">100</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">0</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">100</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;"></td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">渝A11139</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">1050</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">50</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">7</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">43</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td field="NAME" style="text-align: center; vertical-align: middle; width: 106.746pt;">
                                202511061353</td>
                            <td style="text-align: center; vertical-align: middle; width: 108.085pt;">渝A11113</td>
                            <td style="text-align: center; vertical-align: middle; width: 103.725pt;">0</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.098pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 104.118pt;">1050</td>
                            <td style="text-align: center; vertical-align: middle; width: 111.209pt;">2025-11-06
                                00:12:12</td>
                            <td style="text-align: center; vertical-align: middle; width: 114.232pt;">30</td>
                            <td field="SL" style="text-align: center; width: 110.081pt;">7</td>
                            <td field="DJ" style="text-align: center; width: 117.705pt;">23</td>
                        </tr>
                        <tr
                            class="hiprint-printElement-tableTarget-border-all hiprint-printElement-tableTarget-border-td-all">
                            <td
                                style="border-right: 0px;transform: translateY(0px) translateX(85px);text-align: center">
                                小计（26）车</td>
                            <td style="text-align: center" colspan="1"></td>
                            <td style="text-align: center">344.25</td>
                            <td style="text-align: center">－－－</td>
                            <td style="text-align: center">4471.00</td>
                            <td style="text-align: center">－－－</td>
                            <td style="text-align: center">4471.00</td>
                            <td style="text-align: center">37.00</td>
                            <td style="text-align: center">2071.59</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>