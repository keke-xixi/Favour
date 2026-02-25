import {findInverterListApi} from "~/api";

/**
 * 读取json文件，根据父类的id进行筛选，请求逆变器的状态
 * @param prefix json名称
 * @param matrixId 父类的id
 * @returns
 */
export function ReadInverterStatus(prefix: string, matrixId: any) {
    const [find] = useFindSnapshot();

    const statistics = reactive({
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

    // 光伏里面的逆变器状态数组
    const statusArray = ref<any[string]>([
        '', '', '', '',
        '', '', '', '',
        '', '', '', '',
    ]);

    // 向数据插入值
    function insert(value: string, index: any) {
        if (index === 'all') {
            statusArray.value.map((e: any) => {
                e = 'value'
                return true
            })
        } else {
            statusArray.value[index] = value
        }
    }

    // 根据子阵id和标识去请求获取逆变器信息
    findInverterListApi(matrixId, prefix).then((r: any) => {
        for (const [key, item] of Object.entries(r.data || {}) as any) {
            // 总数
            if (item.parentId === matrixId) {
                statistics.total += 1;
                item.tags.forEach((e: any) => {
                    if (e.tagName === '运行状态') statistics.ids.push(e.tagId)
                })
                // statistics.ids.push(item.id.replace('ZZYC', 'ZZYX') + '_S');
            }
        }
        // 去请求数量汇总和状态
        find(statistics.ids)
            .then((r) => {
                const list: any = []
                for (const key in r.data) {
                    list.push({
                        id: key,
                        item: r.data[key]
                    })
                }
                list.sort((a: any, b: any) => a.id.localeCompare(b.id))
                list.map((e: any, i: any) => {
                    // case 1 等其它的，与后端对应，表示不同的状态
                    switch (e.item.value) {
                        case 1:
                            insert('status-1', i);
                            break;
                        case 2:
                            insert('status-2', i);
                            break;
                        case 3:
                            insert('status-3', i);
                            break;
                        case 4:
                            insert('status-5', i);
                            break;
                        case 5:
                            insert('status-8', i);
                            break;
                        case 6:
                            insert('status-7', i);
                            break;
                        // case 7:
                        //     insert('status-7', i);
                        //     break;
                        // case 8:
                        //     insert('status-8', i);
                        //     break;
                        default:
                            insert('status-9', i);
                            // 未接入
                            break;
                    }
                    return true
                })
            })
            .catch(() => {
                // 请求失败就自动补充未接入
                for (let index = 0; index < statistics.ids.length; index++) {
                    statistics.notConnected += 1;
                    insert('status-9', 'all');
                }
            });
    })
    return [statistics, statusArray];
}

export function StateColor() {
    return [
        {
            title: '并网',
            key: 'grid',
            color: '#91cc75',
            svg: 'status-1',
        },
        {
            title: '限电',
            key: 'limitPower',
            color: '#5470c6',
            svg: 'status-2',
        },
        {
            title: '故障',
            key: 'failure',
            color: '#ee6666',
            svg: 'status-3',
        },
        {
            title: '断电',
            key: 'power',
            color: '#9a60b4',
            svg: 'status-5',
        },
        {
            title: '闭锁',
            key: 'shutting',
            color: '#0055ff',
            svg: 'status-8',
        },
        {
            title: '通讯中断',
            key: 'interruption',
            color: '#fc8452',
            svg: 'status-7',
        },
        {
            title: '未接入',
            key: 'notConnected',
            color: '#909399',
            svg: 'status-9',
        },
    ];
}


export function findInverter(prefix: string, matrixId: any) {
    return new Promise((resolve, reject) => {
        findInverterListApi(matrixId, prefix).then((r: any) => {
            resolve(r.data)
        }).catch(() => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject()
        })
    })
}
