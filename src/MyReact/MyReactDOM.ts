import { MyHTMLElement, MyReactElement } from "../shared/MyReactTypes"

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
      mountDOMElement(child, newElement)
    })
  }
  //* 创建DOM元素的时候记录下当前的虚拟DOM
  newElement.__virtualDOM = virtualDOM
  container?.appendChild(newElement)
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
  else if (propName.slice(0, 2) === 'on') {
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