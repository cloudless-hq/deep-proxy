function makePaths ({ name, path, root, delim }) {
  const isPathEnd = name.endsWith(delim)
  let cleanName
  if (isPathEnd) {
    cleanName = name.slice(0, -1)
  } else {
    cleanName = name
  }
  const relPath = path.concat(cleanName)
  let fullPath = relPath.map((ele) => !isNaN(Number(ele)) ? Number(ele) : ele)
  if (root) {
    fullPath = root.concat(fullPath)
  }
  return { isPathEnd, parsedPath: fullPath, cleanName }
}

function init (data, cb, { delim }) {
  // const virtual = false
  // performance of memoization?

  const errorHandlers = {
    // has () {
    //   console.error('error: calling `has` on atreyu proxy.')
    //   return true
    // },
    // deleteProperty () {
    //   console.error('error: calling `delete` on atreyu proxy.')
    // },
    // defineProperty (oTarget, sKey, oDesc) {
    //   console.error('error: calling `defineProperty` on atreyu proxy.')
    // },
    // getOwnPropertyDescriptor (oTarget, sKey) {
    //   console.error('error: calling `getOwnPropertyDescriptor` on atreyu proxy.')
    //   return { configurable: true, enumerable: false, value: 5 }
    // },
    apply (target, thisArg, argumentsList) {
      console.error('error: calling apply on atreyu proxy.')
    },
    set (target, name, value) {
      console.error('error: calling set deirectly on atreyu proxy not supported.')
      return false
    }
    // ownKeys (oTarget, sKey) {
    //   console.error('error: calling ownKeys on atreyu proxy not supported.')
    //   return ['ownKeys test']
    // },
    // getPrototypeOf (target) {
    //   console.error('error: getting prototype on atreyu proxy not supported.')
    //   return Object
    // }
  } // only in debug/dev mode

  function objProxy (rootPath, subObj) {
    return new Proxy({}, {
      ...errorHandlers,
      get (obj, prop) {
        const path = [...rootPath]
        if (typeof prop !== 'string') {
          console.warn('non string key access')
          return () => {}
        }




// use makePaths function here instead of manual delim handling
        if (...isEnd) {
          return cb(path, subObj[cleanName])
        }

// if cleanName is length return 0 imediately with callback :
// return cb(path, 0)


        if (typeof subObj[prop] === 'undefined') {
          return objProxy(path, {})
        }
        if (typeof subObj[prop] !== 'object') {
          return subObj[prop]
        }

        return objProxy(path, subObj[prop])
      }
    })
  }

  // arrProxy = new Proxy([], {
  // funProxy = new Proxy(function () {}, {

  return objProxy([], data)
}
module.exports = init

/*
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
 */
