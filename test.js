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
  return init(origObj, (path, value) => {
    cb(path, value)
  }, '$')
}

test('[1] if access of property, callbck is called with path a', t => {
  t.plan(2)

  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['a'])
    t.is(value, '')
  })

  proxy.a$ === undefined
})

test('[2] if access of property, callbck is called with path i.a', t => {
  t.plan(2)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['i', 'a'])
    t.is(value, 'vincent')
  })
  proxy.i.a$ === undefined
})

// test('[3] if access of property, callbck is called with path i.b.a', t => {
//   t.plan(4)
//   const proxy = setup(testObj, (path, value) => {
//     t.is(path, 'i.b.a')
//     t.is(value, 'not vincent')
//   })
//   t.is(proxy.i.b.a, 'not vincent')
// })

// test('[4] if access of property, callbck is called with path i.b.a$', t => {
//   t.plan(4)
//   const proxy = setup(testObj, (path, value) => {
//     t.is(path, 'i.b.a')
//     t.is(value, 'not vincent')
//   })
//   t.is(proxy.i.b.a$, 'not vincent')
// })

// test('[5] if access of property, callbck is called with path xxx (undefined path)', t => {
//   t.plan(4)
//   const proxy = setup(testObj, (path, value) => {
//     t.is(path, 'i.xxx')
//     t.is(value, undefined)
//   })
//   t.is(proxy.i.xxx, undefined)
// })

test('[6] if access of property, callbck is called with path xxx.xxx (undefined path)', t => {
  t.plan(2)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['xxx', 'xxx'])
    t.is(value, undefined)
  })
  proxy.xxx.xxx$ === undefined
})
