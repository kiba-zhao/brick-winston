/**
 * @fileOverview 工具类
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { PACKAGE_NAME } = require('./constants');
const { definePlugin, Provider } = require('brick-engine');
const { WinstonPlugin } = require('../plugins/winston');

const MODULE_KEY = `${PACKAGE_NAME}:lib:utils`;
exports.MODULE_KEY = MODULE_KEY;
const debug = require('debug')(MODULE_KEY);

/**
 * 安装winston插件
 * @see {@link module:engine/engine~EngineModule} 引擎模块类型
 * @param {EngineModule} module 引擎模块
 */
function winstonSetup(module) {

  debug('winstonSetup %s', module);

  definePlugin(module, { deps: [{ id: Provider }], factory: WinstonPlugin });

}

exports.winstonSetup = winstonSetup;
