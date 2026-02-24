export default [
    {
        // 工单详情 (用户示例)
        url: '/api/work-order/workOrder/appGet',
        method: 'GET',
        maxAge: 123455,
        dataSchema: [
            // data 字段的匹配，默认为空，表示不匹配
            // 类型可以是：string、number、boolean、null、object、any（表示任意类型均可），以及这些类型的数组表示方式
            { name: 'id', schema: { type: 'any' } },
        ],
    },
    // --- api/api.js ---
    {
        // 列表 - 根据bizId获取文件
        url: '/api/file/file/getByBiz',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [
            { name: 'bizId', schema: { type: 'any' } }
        ]
    },
    {
        // 响应/处理工单
        url: '/api/work-order/workOrder/handle',
        method: 'POST',
        maxAge: 0, // 这是一个操作接口，不应缓存
        dataSchema: [
            { name: 'orderNumber', schema: { type: 'string' } },
            { name: 'id', schema: { type: 'string' } },
            { name: 'status', schema: { type: 'string' } },
            { name: 'workCategoryName', schema: { type: 'string' } },
            { name: 'projectId', schema: { type: 'string' } },
            { name: 'instanceId', schema: { type: 'string' } },
            { name: 'processUid', schema: { type: 'string' } }
        ]
    },
    {
        // 团队响应
        url: '/api/work-order/workOrder/receive',
        method: 'POST',
        maxAge: 0,
        dataSchema: [
            { name: 'orderNumber', schema: { type: 'string' } }
        ]
    },
    {
        // 保洁转领班
        url: '/api/employee/employee/api/getLeader',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [] // 无参数
    },
    {
        // 转单
        url: '/api/work-order/workOrder/forwarded',
        method: 'POST',
        maxAge: 0,
        dataSchema: [
            { name: 'orderNumber', schema: { type: 'string' } },
            { name: 'id', schema: { type: 'string' } },
            { name: 'transferUserId', schema: { type: 'string' } },
            { name: 'transferUserName', schema: { type: 'string' } },
            { name: 'reason', schema: { type: 'string' } },
            { name: 'workCategoryName', schema: { type: 'string' } },
            { name: 'projectId', schema: { type: 'string' } },
            { name: 'instanceId', schema: { type: 'string' } },
            { name: 'isCustomerOrder', schema: { type: 'any' } },
            { name: 'orderType', schema: { type: 'any' } },
            { name: 'isTeamWork', schema: { type: 'boolean' } },
            { name: 'processUid', schema: { type: 'string' } }
        ]
    },
    {
        // 待补充
        url: '/api/work-order/workOrder/toBeSupplemented',
        method: 'POST',
        maxAge: 0,
        dataSchema: [
            { name: 'orderNumber', schema: { type: 'string' } },
            { name: 'id', schema: { type: 'string' } },
            { name: 'processUname', schema: { type: 'string' } },
            { name: 'processUid', schema: { type: 'string' } },
            { name: 'spaceId', schema: { type: 'string' } },
            { name: 'spaceName', schema: { type: 'string' } },
            { name: 'workCategoryId', schema: { type: 'string' } },
            { name: 'workCategoryName', schema: { type: 'string' } }
        ]
    },
    {
        // 字典接口
        url: '/api/system-common/sys-dict-item/getByDictCode',
        method: 'GET',
        maxAge: 3600000,
        dataSchema: []
    },
    {
        // 项目列表
        url: '/api/system-common/project/listAll',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [
            { name: 'projectName', schema: { type: 'string' } }
        ] // 无参数
    },
    {
        // 服务类型
        url: '/api/plan/work-category/getSpaceTree',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [
             { name: 'projectId', schema: { type: 'string' } }
        ]
    },
    {
        // 空间
        url: '/api/system-common/space/getAppSpaceTree',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [
             { name: 'projectId', schema: { type: 'string' } },
             { name: 'orderType', schema: { type: 'string' } }
        ]
    },
    {
        // 获取二维码
        url: '/api/system-common/space/getQrCode',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [
            { name: 'id', schema: { type: 'string' } }
        ]
    },
    {
        // 二维码扫码获取空间信息
        url: '/api/system-common/space/getByQrcode',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [
             { name: 'id', schema: { type: 'string' } }
        ]
    },
    {
        // 获取按钮权限
        url: '/api/workflow/flow/execute/getButton',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [
             { name: 'instanceId', schema: { type: 'string' } },
             { name: 'isFreeOperation', schema: { type: 'any' } }
        ]
    },
    {
        // 照片墙新增
        url: '/api/work-order/workOrderQrPhoto/save',
        method: 'POST',
        maxAge: 0,
        dataSchema: [
            { name: 'projectId', schema: { type: 'string' } },
            { name: 'description', schema: { type: 'string' } },
            { name: 'workCategoryId', schema: { type: 'string' } },
            { name: 'orderNumber', schema: { type: 'string' } },
            { name: 'orderId', schema: { type: 'string' } },
            { name: 'imgId', schema: { type: 'string' } },
            { name: 'orderExecute', schema: { type: 'any' } },
            { name: 'spaceManageId', schema: { type: 'any' } },
            { name: 'orderCreateTime', schema: { type: 'any' } },
            { name: 'imgUrl', schema: { type: 'string' } }
        ]
    },
    {
        // 团队人员列表
        url: '/api/employee/sys-employee/getEmployeeByLeaderIdAndAllCleaner',
        method: 'GET', // 代码中是 post，这里修正为 post
        maxAge: 60000,
        dataSchema: [] // 无参数
    },

    // --- pages/login/api.js ---
    {
        // 获取加密字符串
        url: '/api/auth/getEncryptedString',
        method: 'POST',
        maxAge: 60000,
        dataSchema: [] // 代码中未找到明确参数使用
    },
    {
        // 登录
        url: '/api/system-common/auth/appLogin',
        method: 'POST',
        maxAge: 0,
        dataSchema: [
             { name: 'username', schema: { type: 'string' } },
             { name: 'password', schema: { type: 'string' } },
             { name: 'captcha', schema: { type: 'string' } }
        ]
    },
    {
        // 微信登录
        url: '/api/system-common/auth/weChatLogin',
        method: 'POST',
        maxAge: 0,
        dataSchema: [
            { name: 'code', schema: { type: 'string' } }
        ]
    },
    {
        // 免登录
        url: '/api/system-common/auth/getTokenWxUser',
        method: 'POST',
        maxAge: 0,
        dataSchema: [
            { name: 'str', schema: { type: 'string' } }
        ]
    },
    {
        // 修改密码
        url: '/api/system-common/app-user/appChangePassword',
        method: 'POST',
        maxAge: 0,
        dataSchema: [
            { name: 'identityCard', schema: { type: 'string' } },
            { name: 'newPassword', schema: { type: 'string' } },
            { name: 'confirmNewPassword', schema: { type: 'string' } }
        ]
    },
    {
        // 微信登录获取openid
        url: '/api/system-common/auth/getOpenId',
        method: 'POST',
        maxAge: 0,
        dataSchema: [
            { name: 'code', schema: { type: 'string' } },
            { name: 'id', schema: { type: 'string' } }
        ]
    },

    // --- pages/home/api.js ---
    {
        // 获取菜单
        url: '/api/mobile/sysMobilePermission/getAppMenu',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [] // 无参数
    },
    {
        // 获取正在进行中的任务
        url: '/api/task/mtTaskMenu/getPendingTasks',
        method: 'GET',
        maxAge: 10000,
        dataSchema: [] // 无参数
    },
    {
        // 轮播图
        url: '/api/sys/sysCarouselImage/flatPatternmaking',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [] // 无参数
    },
    {
        // 文字轮播图
        url: '/api/sys/sysCarouselImage/flatPatternmakingOrder',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [] // 无参数
    },

    // --- pages/index/api.js ---
    {
        // 我的工作台只显示一条的工单
        url: '/api/work-order/workOrder/appPageOne',
        method: 'GET',
        maxAge: 10000,
        dataSchema: [] // 无参数
    },
    {
        // 我的战绩
        url: '/api/work-order/workOrder/todayPerformance',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [] // 无参数
    },
    {
        // 我的待办
        url: '/api/work-order/workOrder/myWorkOrderCount',
        method: 'GET',
        maxAge: 10000,
        dataSchema: [] // 无参数
    },
    {
        // 我的待办列表
        url: '/api/work-order/workOrder/myWorkOrder',
        method: 'GET',
        maxAge: 10000,
        dataSchema: [] // 无参数
    },
    {
        // 扫码查询代办
        url: '/api/work-order/workOrder/getWorkOrderBySpaceId',
        method: 'GET',
        maxAge: 10000,
        dataSchema: [
            { name: 'id', schema: { type: 'string' } }
        ]
    },
    {
        // 未读消息数量
        url: '/api/message-boot/msg/checkMsgNum',
        method: 'GET',
        maxAge: 10000,
        dataSchema: [
             { name: 'clientType', schema: { type: 'string' } }
        ]
    },
    {
        // 获取最新一条未读消息
        url: '/api/message-boot/msg/getLatestUnReadMsg',
        method: 'GET',
        maxAge: 10000,
        dataSchema: [
             { name: 'clientType', schema: { type: 'string' } }
        ]
    },
    {
        // 设为已读
        url: '/api/message-boot/msg/readMsg',
        method: 'GET',
        maxAge: 0,
        dataSchema: [
            { name: 'msgId', schema: { type: 'string' } }
        ]
    },

    // --- pages/mine/api.js ---
    {
        // 获取员工信息
        url: '/api/employee-boot/sys-employee/getEmployeeByUserId',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [
            { name: 'userId', schema: { type: 'string' } }
        ]
    },
    {
        // 保存员工信息
        url: '/api/employee/sys-employee/save',
        method: 'POST',
        maxAge: 0,
        dataSchema: [] // 员工对象复杂，暂不列出
    },
    {
        // 更新头像
        url: '/api/employee/sys-employee/updateAvatar',
        method: 'POST',
        maxAge: 0,
        dataSchema: [
            { name: 'id', schema: { type: 'string' } },
            { name: 'bizId', schema: { type: 'string' } }
        ]
    },

    // --- pages/orderExecution/api.js ---
    {
        // 工单详情
        url: '/api/work-order/workOrder/getWorkOrderDetails',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [
            { name: 'spaceOrderId', schema: { type: 'any' } },
            { name: 'orderType', schema: { type: 'any' } },
            { name: 'id', schema: { type: 'string' } }
        ]
    },
    {
        // 工单编辑
        url: '/api/work-order/workOrderSopDetails/update',
        method: 'POST',
        maxAge: 0,
        dataSchema: [] // 动态表单数据
    },
    {
        // 工单生命周期列表
        url: '/api/work-order/workOrderLifecycle/list',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [
            { name: 'orderNumber', schema: { type: 'string' } }
        ]
    },
    {
        // 流程详情
        url: '/api/work-order/workOrder/app/topBase',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [
             { name: 'id', schema: { type: 'string' } }
        ]
    },
    {
        // 检查单
        url: '/api/work-order/workOrder/checkOrderAppInfo',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [
            { name: 'orderId', schema: { type: 'string' } }
        ]
    },
    {
        // 合格和一键报单
        url: '/api/work-order/workOrder/appAddQualifiedAndCheckCount',
        method: 'POST',
        maxAge: 0,
        dataSchema: [
             { name: 'orderId', schema: { type: 'string' } },
             { name: 'linkType', schema: { type: 'number' } }
        ]
    },
    {
        // 检查工单详情（获取空间）
        url: '/api/work-order/workOrder/getCheckOrderSpace',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [
             { name: 'id', schema: { type: 'string' } }
        ]
    },

    // --- pages/orderSearch/api.js ---
    {
        // 工单查询
        url: '/api/work-order/workOrder/appPage',
        method: 'POST',
        maxAge: 30000,
        dataSchema: [
            // 搜索表单包含多个字段
             { name: 'pageNo', schema: { type: 'number' } },
             { name: 'pageSize', schema: { type: 'number' } },
             { name: 'status', schema: { type: 'any' } },
             { name: 'orderType', schema: { type: 'any' } }
        ]
    },
    {
        // 团队工单查询
        url: '/api/work-order/workOrder/appPageTeam',
        method: 'POST',
        maxAge: 30000,
        dataSchema: [
             { name: 'pageNo', schema: { type: 'number' } },
             { name: 'pageSize', schema: { type: 'number' } },
             { name: 'status', schema: { type: 'any' } }
        ]
    },

    // --- pages/team/api.js ---
    {
        // 获取周检查
        url: '/api/dispatch-rule-boot/assignment/app/team/check/week',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [
            { name: 'weekOffset', schema: { type: 'number' } },
            { name: 'employeeId', schema: { type: 'string' } }
        ]
    },
    {
        // 预览
        url: '/api/dispatch-rule-boot/assignment/app/team/check/preview',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [
            { name: 'time', schema: { type: 'string' } },
            { name: 'status', schema: { type: 'any' } }
        ]
    },
    {
        // 预览人员列表
        url: '/api/employee/employee/api/getSubordinate',
        method: 'GET',
        maxAge: 60000,
        dataSchema: [
            { name: 'projectId', schema: { type: 'string' } }
        ]
    },
    {
        // 确认分工
        url: '/api/dispatch-rule-boot/assignment/app/team/check/confirm',
        method: 'POST',
        maxAge: 0,
        dataSchema: [
            { name: 'executeTime', schema: { type: 'string' } },
            { name: 'details', schema: { type: 'array' } }
        ]
    },
    {
        // 更新预览
        url: '/api/dispatch-rule-boot/assignment/app/team/check/update',
        method: 'PUT',
        maxAge: 0,
        dataSchema: [
            { name: 'employeeId', schema: { type: 'string' } },
            { name: 'employeeName', schema: { type: 'string' } },
            { name: 'assignmentId', schema: { type: 'string' } },
            { name: 'id', schema: { type: 'string' } },
            { name: 'sync', schema: { type: 'any' } },
            { name: 'executeTime', schema: { type: 'string' } }
        ]
    },
    {
        // 查询当前领导下的所有人
        url: '/api/employee/sys-employee/getEmployeeByLeaderId',
        method: 'POST',
        maxAge: 60000,
        dataSchema: [] // 无参
    },
    {
        // 修改领导
        url: '/api/employee/sys-employee/updateLeader',
        method: 'POST',
        maxAge: 0,
        dataSchema: [
            { name: 'leader', schema: { type: 'string' } },
            { name: 'leaderName', schema: { type: 'string' } },
            { name: 'id', schema: { type: 'string' } }
        ]
    },
    {
        // 修改免操作权限
        url: '/api/employee/employee/api/updateOperationStatus',
        method: 'PUT',
        maxAge: 0,
        dataSchema: [
             { name: 'isNoOperation', schema: { type: 'boolean' } }
        ]
    },
    
    // --- pages/message/api.js ---
    {
        // 消息列表
        url: '/api/message-boot/msg/getUserMsgList',
        method: 'POST',
        maxAge: 30000,
        dataSchema: [
            { name: 'searchVal', schema: { type: 'string' } },
            { name: 'msgStatus', schema: { type: 'string' } },
            { name: 'clientType', schema: { type: 'string' } },
            { name: 'pageNo', schema: { type: 'number' } },
            { name: 'pageSize', schema: { type: 'number' } }
        ]
    },
]
