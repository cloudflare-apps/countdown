(function () {
  if (!window.addEventListener) return

  var options = INSTALL_OPTIONS
  var parts = ['Day', 'Hour', 'Minute', 'Second']
  var partsEls = {}
  var container
  var interval

  var colorStyle = document.createElement('style')
  document.head.appendChild(colorStyle)

  function updateStyle () {
    var color = options.color.trim()
    var content = ''

    container.setAttribute('data-background', color ? 'visible' : 'transparent')

    if (color) {
      content += '' +
      'cloudflare-app[app="countdown"] cf-countdown-block, cloudflare-app[app="countdown"] cf-countdown-header {' +
        'background: ' + color +
      '}'
    }

    colorStyle.innerHTML = content
  }

  function getTimeRemaining (deadline) {
    var remaining = Date.parse(deadline) - Date.parse(new Date())

    return {
      remaining: remaining,
      Day: Math.max(0, Math.floor(remaining / (1000 * 60 * 60 * 24))),
      Hour: Math.max(0, Math.floor((remaining / (1000 * 60 * 60)) % 24)),
      Minute: Math.max(0, Math.floor((remaining / 1000 / 60) % 60)),
      Second: Math.max(0, Math.floor((remaining / 1000) % 60))
    }
  }

  function createNamespacedElement (type) {
    return document.createElement('cf-countdown' + (type ? '-' + type : ''))
  }

  function createPart (part) {
    var block = createNamespacedElement('block')
    var number = createNamespacedElement('number')
    var label = createNamespacedElement('label')

    block.appendChild(number)
    block.appendChild(label)

    return {
      block: block,
      number: number,
      label: label
    }
  }

  function tick () {
    var remaining = getTimeRemaining(options.deadline)

    parts.forEach(function (part) {
      partsEls[part].number.innerHTML = remaining[part] || 0
      partsEls[part].label.innerHTML = remaining[part] === 1 ? part : part + 's'
    })

    partsEls.Day.number.setAttribute('data-digits', (remaining.Day + '').length)
  }

  function bootstrap () {
    container = INSTALL.createElement(options.location, container)
    container.setAttribute('app', 'countdown')
    container.setAttribute('data-position', options.position)
    updateStyle()

    var wrapper = createNamespacedElement('wrapper')

    var header = createNamespacedElement('header')
    var headerLabel = createNamespacedElement('label')

    if (options.countdownTitle.trim()) {
      headerLabel.textContent = options.countdownTitle
      header.appendChild(headerLabel)

      wrapper.appendChild(header)
    }

    var content = createNamespacedElement('content')

    parts.forEach(function (part) {
      partsEls[part] = createPart(part)
      content.appendChild(partsEls[part].block)
    })

    wrapper.appendChild(content)

    container.appendChild(wrapper)

    tick()

    clearInterval(interval)

    interval = setInterval(function () {
      tick()

      if (getTimeRemaining(options.deadline).total <= 0) {
        clearInterval(interval)
      }
    }, 1000)
  }

  document.addEventListener('DOMContentLoaded', bootstrap)

  window.INSTALL_SCOPE = {
    setOptions: function (nextOptions) {
      options = nextOptions

      bootstrap()
    }
  }
})()
