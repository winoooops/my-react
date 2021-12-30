import React from "react";
import * as MyReact from "../src/MyReact";
import './styles.scss'

// 因为@babel/react-preset中的pragma无法和runtime属性一起使用，造成不手动调用一次babel不自动找到MyReact的问题
console.log(MyReact)
const vDOM = (
  <div className="container">
    <ul className="todos" ref="todos">
      <li className="todo" onClick={() => alert('ongoing')}>createElement</li>
      <li className="todo" onClick={() => alert('ongoing')} >rendering</li>
      <li className="todo" onClick={() => alert('ongoing')} >component</li>
      <li className="todo" onClick={() => alert('ongoing')} >diff</li>
      <li className="todo" onClick={() => alert('ongoing')} >state</li>
    </ul>
  </div>
)

console.log(vDOM)

class Todos extends React.Component {
  render() {
    return vDOM
  }
}

const App = function () {
  return (
    <Todos />
  )
}



const root = document.getElementById('app') as HTMLElement
MyReact.render(<App />, root)