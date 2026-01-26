<template>
    <div>
        <!-- 状态区域 -->
        <div class="status-container">
            <div style="display: flex;justify-content: space-between;align-items: center;">
                <div class="header-left">
                    <div class="area-box">
                        <el-select v-model="station" @change="selectStation">
                            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.stationCode" />
                        </el-select>
                        <el-select v-if="items.length > 1" v-model="area" @change="areaChange">
                            <el-option v-for="item in items" :key="item.id" :label="item.name" :value="item.regionCode" />
                        </el-select>
                    </div>
                </div>
                <solar-power-head :station="station" :inverter-count="statistics.total" :stations="options" :wind="wind" :wind-count="Object.keys(WindTurbine).length" @remove-inverter-status="removeInverterStatus" />
            </div>
            <div class="status-box m-t-16">
                <div>
                    <data v-if="mode && !wind" class="status-box">
                        <div v-for="(row, index) in states" :key="index" class="status-box-item" @click="changeInverterStatus(row.key)">
                            <SvgIcon :name="row.svg" class="f-24"></SvgIcon>
                            <label class="status-box-title" :style="{ color: row.color }">{{ row.title }}</label>
                            <span :style="{ color: row.color }">{{ '（' + statistics[row.key] + '）' }}</span>
                        </div>
                    </data>
                    <data v-if="mode && wind" class="status-box">
                        <div v-for="(row, index) in windStates" :key="index" class="status-box-item" @click="changeWindStatus(row.key)">
                            <span class="color" :style="{background: row.color}"></span>
                            <label class="status-box-title" :style="{ color: row.color }">{{ row.title + '（' + fdStates[row.key] + '）' }}</label>
                        </div>
                    </data>
                </div>
                
                <div class="right-config">
                    <el-slider v-if="mode && wind" v-model="radio" :step="1" :max="3" :min="1" :marks="marks" size="small" :show-tooltip="false" />
                    <div v-if="!wind && mode" style="color: rgba(255,255,255,0.7); font-size: 0.8vw;">
                        功率:&nbsp;kW&nbsp;&nbsp;&nbsp;&nbsp;发电量:&nbsp;kWh&nbsp;&nbsp;&nbsp;&nbsp; 
                    </div>
                    <div v-if="!mode" style="color: rgba(255,255,255,0.7); font-size: 0.8vw;">
                        电压:&nbsp;V&nbsp;&nbsp;&nbsp;&nbsp;电流:&nbsp;A&nbsp;&nbsp;&nbsp;&nbsp; 
                    </div>
                    <el-switch
                        v-model="mode"
                        size="large"
                        inline-prompt
                        :active-text="wind ? '风机列表' : '光伏方阵'"
                        :inactive-text="wind ? '风机箱变' : '光伏箱变'"
                    />
                </div>
            </div>
            <div class="division"></div>
        </div>

        <!-- 视图区域 -->
        <!-- 单个光伏方阵 -->
        <div v-if="mode && !wind" class="grid-resize shrink-box">
            <PhotovoltaicItem
                v-for="title in Object.keys(SolarPower)"
                :key="SolarPower[title].id"
                ref="PhotovoltaicItem"
                :row="SolarPower[title]"
                :title="title"
                :area="area"
                :code="station"
                :init-values="InitValuesGf"
                :inverter-status="inverterStatus"
                :nbq-status="nbqStatus"
                :nbq-array="nbqArray"
                @click="goNextPage(SolarPower[title].id)"
                @contextmenu="(e: any) => showDown(e, SolarPower[title].id)"
                @down="down"
            />
        </div>
        <!-- 风机 -->
        <div v-if="mode && wind" class="grid-resize" :class="{'wind-box': radio === 2, 'b-wind-box': radio === 3, 's-wind-box': radio === 1}">
            <WindTurbineItem
                v-for="title in Object.keys(WindTurbine)"
                :key="WindTurbine[title].id"
                ref="WindTurbineItem"
                :row="WindTurbine[title]"
                :title="title"
                :init-values="InitValues"
                @click="goFjPage(WindTurbine[title], title)"
                @contextmenu="(e: any) => showDown(e, WindTurbine[title].id, true, 'fd')"
                @down="down"
            />
        </div>
        <!-- 单个箱变 -->
        <div v-if="!mode" class="grid-resize shrink-box">
            <BoxChangeItem
                v-for="title in Object.keys(BoxChange)"
                :key="BoxChange[title].id"
                ref="BoxChangeItem"
                :row="BoxChange[title]"
                :title="title"
                :area="area"
                :init-values="InitXbValues"
                :data-info="xbInfo[title].tags"
                :station="station"
                @click="goDetail(BoxChange[title].id)"
                @contextmenu="(e: any) => showDown(e, BoxChange[title].id, true, 'xb')"
            />
        </div>

        <Contextmenu v-if="openDown" :configs="configs" :down-info="downInfo" :click-config="clickConfig" :tag-id="deviceId" :down-id="downId" :device-status="deviceStatus" @close-down="closeDown" />
        <ContextmenuDetail v-if="showDetail" :tag-id="pointId" @close="showDetail = false" />
    </div>
