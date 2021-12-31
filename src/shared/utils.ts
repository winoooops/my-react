import { MyReactElement } from "./MyReactTypes"

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
 * 判断组件是否为同一个 
 * @param virtualDOM 
 * @param oldComponent 
 * @returns 
 */
export const isSameComponent = (virtualDOM: MyReactElement, oldComponent: any) => {
  // console.log(virtualDOM.type)
  // console.log(oldComponent.constructor)
  // console.log(virtualDOM.type === oldComponent.constructor)
  return oldComponent && virtualDOM.type === oldComponent.constructor
}