import xss from 'xss'

export default {
  install: (app) => {
    app.directive('xss', {
      mounted(el, binding) {
        el.innerHTML = xss(binding.value, {
          onTagAttr(tag, name, value) {
            if (name === 'style') {
              return `${name}="${value}"`
            }
          },
        })
      },
      updated(el, binding) {
        el.innerHTML = xss(binding.value, {
          onTagAttr(tag, name, value) {
            if (name === 'style') {
              return `${name}="${value}"`
            }
          },
        })
      },
    })
  },
}
