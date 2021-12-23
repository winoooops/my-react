import React from "react";
import * as MyReact from "../src/MyReact";
import { MyHTMLElement } from "../src/shared/MyReactTypes";
import './styles.scss'

const vDOM = (
  <div className="container">
    <ul className="todos" ref="todos">
      <li className="completed" onClick={() => alert('completed')}>createElement</li>
      <li className="completed" onClick={() => alert('completed')} >rendering DOM</li>
      <li className="ongoing" onClick={() => alert('ongoing')} >rendering Component</li>
      <li className="todo" onClick={() => alert('todo')} >diff</li>
      <li className="todo" onClick={() => alert('todo')} >state</li>
    </ul>
  </div>
)


const root = document.getElementById('app') as MyHTMLElement
MyReact.render(vDOM, root)
