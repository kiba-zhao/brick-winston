/**
 * @fileOverview 包目录
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { winstonSetup } = require('./lib/utils');
const { WinstonPlugin, defineWinston } = require('./plugins/winston');

module.exports = {
  winstonSetup,
  WinstonPlugin, defineWinston,
};
