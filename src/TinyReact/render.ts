import { VirtualDOM } from "./interfaces"
import { mountNativeElement } from "./mountNativeElement"

export function render(newDOM: VirtualDOM, container: any, oldDOM?: VirtualDOM) {
  console.log('render function triggered')
  mountNativeElement(newDOM, container)
}