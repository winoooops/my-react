// import React from "react";
import { MyHTMLElement, MyReactElement } from "../shared/MyReactTypes";
import { mountDOMElement, } from "./MyReactDOM";

/**
 * 借助Diff实现渲染
 * @param virtualDOM 
 * @param container 
 */
export const render = (virtualDOM: MyReactElement, container: MyHTMLElement) => {
  mountDOMElement(virtualDOM, container)
}