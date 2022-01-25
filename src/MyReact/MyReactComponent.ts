import { MyReactElement, MyReactComponent, MyHTMLElement } from "../shared/MyReactTypes"
import { isClassComponent, isFunction, isSameComponent } from "../shared/utils"
import { mountDOMElement, updateChildren, updateDOMElement, updateProp, updateText } from "./MyReactDOM"
import { shouldComponentUpdate } from "./MyReactLifecycle"
import { diff, mountElement } from "./MyReactRender"

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
    // 记录下component方便diff算法比较
    newVirtualDOM.component = component
  }
  // 如果是函数组件 
  else {
    console.log('rendering functional component')
    // 函数式组件 
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
export const updateComponent = (virtualDOM: MyReactElement, oldVirtualDOM: MyReactElement, element: MyHTMLElement, container: MyHTMLElement) => {
  const oldComponent = oldVirtualDOM.component
  if (!oldComponent || !isSameComponent(virtualDOM, oldComponent)) {
    console.log('is not the same component, start rendering')
    container.removeChild(element)
    mountComponent(virtualDOM, container)
  }

  // 如果是同一个组件，更新
  else {
    // 判断是否需要重新渲染
    if (!shouldComponentUpdate(oldComponent.props, virtualDOM.props)) return
    // container.removeChild(element)
    // shouldComponentUpdate(oldComponent.props, virtualDOM.props) && mountComponent(virtualDOM, container)
    // 更新的时候需要循环遍历下面的子组件
    const { type: C, props } = virtualDOM
    const newVirtualDOM = new C(props || {}).render()
    // 如果依然为组件
    if (isFunction(newVirtualDOM.type)) {
      // diff(newVirtualDOM, )
      updateComponent(newVirtualDOM, oldVirtualDOM, element, container)
    }
    // DOM元素
    else {
      updateDOMElement(newVirtualDOM, oldVirtualDOM, element)
    }
  }
}