/**
 * @fileOverview winston插件测试
 * @name winston.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { MODULE_KEY, WinstonPlugin, defineWinston } = require('../../plugins/winston');
const { Provider, injectMetadata } = require('brick-engine');
const { transports } = require('winston');
const faker = require('faker');

describe('plugins/winston', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('brick-winston:plugins:WinstonPlugin');
  });

  describe('WinstonPlugin', () => {

    /** @type {Provider} **/
    let provider;

    /** @type {WinstonPlugin} **/
    let plugin;

    beforeEach(() => {

      provider = new Provider();
      plugin = new WinstonPlugin(provider);

    });

    describe('defineWinston', () => {

      it('fatal', () => {

        const target = () => { };
        const WRONG_METADATA = `[${MODULE_KEY}] defineWinston Error:  wrong metadata args`;

        expect(() => defineWinston(target)).toThrow(WRONG_METADATA);
        expect(() => defineWinston(target, Symbol())).toThrow(WRONG_METADATA);
        expect(() => defineWinston(target, { id: null })).toThrow(WRONG_METADATA);
        expect(() => defineWinston(target, { id: Symbol(), level: Symbol() })).toThrow(WRONG_METADATA);
        expect(() => defineWinston(target, { id: Symbol(), levels: Symbol() })).toThrow(WRONG_METADATA);
        expect(() => defineWinston(target, { id: Symbol(), format: Symbol() })).toThrow(WRONG_METADATA);
        expect(() => defineWinston(target, { id: Symbol(), transports: Symbol() })).toThrow(WRONG_METADATA);
        expect(() => defineWinston(target, { silent: Symbol() })).toThrow(WRONG_METADATA);
        expect(() => defineWinston(target, { exitOnError: Symbol() })).toThrow(WRONG_METADATA);
        expect(() => defineWinston(target, { id: Symbol(), levels: JSON.parse(faker.datatype.json()) })).toThrow(WRONG_METADATA);

      });

    });

    describe('match', () => {

      it('success', () => {

        const target = () => { };
        defineWinston(target, { id: Symbol() });

        const res = plugin.match(target);
        expect(res).toBeTruthy();

        const target1 = () => { };
        defineWinston(target1, {
          id: Symbol(),
          level: 'info',
          levels: {
            emerg: 0,
            alert: 1,
            crit: 2,
            error: 3,
            warning: 4,
            notice: 5,
            info: 6,
            debug: 7,
          },
        });

        const res1 = plugin.match(target1);
        expect(res1).toBeTruthy();

      });

      it('failed', () => {

        const target = () => { };
        const metadata = Symbol('metadata');
        injectMetadata(target, metadata, { scope: Symbol() });

        const res = plugin.match(target);
        expect(res).toBeFalsy();

      });

    });

    describe('use', () => {

      it('simple', async () => {

        const defineFn = jest.spyOn(provider, 'define');
        const id = Symbol('id');
        const target = () => { };

        defineWinston(target, { id });

        await plugin.use(target);

        expect(defineFn).toBeCalledTimes(1);
        expect(defineFn).toBeCalledWith(id, [], expect.anything());

      });

      it('transport', async () => {

        const transport = jest.fn();
        const transportId = Symbol('transportId');
        const id = Symbol('id');
        const target = () => { };

        transport.mockReturnValue(new transports.Console());
        provider.define(transportId, [], transport);
        defineWinston(target, { id, transports: [ transportId ] });

        await plugin.use(target);
        await provider.require({ id });

        expect(transport).toBeCalledTimes(1);
      });

      it('transport error', async () => {
        const transport = jest.fn();
        const transportId = Symbol('transportId');
        const id = Symbol('id');
        const target = () => { };

        transport.mockReturnValue(JSON.parse(faker.datatype.json()));
        provider.define(transportId, [], transport);
        defineWinston(target, { id, transports: [ transportId ] });

        await plugin.use(target);

        const WRONG_TRANSPORT = 'Invalid transport, must be an object with a log method.';

        await expect(provider.require({ id })).rejects.toThrow(WRONG_TRANSPORT);
        expect(transport).toBeCalledTimes(1);

      });

    });

  });

});
