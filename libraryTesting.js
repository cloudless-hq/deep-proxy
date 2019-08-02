const DeepProxy = require('proxy-deep')

const test = {
  a: '',
  b: 'sup',
  c: 12,
  d: null,
  f: () => {
    return true
  },
  g: false,
  h: ['mon', 44, 'wed'],
  i: {
    a: 'vincent',
    b: {
      a: 'not vincent',
      b: 321,
      c: {
        a: null,
        b: ['tue'],
        c: 11,
        d: {
          a: 'nothing to see here',
          b: function (arg) {
            console.log('you said: ' + arg)
          }
        }
      }
    }
  }
}

function setup (obj) {
  return new DeepProxy(
    obj,
    {
      get (target, path, receiver) {
        console.log(path)
        return this.nest()
      },
      apply (target, thisArg, argList) {
        return this.path
      }
    }
  )
}

const deepProxyObj = setup(test)

// if access of property, callbck is called
console.log(deepProxyObj)
// callback is called with path 'a'

console.log(deepProxyObj.i.b.c.d.a)
// callback is called with path 'i.b.c.d.a'

const foo = deepProxyObj.i.b.c.d.a
console.log(foo)

