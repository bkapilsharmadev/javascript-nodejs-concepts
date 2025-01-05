import MyPromise from "./promise-concepts/MyPromise.js";

const myPromise = new MyPromise(resolve => {
    resolve('RESOLVED VALUE');
})

console.log(myPromise);
myPromise.then(value => {
    console.log('Executing then')
    console.log("KAPIL>>> ", value);
})