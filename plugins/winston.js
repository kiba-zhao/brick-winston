
/**
 * @fileOverview winston插件
 * @name winston.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

/**
 * @module
 */

const assert = require('assert');
const { PACKAGE_NAME } = require('../lib/constants');
const { Provider, isProviderStoreKey, createExtractFunction, createDefineFunction } = require('brick-engine');
const { EngineModule, ProviderStoreKey, ProviderDependency } = require('brick-engine'); // eslint-disable-line no-unused-vars
const { createLogger, format } = require('winston');
const { config, LoggerOptions, Logger, transport } = require('winston'); // eslint-disable-line no-unused-vars
const { isObject, isString, isArray, isBoolean, isFunction } = require('lodash');
const { isNumber } = require('util');

const MODULE_KEY = `${PACKAGE_NAME}:plugins:WinstonPlugin`;
exports.MODULE_KEY = MODULE_KEY;
const debug = require('debug')(MODULE_KEY);

const WINSTON_SCOPE = Symbol('WINSTON_SCOPE');
const WINSTON_PROVIDER = Symbol('WINSTON_PROVIDER');

const extractWinstonMetadataQueue = createExtractFunction('extractWinstonMetadataQueue', { scope: WINSTON_SCOPE });

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

class WinstonPlugin {

  /**
   * 组件处理插件构造函数
   * @class
   * @param {Provider} provider 提供器
   */
  constructor(provider) {
    assert(
      provider instanceof Provider,
      `[${MODULE_KEY}] constructor Error: wrong provider`
    );

    this[WINSTON_PROVIDER] = provider;

  }

  /**
   *检查是否为匹配模块
   * @param {EngineModule} module 检查的模块
   * @return {boolean} true:匹配/false:不匹配
   */
  match(module) {

    debug('match %s', module);

    const metadataQueue = extractWinstonMetadataQueue(module);
    if (metadataQueue.length > 0) {
      return metadataQueue.every(isWinstonMetadata);
    }
    return false;

  }

  /**
   * 使用模块方法
   * @param {EngineModule} module 使用的模块
   */
  async use(module) {

    debug('use %s', module);

    /** @type {Provider} **/
    const provider = this[WINSTON_PROVIDER];
    /** @type {WinstonMetadata[]} **/
    const metadataQueue = extractWinstonMetadataQueue(module);
    for (const metadata of metadataQueue) {
      const { id, transports, ...opts } = metadata;

      const deps = transports && transports.length > 0 ? transports.map(toProviderDependency) : [];
      provider.define(id || module, deps, createWinston.bind(this, opts || {}));
    }
  }

}

exports.WinstonPlugin = WinstonPlugin;

/**
 * 转换为dep依赖参数
 * @param {ProviderStoreKey} id
 * @return {ProviderDependency} 依赖参数
 */
function toProviderDependency(id) {

  debug('toProviderDependency %s', id);
  return { id };
}

/**
 * 创建winston日志记录器实例
 * @param {LoggerOptions} options 可选项
 * @param {...transport} transports 传输器实例
 * @return {Logger} 日志记录器实例
 */
function createWinston(options, ...transports) {

  debug('createWinston', options, transports);
  return createLogger({ ...options, transports });
}


/**
 * 是否为winston元数据
 * @param {WinstonMetadata} metadata 元数据
 * @return {boolean} true:是/false:否
 */
function isWinstonMetadata(metadata) {

  if (!isObject(metadata)) {
    return false;
  }

  if (metadata.id !== undefined && !isProviderStoreKey(metadata.id)) {
    return false;
  }

  if (metadata.level !== undefined && !isString(metadata.level)) {
    return false;
  }

  if (metadata.levels !== undefined && !isConfigSetLevels(metadata.levels)) {
    return false;
  }

  if (metadata.format !== undefined && !(metadata.format instanceof format)) {
    return false;
  }

  if (metadata.transports !== undefined && !(isArray(metadata.transports) && metadata.transports.every(isProviderStoreKey))) {
    return false;
  }

  if (metadata.silent !== undefined && !isBoolean(metadata.silent)) {
    return false;
  }

  if (metadata.exitOnError !== undefined && !(isBoolean(metadata.exitOnError) || isFunction(metadata.exitOnError))) {
    return false;
  }

  return true;
}


/**
 * 是否为日志级别配置
 * @param {config.AbstractConfigSetLevels} levels 日志级别配置
 * @return {boolean} true:是/false:否
 */
function isConfigSetLevels(levels) {
  if (!isObject(levels)) {
    return false;
  }
  const values = Object.values(levels);
  if (values.length > 0 && !values.every(isNumber)) {
    return false;
  }
  return true;
}

/**
 * @see {@link module:lib/engine~EngineModule} 引擎模块类型
 * @see {@link module:plugins/winston~WinstonMetadata} winston元数据
 * @type {function(EngineModule,WinstonMetadata):EngineModule}
 */
const _defineWinston = createDefineFunction('defineWinston', { scope: WINSTON_SCOPE });

/**
 * 定义axios元数据
 * @see {@link module:lib/engine~EngineModule} 引擎模块类型
 * @see {@link module:plugins/winston~WinstonMetadata} winston元数据
 * @param {EngineModule} target 引擎模块对象
 * @param {...WinstonMetadata} metadatas winston元数据
 * @return {EngineModule} 引擎模块对象
 */
function defineWinston(target, ...metadatas) {

  debug('defineWinston: %s, %s', target, metadatas);

  assert(
    metadatas.length > 0 && metadatas.every(isWinstonMetadata),
    `[${MODULE_KEY}] defineWinston Error:  wrong metadata args`
  );

  return _defineWinston(target, ...metadatas);
}

exports.defineWinston = defineWinston;
