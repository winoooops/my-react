import { isEqual, isReference } from "../src/shared/utils"

const fn = () => alert('poop')
const fn2 = () => alert('poop')

console.log(fn.toString());
console.log(fn2.toString())

console.log(isEqual(fn.toString(), fn2.toString()))
console.log(typeof fn)