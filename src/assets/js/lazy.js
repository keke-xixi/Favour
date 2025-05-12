/**
 * 惰性函数，用于优化性能  执行多次判断的任务优化为只要执行一次 （有确定性）
 * @param {*} 复制文本 
 */
function copyText(text) {
    if(navigator.clipboard) {
        copyText = (text) => {
            navigator.clipboard.writeText(text)
        }
    } else {
        copyText = (text) => {
            const input = document.createElement('input');
            input.setAttribute('value', text);
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        }
    }
}