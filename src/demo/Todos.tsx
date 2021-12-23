import * as TinyReact from '../TinyReact/index'
// import { TinyComponent } from "../TinyReact/types";
import { Todo } from "./Todo";

export function Todos() {
  console.log(TinyReact)
  return (
    <div>
      <Todo taskName="createElement" />
      <Todo taskName="render" />
      <Todo taskName="component rendering" />
    </div >
  )
}