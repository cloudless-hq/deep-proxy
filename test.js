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
  h: ['mon', { a: 44, b: 42 }, 'wed'],
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
    return value
  }, { delim: '$', returnPathOnEmpty: true })
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

test('[3] if access of property, callbck is called with path i.b.a', t => {
  t.plan(2)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['i', 'b', 'a'])
    t.is(value, 'not vincent')
  })
  proxy.i.b.a$ === undefined
})

test('[4] if access of property, callbck is called with path i.b.a$', t => {
  t.plan(2)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['i', 'b', 'a'])
    t.is(value, 'not vincent')
  })
  proxy.i.b.a$ === undefined
})

test('[5] if access of property, callbck is called with path xxx (undefined path)', t => {
  t.plan(2)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['i', 'xxx'])
    t.is(value, undefined)
  })
  proxy.i.xxx$ === undefined
})

test('[6] if access of property, callbck is called with path xxx.xxx (undefined path)', t => {
  t.plan(2)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['xx1', 'xx2'])
    t.is(value, undefined)
  })
  proxy.xx1.xx2$ === undefined
})

test('[7] if access of property, callbck is called with path h[1].a', t => {
  t.plan(2)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['h', '1', 'a'])
    t.is(value, 44)
  })
  proxy.h[1].a$ === undefined
})

test('[8] if access of property, callbck is called with path h', t => {
  t.plan(2)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['h'])
    t.deepEqual(value, ['mon', { a: 44, b: 42 }, 'wed'])
  })
  proxy.h$ === undefined
})

test('[9] if access of property, callbck is called with path h0', t => {
  t.plan(2)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['h', '0'])
    t.is(value, 'mon')
  })
  proxy.h['0$'] === undefined
})

test('[10] if access of property, callbck is called with path [5]', t => {
  t.plan(2)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['h', '5'])
    t.is(value, undefined)
  })
  proxy.h['5$'] === undefined
})

test('[11] if access of property, callbck is called with path [0][1]', t => {
  t.plan(2)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['0', '1'])
    t.is(value, undefined)
  })
  proxy['0']['1$'] === undefined
})

test('[12] proxying an array returns an array', t => {
  t.plan(3)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['h'])
    t.is(value, testObj.h)
  })
  t.is(Array.isArray(proxy.h$), true)
})

test('[13] array methods', t => {
  t.plan(6)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['h'])
    t.is(value, testObj.h)
  })
  t.is(proxy.h$.length, 3)
  t.is(proxy.h$.forEach((element) => true))
})
