import React from "react";
import * as MyReact from "../src/MyReact";
import { MyHTMLElement } from "../src/shared/MyReactTypes";
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
const vDOM2 = (
  <div className="container">
    <ul className="todos" ref="todos">
      <li className="todo" onClick={() => alert('ongoing')}>createElement</li>
      <li className="todo" onClick={() => alert('ongoing')} >rendering</li>
      <li className="todo ongoing" onClick={() => alert('ongoing')} >component</li>
      <li className="todo" onClick={() => alert('ongoing')} >diff</li>
      <li className="todo ongoing" onClick={() => alert('ongoing')} >state</li>
    </ul>
  </div>
)

const anotherVDOM = (
  <main>
    <h1>你好 Tiny React</h1>
    <h2 data-test="test123">(编码必杀技)</h2>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h3>观察: 这个将会被改变</h3>
    {false && <div>如果2和1相等修改了当前内容</div>}
    {true && <div>2</div>}
    <span>这是一段内容</span>
    <button onClick={() => alert("你好，我已经更新")}>点击我</button>
    <h3>这个将会被删除</h3>
    2, 3
  </main>
)

console.log(vDOM)

class Todos extends React.Component<{ type: string }>{

  render() {
    const { type } = this.props
    return type === 'one' ? vDOM : vDOM2
  }
}

const App = function (props: any) {
  return (
    <Todos type={props.type} />
  )
}

const root = document.getElementById('app') as MyHTMLElement
MyReact.render(<App type="one" />, root)

setTimeout(() => {
  MyReact.render(<App type="two" />, root)
}, 5000);

// console.log(root)
