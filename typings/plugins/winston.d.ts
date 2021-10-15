/**
 * winston元数据
 */
export type WinstonMetadata = {
    /**
     * winston提供器id
     */
    id?: any;
    /**
     * 等级
     */
    level?: string;
    /**
     * 拦截器提供器Id
     */
    interceptors?: any[];
};
export const MODULE_KEY: string;
/**
 * winston元数据
 *  @typedef {Object} WinstonMetadata
 * @property {ProviderStoreKey} [id] winston提供器id
 * @property {string} [level] 等级
 * @property {ProviderStoreKey[]} [interceptors] 拦截器提供器Id
 *
 */
export class WinstonPlugin {
    /**
     * 组件处理插件构造函数
     * @class
     * @param {Provider} provider 提供器
     */
    constructor(provider: Provider);
    /**
     *检查是否为匹配模块
     * @param {EngineModule} module 检查的模块
     * @return {boolean} true:匹配/false:不匹配
     */
    match(module: any): boolean;
    /**
     * 使用模块方法
     * @param {EngineModule} module 使用的模块
     */
    use(module: any): Promise<void>;
    [WINSTON_PROVIDER]: Provider;
}
declare const WINSTON_PROVIDER: unique symbol;
import { Provider } from "brick-engine";
export {};
