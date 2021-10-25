/**
 * winston装饰器工厂方法
 * @param {...WinstonMetadata} metadatas winston元数据
 * @return {function(EngineModule):void} winston装饰器
 */
export function Winston(...metadatas: WinstonMetadata[]): (arg0: any) => void;
import { WinstonMetadata } from "../plugins/winston";
