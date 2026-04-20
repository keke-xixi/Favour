/**
 * WebSocket 工具类（支持心跳检测和自动重连）
 */
const topicName = 'v_JYZJ_SYZ_01'
class WebSocketClient {
    constructor(url) {
        this.socket = null;
        this.url = url;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 10000;
        this.messageHandler = null;
        this.errorHandler = null;
        this.closeHandler = null;
        this.openHandler = null;

        // 心跳相关
        this.heartbeatInterval = null;
        this.heartbeatTimeout = null;
        this.heartbeatIntervalTime = 25000;
        this.heartbeatTimeoutTime = 30000;
        this.heartbeatMessage = JSON.stringify({ type: 'CLIENT_HEART_BEAT' });
    }

    connect() {
        try {
            const socketUid = new Date().getTime().toString();
            const fullUrl = this.url + `?secretKey=ws_root&secretPassword=ws_power123&uid=${socketUid}&topic=${topicName}`;

            this.socket = new WebSocket(fullUrl);

            this.socket.onopen = (event) => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
                this.startHeartbeat();
                if (this.openHandler) this.openHandler(event);
            };

            this.socket.onmessage = (event) => {
                this.resetHeartbeatTimeout();
                try {
                    const data = JSON.parse(event.data);
                    if (data === 'pong' || data?.type === 'CLIENT_HEART_BEAT_REPLY') {
                        return;
                    }
                    if (this.messageHandler) this.messageHandler(data);
                } catch (error) {
                    if (event.data === 'pong') return;
                    console.error('WebSocket message parse error:', error);
                }
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                if (this.errorHandler) this.errorHandler(error);
            };

            this.socket.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
                this.stopHeartbeat();
                if (this.closeHandler) this.closeHandler(event);
                this.attemptReconnect();
            };
        } catch (error) {
            console.error('WebSocket connection error:', error);
            this.attemptReconnect();
        }
    }

    disconnect() {
        this.stopHeartbeat();
        if (this.socket) {
            console.log('websocket close disconnect');
            this.socket.close();
            this.socket = null;
        }
    }

    send(data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.error('WebSocket not connected');
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => {
                this.connect();
            }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1));
        } else {
            console.error('Max reconnect attempts reached');
        }
    }

    startHeartbeat() {
        this.stopHeartbeat();
        this.sendHeartbeat();
        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
        }, this.heartbeatIntervalTime);
        this.resetHeartbeatTimeout();
    }

    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout);
            this.heartbeatTimeout = null;
        }
    }

    sendHeartbeat() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(this.heartbeatMessage);
            console.log('WebSocket heartbeat sent');
        }
    }

    resetHeartbeatTimeout() {
        if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout);
        }
        this.heartbeatTimeout = setTimeout(() => {
            console.warn('WebSocket heartbeat timeout, reconnecting...');
            this.stopHeartbeat();
            if (this.socket) {
                console.log('websocket close resetHeartbeatTimeout');
                this.socket.close();
            }
            this.attemptReconnect();
        }, this.heartbeatTimeoutTime);
    }

    setHeartbeatConfig(interval, timeout, message) {
        if (interval) this.heartbeatIntervalTime = interval;
        if (timeout) this.heartbeatTimeoutTime = timeout;
        if (message) this.heartbeatMessage = message;
    }

    onOpen(handler) { this.openHandler = handler; }
    onMessage(handler) { this.messageHandler = handler; }
    onError(handler) { this.errorHandler = handler; }
    onClose(handler) { this.closeHandler = handler; }
    getReadyState() { return this.socket ? this.socket.readyState : WebSocket.CLOSED; }
    isConnected() { return this.socket ? this.socket.readyState === WebSocket.OPEN : false; }
}

window.addEventListener('mousemove', (event) => {
    window.domX = event.clientX
    window.domY = event.clientY
})

meta2d.on('click', () => {
    const item = { type: 'click' }
    window.parent.postMessage(JSON.stringify(item), '*')
})

meta2d.on('contextmenu', () => {
    const item = { type: 'click' }
    window.parent.postMessage(JSON.stringify(item), '*')
})

// WebSocket 服务地址
const wsUrl = "ws://192.168.232.110:56005/api/websocket/subPoint"

// 创建 WebSocket 客户端实例
const wsClient = new WebSocketClient(wsUrl)

// 设置消息处理器：收到数据后更新 meta2d 图形
wsClient.onMessage((data) => {
    if (data && data.pointValue) {
        const obj = {
            id: data.pointName
        }
        if (data.pointName.includes('431125JYZJFDSYZ01YX')) {
            obj.value = data.pointValue ? data.pointValue.toFixed(2) : '0.00'
        } else {
            obj.text = data.pointValue
        }
        meta2d.setValue(obj, { render: false, history: false })
        meta2d.render()
    }
})

// 连接打开后，发送订阅消息（告诉服务端需要哪些测点的数据）
wsClient.onOpen(() => {
    console.log('WebSocket 已连接，发送订阅请求')
    const subscribeMsg = {
        type: 'subscribe',
        topic: topicName
    }
    wsClient.send(subscribeMsg)
})

// 可选：监听错误和关闭事件
wsClient.onError((error) => {
    console.error('WebSocket 错误:', error)
})

wsClient.onClose((event) => {
    console.log(`WebSocket 关闭: ${event.code} - ${event.reason}`)
})

// 启动 WebSocket 连接
wsClient.connect()

// 注意：如果页面关闭，应断开 WebSocket 连接
window.addEventListener('beforeunload', () => {
    if (wsClient && wsClient.disconnect) {
        wsClient.disconnect()
    }
})