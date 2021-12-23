import * as TinyReact from '../TinyReact/index'

export function Todo(props: any) {
  console.log(TinyReact)
  return (
    <li>{props.taskName}</li>
  )
}