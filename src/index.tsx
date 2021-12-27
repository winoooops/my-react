import * as TinyReact from "./TinyReact";
import { Todos } from "./demo/Todos";

function App() {
  return (
    <Todos />
  )
}

const root = document.getElementById('app')
TinyReact.render(<App />, root)