</template>

<script setup lang="ts">
import { useSocketStore } from '~/store/socket';
import { useStore } from '~/store/index';
// import { findHead } from '~/utils/SolarPowerHead';
import { ReadJson } from '~/utils/ReadJson';
import { StateColor, ReadInverterStatus } from '~/utils/ReadInverterStatus';
import { getNbqStatus } from '~/utils/getNbqStatus';
import { StateWindColor } from '~/utils/ReadWindTurbineStatus';
import { queryDeviceBoard, queryBoardList } from '~/api/depot/index'
import { queryTag, configControl } from '@/api/system/control';
import { TimerRandom } from '~/types/constant';

definePageMeta(
    PageMeta({
        active: '/depot/side',
    }),
);

// 防抖
const timeoutGf: any = ref(null);
const timeout: any = ref(null);
const timeoutXb: any = ref(null);
const nbqTime: any = ref(null);
const fjTime: any = ref(null);
const InitValuesGf: any = ref({})
const InitValues: any = ref({})
const InitXbValues: any = ref({})

// 光伏
const router = useRouter();
const route = useRoute();
const store = useSocketStore();
const store1 = useStore();
// const documentName = route.params.param as string;

// 对象
const SolarPower: any = ref([]);
const BoxChange: any = ref([]);
const WindTurbine: any = ref([]);

const nbqStatus: any = ref([]);
const nbqArray: any = ref([]);

// const dataInfo: any = ref({})  // socket数据分组
const xbInfo: any = ref({})  // socket数据分组

// 控制光伏箱变与光伏方阵的切换
const mode = ref(true);
// 场站区域
const options: Ref<any[]> = ref([])
const items: Ref<any[]> = ref([])
const station: any = ref('')
const area: any = ref('')
const deviceId: any = ref('')
const downId: any = ref('')
const radio: any = ref(2)
const marks: any = ref({
    1: '小',
    2: '中',
    3: '大'
})

const windStates = StateWindColor();
const states = StateColor();
const [find] = useFindSnapshot();
// const [head, handleHead] = findHead() as any;

// store.setSocketData([]);
const stateStatistics: any = ref({})
const openDown: Ref<boolean> = ref(false)
const showDetail: Ref<boolean> = ref(false)
const configs: Ref<any[]> = ref([])
const downInfo: Ref<any> = ref({})
const tagId: Ref<any> = ref('')
const pointId: Ref<any> = ref('')
const inverterStatus: Ref<any> = ref('')
// const inverterCount: Ref<any> = ref(0)
const statistics: Ref<any> = ref({
    "total": 0,
    "grid": 0,
    "notGridConnected": 0,
    "failure": 0,
    "alarm": 0,
    "power": 0,
    "limitPower": 0,
    "interruption": 0,
    "shutting": 0,
    "notConnected": 0
})
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

const wind: any = ref(false)
const deviceStatus: any = ref('')

const areaChange = (val: any) => {
    sessionStorage.setItem('area', val)
}

const getCount = () => {
    const list: any = Object.values(SolarPower.value).map((item: any) => {
        return new Promise((resolve: any, reject: any) => {
            const [statistics] = ReadInverterStatus(area.value, item.id);
            resolve(statistics)
        })
    })
    setTimeout(() => {
        Promise.all(list).then((res: any) => {
            res.map((item: any) => {
                for(const key in item) {
                    if (key !== 'ids') statistics.value[key] += item[key]
                }
                return true
            })
        })
    }, TimerRandom)
}

