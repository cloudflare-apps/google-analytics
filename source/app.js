(function () {
  var options = INSTALL_OPTIONS

  if (!options.id) return

  function queue (callback) {
    if ('addEventListener' in window) {
      window.addEventListener('load', callback, false)
    } else {
      window.attachEvent('onload', callback)
    }
  }

  function resolveParameter (uri, parameter) {
    if (uri) {
      var parameters = uri.split('#')[0].match(/[^?=&]+=([^&]*)?/g)

      for (var i = 0, chunk; chunk = parameters[i]; ++i) {
        if (chunk.indexOf(parameter) === 0) {
          return unescape(chunk.split('=')[1])
        }
      }
    }
  }

  window.ga('create', options.id, 'auto')
  window.ga('set', 'forceSSL', true)
  window.ga('send', 'pageview')

  if (options.social) {
    queue(function () {
      var FB = window.FB
      var twttr = window.twttr

      if ('FB' in window && 'Event' in FB && 'subscribe' in window.FB.Event) {
        FB.Event.subscribe('edge.create', function (targetUrl) {
          window.ga('send', 'social', 'facebook', 'like', {page: targetUrl})
        })

        FB.Event.subscribe('edge.remove', function (targetUrl) {
          window.ga('send', 'social', 'facebook', 'unlike', {page: targetUrl})
        })

        FB.Event.subscribe('message.send', function (targetUrl) {
          window.ga('send', 'social', 'facebook', 'send', {page: targetUrl})
        })
      }

      if ('twttr' in window && 'events' in twttr && 'bind' in twttr.events) {
        twttr.events.bind('tweet', function (event) {
          if (event) {
            var targetUrl

            if (event.target && event.target.nodeName === 'IFRAME') {
              targetUrl = resolveParameter(event.target.src, 'url')
            }

            window.ga('send', 'social', 'twitter', 'tweet', {page: targetUrl})
          }
        })
      }
    })
  }
}())
