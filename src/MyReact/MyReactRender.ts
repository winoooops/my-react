// import React from "react";
import { MyHTMLElement, MyReactComponent, MyReactElement } from "../shared/MyReactTypes";
import { isFunction } from "../shared/utils";
import { updateComponent, mountComponent } from "./MyReactComponent";
import { mountDOMElement, updateDOMElement, updateText } from "./MyReactDOM";

/**
 * 借助Diff实现渲染
 * @param virtualDOM 
 * @param container 
 */
export const render = (virtualDOM: MyReactElement, container: MyHTMLElement) => {
  diff(virtualDOM, container, container?.firstChild as MyHTMLElement)
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
  // 获取之前的虚拟DOM
  const { type, props } = virtualDOM
  const oldVirtualDOM: MyReactElement = element?.__virtualDOM
  // 1. 组件类型
  if (isFunction(type)) {
    updateComponent(virtualDOM, oldVirtualDOM, element, container as MyHTMLElement)
  }
  // 2. DOM元素类型
  else {
    if (type === 'text') {
      updateText(virtualDOM, oldVirtualDOM, element)
    } else {
      updateDOMElement(virtualDOM, oldVirtualDOM, element)
    }
  }
  // 如果有子元素，递归diff子元素
  props.children?.forEach((child: MyReactElement, index: number) => {
    diff(child, element, element.childNodes[index] as MyHTMLElement)
  })
}

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