const queryInitValuesGf = (ids: any) => {
    timeoutGf.value && clearTimeout(timeoutGf.value)
    if (!ids.length) return
    find(ids).then((r) => {
        for (const key of Object.keys(r.data)) {
            InitValuesGf.value[key] = r.data[key]?.value;
        }
        timeoutGf.value = setTimeout(() => {
            queryInitValuesGf(ids)
        }, TimerRandom)
    });
}

const queryInitValues = (ids: any) => {
    // console.log("queryInitValues状态："+ids)
    timeout.value && clearTimeout(timeout.value)
    if (!ids.length) return
    find(ids).then((r) => {
        for (const key of Object.keys(r.data)) {
            InitValues.value[key] = r.data[key]?.value;
        }
        InitValues.value.time = new Date().getTime()
        timeout.value = setTimeout(() => {
            queryInitValues(ids)
        }, TimerRandom)
    });
}


const queryFjStatusInfo = (arr: any) => {
    fjTime.value && clearTimeout(fjTime.value)
    // console.log("queryFjStatusInfo："+arr)
    find(arr).then((res: any) => {
        if (wind.value) {
            const obj: any = { grid: 0, standby: 0, maintain: 0, failure: 0, limitPower: 0, offline: 0, halt: 0 }
            if (!Object.keys(res.data).length) obj.offline = arr.length
            for (const key in res.data) {
                switch (res.data[key].value) {
                    case 1:
                        obj.grid += 1;
                        break;
                    case 2:
                        obj.limitPower += 1;
                        break;
                    case 3:
                        obj.failure += 1;
                        break;
                    case 4:
                        obj.standby += 1;
                        break;
                    case 5:
                        obj.maintain += 1;
                        break;
                    case 6:
                        obj.halt += 1;
                        break;
                    case 7:
                        obj.offline += 1;
                        break;
                    default:
                        obj.offline += 1;
                }
            }
            fdStates.value = {...obj}
        }

        fjTime.value = setTimeout(() => {
            queryFjStatusInfo(arr)
        }, TimerRandom)
    })
}

const queryInitValuesXb = (ids: any) => {
    // console.log("queryInitValuesXb：：：："+ids)
    if(timeoutXb.value) {
        clearTimeout(timeoutXb.value)
        timeoutXb.value = null
    }
    if (!ids.length) return
    find(ids).then((r) => {
        for (const key of Object.keys(r.data)) {
            InitXbValues.value[key] = r.data[key]?.value;
        }
        timeoutXb.value = setTimeout(() => {
            queryInitValuesXb(ids)
        }, TimerRandom)
    });
}

const getNbqStatusInfo = (ids: string[], arr: any) => {
    if(nbqTime.value) {
        clearTimeout(nbqTime.value)
        nbqTime.value = null
    }
    // console.log("查逆变器状态："+ids)
    find(ids).then(r => {
        const list: any = []
        for (const key in r.data) {
            let parentId: string = ''
            for (const k in arr) {
                const obj: any = arr[k].tags.find((e: { tagId: string; }) => e.tagId === key)
                if (obj) parentId = arr[k].parentId
            }
            list.push({
                id: key,
                item: r.data[key],
                parentId
            })
        }
        list.sort((a: any, b: any) => a.id.localeCompare(b.id))
        nbqStatus.value = [...list]
        statistics.value = getNbqStatus(list)
        statistics.value.total = ids.length
        statistics.value.notConnected += ids.length - list.length

        nbqTime.value = setTimeout(() => {
            getNbqStatusInfo(ids, arr)
        }, TimerRandom)
    })
}

