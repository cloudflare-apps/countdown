(function(){
  if (!window.addEventListener || !document.documentElement.setAttribute) {
    return
  }

  var options, namespace, parts, partsEls, colorStyle, getTimeRemaining, createEl, createPart, update, interval, init, element, updateStyle, setOptions;

  options = INSTALL_OPTIONS;
  namespace = 'eager-countdown-app';
  parts = ['Day', 'Hour', 'Minute', 'Second'];
  partsEls = {};

  colorStyle = document.createElement('style');
  document.head.appendChild(colorStyle);

  updateStyle = function(){
    colorStyle.innerHTML = namespace + '-block { background: ' + options.color + ' !important}';
  };

  getTimeRemaining = function(deadline) {
    var remaining = Date.parse(deadline) - Date.parse(new Date());
    return {
      remaining: remaining,
      Day: Math.max(0, Math.floor(remaining / (1000 * 60 * 60 * 24))),
      Hour: Math.max(0, Math.floor((remaining / (1000 * 60 * 60)) % 24)),
      Minute: Math.max(0, Math.floor((remaining / 1000 / 60) % 60)),
      Second: Math.max(0, Math.floor((remaining / 1000) % 60))
    };
  };

  createEl = function(type) {
    return document.createElement(namespace + (type ? '-' + type : ''));
  };

  createPart = function(part) {
    var block, number, label;
    block = createEl('block');
    number = createEl('number');
    label = createEl('label');
    block.appendChild(number);
    block.appendChild(label);
    return {
      block: block,
      number: number,
      label: label
    };
  };

  update = function() {
    var remaining, i;
    remaining = getTimeRemaining(options.deadline);
    for (i = 0; i < parts.length; i++) {
      partsEls[parts[i]].number.innerHTML = remaining[parts[i]] || 0;
      partsEls[parts[i]].label.innerHTML = remaining[parts[i]] === 1 ? parts[i] : parts[i] + 's';
    }

    partsEls.Day.number.setAttribute('data-' + namespace + '-digits', (remaining.Day + '').length);
  };

  init = function() {
    var el, i;
    el = createEl();
    for (i = 0; i < parts.length; i++) {
      partsEls[parts[i]] = createPart(parts[i]);
      el.appendChild(partsEls[parts[i]].block);
    }

    element = Eager.createElement(options.location, element).appendChild(el);
    update();
    updateStyle();

    if (interval){
      clearInterval(interval);
    }
    interval = setInterval(function(){
      update();

      if (getTimeRemaining(options.deadline).total <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  document.addEventListener('DOMContentLoaded', init);

  setOptions = function(opts) {
    options = opts;

    init();
  };

  INSTALL_SCOPE = {
    setOptions: setOptions
  };
})();
