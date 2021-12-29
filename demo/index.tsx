import React from "react";
import * as MyReact from "../src/MyReact";
// 因为@babel/react-preset中的pragma无法和runtime属性一起使用，造成不手动调用一次babel不自动找到MyReact的问题
console.log(MyReact)
const vDOM = (
  <div className="container">
    <ul>
      <li>createElement</li>
      <li>rendering</li>
      <li>component</li>
      <li>diff</li>
      <li>state</li>
    </ul>
  </div>
)

console.log(vDOM)

class Demo extends React.Component {

}

const App = function () {
  return vDOM
}



const root = document.getElementById('app')
MyReact.render(<App />, root)