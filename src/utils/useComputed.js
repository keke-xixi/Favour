// 缓存计算函数，防止表格或者列表渲染产生效率问题
/*
  调用：
  const allprice = useComputed(totalPrice);  totalPrice 为一个函数，可以返回计算结果
*/
import { computed } from 'vue'

export function useComputed(fn) {
    const map = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        if (map.has(key)) {
            return map.get(key);
        }
        const result = computed(() => fn(...args));
        map.set(key, result);
        return result;
    }
}