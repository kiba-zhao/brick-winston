/**
 * @fileOverview 简单示例
 * @name simple.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { winstonSetup, defineWinston } = require('..');
const { createEngine, Provider } = require('brick-engine');
const TransportStream = require('winston-transport');
const { Logger } = require('winston'); // eslint-disable-line no-unused-vars
const faker = require('faker');

const WINSTON_ID = Symbol('WINSTON_ID');
const WINSTON_TRANSPORT_ID = Symbol('WINSTON_TRANSPORT_ID');

describe('simple', () => {

  /** @type {Provider} **/
  let provider;

  /** @type {TransportStream} **/
  let transport;

  beforeEach(async () => {

    provider = new Provider();
    transport = new TransportStream({ log: jest.fn() });
    provider.define(WINSTON_TRANSPORT_ID, [], () => transport);

    const engine = await createEngine(provider);

    const target = {};
    winstonSetup(target);
    defineWinston(target, { id: WINSTON_ID, transports: [ WINSTON_TRANSPORT_ID ] });

    await engine.install(target);

    expect(provider.contains(WINSTON_ID)).toBeTruthy();
    expect(provider.contains(WINSTON_TRANSPORT_ID)).toBeTruthy();
  });

  it('log', async () => {


    const expected = { ...JSON.parse(faker.datatype.json()), message: faker.random.words(), level: 'info' };

    /** @type {Logger[]} **/
    const [ logger ] = await provider.require({ id: WINSTON_ID });
    logger.log(expected);

    expect(transport.log).toBeCalledTimes(1);
    expect(transport.log).toHaveBeenCalledWith(expected, expect.anything());
  });

});
