import React, { createRef, ReactElement, RefObject } from "react"
import { MyReactElement } from "../shared/MyReactTypes"

/**
 * 
 * @param type 元素类型
 * @param props 属性
 * @param children 子元素 
 * @returns 
 */
export const createElement = (type: any, props: any, ...children: any): MyReactElement => {
  // 对子元素进行处理
  const childElements = children.map((child: any) => {
    // 如果子元素为虚拟DOM对象，直接返回
    if (child instanceof Object) {
      return child
    }
    // 如果子元素为纯文本，将文本储存在props.textContent中返回
    else {
      return createElement('text', { textContent: child })
    }
  })

  props = Object.assign({}, props, { children: childElements })

  const key = props.key || null
  const ref = props.ref || null

  return {
    type,
    props,
    key,
    ref,
  }
}


