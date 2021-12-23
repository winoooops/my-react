import { VirtualDOM } from "../types"
import { mountElement } from "./mountElement"

export function render(newDOM: VirtualDOM, container: any, oldDOM?: VirtualDOM) {
  console.log('render function triggered')
  mountElement(newDOM, container)
}