/**
 * winston元数据
 */
export type WinstonMetadata = {
    /**
     * winston提供器id
     */
    id?: any;
    /**
     * 日志级别
     */
    level?: string;
    /**
     * 日志级别设置
     */
    levels?: config.AbstractConfigSetLevels;
    /**
     * 格式化方法
     */
    format?: typeof format;
    /**
     * 传播器提供器Id
     */
    transports?: any[];
    /**
     * 是否异常退出进程
     */
    exitOnError?: boolean | Function;
    /**
     * 是否静默
     */
    silent?: boolean;
};
export const MODULE_KEY: string;
/**
 * winston元数据
 *  @typedef {Object} WinstonMetadata
 * @property {ProviderStoreKey} [id] winston提供器id
 * @property {string} [level] 日志级别
 * @property {config.AbstractConfigSetLevels} [levels] 日志级别设置
 * @property {format} [format] 格式化方法
 * @property {ProviderStoreKey[]} [transports] 传播器提供器Id
 * @property {Boolean | Function} [exitOnError] 是否异常退出进程
 * @property {Boolean} [silent] 是否静默
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
/**
 * 定义axios元数据
 * @see {@link module:lib/engine~EngineModule} 引擎模块类型
 * @see {@link module:plugins/winston~WinstonMetadata} winston元数据
 * @param {EngineModule} target 引擎模块对象
 * @param {...WinstonMetadata} metadatas winston元数据
 * @return {EngineModule} 引擎模块对象
 */
export function defineWinston(target: any, ...metadatas: WinstonMetadata[]): any;
import { config } from "winston";
import { format } from "winston";
declare const WINSTON_PROVIDER: unique symbol;
import { Provider } from "brick-engine";
export {};
