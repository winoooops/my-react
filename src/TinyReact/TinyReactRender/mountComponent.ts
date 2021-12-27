import { VirtualDOM } from "../types";
import { isFunction } from "./mountElement";
import { mountNativeElement } from "./mountNativeElement";

export function mountComponent(vDOM: VirtualDOM, container: any) {
  console.log(vDOM)
  console.log(container)
  let newDOM = null

  // 判断是函数组件还是类组件
  if (isFunctionalComponent(vDOM)) {
    // 函数式样组件
    console.log('is functional component')
    newDOM = makeFunctionalComponent(vDOM)
  } else {
    // 类组件
    console.log('is a class component')
    newDOM = makeClassComponent(vDOM)
  }

  if (isFunction(newDOM)) {
    mountComponent(newDOM, container)
  } else {
    mountNativeElement(newDOM, container)
  }

}

export function isFunctionalComponent(target: VirtualDOM) {
  const { type } = target
  return type && isFunction(target) && !type.prototype.render
}

export function makeFunctionalComponent(dom: VirtualDOM) {
  // 直接调用virtualDOM.type()就可以拿到对应的虚拟DOM，因为函数组件 type就是一个方法
  const component = dom.type
  return component(dom.props || {})
}

export function makeClassComponent(dom: VirtualDOM) {
  console.log(dom.type)
  const { render } = dom.type.prototype
  return render()
}