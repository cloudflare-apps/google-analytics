(function () {
  var options = INSTALL_OPTIONS
  var domain = options.showDomain && options.domain ? options.domain : 'auto'

  if (!options.id) return

  window.ga('create', options.id, domain, 'cfapp')
  window.ga('cfapp.send', 'pageview')
}())
