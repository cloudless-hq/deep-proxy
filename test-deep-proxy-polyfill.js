import test from 'ava'
import deepProxy from 'deep-proxy-polyfill'

const testObj = {
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

function setup (origObj, cb) {
  return deepProxy(origObj, { get: (innerObj, key, root, keys) => {
    if (key.endsWith('$')) {
      key = key.slice(0, -1)
      const path = [...keys, key]
      cb(path, 'get', innerObj[key])
      return innerObj[key]
    }
    return innerObj[key]
  } })
}

test('[1] if access of property, callbck is called with path a', t => {
  t.plan(4)
  const proxy = setup(testObj, (path, action, value) => {
    t.is(path, ['a'])
    t.is(action, 'get')
    t.is(value, '')
  })
  t.is(proxy.a$, '')
})

// test('[2] if access of property, callbck is called with path i.a', t => {
//  t.plan(4)
//   const proxy = setup(testObj, (path, action, value) => {
//     t.is(path, ['i', 'a'])
//     t.is(action, 'get')
//     t.is(value, 'vincent')
//   })
//   t.is(proxy.i.a, 'vincent')
// })
