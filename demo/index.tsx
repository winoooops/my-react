import React, { MouseEventHandler } from "react";
import * as MyReact from "../src/MyReact";
import { mountDOMElement, updateDOMElement, updateText } from "../src/MyReact/MyReactDOM";
import { MyHTMLElement } from "../src/shared/MyReactTypes";
import { isFunction } from "../src/shared/utils";
import './styles.scss'

const vDOM = (
  <div className="container" >
    <ul className="todos" ref="todos">
      <li className="todo" onClick={() => alert('ongoing')}>createElement</li>
      <li className="todo" onClick={() => alert('ongoing')} >rendering</li>
      <li className="todo" onClick={() => alert('ongoing')} >component</li>
      <li className="todo" onClick={() => alert('ongoing')} >diff</li>
      <li className="todo" onClick={() => alert('ongoing')} >state</li>
    </ul>
  </div>
)


const Greeting = function () {
  return (
    <div>
      <h1>Hello React</h1>
    </div>
  )
}

class Welcome extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello React</h1>
      </div>
    )
  }
}

// const greeting = Greeting()
// const welcome = new Welcome({}).render()

// console.log(Greeting);
// // console.log(isFunction(Greeting.type))
// console.log(isFunction(greeting.type))

// console.log(Welcome);
// // console.log(isFunction(Welcome.type))
// console.log(isFunction(welcome.type))
// console.log(isFunction(vDOM.type))

// React.Component<P, S> 接受两个参数P = props和 S = state, 这里我只传了props
export class Todo extends React.Component<{ task: string, completed?: boolean, event?: MouseEventHandler<HTMLLIElement> }> {
  render() {
    const { completed, task, event } = this.props
    return (
      <li className={completed ? 'completed' : 'ongoing'} onClick={event}>
        {task}
      </li>
    )
  }
}

export class Todos extends React.Component<{ type: string }> {

  render() {
    const { type } = this.props
    const engList = (
      <section className="todos eng" role="list">
        <Todo task="createElement" completed={true} />
        <Todo task="render" completed={true} />
        <Todo task="diff" completed={false} />
      </section>
    )
    const cnList = (
      <section className="todos chi" role="list">
        <Todo task="createElement" completed={true} />
        <Todo task="render" completed={true} />
        <Todo task="Diff" completed={true} />
        <Todo task="虚拟DOM" completed={true} />
        <Todo task="渲染" completed={true} />
        <Todo task="Diff算法" />
      </section>
    )
    return type === 'one' ? engList : cnList
  }

}

export const App = function (props: { type: string }) {
  return (
    <Todos type={props.type} />
  )
}


const root = document.getElementById('app') as MyHTMLElement
// MyReact.render(<Todos type="one" />, root)

// setTimeout(() => {
//   MyReact.render(<Todos type="two" />, root)
// }, 5000);


let oldVirtualDOM = <p>old</p>
let newVirtualDOM = <p>new</p>
console.log(MyReact)
mountDOMElement(oldVirtualDOM, root)
setTimeout(() => {
  updateDOMElement(newVirtualDOM, oldVirtualDOM, root)
}, 3000);