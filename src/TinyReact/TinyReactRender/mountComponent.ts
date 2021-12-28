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
  // 创造新的类实例
  const props = dom.props
  const component = new dom.type(props || {})
  // 直接从实例里面调用
  return component.render()
  // 因为render是定义在原型上的方法，拿不到定义在实例里面的state
  // 所以需要手动绑定this
  // const renderOfInstance = render.bind(component)
  // console.log(renderOfInstance)
  // return renderOfInstance()
  // return renderOfInstance()
}