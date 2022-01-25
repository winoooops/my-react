import * as MyReact from "../src/MyReact";
import { Todo, Todos } from '../demo/'
import { updateText, mountDOMElement, updateDOMElement } from "../src/MyReact/MyReactDOM";
import { getByText, getByRole } from '@testing-library/dom'
import { mountComponent, updateComponent } from "../src/MyReact/MyReactComponent";

let container: any;
let child: any;

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  console.log(MyReact)
})

afterEach(() => {
  document.body.removeChild(container)
  // container = null
})

describe("test Diff with DOM", () => {
  it('should update text', () => {
    let oldVirtualDOM = <p>old</p>
    let newVirtualDOM = <p>new</p>
    mountDOMElement(oldVirtualDOM, container)
    setTimeout(() => {
      updateDOMElement(newVirtualDOM, oldVirtualDOM, container)
      expect(getByText(container, 'new')).toBeTruthy()
    }, 3000);
  })

  it('should update class', () => {
    let oldVirtualDOM = <p className="cool">old</p>
    let newVirtualDOM = <p className="chill">new</p>
    mountDOMElement(oldVirtualDOM, container)
    setTimeout(() => {
      updateDOMElement(newVirtualDOM, oldVirtualDOM, container)
      expect(getByText(container, 'new')).toHaveClass('chill')
    }, 3000);
  })

  it('should have correect child elements', () => {
    let oldVDOM = (
      <ul role="list">
        <li>a</li>
        <li>b</li>
        <li>c</li>
      </ul>
    )
    let newVDOM = (
      <ul role="list">
        <li>a</li>
        <li>b</li>
        <li>c</li>
        <li>d</li>
        <li>Z</li>
      </ul>
    )

    mountDOMElement(oldVDOM, container)
    expect(getByRole(container, 'list').childElementCount).toBe(3)
    setTimeout(() => {
      updateDOMElement(newVDOM, oldVDOM, container)
      expect(getByRole(container, 'list').childElementCount).toBe(5)
    }, 3000);
  })
})

describe('test Diff with Component', () => {
  it('should update props', () => {
    let oldVDOM = <Todo task="diff" completed={false} />
    let newVDOM = <Todo task="Diff" completed={true} />
    mountComponent(oldVDOM, container)
    setTimeout(() => {
      updateComponent(newVDOM, oldVDOM, container.firstChild, container)
      expect(getByText(container, 'Diff')).toBeTruthy()
      expect(getByText(container, 'Diff').parentElement).toHaveClass('completed')
    }, 3000);
  })

  it('should update child elements', () => {
    let oldVDOM = <Todos type="one" />
    let newVDOM = <Todos type="two" />

    mountComponent(oldVDOM, container)
    expect(getByRole(container, 'list').childElementCount).toBe(3)
    setTimeout(() => {
      updateComponent(newVDOM, oldVDOM, container.firstChild, container)
      expect(getByRole(container, 'list').childElementCount).toBe(6)
      expect(getByRole(container, 'list').childNodes[2]).toHaveTextContent('Diff')
      expect(getByRole(container, 'list').childNodes[2]).toHaveClass('completed')
    }, 3000);
  })

})