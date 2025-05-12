// 高任务优化  同时执行很多耗时任务，导致页面卡顿
function _runTask(task, callback) {
    let startTime = Date.now(); // 记录任务开始时间
    requestAnimationFrame(() => {
        // 检查本次执行是否超时（超过16ms）
        if (Date.now() - startTime < 16) {
            task();      // 执行任务
            callback();  // 触发完成回调
        } else {
            _runTask(task, callback); // 超时则递归拆分任务
        }
    });
}

/*
  运行一个耗时任务
  如果要异步执行多个任务，请返回Promise
  要尽快完成任务，同时不要让界面产生卡顿
  尽量兼容更多的浏览器  requestAnimationFrame
  @param {Function} task 
*/
// 调用100000次这个耗时任务，要优化它，防止页面卡顿
function runTask(task) {
    return new Promise((resolve,reject)=>{
        _runTask(task,resolve);
    })
}
export default runTask;