// 监听区域变化读取json文件
watch(
[area, mode], 
  (newVals, oldVals) => {
    const nVal = newVals[0] // 选择的哪个站点
    const mode1 = newVals[1] // 是否选择的箱变switch,为true是风机和光伏，为false是箱变

        // console.log("area.value===",nVal)
        // console.log("mode.value===",mode1)
        statistics.value = {
            "total": 0,
            "grid": 0,
            "notGridConnected": 0,
            "failure": 0,
            "alarm": 0,
            "power": 0,
            "limitPower": 0,
            "interruption": 0,
            "shutting": 0,
            "notConnected": 0
        }
        store.setCurrentPage(area.value);
        if(mode1){
            timeoutXb.value && clearTimeout(timeoutXb.value)
            if (!wind.value) {
                // 光电
                ReadJson(station.value, nVal + '_zz').then((module: any) => {
                    // 对象数据
                    SolarPower.value = module?.default || [];

                    timeout.value && clearTimeout(timeout.value)
                    let ids: any = []

                    for (const key in SolarPower.value) {
                        ids = [...ids, ...SolarPower.value[key].tags.map((e: any) => e.tagId)]
                    }
                    
                    queryInitValuesGf(ids)
                });

                ReadJson(station.value, nVal + '_nbq').then((module: any) => {
                    if (module) {
                        const arr: any = module?.default
                        nbqArray.value = arr
                        const ids: string[] = []
                        for (const key in arr) {
                            ids.push(arr[key].tags.find((e: { tagName: string; }) => e.tagName === '运行状态')?.tagId)
                        }

                        getNbqStatusInfo(ids, arr)
                    } else {
                        getCount()
                    }
                })
            } else if (wind.value) {
                // 风电
                ReadJson(station.value, nVal + '_fj').then((module: any) => {
                    // 对象数据
                    WindTurbine.value = module?.default || [];

                    timeout.value && clearTimeout(timeout.value)
                    let ids: any = []
                    const arr: any = []

                    for (const key in WindTurbine.value) {
                        ids = [...ids, ...WindTurbine.value[key].tags.map((e: any) => e.tagId)]
                        arr.push(WindTurbine.value[key].tags.find((e: any) => e.tagName === '风机状态')?.tagId)
                    }
                    
                    queryInitValues(ids)
                    queryFjStatusInfo(arr)
                });
            }
        }else{
            if (timeoutGf.value) {
                clearTimeout(timeoutGf.value)
                timeoutGf.value = null  // 重要：重置引用
            }
            if (timeout.value) {
                clearTimeout(timeout.value)
                timeout.value = null
            }
            if (timeoutXb.value) {
                clearTimeout(timeoutXb.value)
                timeoutXb.value = null
            }
            if (nbqTime.value) {
                clearTimeout(nbqTime.value)
                nbqTime.value = null
            }
            if (fjTime.value) {
                clearTimeout(fjTime.value)
                fjTime.value = null
            }
            ReadJson(station.value, nVal + '_xb').then((module: any) => {
                // 对象数据
                BoxChange.value = module?.default || [];

                timeout.value && clearTimeout(timeout.value)
                let ids: any = []

                for (const key in BoxChange.value) {
                    ids = [...ids, ...BoxChange.value[key].tags.map((e: any) => e.tagId)]
                    xbInfo.value[key] = {
                        id: BoxChange.value[key].id,
                        tags: {}
                    }
                    BoxChange.value[key].tags.forEach((item: any) => {
                        xbInfo.value[key].tags[item.tagId] = ''
                    })
                }
                
                queryInitValuesXb(ids)
            });

        }
    },
    { immediate: true, deep: true },
);

const getBoardList = async () => {
    const params = {
        type: wind.value ? 2 : 1
    }
    const res: any = await queryBoardList(params)
    sessionStorage.setItem('boardList', JSON.stringify(res.data))
}

const getStations = () => {
    const arr: any =  sessionStorage.getItem('stations')
    const code: any =  sessionStorage.getItem('station')
    options.value = JSON.parse(arr) || []
    station.value = code || [];
    console.log(station.value,'station.value')
    const data: any = options.value.find((e: any) => code === e.stationCode)
    wind.value = data.stationType === '2'
    // store.setSocketUrl(data?.websocketUrl)

    // nextTick(() => {
    //     if (!store.initSocket) store.initWebSocket();
    //     store.setInitSocket(true);
    // })
    getBoardList()

    if (!data) return
    getPhotovoltaics(data)
}

const getPhotovoltaics = (data: any) => {
    if (data.photovoltaics.length) {
        items.value = data.photovoltaics
        area.value = items.value[0].regionCode
        sessionStorage.setItem('area', area.value)
    } else {
        items.value = []
        area.value = ''
    }
    wind.value = data.stationType === '2'
    getBoardList()
}

