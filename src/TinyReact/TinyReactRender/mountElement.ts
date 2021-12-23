import { VirtualDOM } from "../types";
import { mountComponent } from "./mountComponent";
import { mountNativeElement } from "./mountNativeElement";
import * as TinyReact from '../index'

// 判断是否是函数
export function isFunction(target: VirtualDOM): boolean {
  return target && typeof target.type === 'function'
}

export function mountElement(newDOM: VirtualDOM, container: any) {
  if (isFunction(newDOM)) {
    // 处理组件
    console.log('is component')
    mountComponent(newDOM, container)
  } else {
    mountNativeElement(newDOM, container)
  }
}