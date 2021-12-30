// import React from "react";
import { MyHTMLElement, MyReactElement } from "../shared/MyReactTypes";

/**
 * 渲染方法 
 * @param virtualDOM 
 * @param container 
 * @returns 
 */
export const render = (virtualDOM: MyReactElement, container: HTMLElement | null) => {
  if (!container) return
  // 渲染组件还是渲染DOM元素
  if (isFunction(virtualDOM.type)) {
    // 渲染组件 
    mountComponent(virtualDOM, container)
    // console.log(React.Component.prototype.isReactComponent === {})
  } else {
    // 渲染原生DOM元素
    console.log('Rendering DOM Element')
    mountElement(virtualDOM, container)
  }
}

/**
 * Diff算法
 * @param virtualDOM 
 * @param element 
 * @param preVirtualDOM 
 */
export const diff = (virtualDOM: MyReactElement, element: HTMLElement, preVirtualDOM: MyReactElement) => { }

/**
 * 更新DOM文本节点
 * @param virtualDOM 
 * @param oldVirtualDOM 
 * @param element 
 */
export const updateText = (virtualDOM: MyReactElement, oldVirtualDOM: MyReactElement, element: MyHTMLElement) => {
  if (virtualDOM.props.textContent !== oldVirtualDOM.props.textContent) {
    // 更换文本
    element.textContent = virtualDOM.props.textContent
    // 储存为__virtualDOM
    element.__virtualDOM = virtualDOM
  }
}

/**
 * 更新DOM元素  => 更新元素下面的属性值
 * @param virtualDOM 
 * @param oldVirtualDOM 
 * @param element 
 */
export const updateElement = (virtualDOM: MyReactElement, oldVirtualDOM: MyReactElement, element: MyHTMLElement) => {
  const newProps = virtualDOM.props
  const oldProps = oldVirtualDOM.props
  const propsKeys = Object.keys(newProps)
  const oldPropsKeys = Object.keys(oldProps)

  propsKeys.length && propsKeys.forEach((key: string) => {
    // 如果属性值发生改变
    if (newProps[key] !== oldProps[key]) {
      updateProp(key, newProps[key], element)
      console.log(`---------${key} has been updated---------`)
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

/**
 * 利用组件虚拟DOM的type属性为function这个特点，判断指定的虚拟DOM应该被渲染成组件还是渲染成原生DOM节点 
 * @param type 
 * @returns 
 */
export const isFunction = (type: any): boolean => {
  return type && type instanceof Function
}

/**
 * 可以利用类组件的实例的原型上有isReactComponent这个属性来判断是函数式组件还是类式组件 
 * @param type 
 * @returns 
 */
export const isClassComponent = (type: any): boolean => {
  return type && !!type.prototype.isReactComponent
}

/**
 * 渲染原生DOM元素
 * @param virtualDOM 虚拟DOM
 * @param container 父容器 
 */
export const mountElement = (virtualDOM: MyReactElement, container: HTMLElement | null) => {
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
      render(child, newElement)
    })
  }
  //* 创建DOM元素的时候记录下当前的虚拟DOM
  newElement.__virtualDOM = virtualDOM
  container?.appendChild(newElement)
}

/**
 * 渲染组件(需要判断组件为函数式组件还是类式组件) 
 * @param virtualDOM 
 * @param container 
 */
export const mountComponent = (virtualDOM: MyReactElement, container: HTMLElement) => {
  // 获取构造函数和属性
  const { type: C, props } = virtualDOM
  let newVirtualDOM: MyReactElement
  // 如果是类组件
  if (isClassComponent(virtualDOM.type)) {
    console.log('rendering class component')
    // 创建实例并返回
    newVirtualDOM = new C(props || {}).render()
  }
  // 如果是函数组件 
  else {
    console.log('rendering functional component')
    newVirtualDOM = C(props || {})
  }

  // 判断newVirualDOM的类型是否为函数
  if (isFunction(newVirtualDOM.type)) {
    mountComponent(newVirtualDOM, container)
  } else {
    mountElement(newVirtualDOM, container)
  }
}

/**
 * 更新props属性
 * @param virtualDOM 
 * @param element 
 */
export const attachProps = (virtualDOM: MyReactElement, element: MyHTMLElement) => {
  console.log(element)
  // 获取props键值对

  const props: { [key: string]: any } = virtualDOM.props
  const keys = Object.keys(props)

  // 遍历属性
  keys && keys.forEach((propName: string) => {
    updateProp(propName, props[propName], element)
  })
}

/**
 * 更新单个属性
 * @param propName 
 * @param propValue 
 * @param element 
 * @returns 
 */
export const updateProp = (propName: string, propValue: any, element: MyHTMLElement) => {
  // 如果是children 跳过
  if (propName === 'children') return
  // 事件以‘on’开头
  if (propName.slice(0, 2) === 'on') {
    const eventName = propName.toLocaleLowerCase().slice(2)
    element.addEventListener(eventName, propValue)
  }
  // className 附加属性
  else if (propName === 'className') {
    element.setAttribute('class', propValue)
  }
  // ref 接受string或者回调函数
  else if (propName === 'ref') {
    //  
  }
  // value或者checked属性
  else if (propName === 'value') {
    // element.value
    (element as HTMLInputElement).value = propValue
  }
  else if (propName === 'checked') {
    (element as HTMLInputElement).checked = propValue
  }
  // 其他
  else {
    element.setAttribute(propName, propValue)
  }
}

/**
 * 删除属性 
 * @param propName 
 * @param propValue 
 * @param element 
 */
export const removeProp = (propName: string, propValue: any, element: MyHTMLElement) => {
  if (propName === 'children') return
  if (propName.toLowerCase().slice(0, 2) === 'on') {
    element.removeEventListener(propName.toLowerCase().slice(2), propValue)
  }
}