const selectStation = (val: any) => {
    sessionStorage.setItem('station', val)
    sessionStorage.removeItem('area')
    const data: any = options.value.find((e: any) => val === e.stationCode)
    // wind.value = data.stationType === '2'
    // getBoardList()
    getPhotovoltaics(data)

    // 切换场站后重置socketUrl
    // store.webSocketClose()
    // store.setSocketUrl(data.websocketUrl)
    // store.setInitSocket(false);
    // nextTick(() => {
    //     if (!store.initSocket) store.initWebSocket();
    //     store.setInitSocket(true);
    // })
}

/**
 * 跳转逆变器页面或者箱变详情
 * @param matrixId 子阵id
 */
const goNextPage = (matrixId?: string) => {
    store1.setParams({
        matrixId,
        zzInfo: {
            title: station.value,
            nbqStatus: nbqStatus.value,
            nbqArray: nbqArray.value
        }
    })
    router.push('/depot/side/nbq')
}
const goFjPage = (item: any, title: any) => {
    store1.setParams({
        item,
        InitWind: InitValues.value,
        title
    })
    router.push(`${route.path}/draught-fan`)
}
const goDetail = (matrixId?: string) => {
    store1.setParams({
        matrixId,
        area: area.value,
        station: station.value
    })
    router.push(`${route.path}/box-detail`)
}

// window.addEventListener('onmessageWS', ({detail: {data}}: any) => {
//     if (store.currentPage !== area.value) return false;
//     const socketData: any = [...store.socketData]
//     if (socketData.length === 0) return false;
//     if (mode.value) {
//         for (let index = 0; index < socketData.length; index++) {
//             const cur = socketData[index];

//             for (const key in dataInfo.value) {
//                 if (cur.pointCode.includes(dataInfo.value[key].id)) {
//                     for (const i in dataInfo.value[key].tags) {
//                         if (i === cur.pointCode) dataInfo.value[key].tags[i] = cur.pointValue
//                     }
//                 }
//             }
//         }
//     } else {
//         for (let index = 0; index < socketData.length; index++) {
//             const cur = socketData[index];

//             for (const key in xbInfo.value) {
//                 if (cur.pointCode.includes(xbInfo.value[key].id)) {
//                     for (const i in xbInfo.value[key].tags) {
//                         if (i === cur.pointCode) xbInfo.value[key].tags[i] = cur.pointValue
//                     }
//                 }
//             }
//         }
//     }
//     store.resetSocketData()
// });

// 右键下控
const showDown = (event: any, id: any, isBoard: any = false, type: any = 'gf') => {
    event.preventDefault()

    downId.value = id

    openDown.value = false
    queryDeviceBoard({ deviceCode: id }).then((res1: any) => {
        if (res1.success) {
            deviceStatus.value = res1.data?.status
            const params: any = {
                name: id
            }
            deviceId.value = res1.data?.id || ''
            let arr: any = []
            if (type !== 'xb') {
                arr = [
                    { id: 'gp', operationName: '挂牌', type },
                    // { id: 'zp', operationName: '摘牌', type }
                ]
                if (res1.data?.status.split('').find((e: any) => e === '1')) {
                    arr.push({
                        id: 'zp',
                        operationName: '摘牌',
                        type
                    })
                }
            }
            queryTag(params).then((res: any) => {
                if (res.success) {
                    configs.value = res.data?.monitorPointOperationConfigs || []
                    if (isBoard) {
                        configs.value = [...configs.value, ...arr]
                    }
                    tagId.value = res.data?.id

                    downInfo.value = {
                        top: event.clientY,
                        left: event.clientX,
                        isNeedPassword: res.data?.isNeedPassword
                    }
                    configs.value.length && (openDown.value = true)
                }
            })
        }
    })
}

const clickConfig = (item: any) => {
    if (!item.type) {
        openDown.value = false
        const params: any = {
            id: tagId.value,
            configId: item.id
        }
        if (item.attachmentId) params.attachmentId = item.attachmentId
        configControl(params).then((res: any) => {
            if (res.success) {
                ElMessage.success('操作成功')
            }
        })
    } else if (item.id === 1) {
        openDown.value = false
        showDetail.value = true
    } else if (item.id === 2) {
        openDown.value = false
        const list: any = JSON.parse(sessionStorage.getItem('points') || '[]')
        if (list.find((e: any) => e.id === pointId.value)) {
            nextTick(() => {
                store1.setTrend(true)
            })
        } else {
            find([pointId.value]).then(res => {
                if (res.success) {
                    list.push({
                        name: res.data[pointId.value].desc,
                        id: pointId.value
                    })
                    sessionStorage.setItem('points', JSON.stringify(list))

                    nextTick(() => {
                        store1.setTrend(true)
                    })
                }
            })
        }
    }
}

