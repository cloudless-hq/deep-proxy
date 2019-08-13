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
  h: [
    {
      a: {
        b: 11
      }
    },
    {
      a: {
        b: 22
      }
    },
    {
      a: {
        b: 33
      }
    }
  ],
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
    t.deepEqual(path, ['h', 1, 'a'])
    t.deepEqual(value, {
      b: 22
    })
  })
  proxy.h[1].a$ === undefined
})

test('[8] if access of property, callbck is called with path h', t => {
  t.plan(2)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['h'])
    t.deepEqual(value, [
      {
        a: {
          b: 11
        }
      },
      {
        a: {
          b: 22
        }
      },
      {
        a: {
          b: 33
        }
      }
    ])
  })
  proxy.h$ === undefined
})

test('[9] if access of property, callbck is called with path h0', t => {
  t.plan(2)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['h', 0])
    t.deepEqual(value, {
      a: {
        b: 11
      }
    })
  })
  proxy.h['0$'] === undefined
})

test('[10] if access of property, callbck is called with path [5]', t => {
  t.plan(2)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['h', 5])
    t.is(value, undefined)
  })
  proxy.h['5$'] === undefined
})

test('[11] if access of property, callbck is called with path [0][1]', t => {
  t.plan(2)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, [0, 1])
    t.is(value, undefined)
  })
  proxy[0]['1$'] === undefined
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

test('[14] array methods for non existing arrays', t => {
  t.plan(3)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, [0, 1, 2])
    t.is(value, undefined)
  })
  t.is(proxy[0][1]['2$'], undefined)
})

test('[15] array length', t => {
  t.plan(3)
  const proxy = setup(testObj, (path, value) => {
    t.deepEqual(path, ['virtobj', 'length'])
  })

  t.is(proxy.virtobj.length, 0)

  for (let i = 0; i < proxy.virtobj.length; i++) {
    console.log('this should run 0 times')
    console.log(proxy.h[i].a.b$)
    t.is(true, false)
  }
})
