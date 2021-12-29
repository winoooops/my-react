import React from "react";
import { createModuleResolutionCache } from "typescript";
import { MyReactDOM } from "./createElement";

/**
 * 渲染方法 
 * @param virtualDOM 
 * @param container 
 * @returns 
 */
export const render = (virtualDOM: MyReactDOM, container: HTMLElement | null) => {
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

export const diff = (virtualDOM: MyReactDOM, element: HTMLElement, preVirtualDOM: MyReactDOM) => { }

/**
 * 渲染原生DOM元素
 * @param virtualDOM 虚拟DOM
 * @param container 父容器 
 */
export const mountElement = (virtualDOM: MyReactDOM, container: HTMLElement | null) => {
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

    // 递归渲染子元素
    props?.children.forEach((child: MyReactDOM) => {
      render(child, newElement)
    })
  }
  container?.appendChild(newElement)
}

/**
 * 渲染组件(需要判断组件为函数式组件还是类式组件) 
 * @param virtualDOM 
 * @param container 
 */
export const mountComponent = (virtualDOM: MyReactDOM, container: HTMLElement) => {
  // 获取构造函数和属性
  const { type: C, props } = virtualDOM
  let newVirtualDOM: MyReactDOM
  // 如果是类组件
  if (isClassComponent(virtualDOM.type)) {
    console.log('rendering class component')
    // 创建实例并返回
    newVirtualDOM = new C(props || {})
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