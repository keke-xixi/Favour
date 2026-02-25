/*
   原： 逆变器状态对应
*/
export function StateColor() {
    return [
        {
            title: '并网',
            key: 'grid',
            color: '#91cc75',
            svg: 'status-1',
            value: 1,
        },
        {
            title: '限电',
            key: 'limitPower',
            color: '#5470c6',
            svg: 'status-2',
            value: 2,
        },
        {
            title: '故障',
            key: 'failure',
            color: '#ee6666',
            svg: 'status-3',
            value: 3,
        },
        {
            title: '断电',
            key: 'power',
            color: '#9a60b4',
            svg: 'status-5',
            value: 4,
        },
        {
            title: '闭锁',
            key: 'shutting',
            color: '#0055ff',
            svg: 'status-8',
            value: 5,
        },
        {
            title: '通讯中断',
            key: 'interruption',
            color: '#fc8452',
            svg: 'status-7',
            value: 6,
        },
        {
            title: '未接入',
            key: 'notConnected',
            color: '#909399',
            svg: 'status-9',
            // 默认未接入
        },
    ];
}

/*
   新： 逆变器状态对应
*/
export function StateColor() {
    return [
        {
            title: '并网',
            key: 'grid',
            color: '#91cc75',
            svg: 'status-1',
            value: 1,
        },
        {
            title: '闭锁',
            key: 'shutting',
            color: '#0055ff',
            svg: 'status-8',
            value: 2,
        },
        {
            title: '限电',
            key: 'limitPower',
            color: '#5470c6',
            svg: 'status-2',
            value: 3,
        },
        {
            title: '故障',
            key: 'failure',
            color: '#ee6666',
            svg: 'status-3',
            value: 4,
        },
        {
            title: '关机',
            key: 'power',
            color: '#9a60b4',
            svg: 'status-5',
            value: 5,
        },
        {
            title: '通讯中断',
            key: 'interruption',
            color: '#fc8452',
            svg: 'status-7',
            value: 6,
        },
        {
            title: '未接入',
            key: 'notConnected',
            color: '#909399',
            svg: 'status-9',
            // 默认未接入
        },
    ];
}

/** 逆变器状态统计 */
const statistics: Ref<any> = ref({
    // 总数
    total: 0,
    // 并网
    grid: 0,
    // 故障
    failure: 0,
    // 关机
    power: 0,
    // 限电
    limitPower: 0,
    // 通讯故障
    interruption: 0,
    // 闭锁
    shutting: 0,
    // 未接入
    notConnected: 0,
})

/** 风机状态分布 */
const fdStates: Ref<any> = ref({
    // 并网
    grid: 0,
    // 待机
    standby: 0,
    // 维护
    maintain: 0,
    // 故障
    failure: 0,
    // 限电
    limitPower: 0,
    // 离线
    offline: 0,
    // 停机
    halt: 0,
})