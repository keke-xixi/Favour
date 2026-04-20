window.addEventListener('mousemove', (event) => {
    window.domX = event.clientX
    window.domY = event.clientY
})
meta2d.on('click', () => {
    const item = {
        type: 'click'
    }
    window.parent.postMessage(JSON.stringify(item), '*')
});
meta2d.on('contextmenu', () => {
    const item = {
        type: 'click'
    }
    window.parent.postMessage(JSON.stringify(item), '*')
});

var url = "http://192.168.231.201:56001/api/ce-dian/snapshot/find"; // 可访问的 http
var interval = 2000;//发送的时间间隔，默认2秒播放一次，0.5倍，1倍速，2倍，4倍
// var stime = now();
// var etime = now();
// var currentTime = now();
// var times = 1;//时间间隔：1秒，2秒，5秒，30秒，1分钟，5分钟，10分钟，30分钟，1小时

const head = { "Content-Type": "application/json" };
const data = {
    "data": [
        "HN_JYZJ_FD.431125JYZJFDSYZ01YC01CDM101",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YC01CDM144",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YC01CDM145",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YC01CDM146",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YC01CDM147",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YC01CDM148",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YC01CDM149",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YC01CDM150",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YC01CDM151",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YC01CDM152",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YC01CDM154",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YC01CDM155",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YC01CDM156",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX02CDM076",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX02CDM077",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX02CDM078",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX02CDM079",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX02CDM080",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX03CDM483",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX03CDM485",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX03CDM486",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX03CDM487",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX03CDM491",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX03CDM492",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX03CDM493",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX03CDM494",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX03CDM495",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX03CDM496",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM002",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM004",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM005",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM011",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM014",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM015",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM016",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM017",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM018",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM019",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM028",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM036",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM037",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM038",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM047",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM054",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM055",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM056",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM104",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM060",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM051",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM049",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM052",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX01CDM432",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX01CDM436",
        "HN_JYZJ_FD.431125JYZJFDSYZ01YX04CDM105"
    ]
};

//发送请求 http
function getData() {
    const res = fetch(url, {
        headers: head,
        method: 'POST',
        body: JSON.stringify(data)
    }).then((e) => {
        // console.log("e", e);
        if (e.ok) {
            const promise = e.text()
            const list = []
            promise.then(res => {
                const obj = JSON.parse(res).data;
                for (const key in obj) {
                    if (key.includes('431125JYZJFDSYZ01YX')) {
                        list.push({
                            id: key,
                            value: obj[key].value
                        })
                    } else {
                        list.push({
                            id: key,
                            text: obj[key]?.value ? obj[key].value.toFixed(2) : '0.00'
                        })
                    }
                }
                console.log(list, 'list')
                for (let i = 0; i < list.length; i++) {
                    meta2d.setValue(list[i], { render: false, history: false });
                }
                meta2d.render();
            })
        }
    });
}

function getIntervalData() {
    meta2d.store.data.https[0].http = url;
    meta2d.store.data.https[0].method = "POST"; //设置请求方式 版本1.0.26以上支持
    meta2d.store.data.https[0].httpTimeInterval = interval; // 轮询间隔时间, 默认 1000
    meta2d.store.data.https[0].httpHeaders = head;
    meta2d.store.data.https[0].body = data;
    meta2d.connectHttp();
}

setInterval(function () {
    getData();
}, 5000)


