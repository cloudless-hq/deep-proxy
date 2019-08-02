import test from 'ava'
import DeepProxy from 'proxy-deep'

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

// test('bar', async t => {
//   const bar = Promise.resolve('bar')
//   t.is(await bar, 'bar')
// })

function setup (obj, cb) {
  return new DeepProxy(
    obj,
    {
      get (target, path, receiver) {

        // console.log({ target, path, receiver, that: this})

        const value = ?

        cb(path, 'get', value)
        return value

        // return this.nest()
      },
      set (target, path, receiver) {
        return this.nest()
      },
      apply (target, thisArg, argList) {

        return this.path
      }
    }
  )
}

test('if access of property, callbck is called with path a', t => {
  t.plan(4)

  const proxy = setup(testObj, (path, action, value) => {
    t.is(path, 'a')
    t.is(action, 'get')
    t.is(value, '')
  })

  t.is(proxy.a, '')

  // t.pass()
})



// console.log(proxy.i.b.c.d.a)
// // callback is called with path 'i.b.c.d.a'

// const foo = proxy.i.b.c.d.a
// console.log(foo)
