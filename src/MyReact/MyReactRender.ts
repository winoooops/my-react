// import React from "react";
import { MyHTMLElement, MyReactComponent, MyReactElement } from "../shared/MyReactTypes";
import { isClassComponent, isFunction, isSameComponent } from "../shared/utils";
import { updateComponent } from "./MyReactComponent";
import { mountDOMElement, mountElement, updateDOMElement } from "./MyReactDOM";

export const render = (virtualDOM: MyReactElement, container: MyHTMLElement) => {
  diff(virtualDOM, container, container.firstChild as MyHTMLElement)
}

/**
 * Diff算法
 * @param virtualDOM 
 * @param element 
 * @param preVirtualDOM 
 */
export const diff = (virtualDOM: MyReactElement, container: MyHTMLElement, element: MyHTMLElement) => {
  // * 第一次渲染
  if (!element) return mountElement(virtualDOM, container)
  // * 同级别比较
  const oldVirtualDOM = element.__virtualDOM
  const oldComponent = oldVirtualDOM?.component
  // 1. 组件类型
  if (isFunction(virtualDOM.type)) {
    console.log('comparing component')
    console.log(virtualDOM)
    updateComponent(virtualDOM, oldComponent as MyReactComponent, element, container as MyHTMLElement)
  }
  // 2. DOM元素类型
  else {
    if (virtualDOM.type === 'text') {
      updateText(virtualDOM, oldVirtualDOM, element)
    } else {
      updateDOMElement(virtualDOM, oldVirtualDOM, element)
    }
  }
}

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