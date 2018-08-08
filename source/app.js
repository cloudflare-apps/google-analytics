(function() {
  var options = INSTALL_OPTIONS;
  var id;

  if (options.account && options.organization) {
    id = options["web-properties-for-" + options.organization];
  } else {
    id = (options.id || "").trim();
  }

  if (!id) {
    console.log("Cloudflare Google Analytics: Disabled. UA-ID not present.");
    return;
  } else if (INSTALL_ID === "preview") {
    console.log("Cloudflare Google Analytics: Enabled", id);
  }

  function resolveParameter(uri, parameter) {
    if (uri) {
      var parameters = uri.split("#")[0].match(/[^?=&]+=([^&]*)?/g);

      for (var i = 0, chunk; (chunk = parameters[i]); ++i) {
        if (chunk.indexOf(parameter) === 0) {
          return unescape(chunk.split("=")[1]);
        }
      }
    }
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  gtag("js", new Date());
  gtag("config", id);
  gtag("set", { anonymizeIp: options.anonymizeIp });

  var vendorScript = document.createElement("script");
  vendorScript.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
  document.head.appendChild(vendorScript);

  if (options.social) {
    window.addEventListener(
      "load",
      function googleAnalyticsSocialTracking() {
        var FB = window.FB;
        var twttr = window.twttr;

        if ("FB" in window && "Event" in FB && "subscribe" in window.FB.Event) {
          FB.Event.subscribe("edge.create", function(targetUrl) {
            gtag("event", "share", {
              method: "facebook",
              event_action: "like",
              content_id: targetUrl
            });
          });

          FB.Event.subscribe("edge.remove", function(targetUrl) {
            gtag("event", "share", {
              method: "facebook",
              event_action: "unlike",
              content_id: targetUrl
            });
          });

          FB.Event.subscribe("message.send", function(targetUrl) {
            gtag("event", "share", {
              method: "facebook",
              event_action: "send",
              content_id: targetUrl
            });
          });
        }

        if ("twttr" in window && "events" in twttr && "bind" in twttr.events) {
          twttr.events.bind("tweet", function(event) {
            if (event) {
              var targetUrl;

              if (event.target && event.target.nodeName === "IFRAME") {
                targetUrl = resolveParameter(event.target.src, "url");
              }

              gtag("event", "share", {
                method: "twitter",
                event_action: "tweet",
                content_id: targetUrl
              });
            }
          });
        }
      },
      false
    );
  }
})();
