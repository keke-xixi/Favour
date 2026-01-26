/*
  异步方法防重复调用 + 自动轮询封装
  在页面生命周期内，对指定方法自动应用防重复和轮询逻辑
*/
export interface UsePollingReturn<T extends (...args: any[]) => Promise<any>> {
  // 封装后的方法，调用时会自动应用防重复逻辑
  execute: (...args: Parameters<T>) => Promise<ReturnType<T> | null>
  // 手动开始轮询（如果需要在后台自动执行）
  startPolling: (interval?: number, immediate?: boolean) => void
  // 停止轮询
  stopPolling: () => void
  // 重启轮询
  restartPolling: () => void
  // 状态
  isActive: Ref<boolean>
  isExecuting: Ref<boolean>
  error: Ref<any | null>
  // 最后一次执行的结果
  lastResult: Ref<ReturnType<T> | null>
  // 轮询统计
  executionCount: Ref<number>
}

// 配置选项
export interface PollingOptions {
  // 是否自动开始轮询
  autoStart?: boolean
  // 轮询间隔（默认5秒）
  interval?: number
  // 是否立即执行第一次
  immediate?: boolean
  // 是否开启防重复调用（默认开启）
  preventDuplicate?: boolean
  // 错误重试次数
  maxRetries?: number
  // 错误回调
  onError?: (error: any) => void
  // 成功回调
  onSuccess?: (result: any) => void
}

// 默认轮询时间 5s
export function usePolling<T extends (...args: any[]) => Promise<any>>(
  originalFn: T,
  options: PollingOptions = {}
): UsePollingReturn<T> {
  const {
    autoStart = false,
    interval = 5000,
    immediate = true,
    preventDuplicate = true,
    maxRetries = 3,
    onError,
    onSuccess
  } = options

  let timer: NodeJS.Timeout | null = null
  let scheduledTimeout: NodeJS.Timeout | null = null
  let lastExecutionTime: number = 0
  let currentRetries: number = 0
  let lastCallArgs: any[] | null = null
  
  const isActive: Ref<boolean> = ref(false)
  const isExecuting: Ref<boolean> = ref(false)
  const error: Ref<any | null> = ref(null)
  const lastResult: Ref<ReturnType<T> | null> = ref(null)
  const executionCount: Ref<number> = ref(0)

  // 清理定时器
  const clearTimers = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    
    if (scheduledTimeout) {
      clearTimeout(scheduledTimeout)
      scheduledTimeout = null
    }
  }

  // 实际的执行函数
  const executeInternal = async (args: any[] = lastCallArgs || []): Promise<ReturnType<T> | null> => {
    // 防止重复调用
    if (preventDuplicate && isExecuting.value) {
      console.log('请求正在执行中，跳过本次调用')
      return Promise.resolve(lastResult.value)
    }

    try {
      isExecuting.value = true
      error.value = null
      
      const result = await originalFn(...args)
      
      // 执行成功，重置重试计数
      currentRetries = 0
      lastResult.value = result
      lastExecutionTime = Date.now()
      executionCount.value++
      
      onSuccess?.(result)
      return result
    } catch (err: any) {
      error.value = err
      lastExecutionTime = Date.now()
      
      // 错误重试逻辑
      if (currentRetries < maxRetries) {
        currentRetries++
        console.warn(`请求失败，第 ${currentRetries} 次重试...`)
        
        // 延迟重试
        setTimeout(() => {
          if (isActive.value) {
            executeInternal(args)
          }
        }, 1000 * currentRetries)
      } else {
        onError?.(err)
        console.error('轮询请求失败:', err)
      }
      
      return null
    } finally {
      isExecuting.value = false
    }
  }

  // 封装后的方法 - 外部调用时使用这个
  const execute = async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    lastCallArgs = args
    return executeInternal(args)
  }

  // 轮询执行函数
  const pollExecute = async (): Promise<void> => {
    if (!isActive.value) return
    
    // 保存当前参数用于轮询
    const args = lastCallArgs || []
    await executeInternal(args)
  }

  const scheduleNextExecution = (): void => {
    if (!isActive.value) return
    
    const now: number = Date.now()
    const timeSinceLastExecution: number = now - lastExecutionTime
    const delay: number = Math.max(0, interval - timeSinceLastExecution)
    
    // 清除之前的定时器
    if (scheduledTimeout) {
      clearTimeout(scheduledTimeout)
    }
    
    scheduledTimeout = setTimeout(async (): Promise<void> => {
      await pollExecute()
      scheduleNextExecution()
    }, delay)
  }

  const startPolling = (customInterval?: number, immediateStart: boolean = immediate): void => {
    stopPolling()
    
    isActive.value = true
    lastExecutionTime = immediateStart ? 0 : Date.now()
    
    const pollInterval = customInterval || interval
    
    if (immediateStart) {
      pollExecute().then(() => {
        if (isActive.value) {
          // 设置定时器开始轮询
          timer = setInterval(pollExecute, pollInterval)
        }
      })
    } else {
      // 延迟开始第一次轮询
      lastExecutionTime = Date.now()
      timer = setInterval(pollExecute, pollInterval)
    }
  }

  const stopPolling = (): void => {
    clearTimers()
    isActive.value = false
    currentRetries = 0
  }

  const restartPolling = (): void => {
    stopPolling()
    startPolling()
  }

  // 如果配置了自动开始轮询
  if (autoStart) {
    startPolling(interval, immediate)
  }

  // 组件卸载时清理
  onUnmounted(() => {
    stopPolling()
  })

  return {
    execute,
    startPolling,
    stopPolling,
    restartPolling,
    isActive,
    isExecuting,
    error,
    lastResult,
    executionCount
  }
}

// 简化版本 - 只封装方法，不自动轮询
export function useDebouncedAsync<T extends (...args: any[]) => Promise<any>>(
  originalFn: T,
  options: {
    preventDuplicate?: boolean
    onError?: (error: any) => void
    onSuccess?: (result: any) => void
  } = {}
) {
  const { preventDuplicate = true, onError, onSuccess } = options
  
  let isExecuting = false
  let lastResult: ReturnType<T> | null = null
  
  const execute = async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
    // 防止重复调用
    if (preventDuplicate && isExecuting) {
      console.log('请求正在执行中，返回上次结果')
      return Promise.resolve(lastResult)
    }

    try {
      isExecuting = true
      const result = await originalFn(...args)
      lastResult = result
      onSuccess?.(result)
      return result
    } catch (error) {
      onError?.(error)
      console.error('请求失败:', error)
      return null
    } finally {
      isExecuting = false
    }
  }

  return { execute }
}