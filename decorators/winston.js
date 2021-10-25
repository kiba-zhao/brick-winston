/**
 * @fileOverview winston装饰器工厂
 * @name winston.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { EngineModule } = require('brick-engine'); // eslint-disable-line no-unused-vars
const { WinstonMetadata } = require('../plugins/winston'); // eslint-disable-line no-unused-vars
const { defineWinston } = require('../plugins/winston');
const { PACKAGE_NAME } = require('../lib/constants');

const MODULE_KEY = `${PACKAGE_NAME}:decorators:Winston`;
const debug = require('debug')(MODULE_KEY);

/**
 * winston装饰器工厂方法
 * @param {...WinstonMetadata} metadatas winston元数据
 * @return {function(EngineModule):void} winston装饰器
 */
function Winston(...metadatas) {

  debug('Winston %s', metadatas);

  return function(target) {
    defineWinston(target, ...metadatas);
  };

}

exports.Winston = Winston;
