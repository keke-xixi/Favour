// 类型定义
export interface DataItem {
    name: string;
    stationCode: string;
    outPower: string;
    [key: string]: any;
}

export interface QueryResultItem {
    desc: string;
    highlimit: number;
    lowlimit: number;
    name: string;
    time: number;
    unit: string;
    value: any;
}

export interface QueryResult {
    [key: string]: QueryResultItem;
}

export interface FieldMapping {
    [key: string]: string;
}

// 主封装类
export class DataProcessor {
    /**
     * 处理数据并获取实时值
     * @param dataArray 原始数据数组
     * @param fieldMapping 字段映射表
     * @param queryApi 查询接口函数
     * @returns 处理后的数据数组（包含实时值）
     */
    static async processDataWithRealTimeValues(
        dataArray: DataItem[],
        fieldMapping: FieldMapping,
        queryApi: (keys: string[]) => Promise<QueryResult>
    ): Promise<DataItem[]> {
        if (!dataArray || !Array.isArray(dataArray)) {
            throw new Error('dataArray must be an array');
        }

        if (!fieldMapping || typeof fieldMapping !== 'object') {
            throw new Error('fieldMapping must be an object');
        }

        if (typeof queryApi !== 'function') {
            throw new Error('queryApi must be a function');
        }

        try {
            // 1. 提取需要查询的字段值
            const queryKeys = this.extractQueryKeys(dataArray, fieldMapping);
            
            if (queryKeys.length === 0) {
                console.warn('No valid field values found for query');
                return this.deepClone(dataArray);
            }

            // 2. 调用查询接口
            const queryResult = await queryApi(queryKeys);

            // 3. 将查询结果映射回原数组
            return this.mapValuesToData(dataArray, queryResult, fieldMapping);

        } catch (error) {
            console.error('Data processing failed:', error);
            throw new Error(`Data processing failed: ${error.message}`);
        }
    }

    /**
     * 提取需要查询的字段值
     */
    private static extractQueryKeys(
        dataArray: DataItem[],
        fieldMapping: FieldMapping
    ): string[] {
        const mappingValues = Object.values(fieldMapping);
        const keys = new Set<string>();

        dataArray.forEach(item => {
            mappingValues.forEach(fieldName => {
                const fieldValue = item[fieldName];
                if (fieldValue && typeof fieldValue === 'string') {
                    const trimmedValue = fieldValue.trim();
                    if (trimmedValue) {
                        keys.add(trimmedValue);
                    }
                }
            });
        });

        return Array.from(keys);
    }

    /**
     * 将查询结果映射回数据
     */
    private static mapValuesToData(
        dataArray: DataItem[],
        queryResult: QueryResult,
        fieldMapping: FieldMapping
    ): DataItem[] {
        // 深拷贝原数组
        const result = this.deepClone(dataArray);
        
        // 创建反向映射：字段值 -> [数组索引, 字段名]
        const valueToFieldMap = new Map<string, Array<[number, string]>>();

        // 构建映射关系
        result.forEach((item, index) => {
            Object.values(fieldMapping).forEach(fieldName => {
                const fieldValue = item[fieldName];
                if (fieldValue && typeof fieldValue === 'string') {
                    const key = fieldValue.trim();
                    if (key) {
                        if (!valueToFieldMap.has(key)) {
                            valueToFieldMap.set(key, []);
                        }
                        valueToFieldMap.get(key)!.push([index, fieldName]);
                    }
                }
            });
        });

        // 更新字段值
        Object.entries(queryResult).forEach(([key, queryItem]) => {
            const fieldRefs = valueToFieldMap.get(key);
            if (fieldRefs) {
                fieldRefs.forEach(([index, fieldName]) => {
                    if (result[index]) {
                        result[index][fieldName] = queryItem.value;
                    }
                });
            }
        });

        return result;
    }

    /**
     * 深拷贝对象
     */
    private static deepClone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * 单独提取查询键（如果需要单独使用）
     */
    static extractQueryKeysOnly(
        dataArray: DataItem[],
        fieldMapping: FieldMapping
    ): string[] {
        return this.extractQueryKeys(dataArray, fieldMapping);
    }

    /**
     * 同步处理版本（当已经有关查询结果时）
     */
    static processWithExistingResult(
        dataArray: DataItem[],
        fieldMapping: FieldMapping,
        queryResult: QueryResult
    ): DataItem[] {
        return this.mapValuesToData(dataArray, queryResult, fieldMapping);
    }
}

// 使用示例
const FIELD_MAPPING: FieldMapping = {
    '功率': 'gl',
    '日发电量': 'rfdl',
    '运行状态': 'yxzt',
    '额定功率': 'edgl',
    '发电量': 'fdl',
    '单机风速': 'djfs',
    '有功功率': 'yggl',
    '发电机转速': 'fdjzs',
    '叶轮转速': 'ylzs'
};

