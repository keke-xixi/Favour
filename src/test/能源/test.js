

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


const openDown: Ref<boolean> = ref(false)

<Contextmenu v-if="openDown" :configs="configs" :down-info="downInfo" :click-config="clickConfig" :tag-id="deviceId" :down-id="downId" :device-status="deviceStatus" @close-down="closeDown" />
        <ContextmenuDetail v-if="showDetail" :tag-id="pointId" @close="showDetail = false" />