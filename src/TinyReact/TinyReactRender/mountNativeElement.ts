import { VirtualDOM } from "../types"
import { mountElement } from "./mountElement"
import { updateProps } from "./updateProps"

export function mountNativeElement(newDOM: VirtualDOM, container: any) {
  let newElement: any
  console.log(newDOM)
  if (newDOM.type === 'text') {
    newElement = document.createTextNode(newDOM.props.textContent)
  } else {
    newElement = document.createElement(newDOM.type)
    console.log(newElement)
    updateProps(newDOM, newElement)
    console.log(newDOM)
    newDOM.childElements?.forEach(child => {
      console.log(child)
      mountElement(child, newElement)
    })
  }

  container.appendChild(newElement)
}