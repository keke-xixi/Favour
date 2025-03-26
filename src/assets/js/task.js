// 高任务优化  同时执行很多耗时任务，导致页面卡顿
function _runTask(task,callback) {
    let startTime = Date.now();
    requestAnimationFrame(()=>{
        if(Date.now() - startTime < 16){
             task();
            callback();
        }else{
            _runTask(task,callback);
        }
    })
    // requestIdleCallback((idle)=>{
    //     if(idle.timeRemaining() > 0){
    //         task();
    //         callback(); // 任务执行完毕后，执行回调函数
    //     }else{
    //         _runTask(task,callback); // 如果时间片用完，则继续执行任务
    //     }
    // })
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