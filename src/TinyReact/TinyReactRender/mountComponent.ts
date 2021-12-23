import { VirtualDOM } from "../types";
import { isFunction } from "./mountElement";
import { mountNativeElement } from "./mountNativeElement";

export function mountComponent(vDOM: VirtualDOM, container: any) {
  console.log(vDOM)
  console.log(container)
  let newDOM = null

  if (isFunctionalComponent(vDOM)) {
    // 函数式样组件
    console.log('is functional component')
    newDOM = makeFunctionalComponent(vDOM)
  } else {
    // 类组件
  }

  if (isFunction(newDOM)) {
    mountComponent(newDOM, container)
  } else {
    mountNativeElement(newDOM, container)
  }

}

export function isFunctionalComponent(target: VirtualDOM) {
  const { type } = target
  console.log(type)
  return type && isFunction(target) && type.prototype.isTinyReactComponent !== {}
}

export function makeFunctionalComponent(dom: VirtualDOM) {
  console.log(dom.type)
  // 直接调用virtualDOM.type()就可以拿到对应的虚拟DOM，因为函数组件 type就是一个方法
  return dom.type(dom.props || {})
}