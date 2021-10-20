# brick-winston #
基于[brick-engine](https://github.com/kiba-zhao/brick-engine)的[winston](https://github.com/winstonjs/winston)工具包.

## Install ##

``` shell
npm install --save brick-winston
npm install --save winston
```

## Usage ##

**Setup**

``` javascript

const {defineApplication} = require('brick-engine');
const {winstonSetup} = require('brick-winston');

const app = {};

winstonSetup(app);
defineApplication(exports, app);
```

**Define Winston Logger Instance**

``` javascript

const { defineProviderFactory } = require('brick-engine');
const { defineWinston } = require('brick-winston');
const { WINSTON_ID,WINSTON_TRANSPORT_ID } = require('./constants');
const { transports } = require('winston');

class Module {
    
}

exports.Module = Module;
defineWinston(Module,{id:WINSTON_ID,level:'info',transports:[WINSTON_TRANSPORT_ID]});

function transportFactory(){
    return new transports.File({ filename: 'error.log', level: 'error' });
}

defineProviderFactory(Module,{id:WINSTON_TRANSPORT_ID,transportFactory});
```

**Use  Winston Logger Instance**

``` javascript

const { WINSTON_ID } = require('./constants');
const { defineProviderFactory } = require('brick-engine');

class Service {

    constructor(logger) {
        this.logger = logger;
    }

    async create(entity){
        this.logger.info('create method called',entity)
    }
}

exports.Service = Service;
defineProviderFactory(Service,{deps:[{id:WINSTON_ID}]});

```
## Documentations ##
使用`jsdoc`生成注释文档

``` shell
git clone https://github.com/kiba-zhao/brick-winston.git
cd brick-winston
npm install
npm run docs
open docs/index.html
```

## License ##
[MIT](LICENSE)
