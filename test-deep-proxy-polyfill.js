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

// TODO: create test out of following
const path = []
const value = ''
function getHandler (obj, key, root, keys) {
  path.push(key)
  return obj[key]
};

function setup (obj) {
  return deepProxy(obj, { get: getHandler })
}

const proxy = setup(testObj)

const foo = proxy.i.a

console.log(path) // output: ['i', 'a']
console.log(testObj[path[0]][path[1]]) // output: 'vincent'
console.log('get') // TODO: get action from deepProxy
// END TODO

test('if access of property, callbck is called with path a', t => {
  t.plan(4)

  const proxy = setup(testObj, (path, action, value) => {
    t.is(path, ['a'])
    t.is(action, 'get')
    t.is(value, '')
  })

  t.is(proxy.a, '')
})
