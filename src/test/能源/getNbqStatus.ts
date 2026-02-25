export function getNbqStatus(row: any) {
    const statics = reactive({
        // 总数
        total: 0,
        // 并网
        grid: 0,
        // 未并网
        // notGridConnected: 0,
        // 故障
        failure: 0,
        // 告警
        // alarm: 0,
        // 断电
        power: 0,
        // 限电
        limitPower: 0,
        // 通讯中断
        interruption: 0,
        // 闭锁
        shutting: 0,
        // 未接入
        notConnected: 0,
        // 所有的ids
        ids: [] as any,
    });

    row.map((e: any, i: any) => {
        // case 1 等其它的，与后端对应，表示不同的状态
        switch (e.item.value) {
            case 1:
                statics.grid += 1;
                break;
            case 2:
                statics.limitPower += 1;
                break;
            case 3:
                statics.failure += 1;
                break;
            case 4:
                statics.power += 1;
                break;
            case 5:
                statics.shutting += 1;
                break;
            case 6:
                statics.interruption += 1;
                break;
            // case 7:
            //     statics.interruption += 1;
            //     break;
            // case 8:
            //     statics.shutting += 1;
            //     break;
            default:
                statics.notConnected += 1;
                // 未接入
                break;
        }
        return true
    })

    statics.total = row.length

    return statics
}

export function getPhotovaltaicArr(row: any, num: number) {
    // 光伏里面的逆变器状态数组

    const arr = ref<any[string]>([
        '', '', '', '',
        '', '', '', '',
        '', '', '', ''
    ])

    const n = Math.ceil(num/4)*4

    if (arr.value.length < n) arr.value = new Array(n).fill('');
    
    // 向数据插入值
    function insert(value: string, index: any) {
        if (index === 'all') {
            arr.value.map((e: any) => {
                e = 'value'
                return true
            })
        } else {
            arr.value[index] = value
        }
    }

    row.map((e: any, i: any) => {
        // case 1 等其它的，与后端对应，表示不同的状态
        switch (e.item.value) {
            case 1:
                insert('#91cc75', i);
                // insert('status-1', i);
                break;
            case 2:
                insert('#5470c6', i);
                // insert('status-2', i);
                break;
            case 3:
                insert('#ee6666', i);
                // insert('status-3', i);
                break;
            case 4:
                insert('#9a60b4', i);
                // insert('status-5', i);
                break;
            case 5:
                insert('#0055ff', i);
                // insert('status-8', i);
                break;
            case 6:
                insert('#fc8452', i);
                // insert('status-7', i);
                break;
            // case 7:
            //     insert('status-7', i);
            //     break;
            // case 8:
            //     insert('status-8', i);
            //     break;
            default:
                insert('#909399', i);
                // insert('status-9', i);
                // 未接入
                break;
        }
        return true
    })

    const list = arr.value.map((e: string, i: number) => {
        if (e === '' && i < num) {
            return 'status-9'
        } else {
            return e
        }
    })

    return list
}