import { VirtualDOM } from "./interfaces";

export function updateProps(newDOM: VirtualDOM, element: any) {
  console.log(`****** updating ******`)
  console.log(newDOM)
  const props = newDOM.props
  Object.keys(props).forEach(propName => {
    if (propName === 'children') return

    const propValue = props[propName]
    console.log("props name is", propName)
    console.log(propValue)

    if (propName.slice(0, 2) === 'on') {
      console.log('should bind event')
      const eventName = propName.toLowerCase().slice(2)
      element.addEventListener(eventName, propValue)
    } else if (propName === 'value' || propName === 'checked') {
      element[propName] = propValue
    } else if (propName === 'className') {
      element.setAttribute('class', propValue)
    } else {
      element.setAttribute(propName, propValue)
    }
  })
  console.log(`***** updated ${newDOM} *****`)
} 