const down = (row: any) => {
    openDown.value = false
    configs.value = [
        { id: 1, operationName: '查看详情', type: 'dw' },
        { id: 2, operationName: '趋势分析', type: 'dw' }
    ]
    pointId.value = row.id

    downInfo.value = {
        top: row.e.clientY,
        left: row.e.clientX,
        isNeedPassword: 0
    }
    openDown.value = true
}

const changeInverterStatus = (key: any) => {
    inverterStatus.value = key
}
const changeWindStatus = (key: any) => {
    inverterStatus.value = key
}
const removeInverterStatus = () => {
    inverterStatus.value = ''
}

const closeDown = () => {
    openDown.value = false
}

onMounted(() => {
    getStations()
    window.removeEventListener('click', closeDown)
    window.addEventListener('click', closeDown)
    window.addEventListener('mousewheel', closeDown)
    console.log('onMounted', timeoutGf.value, timeout.value, timeoutXb.value, nbqTime.value, fjTime.value)
})

onBeforeUnmount(() => {
    if (timeoutGf.value) {
        clearTimeout(timeoutGf.value)
        timeoutGf.value = null  // 重要：重置引用
    }
    if (timeout.value) {
        clearTimeout(timeout.value)
        timeout.value = null
    }
    if (timeoutXb.value) {
        clearTimeout(timeoutXb.value)
        timeoutXb.value = null
    }
    if (nbqTime.value) {
        clearTimeout(nbqTime.value)
        nbqTime.value = null
    }
    if (fjTime.value) {
        clearTimeout(fjTime.value)
        fjTime.value = null
    }

    window.removeEventListener('click', closeDown)
    window.removeEventListener('mousewheel', closeDown)
});

onUnmounted(()=>{
    if (timeoutGf.value) {
        clearTimeout(timeoutGf.value)
        timeoutGf.value = null  // 重要：重置引用
    }
    if (timeout.value) {
        clearTimeout(timeout.value)
        timeout.value = null
    }
    if (timeoutXb.value) {
        clearTimeout(timeoutXb.value)
        timeoutXb.value = null
    }
    if (nbqTime.value) {
        clearTimeout(nbqTime.value)
        nbqTime.value = null
    }
    if (fjTime.value) {
        clearTimeout(fjTime.value)
        fjTime.value = null
    }
    console.log('unmounted', timeoutGf.value, timeout.value, timeoutXb.value, nbqTime.value, fjTime.value)
})

useBeforeLeave(() => {
    // store.webSocketClose();
});
</script>

<style lang="scss" scoped>
.f-24 {
    font-size: 24px;
}

