import * as TinyReact from "./TinyReact";


const vDOM = (
  <div className="map">
    <h1>React Roadmap</h1>
    <div>
      <span>Hello, </span>
      {true && <span>Winoooops</span>}
      {false && <span>Wei</span>}
    </div>
    <ul>
      <li>React Basic</li>
      <li>React in Depth</li>
      <li>React in Action</li>
      <li>React Interview Prep</li>
    </ul>
    <div>
      <span>New Task: </span>
      <input type="text" placeholder="input new task" value="order coffee" />
      <button onClick={() => { alert('Adding') }}>Add</button>
    </div>
  </div>
)
console.log(vDOM)
const root = document.getElementById('app')
console.log(TinyReact.render)
TinyReact.render(vDOM, root)



