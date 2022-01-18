// import React from "react";
import { MyHTMLElement, MyReactElement } from "../shared/MyReactTypes";
import { isFunction } from "../shared/utils";
import { mountComponent } from "./MyReactComponent";
import { mountDOMElement } from "./MyReactDOM";

/**
 * 借助Diff实现渲染
 * @param virtualDOM 
 * @param container 
 */
export const render = (virtualDOM: MyReactElement, container: MyHTMLElement) => {
  mountElement(virtualDOM, container)
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
  } else {
    // 渲染原生DOM元素
    console.log('Rendering DOM Element')
    mountDOMElement(virtualDOM, container)
  }
}