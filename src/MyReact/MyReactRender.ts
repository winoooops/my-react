// import React from "react";
import { MyHTMLElement, MyReactComponent, MyReactElement } from "../shared/MyReactTypes";
import { isClassComponent, isFunction, isSameComponent } from "../shared/utils";
import { updateComponent } from "./MyReactComponent";
import { mountDOMElement, mountElement, updateDOMElement, updateText } from "./MyReactDOM";

/**
 * 借助Diff实现渲染
 * @param virtualDOM 
 * @param container 
 */
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
  // 获取之前的虚拟DOM
  const oldVirtualDOM = element.__virtualDOM
  const { type, props } = virtualDOM
  // 1. 组件类型
  if (isFunction(type)) {
    const oldComponent = oldVirtualDOM.component
    updateComponent(virtualDOM, oldComponent as MyReactComponent, element, container as MyHTMLElement)
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