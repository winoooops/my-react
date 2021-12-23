import { VirtualDOM } from "./interfaces"
import { updateProps } from "./updateProps"

export function mountNativeElement(newDOM: VirtualDOM, container: any) {
  let newElement: any
  if (newDOM.type === 'text') {
    newElement = document.createTextNode(newDOM.props.textContent)
  } else {
    newElement = document.createElement(newDOM.type)
    updateProps(newDOM, newElement)
    newDOM.childElements?.forEach(child => mountNativeElement(child, newElement))
  }

  container.appendChild(newElement)
}