import { MyReactElement, MyReactComponent, MyHTMLElement } from "../shared/MyReactTypes"
import { isClassComponent, isFunction } from "../shared/utils"
import { mountDOMElement } from "./MyReactDOM"
import { mountElement } from "./MyReactRender"

/**
 * 渲染组件(需要判断组件为函数式组件还是类式组件) 
 * @param virtualDOM 
 * @param container 
 */
export const mountComponent = (virtualDOM: MyReactElement, container: MyHTMLElement) => {
  // 获取构造函数和属性
  const { type: C, props } = virtualDOM
  let newVirtualDOM: MyReactElement
  let component: MyReactComponent
  // 如果是类组件
  if (isClassComponent(virtualDOM.type)) {
    console.log('rendering class component')
    // 创建实例并返回
    component = new C(props || {})
    newVirtualDOM = component?.render()
  }
  // 如果是函数组件 
  else {
    console.log('rendering functional component')
    // 函数式组件 
    newVirtualDOM = C(props || {})
  }

  // 记录下虚拟DOM方便diff算法比较
  container.__virtualDOM = newVirtualDOM
  // 判断渲染出来的元素类型, 以此来决定递归渲染的类型
  mountElement(newVirtualDOM, container)
}