import { MyHTMLElement, MyReactElement } from "../shared/MyReactTypes"
import { isFunction } from "../shared/utils"
import { mountComponent } from "./MyReactComponent"
import { attachProps, removeProp, updateProp } from "./MyReactRender"

/**
 * 渲染方法 
 * @param virtualDOM 
 * @param container 
 * @returns 
 */
export const mountElement = (virtualDOM: MyReactElement, container: MyHTMLElement) => {
  if (!container) return
  // 渲染组件还是渲染DOM元素
  if (isFunction(virtualDOM.type)) {
    // 渲染组件 
    mountComponent(virtualDOM, container)
    // console.log(React.Component.prototype.isReactComponent === {})
  } else {
    // 渲染原生DOM元素
    console.log('Rendering DOM Element')
    mountDOMElement(virtualDOM, container)
  }
}

/**
 * 渲染原生DOM元素
 * @param virtualDOM 虚拟DOM
 * @param container 父容器 
 */
export const mountDOMElement = (virtualDOM: MyReactElement, container: HTMLElement | null) => {
  let newElement: any
  const { type, props } = virtualDOM

  // 为纯文本
  if (type === 'text') {
    newElement = document.createTextNode(props?.textContent)
  }
  // 为DOM元素
  else {
    // 创建元素
    newElement = document.createElement(type)
    // 更新属性
    attachProps(virtualDOM, newElement)
    // 递归渲染子元素
    props?.children.forEach((child: MyReactElement) => {
      mountElement(child, newElement)
    })
  }
  //* 创建DOM元素的时候记录下当前的虚拟DOM
  newElement.__virtualDOM = virtualDOM
  container?.appendChild(newElement)
}

/**
 * 更新DOM元素  => 更新元素下面的属性值
 * @param virtualDOM 
 * @param oldVirtualDOM 
 * @param element 
 */
export const updateDOMElement = (virtualDOM: MyReactElement, oldVirtualDOM: MyReactElement, element: MyHTMLElement) => {
  const newProps = virtualDOM.props
  const oldProps = oldVirtualDOM.props
  const propsKeys = Object.keys(newProps)
  const oldPropsKeys = Object.keys(oldProps)

  propsKeys.length && propsKeys.forEach((key: string) => {
    if (key !== 'children') {
      // 如果属性值发生改变
      if (newProps[key] !== oldProps[key]) {
        updateProp(key, newProps[key], element)
        console.log(`---------${key} has been updated---------`)
      }
    }
  })

  oldPropsKeys.length && oldPropsKeys.forEach((oldKey: string) => {
    // 如果属性被删除
    if (!propsKeys.includes(oldKey)) {
      removeProp(oldKey, oldProps[oldKey], element)
    }
  })

  // 更新删除完毕后记录下当前的虚拟DOM
  element.__virtualDOM = virtualDOM
  // return element
}