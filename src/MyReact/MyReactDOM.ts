import { MyHTMLElement, MyReactElement } from "../shared/MyReactTypes"
import { isEqual, isFunction } from "../shared/utils"
import { mountComponent } from "./MyReactComponent"

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
      if (!isEqual(newProps[key], oldProps[key])) {
        console.log(newProps[key])
        console.log(oldProps[key])
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
  } else {
    element.removeAttribute(propName)
  }
}