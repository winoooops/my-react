import { MyReactElement, MyReactComponent, MyHTMLElement } from "../shared/MyReactTypes"
import { isClassComponent, isFunction, isSameComponent } from "../shared/utils"
import { mountDOMElement, mountElement } from "./MyReactDOM"

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
    newVirtualDOM = component.render()
    // 记录下component方便diff算法比较
    newVirtualDOM.component = component
  }
  // 如果是函数组件 
  else {
    console.log('rendering functional component')
    newVirtualDOM = C(props || {})
  }

  // 记录下虚拟DOM方便diff算法比较
  container.__virtualDOM = newVirtualDOM

  // 判断newVirualDOM的类型是否为函数
  if (isFunction(newVirtualDOM.type)) {
    mountComponent(newVirtualDOM, container)
  } else {
    mountDOMElement(newVirtualDOM, container)
  }
}

/**
 * 更新组件
 * @param virtualDOM 
 * @param oldComponent 
 * @param element 
 * @param container 
 */
export const updateComponent = (virtualDOM: MyReactElement, oldComponent: MyReactComponent, element: MyHTMLElement, container: MyHTMLElement) => {
  // 如果是同一个组件，更新
  if (isSameComponent(virtualDOM, oldComponent)) {
    console.log('is the same component, updating')
  }
  // 如果不是同一个组件，直接渲染
  else {
    console.log('is not the same component, start rendering')
    container.removeChild(element)
    mountElement(virtualDOM, container)
  }
}