function init (data, cb, delim) {
  let virtual = false
  // performance of memoization?

  let errorHandlers = {
    has () {
      console.error('error: calling `has` on atreyu proxy.')
      return true
    },
    deleteProperty () {
      console.error('error: calling `delete` on atreyu proxy.')
    },
    defineProperty (oTarget, sKey, oDesc) {
      console.error('error: calling `defineProperty` on atreyu proxy.')
    },
    getOwnPropertyDescriptor (oTarget, sKey) {
      console.error('error: calling `getOwnPropertyDescriptor` on atreyu proxy.')
      return { configurable: true, enumerable: true, value: 5 }
    },
    apply (target, thisArg, argumentsList) {
      console.error('error: calling apply on atreyu proxy.')
    },
    set (target, name, value) {
      console.error('error: calling set deirectly on atreyu proxy not supported.')
      return false
    },
    ownKeys (oTarget, sKey) {
      console.error('error: calling ownKeys on atreyu proxy not supported.')
      return ['ownKeys test']
    },
    getPrototypeOf (target) {
      console.error('error: getting prototype on atreyu proxy not supported.')
      return Object
    }
  } // only in debug/dev mode

  function objProxy (root) {
    return new Proxy({}, {
      ...errorHandlers,
      get (obj, prop) {
        let path = [...root]
        if (!delim || prop.endsWith(delim)) {
          if (delim) {
            prop = prop.slice(0, -1)
          }

          path.push(prop)
          cb(path, null, 'get')
        } else {
          path.push(prop)
        }

        return objProxy(path)
      }
    })
  }

  // arrProxy = new Proxy([], {
  // funProxy = new Proxy(function () {}, {

  return objProxy([])
}

exports.default = init





let proxy = init({}, (path, value, action) => {
  console.log('----------')
  console.log({ path, value, action })
}, '$')

console.log(proxy.a.b.c.d$)

const test1 = proxy.a.b$

console.log(test1.blah$)

console.log(test1.keks$)

console.log(proxy.x.y.z['1$'])

// console.log(proxy.c.forEach(e => {
//   console.log(e)
// }))
//
// for (var x in proxy) {
//   console.log(x)
// }

console.log(proxy._secret = 'easily scared')

// console.log(proxy.c())