// 模拟你的数据数组
const dataArray: DataItem[] = [
    {
        "name": "01子阵",
        "stationCode": "CBWT",
        "outPower": " 文田01集电线",
        "gl": "HN_CBWT_GF.431125CBWTGF01ZZYK18NBQ00CDM005",
        "rfdl": "HN_CBWT_GF.431125CBWTGF01ZZYK18NBQ00CDM004",
        "yxzt": "HN_CBWT_GF.431125CBWTGF01ZZYK18NBQ00CDM003",
        "edgl": "HN_CBWT_GF.431125CBWTGF01ZZYK18NBQ00CDM003"
    },
    {
        "name": "02子阵",
        "stationCode": "CBWT",
        "outPower": " 文田01集电线",
        "gl": "HN_CBWT_GF.431125CBWTGF01ZZYK18NBQ00CDM005",
        "rfdl": "HN_CBWT_GF.431125CBWTGF01ZZYK18NBQ00CDM004",
        "yxzt": "HN_CBWT_GF.431125CBWTGF01ZZYK18NBQ00CDM003",
        "edgl": "HN_CBWT_GF.431125CBWTGF01ZZYK18NBQ00CDM003"
    },
    {
        "name": "01风机",
        "stationCode": "JYHJLM",
        "outPower": " 梁山顶01集电线",
        "fdl": "HN_JYHJL_FD.431125JYHJLFDFJ01YC01CDM065",
        "djfs": "HN_JYHJL_FD.431125JYHJLFDNLGL01FJYC01CDM001",
        "yggl": "HN_JYHJL_FD.431125JYHJLFDNLGL01FJYC01CDM002",
        "fdjzs": "HN_JYHJL_FD.431125JYHJLFDFJ01YC01CDM033",
        "ylzs": "HN_JYHJL_FD.431125JYHJLFDFJ01YC01CDM002"
    }
];

// 模拟你的查询接口
async function mockFindApi(keys: string[]): Promise<QueryResult> {
    console.log('API called with keys:', keys);
    
    // 这里模拟接口返回
    return {
        "HN_CBWT_GF.431125CBWTGF01ZZYK18NBQ00CDM005": {
            "desc": "文田_01子阵_功率",
            "highlimit": 0,
            "lowlimit": 0,
            "name": "HN_CBWT_GF.431125CBWTGF01ZZYK18NBQ00CDM005",
            "time": 1767764790000,
            "unit": "",
            "value": 772303.763671875
        },
        "HN_CBWT_GF.431125CBWTGF01ZZYK18NBQ00CDM004": {
            "desc": "文田_01子阵_日发电量",
            "highlimit": 0,
            "lowlimit": 0,
            "name": "HN_CBWT_GF.431125CBWTGF01ZZYK18NBQ00CDM004",
            "time": 1755475598000,
            "unit": "",
            "value": 1000
        },
        "HN_JYHJL_FD.431125JYHJLFDFJ01YC01CDM065": {
            "desc": "梁山顶_01风机_发电量",
            "highlimit": 0,
            "lowlimit": 0,
            "name": "HN_JYHJL_FD.431125JYHJLFDFJ01YC01CDM065",
            "time": 1767764790000,
            "unit": "",
            "value": 500000
        },
        "HN_JYHJL_FD.431125JYHJLFDNLGL01FJYC01CDM001": {
            "desc": "梁山顶_01风机_单机风速",
            "highlimit": 0,
            "lowlimit": 0,
            "name": "HN_JYHJL_FD.431125JYHJLFDNLGL01FJYC01CDM001",
            "time": 1767764790000,
            "unit": "m/s",
            "value": 12.5
        }
    };
}

// 使用方式一：完整处理
async function exampleUsage1() {
    try {
        const processedData = await DataProcessor.processDataWithRealTimeValues(
            dataArray,
            FIELD_MAPPING,
            mockFindApi
        );
        
        console.log('Processed data:', processedData);
        // 输出结果：
        // [
        //     {
        //         "name": "01子阵",
        //         "stationCode": "CBWT",
        //         "outPower": " 文田01集电线",
        //         "gl": 772303.763671875,  // 替换为实际值
        //         "rfdl": 1000,            // 替换为实际值
        //         "yxzt": "HN_CBWT_GF.431125CBWTGF01ZZYK18NBQ00CDM003", // 未查询到，保持原值
        //         "edgl": "HN_CBWT_GF.431125CBWTGF01ZZYK18NBQ00CDM003"  // 未查询到，保持原值
        //     },
        //     ...
        // ]
        
        return processedData;
    } catch (error) {
        console.error('Error:', error);
    }
}

// 使用方式二：分步处理（如果需要先获取查询参数）
function exampleUsage2() {
    // 1. 先提取查询键
    const queryKeys = DataProcessor.extractQueryKeysOnly(dataArray, FIELD_MAPPING);
    console.log('Query keys:', queryKeys);
    // 输出: ["HN_CBWT_GF.431125CBWTGF01ZZYK18NBQ00CDM005", "HN_CBWT_GF.431125CBWTGF01ZZYK18NBQ00CDM004", ...]
    
    // 2. 使用这些键调用你的接口
    // 3. 获取结果后映射
}

// 使用方式三：已有查询结果时
async function exampleUsage3() {
    // 假设你已经从接口获取了查询结果
    const existingResult: QueryResult = await mockFindApi(['key1', 'key2']);
    
    const processedData = DataProcessor.processWithExistingResult(
        dataArray,
        FIELD_MAPPING,
        existingResult
    );
    
    return processedData;
}

// 快速使用的辅助函数（如果不想用类）
export async function processWindFarmData(
    dataArray: DataItem[],
    fieldMapping: FieldMapping = FIELD_MAPPING,
    customQueryApi?: (keys: string[]) => Promise<QueryResult>
): Promise<DataItem[]> {
    const queryApi = customQueryApi || mockFindApi;
    return DataProcessor.processDataWithRealTimeValues(
        dataArray,
        fieldMapping,
        queryApi
    );
}

// 导出
export default DataProcessor;