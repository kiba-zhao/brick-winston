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
const {createLogger,transport} = require('winston');

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
 * @property {string} [level] 等级
 * @property {ProviderStoreKey[]} [interceptors] 拦截器提供器Id
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
      const { id, config, interceptors } = metadata;
      const deps = interceptors && interceptors.length > 0 ? interceptors.map(toProviderDependency) : [];
      provider.define(id || module, deps, createAxios.bind(this, config || {}));
    }
  }

}

exports.WinstonPlugin = WinstonPlugin;

function isWinstonMetadata(metadata) {
  
}
