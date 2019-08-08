import test from 'ava'
import init from './sidecar-proxy'

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
  // return deepProxy(origObj, { get: (innerObj, key, root, keys) => {
  //   if (key.endsWith('$')) {
  //     key = key.slice(0, -1)
  //     const path = [...keys, key]
  //     cb(path, 'get', innerObj[key])
  //     return innerObj[key]
  //   }
  //   return innerObj[key]
  // } })
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
test('[1] if access of property, callbck is called with path a', t => {
  t.plan(4)

  const proxy = setup(testObj, (path, action, value) => {
    t.is(path, 'a')
    t.is(action, 'get')
    t.is(value, '')
  })
  t.is(proxy.a, '')
})

test('[2] if access of property, callbck is called with path i.a', t => {
  t.plan(4)
  const proxy = setup(testObj, (path, action, value) => {
    t.is(path, 'i.a')
    t.is(action, 'get')
    t.is(value, 'vincent')
  })
  t.is(proxy.i.a, 'vincent')
})

test('[3] if access of property, callbck is called with path i.b.a', t => {
  t.plan(4)
  const proxy = setup(testObj, (path, action, value) => {
    t.is(path, 'i.b.a')
    t.is(action, 'get')
    t.is(value, 'not vincent')
  })
  t.is(proxy.i.b.a, 'not vincent')
})

test('[4] if access of property, callbck is called with path i.b.a$', t => {
  t.plan(4)
  const proxy = setup(testObj, (path, action, value) => {
    t.is(path, 'i.b.a')
    t.is(action, 'get')
    t.is(value, 'not vincent')
  })
  t.is(proxy.i.b.a$, 'not vincent')
})

test('[5] if access of property, callbck is called with path xxx (undefined path)', t => {
  t.plan(4)
  const proxy = setup(testObj, (path, action, value) => {
    t.is(path, 'i.xxx')
    t.is(action, 'get')
    t.is(value, undefined)
  })
  t.is(proxy.i.xxx, undefined)
})

test('[6] if access of property, callbck is called with path xxx.xxx (undefined path)', t => {
  t.plan(4)
  const proxy = setup(testObj, (path, action, value) => {
    console.log({ path, action, value })
    t.is(path, 'xxx')
    t.is(action, 'get')
    t.is(value, undefined)
  })
  t.is(proxy.xxx.xxx, undefined)
})
