import { createElement, createRef } from "react"


export interface MyReactElement {
  type: any,
  props: { [key: string]: any },
  key: any | null,
  ref?: MyRef<any>;
}

export type MyHTMLElement = HTMLElement & { __virtualDOM: MyReactElement } | HTMLInputElement & { __virtualDOM: MyReactElement }

// createRef构造的对象
export interface MyRefObject<T> {
  readonly current: T | null;
}
// 函数式的ref
export type MyRefCallback<T> = (instace: T) => {}

// 现在可使用ref对象，ref回调和ref字符串的形式定义ref
export type MyRef<T> = MyRefObject<T> | MyRefCallback<T> | String | null  
