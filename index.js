/**
 * @fileOverview 包目录
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { winstonSetup } = require('./lib/utils');
const { WinstonPlugin, defineWinston } = require('./plugins/winston');
const { Winston } = require('./decorators');

module.exports = {
  winstonSetup,
  WinstonPlugin, defineWinston,
  Winston,
};