.shrink-box {
    grid-template-columns: repeat(6, 1fr);
    margin-top: 20px;

    ::v-deep(.bigbox-power) {
        grid-template-columns: repeat(1, 1fr);
    }
}
.wind-box {
    grid-template-columns: repeat(7, 1fr);
    margin-top: 20px;
    gap: 12px !important;

    ::v-deep(.bigbox-power) {
        grid-template-columns: repeat(1, 1fr);
    }
}
.b-wind-box {
    grid-template-columns: repeat(6, 1fr);
    margin-top: 20px;
    gap: 12px !important;

    ::v-deep(.bigbox-power) {
        grid-template-columns: repeat(1, 1fr);
    }
    :deep(.wind-item) {
        padding: 20px;
    }
    :deep(.wind-left) {
        width: 130px !important;

        svg {
            width: 100px !important;
            height: 111px !important;
        }

        span {
            font-size: 18px !important;
            height: 23px;
            background-size: 100% 70%;
            padding-bottom: 36px;
        }
    }
    :deep(.wind-right) {
        width: calc(100% - 130px);

        * {
            font-size: 18px !important;
        }
    }
}
.s-wind-box {
    grid-template-columns: repeat(9, 1fr);
    margin-top: 20px;
    gap: 12px !important;

    ::v-deep(.bigbox-power) {
        grid-template-columns: repeat(1, 1fr);
    }
    :deep(.wind-item) {
        padding: 12px;
    }

   :deep(.wind-left) {
        width: 72px !important;

        svg {
            width: 64px !important;
            height: 69px !important;
        }

        span {
            font-size: 14px !important;
            height: auto;
            padding-bottom: 8px;
            background-size: 100% 70%;
        }
    }
    :deep(.wind-right) {
        width: calc(100% - 72px);

        * {
            font-size: 14px !important;
        }
    }
}
.status-container {
    // display: flex;
    // align-items: center;
    // justify-content: space-between;

    .header-left {
        display: flex;
        gap: 20px;

        .area-box {
            display: flex;
            gap: 10px;

            .el-select {
                height: 100%;

                :deep(.el-select__placeholder span) {
                    color: #fff !important;
                }
            }
        }
    }

    .status-main {
        text-align: right;

        ::v-deep(.el-select__wrapper) {
            box-shadow: 0 0 0 1px #396285 inset !important;
        }
        :deep(.el-select__placeholder) {
            color: rgba(255,255,255,0.7) !important;
        }
    }

    .el-select {
        width: 200px;
    }
}
.status-box {
    display: flex;
    // margin: 20px 0;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    .right-config {
        text-align: right;
        display: flex;
        gap: 40px;
        align-items: center;
        justify-content: end;
    }
    &-item {
        height: 24px;
        font-size: 18px;
        font-family:
            Source Han Sans,
            Source Han Sans;
        font-weight: 400;
        line-height: 24px;
        cursor: pointer;
        display: flex;
        gap: 6px;
        align-items: center;

        .color {
            width: 30px;
            height: 18px;
            border-radius: 2px;
        }
    }
    &-title {
        height: 24px;
        font-family: Source Han Sans, Source Han Sans;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        text-align: left;
        font-style: normal;
        text-transform: none;
        cursor: pointer;
    }
}
.division {
    width: 100%;
    height: 1px;
    background: #129BFF;
    border-radius: 0px 0px 0px 0px;
    opacity: 0.5;
    margin-top: 20px;
}
::v-deep(.el-switch.is-checked .el-switch__core) {
    border: 0;
    background: #022043;
    box-shadow: inset 0px 0px 27px 0px #074277;
}
::v-deep(.el-switch__core) {
    border: 0;
    background: #022043;
    box-shadow: inset 0px 0px 27px 0px #074277;
}
::v-deep(.el-switch.is-checked .el-switch__core .el-switch__action) {
    background-color: #0097ff;
}
::v-deep(.is-text) {
    color: #0097ff !important;
}
:deep(.el-switch--large .el-switch__core) {
    width: 95px;
    height: 32px;
    background: transparent !important;
    box-shadow: none !important;
    border: 1px solid #0E9CFF !important;
    border-radius: 16px;

    .el-switch__action {
        width: 22px !important;
        height: 22px !important;
        // left: calc(100% - 23px) !important;
    }
    .el-switch__inner .is-text {
        font-size: 12px;
    }
}
:deep(.el-switch.is-checked .el-switch__action) {
    left: calc(100% - 23px) !important;
}

:deep(.el-select__wrapper) {
    height: 68px;
    box-shadow: inset 0px 0px 87px 0px rgba(1, 194, 255, 0.4) !important;
    border: 1px solid #0E9CFF !important;
    border-radius: 0 !important;
}
:deep(.el-select__popper) {
    background: #00000A !important;
    box-shadow: inset 0px 0px 80px 0px #264B64, inset 0px 0px 10px 0px rgba(28,126,242,0.5) !important;
    border-radius: 6px !important;
    border: 1px solid #1B7EF2;
}

:deep(.el-radio-group) {
    height: 100%;

    label {
        height: 33.33% !important;
        margin: 0 !important;
    }
};
:deep(.el-slider__bar){
    background-color: #fff;
}
:deep(.el-slider__button-wrapper){
    width: 36px !important;
}
:deep(.el-slider__marks){
    width: 36px !important;
}
:deep(.el-slider__stop){
    width: 12px !important;
    border-radius:2px !important;
}
:deep(.el-slider__button) {
    width: 18px !important;
    height: 18px !important;
}
:deep(.el-slider__marks-text) {
    text-align: center;
    width:12px !important;
    font-size: 14px !important;
}
</style>
