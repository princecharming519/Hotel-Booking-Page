! function() {
 function CustomStyle() {
  this.selectors = ["#livechat-badge", "#livechat-full", "#livechat-compact-container", "#livechat-eye-catcher", "#livechat-compact-view"], this.parseMobileCss = function(e, t) {
   e = e.replace(/\/\*[^*]*\*+([^\/*][^*]*\*+)*\//gi, "");
   var n = function(e, t) {
     t = t || 0;
     var i, o, r, a;
     return -1 !== (i = e.indexOf("}", t)) && (o = e.substr(0, i + 1), r = o.match(/{/g) && o.match(/{/g).length || 0, a = o.match(/}/g) && o.match(/}/g).length || 0, r !== a ? n(e, o.length) : o = o.substr(o.indexOf("{") + 1, o.lastIndexOf("}") - o.indexOf("{") - 1))
    },
    i = -1;
   return -1 !== (i = e.indexOf("@livechat-mobile")) && (e = e.substr(i, e.length + 1 - i), cuttedCustomStyle = n(e), cuttedCustomStyle)
  }, this.appendStyle = function(e) {
   var t = document.createElement("style");
   t.type = "text/css", t.styleSheet ? t.styleSheet.cssText = e : t.appendChild(document.createTextNode(e)), document.getElementsByTagName("head")[0].appendChild(t)
  }, this.cssProperties = function(e, t, n, i) {
   if ("string" == typeof e && (e = document.getElementById(e)), e || e instanceof HTMLElement) {
    var o = CSSStyleDeclaration.prototype.setProperty ? "setProperty" : "setAttribute";
    if ("[object Object]" === Object.prototype.toString.call(t))
     for (var r in t) i ? e.style[o](r, t[r]) : e.style[o](r, t[r], "important");
    else {
     if (null === n || void 0 === n) return e.style.getPropertyValue(t);
     i ? (e.style[o](t, null), e.style[o](t, n)) : e.style[o](t, n, "important")
    }
    return e
   }
  }, this.parseCss = function(e) {
   var t;
   if (-1 !== e.indexOf("prevent_parsing_custom_css")) return !1;
   try {
    e = e.replace(/\/\*[^*]*\*+([^\/*][^*]*\*+)*\//gi, ""), t = this.parseMobileCss(e), Mobile.isNewMobile() || (e = e.replace(t, ""));
    for (var n, i, o, r = -1, a = -1, s = 0; s < this.selectors.length; s++) n = e.indexOf(this.selectors[s]), i = e.lastIndexOf(this.selectors[s]), -1 !== n && (-1 === r || n < r) && (r = n), -1 !== i && i > a && (a = i);
    if (o = e.indexOf("}", a), -1 === o && (o = e.length), -1 === r) return !1;
    e = e.substr(r, o + 1 - r);
    var c = /{([^}]*)}/gm,
     l = e.replace(c, "$%^");
    l = l.replace(/\@media[^\}]*\}[^\}]*\}/, ""), l = l.replace(/(\[([^\]])*\])/gi, function(e) {
     return e = e.replace(/\,/g, "*@!")
    });
    for (var u = l.split("$%^"), d = "", f = "", h = "", p = "", _ = 0; _ < u.length; _++) {
     d = u[_];
     for (var m = 0; m < this.selectors.length; m++)
      if (-1 !== d.indexOf(this.selectors[m]) && (f = e.substr(e.indexOf(d), e.length + 1), f.length > 1)) {
       h = d.split(",");
       for (var g = 0; g < h.length; g++) - 1 !== h[g].indexOf(this.selectors[m]) && (f = f.replace(/(\r\n|\n|\r)/gm, "").match(/{(.*?)}/)[0], p = p + h[g] + f)
      }
    }
    if ("" !== p) {
     if (-1 !== p.indexOf("transform")) {
      for (var v = p.split(";"), s = 0; s < v.length; s++) - 1 !== v[s].indexOf("transform") && -1 === v[s].indexOf("text-transform") && (v[s] = v[s] + "!important");
      p = v.join(";")
     }
     return this.appendStyle(p), !0
    }
    return !1
   } catch (t) {
    return Events.track("chat_window", "CSS parse error: " + e), !1
   }
  }
 }

 function $(e) {
  return document.getElementById(e)
 }

 function isDestkopSafari() {
  var e = window.navigator && window.navigator.userAgent && window.navigator.userAgent.toLowerCase();
  return !(!e || -1 === e.indexOf("safari") || -1 !== e.indexOf("chrome") || -1 !== e.indexOf("mobile"))
 }

 function LiveChat(config) {
  this.lang_sent_phrases = null, this.embedded_chat_hidden_by_api = !1, this.invoked_callbacks = {}, this.is_main_window = !1, this.EMBEDDED_LOADED = 0, this.httpp = "https://", this.location = encodeURIComponent(document.location), this.INVITATION_NONE = 0, this.INVITATION_STANDARD = 1, this.INVITATION_AUTO = 2, this.INVITATION_PERSONAL = 3, this.current_invitation = this.INVITATION_NONE, this.$invitation_layer = !1, this.$invitation_image = !1, this.$overlay = !1, this.conf = config, this.invitation_layer_id = "lc_invite_layer", this.private_invite_script_id = "LC_Private_Invite", this.auto_invite_script_id = "LC_Auto_Invite", this.invite_layer = "lc_invite_layer", this.is_popped_out = !1, this.destinationSkillChosen = null, this.msie = /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent), this.msie_version = !!this.msie && function() {
   var e = navigator.userAgent,
    t = e.indexOf("MSIE ");
   return -1 == t ? 0 : parseFloat(e.substring(t + 5, e.indexOf(";", t)))
  }(), this.embeddedWindowSupported = !0, window.postMessage || (this.embeddedWindowSupported = !1), this.conf.overlay.id = "lc_overlay_layer", this.chat_id = null, this.animationTimeout = null, this.standard_invite_html = '<div style="position:relative">', this.standard_invite_html += '<a style="display:block;position:absolute;top:0;right:0;width:70px;height:25px;cursor:pointer;background:url(//cdn.livechatinc.com/img/pixel.gif)" href="javascript:void(0)" onclick="LC_Invite.lc_popup_close()"></a>', this.standard_invite_html += '<a href="javascript:void(0)" onclick="LC_Invite.lc_open_chat(\'manual\')" style="display:block;cursor:pointer;"><img src="' + this.httpp + this.conf.invite_img_name + '" id="lc_standard_invitation_img" border="0" alt="" style="display:block"></a>', this.standard_invite_html += "</div>", this.text_buttons_queue = [], this.init_location_change_observer = function() {
   var e = this;
   if (!0 === __lc.embedded_in_iframe) return !1;
   __lc.wix ? Wix.addEventListener(Wix.Events.PAGE_NAVIGATION, function(t) {
    Wix.getSiteInfo(function(t) {
     Loader.pageData.title = t.siteTitle, Loader.pageData.url = t.url, e.update_page_address()
    })
   }) : setInterval(function() {
    var t = document.location.toString();
    t !== Loader.pageData.url && (Loader.pageData.title = document.title, Loader.pageData.url = t, e.update_page_address())
   }, 2e3)
  }, this.update_page_address = function() {
   Pinger.set_force_reload(!0).ping()
  }, this.verifyDomain = function() {
   if (!this.conf.domain_whitelist || 0 === this.conf.domain_whitelist.length) return !0;
   if (parent !== window) {
    var e;
    if (e = document.referrer ? UrlsUtils.removeProtocolFromURL(Utils.extractDomain(document.referrer)) : Utils.get(window, "top.location.hostname"), !1 === Utils.checkDomainWhitelist(this.conf.domain_whitelist, e)) return !1
   }
   return !1 !== Utils.checkDomainWhitelist(this.conf.domain_whitelist, location.hostname)
  }, this.init = function() {
   return !!this.verifyDomain() && (-1 !== Utils.inArray(__lc.license, [100000334, 100000006, 7188861, 6463811]) && (this.statusChecker = StatusChecker, this.statusChecker.init({
    hostname: __lc.hostname,
    protocol: Loader.protocol,
    licence: config.lic,
    checkRatio: this.conf.global_properties.status_check_ratio
   }), config.client_limit_exceeded && this.statusChecker.startChecking()), this.setupIntegrations(), Pinger.isInited() ? this.pinger.setConfig(this.conf) : (this.pinger = Pinger.init({
    config: this.conf,
    app: this,
    minimized: Minimized,
    loaderInfo: Loader,
    chatBetweenGroups: __lc.chat_between_groups,
    hostname: __lc.hostname,
    skill: __lc.skill,
    visitorEmail: __lc.visitor && __lc.visitor.email,
    scriptVersion: __lc_script_version,
    embedded: !0,
    statusChecker: this.statusChecker,
    pingRatio: this.conf.global_properties.ping_ratio,
    newWebserv: Loader.requestsDistributor && Loader.requestsDistributor.ping
   }).set_force_reload(!0), this.pinger.ping()), this.lookup_custom_variables(), Chat.init(), EyeCatcher.init(this.conf), this.display_chat_buttons(), NotifyChild.chat_reloaded ? void(Mobile.isNewMobile() && Mobile.onMinimizeChatWindow()) : (this.load_embedded_window(), this.init_location_change_observer(), NotifyChild.init(), this.prepare_elements(), (LC_API.mobile_is_detected() || LC_API.new_mobile_is_detected()) && Mobile.preloadSound(), void this.bindWindowEvents()))
  }, this.sendLangPhrasesToEmbedded = function(e) {
   if (!1 === LC_API.embedded_chat_enabled()) return !1;
   null == e && (e = this.lang_sent_phrases), NotifyChild.send("language_phrases;" + JSON.stringify(e)), this.lang_sent_phrases = e
  }, this.sendWindowConfigToEmbedded = function(e) {
   Loader.correctRegion && NotifyChild.send("region;" + Loader.correctRegion);
   var t = "window_config;" + encodeURIComponent(JSON.stringify(__config_response));
   e && (t += ";" + encodeURIComponent(JSON.stringify(e))), NotifyChild.send(t), NotifyChild.send("is_new_mobile;" + encodeURIComponent(Mobile.isNewMobile()))
  }, this.setLangPhrasesForMinimized = function() {
   Minimized.setLangPhrases(this.conf.localization_basic)
  }, this.prepare_elements = function() {
   var e, t;
   document.getElementsByTagName("body")[0];
   e = document.createElement("div"), e.setAttribute("id", this.invitation_layer_id), e.style.textAlign = "left", this.$invitation_layer = e, t = this.$invitation_layer.style, t.display = "none", t.zIndex = 16777261, DOM.appendToBody(this.$invitation_layer);
   var e = document.createElement("div");
   e.setAttribute("id", this.conf.overlay.id), this.$overlay = e, t = this.$overlay.style, t.backgroundColor = this.conf.overlay.color, t.position = "fixed", t.left = 0, t.top = 0, t.zIndex = 16777260, t.display = "none", t.width = "100%", t.height = "100%", DOM.appendToBody(this.$overlay)
  }, this.lookup_custom_variables = function() {
   return "string" != typeof __lc_params || (0 == __lc_params.length || void this.set_custom_variables(__lc_params))
  }, this.embedded_chat_enabled = function() {
   return __lc_settings.embedded.enabled
  }, this.embedded_hide_when_offline = function() {
   return !0 !== this.destinationSkillChosen && (!this.getVisitorInteraction() && __lc_settings.embedded.hide_when_offline)
  }, this.display_chat_buttons = function() {
   if (document.querySelectorAll) {
    var i, j, len, len2, DOMButtons, DOMButton, DOMButtonID, availableButtons, button, text, url;
    for (availableButtons = LC_Invite.conf.buttons, len2 = availableButtons.length, DOMButtons = document.querySelectorAll(".livechat_button"), i = 0, len = DOMButtons.length; i < len; i++)
     if (DOMButton = DOMButtons[i], DOMButtonID = DOMButton.getAttribute("data-id"), text = DOMButton.innerText || DOMButton.textContent, url = "", DOMButton.children[0] && DOMButton.children[0].href && (url = DOMButton.children[0].href), DOMButtonID)
      for (j = 0; j < len2; j++) button = availableButtons[j], button.id === DOMButtonID && ("image" === button.type ? DOM.innerHTML(DOMButton, '<a href="' + url + '" onclick="LC_API.open_chat_window({source:\'button\'});return false;"><img src="//' + button.value + '" alt="' + text + '" title="' + text + '"></a>') : "text" === button.type && DOM.innerHTML(DOMButton, '<a href="" onclick="LC_API.open_chat_window({source:\'button\'});return false;">' + button.value + "</a>"))
   }
   if ("undefined" == typeof __lc_buttons) {
    var self = this,
     wait_for_lc_buttons_counter = 0,
     wait_for_lc_buttons = function() {
      return ++wait_for_lc_buttons_counter > 20 || ("undefined" != typeof __lc_buttons ? (self.display_chat_buttons(), !0) : void setTimeout(function() {
       wait_for_lc_buttons()
      }, 500))
     };
    wait_for_lc_buttons()
   }
   var i, button, e, img, container, script, lc_onclick, lc_onclick_fn, buttonPath;
   if ("object" != typeof __lc_buttons || "number" != typeof __lc_buttons.length || 0 == __lc_buttons.length) return !0;
   for (i in __lc_buttons)
    if (__lc_buttons.hasOwnProperty(i) && (button = __lc_buttons[i], "string" == typeof button.elementId)) {
     if (button.language = button.language || null, button.language && 0 == /^[a-z]+$/.test(button.language) && (button.language = "en"), void 0 !== button.skill && 0 != /^[0-9]+$/.test(button.skill) || (button.skill = 0), button.skill = parseInt(button.skill, 10), void 0 === button.window && (button.window = {}), void 0 === button.window.width && (button.window.width = 530), void 0 === button.window.height && (button.window.height = 520), null == (container = $(button.elementId))) return !0;
     void 0 !== button.link && 0 == button.link && (container.innerHTML = ""), void 0 === button.type && (button.type = "graphical");
     var urlOpts = {};
     urlOpts.groups = button.skill, void 0 !== button.params && (urlOpts.params = unescape(button.params)), void 0 !== button.name ? urlOpts.name = unescape(button.name) : "" !== __lc_settings.nick && "$" !== __lc_settings.nick && (urlOpts.name = __lc_settings.nick), "" !== __lc_settings.email && (urlOpts.email = __lc_settings.email), void 0 !== button.autologin && 1 == button.autologin && (urlOpts.autologin = 1);
     var that = this,
      url = Loader.getChatUrl(urlOpts, {
       force_ssl: !0,
       include_current_page_address: !0
      });
     switch (lc_onclick = "if (LC_API.mobile_is_detected()) { LC_API.open_mobile_window({skill:" + button.skill + "}); } else if (LC_API.embedded_chat_supported() && LC_API.embedded_chat_enabled()) { LC_API.show_full_view({skill:" + button.skill + ",source:'button'}); } else { LC_Invite.windowRef = window.open('" + url + "','Chat_" + this.conf.lic + "','width=" + button.window.width + ",height=" + button.window.height + ",resizable=yes,scrollbars=no'); }", button.type) {
      case "text":
       this.text_buttons_queue.push({
        button: button,
        container: container,
        lc_onclick: lc_onclick + ";return false"
       });
       break;
      default:
       var buttonContainerName = button.elementId + "_button",
        oldButton = $(buttonContainerName);
       oldButton && container.removeChild(oldButton), DOM.innerHTML(container, '<div id="' + buttonContainerName + '"></div>' + container.innerHTML), container = $(button.elementId + "_button");
       var children = $(button.elementId).childNodes;
       if (void 0 !== children[1] && "A" == children[1].nodeName && (children[1].style.fontFamily = "Tahoma,sans-serif", children[1].style.fontSize = "11px", children[1].style.lineHeight = "16px", children[1].style.textDecoration = "none", children[1].setAttribute("target", "_blank")), void 0 !== children[2] && "SPAN" == children[2].nodeName && (children[2].style.fontFamily = "Tahoma,sans-serif", children[2].style.fontSize = "11px", children[2].style.lineHeight = "16px", children[2].style.color = "#333"), e = document.createElement("a"), e.setAttribute("id", button.elementId + "_btn"), e.setAttribute("href", Loader.getChatUrl({
         groups: button.skill
        }, {
         force_ssl: !0
        })), e.setAttribute("target", "chat_" + this.conf.lic + "_" + this.conf.serv), function(button, url) {
         var onclick_fn, skill, onclick = lc_onclick;
         skill = button.skill, onclick_fn = function() {
          LC_API.mobile_is_detected() ? LC_API.open_mobile_window({
           skill: skill
          }) : LC_API.embedded_chat_supported() && LC_API.embedded_chat_enabled() ? LC_API.show_full_view({
           skill: skill,
           source: "button"
          }) : LC_Invite.windowRef = window.open(url, "Chat_" + LC_Invite.conf.lic, "width=" + button.window.width + ",height=" + button.window.height + ",resizable=yes,scrollbars=no")
         }, this.msie && this.msie_version < 8 ? e.setAttribute("onclick", function() {
          return eval(onclick), !1
         }) : (!1 === this.msie && e.setAttribute("onclick", onclick + ";return false;"), e.onclick = function() {
          return onclick_fn(), !1
         })
        }(button, url), container.appendChild(e), img = document.createElement("img"), buttonPath = "", this.conf.skills.length > 0)
        for (j = 0; j < this.conf.skills.length; j++) this.conf.skills[j].id === button.skill && (buttonPath = "offline" === this.conf.skills[j].status ? "//" + UrlsUtils.convertUrlToCdn(this.conf.skills[j].chat_button.offline_url) : "//" + UrlsUtils.convertUrlToCdn(this.conf.skills[j].chat_button.online_url));
       if ("" === buttonPath) {
        var langParamInUrl = button.language ? "lang=" + button.language + decodeURIComponent("%26") : "";
        buttonPath = "https://" + this.conf.serv + "/licence/" + this.conf.lic + "/button.cgi?" + langParamInUrl + "groups=" + button.skill + decodeURIComponent("%26") + "d=" + (new Date).getTime()
       }
       img.src = buttonPath, img.alt = "LiveChat", img.style.border = "0", e = $(button.elementId + "_btn"), e.appendChild(img)
     }
    }
   this.runTextButtonsQueue()
  }, this.runTextButtonsQueue = function() {
   if (0 == this.text_buttons_queue.length) return !0;
   var e = LC_Invite;
   e.lc_text_link = null;
   var t = function() {
    function t() {
     this.display = function() {
      var e;
      if ("undefined" == typeof LC_Status || "wait" === LC_Status) return !1;
      clearInterval(this.interval), this.interval = null, void 0 === this.button.labels && (this.button.labels = {}), void 0 === this.button.labels.online && (this.button.labels.online = escape("LiveChat online")), void 0 === this.button.labels.offline && (this.button.labels.offline = escape("Leave a message")), void 0 === this.button.labels.callback && (this.button.labels.callback = escape("Leave a message. We'll call you back.")), void 0 === this.button.labels.voice && (this.button.labels.voice = escape("Callback available")), "online" == LC_Status ? e = this.button.labels.online : "offline" == LC_Status ? e = this.button.labels.offline : "callback" == LC_Status ? e = this.button.labels.callback : "voice" == LC_Status && (e = this.button.labels.voice), e = unescape(e), DOM.innerHTML(this.container, '<a href="#" onclick="' + this.lc_onclick + '">' + e + "</a>")
     }
    }
    var n;
    if (null === e.lc_text_link || null === e.lc_text_link.interval) {
     if (0 == e.text_buttons_queue.length) return clearInterval(e.process_button_interval), e.process_button_interval = null, !0;
     var i = e.text_buttons_queue.shift();
     LC_Status = "wait"
    }
    if (void 0 === i) return !0;
    script = document.createElement("script"), script.type = "text/javascript", script.async = !0, script.src = e.httpp + e.conf.serv + "/licence/" + e.conf.lic + "/buttontype.cgi?groups=" + i.button.skill, n = document.getElementsByTagName("script")[0], n.parentNode.insertBefore(script, n), e.lc_text_link = new t, e.lc_text_link.button = i.button, e.lc_text_link.container = i.container, e.lc_text_link.lc_onclick = i.lc_onclick, e.lc_text_link.interval = setInterval(function() {
     e.lc_text_link.display()
    }, 30)
   };
   e.process_button_interval = setInterval(function() {
    t()
   }, 100)
  }, this.setEmbeddedLoaded = function() {
   this.EMBEDDED_LOADED = 1
  }, this.getEmbeddedLoaded = function() {
   return this.EMBEDDED_LOADED
  }, this.set_custom_variables = function(e) {
   var t;
   if (!1 === (t = CustomVariablesParser.parse(e))) return !1;
   this.conf.lc.params = t, NotifyChild.send("params;" + encodeURIComponent(this.conf.lc.params)), Pinger.set_force_reload(!0).ping()
  }, this.check_if_invitation_allowed = function(e) {
   return !0 !== LC_API.chat_window_maximized() && (e > this.current_invitation || e == this.current_invitation && e != this.INVITATION_STANDARD)
  }, this.load_standard_invitation = function() {
   return !0 === LC_API.embedded_chat_enabled() ? this.chat_ended ? (function(e, t) {
    t = t || {}, void 0 !== e ? NotifyChild.send("start_chat;" + encodeURIComponent(e)) : NotifyChild.send("start_chat"), !1 !== Mobile.isDetected() || t.ignoreOpening || LC_Invite.open_chat_window()
   }(void 0, {
    ignoreOpening: !0
   }), !0) : (LC_API.start_chat(), !0) : 0 != this.check_if_invitation_allowed(this.INVITATION_STANDARD) && (this.current_invitation = this.INVITATION_STANDARD, AnalyticsIntegrations.trackPageView("Standard greeting", {
    nonInteraction: !0,
    onlyMainWindow: !1
   }), void this.display_invitation(this.standard_invite_html, this.conf.position))
  }, this.load_personal_invitation = function(e) {
   if (!0 === LC_API.embedded_chat_enabled()) this.current_invitation = this.INVITATION_PERSONAL;
   else {
    if (0 == this.check_if_invitation_allowed(this.INVITATION_PERSONAL)) return !1;
    this.current_invitation = this.INVITATION_PERSONAL, AnalyticsIntegrations.trackPageView("Personal greeting")
   }
   window.PersonalInvitation.render(e)
  }, this.load_auto_invitation = function(e) {
   if (0 == this.check_if_invitation_allowed(this.INVITATION_AUTO)) return !1;
   this.current_invitation = this.INVITATION_AUTO, this.trackAndRenderAutoInvitation(e, {
    maximizeWindow: !0
   })
  }, this.trackAndRenderAutoInvitation = function(e, t) {
   !1 !== e.displayed_first_time && AnalyticsIntegrations.trackPageView("Automated greeting", {
    nonInteraction: !0,
    onlyMainWindow: !1
   }), window.AutoInvitation.render(e, t)
  }, this.show_overlay_layer = function() {
   this.$overlay.style.display = "block", this.overlay_fade_in()
  }, this.hide_overlay_layer = function() {
   this.$overlay.style.display = "none"
  }, this.show_invitation_layer = function(e, t) {
   if (0 == this.$invitation_image.complete) return setTimeout(function() {
    LC_Invite.show_invitation_layer(e, t)
   }, 50), !1;
   if ("left" == t.option && (t.option = "centered", t.arg1 = 0, t.arg2 = 0), this.conf.overlay.enabled = Boolean("centered" == t.option), this.$invitation_layer.style.display = "block", this.$invitation_layer.style.width = parseInt(this.$invitation_image.width) + "px", this.conf.overlay.enabled ? (this.$invitation_layer.style.marginLeft = "-" + parseInt(this.$invitation_image.width / 2) + "px", this.$invitation_layer.style.marginTop = "-" + parseInt(this.$invitation_image.height / 2) + "px") : (this.$invitation_layer.style.marginLeft = "0", this.$invitation_layer.style.marginTop = "0"), this.conf.overlay.enabled ? (this.show_overlay_layer(), this.$invitation_layer.style.position = "fixed", this.$invitation_layer.style.top = "50%", this.$invitation_layer.style.left = "50%", this.$invitation_layer.style.bottom = "") : (this.hide_overlay_layer(), this.$invitation_layer.style.position = "absolute", this.$invitation_layer.style.left = "", this.$invitation_layer.style.top = "", this.$invitation_layer.style.bottom = ""), this.$invitation_image.style.backgroundColor = "transparent", this.conf.overlay.enabled) return !1;
   var n = document,
    i = (n.documentElement, n.getElementById ? n.getElementById(e) : n.all ? n.all[e] : n.layers[e]),
    o = document.layers ? "" : "px";
   window[e + "_obj"] = i, n.layers && (i.style = i);
   var r = this;
   i.cx = i.sx = t.arg2, i.cy = i.sy = t.arg1, i.sP = function(e, n) {
    var i = -2 * t.arg1 + LC_Invite.getClientHeight() - r.$invitation_image.height;
    "topLeft" == t.option ? (this.style.left = e + o, this.style.top = n + o) : "topRight" == t.option ? (this.style.left = r.getClientWidth() - r.$invitation_image.width - e + o, this.style.top = n + o) : "topCenter" == t.option ? (this.style.top = n + o, this.style.left = "50%", this.style.marginLeft = -parseInt(r.$invitation_image.width / 2) + "px") : "bottomRight" == t.option ? (this.style.left = r.getClientWidth() - r.$invitation_image.width - e + o, this.style.top = n + i + o) : "bottomLeft" == t.option ? (this.style.top = n + i + o, this.style.left = e + o) : "bottomCenter" == t.option && (this.style.top = n + i + o, this.style.left = "50%", this.style.marginLeft = -parseInt(r.$invitation_image.width / 2) + "px")
   }, i.floatIt = function() {
    var e, t;
    e = this.sx >= 0 ? 0 : LC_Invite.getClientWidth(), t = LC_Invite.getScrollTop(), this.sy < 0 && (t += LC_Invite.getClientHeight()), this.cx += parseInt((e + this.sx - this.cx) / 8), this.cy += parseInt((t + this.sy - this.cy) / 8), this.sP(this.cx, this.cy), r.floatItTimeout = setTimeout(this.id + "_obj.floatIt()", 20)
   }, i.floatIt()
  }, this.lc_popup_hide = function() {
   this.$invitation_layer.style.display = "none", this.$overlay.style.display = "none", clearTimeout(this.floatItTimeout)
  }, this.lc_popup_close = function() {
   this.lc_popup_hide(), this.current_invitation = this.INVITATION_NONE, document.createElement("img").src = this.httpp + this.conf.serv + "/licence/" + this.conf.lic + "/tunnel.cgi?IWCS0014C^inviterefused^" + LC_API.get_visitor_id() + "^$^&rand=" + Math.floor(1e3 * Math.random())
  }, this.lc_open_chat = function(e, t) {
   var n, i;
   this.lc_popup_hide(), void 0 === e ? (NotifyChild.send("source_invitation"), e = "") : NotifyChild.send("source_invitation;" + encodeURIComponent(e)), void 0 === t && (t = this.conf.lc.groups), LC_API.embedded_chat_supported() && LC_API.embedded_chat_enabled() ? LC_API.show_full_view({
    source: "manual" === e ? "manual invitation" : "embedded invitation"
   }) : (i = {
    groups: t,
    timestamp: +new Date,
    trigger: e
   }, "" !== __lc_settings.nick && "$" !== __lc_settings.nick && (i.name = __lc_settings.nick), "" !== __lc_settings.email && "$" !== __lc_settings.email && (i.email = __lc_settings.email), n = Loader.getChatUrl(i, {
    force_ssl: !0,
    include_current_page_address: !0
   }), LC_Invite.windowRef = window.open(n, "Chat_" + this.conf.lic, "width=530,height=520,resizable=yes,scrollbars=no"))
  }, this.open_chat_window = function(e) {
   e = e || {}, "popup" === LC_API.get_window_type() || Mobile.isOldMobile() ? Mobile.isDetected() ? LC_API.open_mobile_window(e) : this.lc_open_chat() : Full.isLoaded() ? Mobile.isDetected() ? LC_API.open_mobile_window(e) : LC_API.show_full_view(e) : (Minimized.displayLoadingMessage(), Full.onAfterLoad(function() {
    LC_Invite.open_chat_window(e)
   }))
  }, this.open_mobile_window = function(e) {
   var t, e = e || {};
   if (LC_API.embedded_chat_supported() && !LC_API.agents_are_available() && !0 === this.embedded_hide_when_offline()) return !1;
   if (LC_API.embedded_chat_enabled() && Minimized.disableNewMessageNotification(), LC_API.new_mobile_is_detected()) return this.lc_open_chat();
   t = null != e.skill ? e.skill : this.conf.lc.groups;
   var n = {
    groups: t,
    mobile: 1
   };
   "" !== __lc_settings.nick && "$" !== __lc_settings.nick && (n.name = __lc_settings.nick), "" !== __lc_settings.email && "$" !== __lc_settings.email && (n.email = __lc_settings.email), url = Loader.getChatUrl(n, {
    force_ssl: !0,
    include_current_page_address: !0
   }), LC_Invite.windowRef = window.open(url, "Chat_" + this.conf.lic), NotifyChild.send("preload_sounds"), Mobile.playSound({
    preloadOnMobile: !0
   })
  }, this.getWindowDimensions = function() {
   return "CSS1Compat" !== document.compatMode && document.body.clientHeight ? [document.body.clientWidth, document.body.clientHeight] : [document.documentElement.clientWidth, document.documentElement.clientHeight]
  }, this.getClientWidth = function() {
   return this.getWindowDimensions()[0]
  }, this.getClientHeight = function() {
   return this.getWindowDimensions()[1]
  }, this.getScrollTop = function() {
   var e;
   return self.pageYOffset ? e = self.pageYOffset : document.documentElement && document.documentElement.scrollTop ? e = document.documentElement.scrollTop : document.body && (e = document.body.scrollTop), e
  }, this.display_invitation = function(e, t) {
   if ("undefined" != typeof LC_PrivateInvite && !0 === LC_API.embedded_chat_enabled()) {
    var n, i;
    return n = e.match(/id="div_greeting-message">((.|[\r\n])*?)<\/div>/), i = n[1], LC_API.start_chat(i), !0
   }
   if ("undefined" != typeof LC_AutoInvite && !0 === LC_API.embedded_chat_enabled()) {
    var n, o, r, a;
    return n = e.match(/lc_open_chat\('(.*?)', (.*?)\)/), o = n[1], r = n[2], "function" == typeof LC_AutoInvite.get_invitation_content ? a = LC_AutoInvite.get_invitation_content() : "function" == typeof LC_AutoInvite.construct_invite ? (a = LC_AutoInvite.construct_invite(), a = a.match(/div_greeting-message">(.*?)<\/div>/)[1] ? a.match(/div_greeting-message">(.*?)<\/div>/)[1] : "") : a = "", LC_API.display_embedded_invitation(a, o, r), !0
   }
   this.lc_popup_hide(), this.conf.overlay.enabled = Boolean("centered" == t.option), this.$invitation_layer.innerHTML = e;
   var s;
   this.current_invitation == this.INVITATION_STANDARD ? s = "lc_standard_invitation_img" : this.current_invitation == this.INVITATION_PERSONAL ? s = "lc_personal_invitation_img" : this.current_invitation == this.INVITATION_AUTO && (s = "lc_auto_invitation_img"), this.$invitation_image = $(s), this.show_invitation_layer(this.invitation_layer_id, t)
  }, this.overlay_fade_in = function() {
   var e = function(e) {
    var t = LC_Invite.$overlay.style;
    t.opacity = t.MozOpacity = t.KhtmlOpacity = e / 100, t.filter = "alpha(opacity=" + e + ")"
   };
   e(0);
   var t = parseInt(100 * this.conf.overlay.opacity),
    n = Math.abs((t - 0) / 5),
    i = function(o) {
     if (o > n) return void e(t);
     e(Math.ceil(0 + o / n * (t - 0))), ++o, setTimeout(function() {
      i(o)
     }, 40)
    };
   i(1)
  }, this.iframe_full_view_loaded = function() {}, this.load_embedded_window = function() {
   var e, t, n, i, o, r, a, s, c = this,
    l = function(e) {
     null == c.invoked_callbacks[e] && (c.invoked_callbacks[e] = !0, LC_API[e]())
    };
   if (!1 === LC_API.embedded_chat_supported()) return l("on_before_load"), !1;
   if (!1 === LC_API.embedded_chat_enabled()) return l("on_before_load"), !1;
   document.getElementsByTagName("body")[0];
   var u = this.conf.embedded.dimensions.width + "px",
    d = this.conf.embedded.dimensions.height + "px";
   if (n = document.createElement("div"), n.setAttribute("id", "livechat-full"), e = n.style, e.position = "fixed", e.bottom = "0", e.right = this.conf.embedded.dimensions.margin + "px", e.width = u, e.height = d, e.overflow = "hidden", e.visibility = "hidden", e.zIndex = "-1", e.background = "transparent", e.border = "0", e.transition = "transform .2s ease-in-out", e.WebkitTransition = "transform .2s ease-in-out", e.MozTransition = "transform .2s ease-in-out", e.OTransition = "transform .2s ease-in-out", e.MsTransition = "transform .2s ease-in-out", isDestkopSafari() && (e.transition = "transform 0s ease-in-out", e.WebkitTransition = "transform 0s ease-in-out", e.MozTransition = "transform 0s ease-in-out", e.OTransition = "transform 0s ease-in-out", e.MsTransition = "transform 0s ease-in-out"), !1 === Mobile.isDetected() && (e.webkitBackfaceVisibility = "hidden"), LC_API.mobile_is_detected() && !LC_API.new_mobile_is_detected() && (e.position = "absolute", e.top = "-9999em", e.left = "-9999em", e.bottom = "auto", e.right = "auto"), LC_API.new_mobile_is_detected() && (e.zIndex = "-1"), o = document.createElement("iframe"), o.setAttribute("src", __lc_iframe_src_hash), o.setAttribute("id", "livechat-full-view"), o.setAttribute("name", "livechat-full-view"), o.setAttribute("title", "LiveChat Widget"), o.setAttribute("scrolling", "no"), o.setAttribute("frameborder", "0"), o.setAttribute("allowtransparency", "true"), r = o.style, r.position = "absolute", r.top = "0", r.right = "0", r.bottom = "0", r.left = "0", r.width = "100%", r.height = "100%", r.border = "0", r.padding = "0", r.margin = "0", r.float = "none", r.background = "none", o.onload = LC_Invite.iframe_full_view_loaded, n.appendChild(o), i = document.createElement("div"), i.setAttribute("id", "livechat-compact-container"), t = i.style, t.position = "fixed", t.bottom = "0", t.right = this.conf.embedded.dimensions.margin + "px", t.width = this.conf.embedded.dimensions.width_minimized + "px", t.height = "53px", t.overflow = "hidden", t.visibility = "hidden", t.zIndex = "2147483639", t.background = "transparent", t.border = "0", t.transition = "transform .2s ease-in-out", t.WebkitTransition = "transform .2s ease-in-out", t.MozTransition = "transform .2s ease-in-out", t.OTransition = "transform .2s ease-in-out", t.MsTransition = "transform .2s ease-in-out", isDestkopSafari() && (t.transition = "transform 0s ease-in-out", t.WebkitTransition = "transform 0s ease-in-out", t.MozTransition = "transform 0s ease-in-out", t.OTransition = "transform 0s ease-in-out", t.MsTransition = "transform 0s ease-in-out"), !1 === Mobile.isDetected() && (t.webkitBackfaceVisibility = "hidden"), a = ["position: absolute", "display: block", "visibility: hidden", "height: 16px", "padding: 0 4px", "line-height: 16px", "background: #f00", "color: #fff", "font-size: 10px", "text-decoration: none", "font-family: 'Lucida Grande', 'Lucida Sans Unicode', Arial, Verdana, sans-serif", "border-radius: 3px", "box-shadow: 0 -1px 0px #f00, -1px 0 0px #f00, 1px 0 0px #f00, 0 1px 0px #f00, 0 0 2px #000", "border-top: 1px solid #f99"], -1 !== Utils.inArray(this.conf.chat_window.theme.name, ["modern", "postmodern", "minimal"]) && (a.push("width: 16px"), a.push("border-radius: 50%"), a.push("box-shadow: none"), a.push("border-top: 0"), a.push("padding: 0"), a.push("text-align: center"), a.push("font-family: 'Lato', sans-serif")), this.conf.group_properties.chat_window && "circle" === this.conf.group_properties.chat_window.theme.minimized ? (a.push("top: 23px"), a.push("right: 8px")) : (a.push("top: 12px"), a.push("left: 20px")), r = ["position: relative", "top: 20px", "left: 0", "width: 100%", "border: 0", "padding: 0", "margin: 0", "float: none", "background: none"], s = "about:blank", __lc.mute_csp_errors) {
    var f = function() {
     var e = document.getElementById("livechat-compact-view"),
      t = e && (e.contentWindow || e.contentDocument);
     if (!t) return void setTimeout(f, 300);
     var n = function(e) {
      e.preventDefault(), LC_API.show_full_view()
     };
     if (document.attachEvent) return void t.attachEvent("onclick", n);
     t.addEventListener("click", n, !0)
    };
    f()
   }
   i.innerHTML = '<iframe src="' + s + '" id="livechat-compact-view" style="' + r.join(";") + '" scrolling="no" frameborder="0" allowtransparency="true"></iframe><a id="livechat-badge" href="#" onclick="LC_API.show_full_view({source:\'minimized click\'});return false" style="' + a.join(";") + '"></a>';
   var h = this,
    p = function() {
     Minimized.init();
     var e = function(e) {
      EyeCatcher.setState("offline" === e ? "offline" : "online")
     };
     Minimized.setStateCallback(e)
    },
    _ = function() {
     var e;
     h.setLangPhrasesForMinimized(), h.embedded_chat_hidden_by_api = !1, Minimized.setLC2Theme(h.conf.chat_window.use_lc2_theme), Minimized.setTheme(h.conf.chat_window.theme.name, h.conf.chat_window.theme.color), h.conf.group_properties.chat_window && h.conf.group_properties.chat_window.theme.minimized && Minimized.setMinimizedTheme(h.conf.group_properties.chat_window.theme.minimized), Minimized.setOperatorsOnline("online" === h.conf.status);
     var t = new CustomStyle;
     if ("postmodern" !== h.conf.chat_window.theme.name || Mobile.isNewMobile() || (t.parseCss("#livechat-full {height: 440px !important;}"), NotifyChild.send("update_body_height")), "minimal" === h.conf.chat_window.theme.name && (t.parseCss("#livechat-full {width: 270px !important;height: 332px !important;}"), NotifyChild.send("update_body_height")), h.conf.chat_window.theme.skin_css) {
      var n = h.conf.chat_window.theme.skin_css;
      Mobile.isNewMobile() && (n = t.parseMobileCss(n)), NotifyChild.send("skin_css;" + h.conf.group_properties.chat_window.theme.skin_base + ";" + encodeURIComponent(n)), Minimized.setSkinCSS(n), t.parseCss(n) && NotifyChild.send("update_body_height")
     }
     if (h.conf.chat_window.theme.css && (!Minimized.useLC2Theme() || "0" !== h.conf.chat_window.theme.customized && !1 !== h.conf.chat_window.theme.customized)) {
      var i = h.conf.chat_window.theme.css;
      Mobile.isNewMobile() && (i = t.parseMobileCss(i)), i && (Minimized.setCustomCSS(i), NotifyChild.send("custom_css;" + encodeURIComponent(h.conf.chat_window.theme.css)), t.parseCss(i) && NotifyChild.send("update_body_height"))
     }
     return NotifyChild.send("mobile_input_blur"), e = $("livechat-compact-view"), e.setAttribute("title", "LiveChat Minimized Widget"), e = e.contentWindow || e.contentDocument, e = e.document || e, Minimized.onRender(function() {
      Mobile.isDetected() && Mobile.isiOS() && (window.addEventListener("focusin", function(e) {
       var t = e.target && e.target.type;
       t && -1 !== Utils.inArray(t, ["email", "text", "url", "search", "number", "date", "textarea"]) && !0 === LC_API.chat_window_minimized() && (Minimized.hiddenByInputFocus = !0, Minimized.hide())
      }), window.addEventListener("focusout", function(e) {
       Minimized.hiddenByInputFocus && Minimized.show()
      }))
     }), e && "complete" === e.readyState ? Minimized.render() : document.attachEvent ? $("livechat-compact-view").attachEvent("onload", function() {
      Minimized.render()
     }) : $("livechat-compact-view").onload = function() {
      Minimized.render()
     }, LC_API.new_mobile_is_detected() && Mobile.setWindowStyle(), "offline" !== h.conf.status || !0 !== h.embedded_hide_when_offline() || Chat.running() || Chat.waitingInQueue() ? !0 === h.embedded_chat_hidden_by_api ? (l("on_before_load"), !0) : void(h.conf.automatic_greeting || Chat.running() || Chat.waitingInQueue() || (l("on_before_load"), !0 !== h.embedded_chat_hidden_by_api && LC_API.minimize_chat_window({
      callAPI: !1
     }))) : (l("on_before_load"), LC_API.hide_chat_window(), !0)
    };
   DOM.appendToBody(i, function() {
    p(), _()
   }), EyeCatcher.appendToDOM(), DOM.appendToBody(n), Mobile.isNewMobile() && Mobile.initNewMobile()
  }, this.init_firefly = function(e) {
   var t, n, i;
   return e = e || {}, null != this.conf.integrations.firefly && (null != this.conf.integrations.firefly.api_key && (window.fireflyAPI = {}, fireflyAPI.ready = function(e) {
    "function" == typeof e && (e = [e]), fireflyAPI.onLoaded = fireflyAPI.onLoaded || [], fireflyAPI.isLoaded ? e.forEach(function(e) {
     e()
    }) : e.forEach(function(e) {
     fireflyAPI.onLoaded.push(e)
    })
   }, fireflyAPI.token = "5134be7651f9f4005600fb87", t = document.createElement("script"), t.type = "text/javascript", t.src = "https://firefly-071591.s3.amazonaws.com/scripts/loaders/loader.js", t.async = !0, n = document.getElementsByTagName("script")[0], n.parentNode.insertBefore(t, n), void(e.callback && (i = setInterval(function() {
    if (void 0 === window.fireflyAPI.set) return !1;
    clearInterval(i), e.callback()
   }, 300)))))
  }, this.bindWindowEvents = function() {
   var e = this;
   if (null == window.addEventListener) return !1;
   window.addEventListener("focus", function(e) {
    NotifyChild.send("window_focus")
   }, !1), window.addEventListener("blur", function(e) {
    NotifyChild.send("window_blur")
   }, !1), this.isFirefox() && window.addEventListener("beforeunload", function(t) {
    e.pageUnloaded = !0, Pinger.setPageUnloaded(!0)
   }, !1)
  }, this.isFirefox = function() {
   return navigator.userAgent && -1 !== navigator.userAgent.indexOf("Firefox")
  }, this.setupIntegrations = function() {
   null != this.conf.integrations.analytics && GoogleAnalytics.setEnabled(!0), null != this.conf.integrations.kissmetrics && Kissmetrics.setEnabled(!0), null != this.conf.integrations.mixpanel && Mixpanel.setEnabled(!0)
  }, this.setPingSent = function(e) {
   return this.setFlag("ping_sent", e), this
  }, this.wasPingSent = function() {
   return this._pingSent
  }, this.setConfig = function(e) {
   return this.conf = e, this
  }, this.setVisitorInteraction = function(e) {
   return this.setFlag("visitor_interaction", e), this
  }, this.getVisitorInteraction = function() {
   return this._visitor_interaction
  }, this.setFlag = function(e, t) {
   return this["_" + e] = t, Utils.makeItDone(function() {
    NotifyChild.send(e + ";" + t)
   }).when(function() {
    return Loader.is_iframe_loaded
   }), this
  }, this.hideChatWindow = function() {
   if (null === $("livechat-compact-container")) return !1;
   $("livechat-compact-container").style.visibility = "hidden", $("livechat-compact-container").style.opacity = 0, $("livechat-eye-catcher") && ($("livechat-eye-catcher").style.visibility = "hidden", $("livechat-eye-catcher").style.opacity = 0), $("livechat-full") && ($("livechat-full").style.visibility = "hidden", $("livechat-full").style.opacity = 0, $("livechat-full").style.zIndex = "-1"), $("livechat-badge") && ($("livechat-badge").style.visibility = "hidden", $("livechat-badge").style.opacity = 0), LC_API.on_chat_window_hidden(), NotifyChild.send("window_state;minimized")
  }, this.minimize_chat_window = function(e) {
   var e = e || {};
   if (null == e.callAPI && (e.callAPI = !0), null === $("livechat-compact-container")) return !1;
   if (Cookie.set("lc_window_state", "minimized"), $("livechat-compact-container").style.visibility = "visible", $("livechat-compact-container").style.opacity = 1, $("livechat-compact-container").style.zIndex = "2147483639", $("livechat-compact-container").style.transform = "translateY(0%)", $("livechat-eye-catcher") && LC_API.agents_are_available() && ($("livechat-eye-catcher").style.visibility = "visible", $("livechat-eye-catcher").style.opacity = 1), $("livechat-full")) {
    var t = window.getComputedStyle && getComputedStyle($("livechat-full")).transitionDuration || "200";
    t = -1 !== t.indexOf("ms") ? t.replace("ms", "") : -1 !== t.indexOf("s") ? 1e3 * t.replace("s", "") : 200, $("livechat-full").style.transform = "translateY(100%)", this.animationTimeout && clearTimeout(this.animationTimeout), this.animationTimeout = setTimeout(function() {
     $("livechat-full").style.visibility = "hidden", $("livechat-full").style.opacity = 0, $("livechat-full").style.zIndex = "-1"
    }, t)
   }
   "" != $("livechat-badge").innerHTML && ($("livechat-badge").style.visibility = "visible", $("livechat-badge").style.opacity = 1), e.callAPI && LC_API.on_chat_window_minimized(), NotifyChild.send("window_state;minimized"), Mobile.isNewMobile() && Mobile.onMinimizeChatWindow()
  }, this.show_full_view = function(e) {
   var t, n, i, o, r = !1;
   void 0 === e && (r = !0);
   var e = e || {};
   if (void 0 === e.skill && (e.skill = __lc_settings.lc.groups), e.skill = parseInt(e.skill, 10), null === $("livechat-compact-container")) return !1;
   if (Mobile.isNewMobile() && Mobile.onShowFullView(), Minimized.getState() !== Minimized.STATE_INVITATION_WITH_AGENT && Minimized.getState() !== Minimized.STATE_CHATTING || (Cookie.set("lc_invitation_opened", "opened"), Minimized.updateWindowHTML()), !LC_API.agents_are_available() && !0 === LC_Invite.embedded_hide_when_offline()) return !1;
   if (Cookie.set("lc_window_state", "full"), Minimized.newMessagesCounter = 0, $("livechat-badge").innerHTML = "", $("livechat-badge").style.visibility = "hidden", $("livechat-badge").style.opacity = 0, !1 === r && e.skill !== __lc_iframe_current_skill) e.skill = parseInt(e.skill, 10), __lc_iframe_current_skill = e.skill, __lc_iframe_src = Loader.getChatUrl({
    groups: __lc_iframe_current_skill,
    langSkillUpdated: 1,
    embedded: LC_Invite.embedded_chat_enabled() ? "1" : "0"
   }), __lc_iframe_src_hash = __lc_iframe_src + "#" + document.location.toString(), t = $("livechat-full-view"), LC_Invite.embedded_chat_hidden_by_api = !1, n = function() {
    Minimized.updateText(), NotifyChild.maximizeOnInit(!0), $("livechat-compact-container").style.visibility = "hidden", $("livechat-compact-container").style.opacity = 0, $("livechat-compact-container").style.zIndex = "2147483638", $("livechat-eye-catcher") && ($("livechat-eye-catcher").style.visibility = "hidden", $("livechat-eye-catcher").style.opacity = 0), $("livechat-full").style.visibility = "visible", $("livechat-full").style.opacity = 1, $("livechat-full").style.zIndex = "2147483639", $("livechat-full").style.transform = "translateY(0%)"
   }, LC_Invite.msie ? LC_Invite.iframe_full_view_loaded = n : t.onload = n, t.src ? t.src = __lc_iframe_src_hash : null !== t.contentWindow && null !== t.contentWindow.location ? t.contentWindow.location = __lc_iframe_src_hash : t.setAttribute("src", __lc_iframe_src_hash);
   else {
    Minimized.updateText(), i = "1", document.activeElement && document.activeElement.tagName && ("input" !== (o = String(document.activeElement.tagName).toLowerCase()) && "textarea" !== o || (i = "0")), NotifyChild.send("maximize;" + i + ";" + e.source), $("livechat-compact-container").style.transform = "translateY(100%)";
    var a = window.getComputedStyle && getComputedStyle($("livechat-full")).transitionDuration || "200";
    a = -1 !== a.indexOf("ms") ? a.replace("ms", "") : -1 !== a.indexOf("s") ? 1e3 * a.replace("s", "") : 200, this.animationTimeout && clearTimeout(this.animationTimeout), this.animationTimeout = setTimeout(function() {
     $("livechat-compact-container").style.visibility = "hidden", $("livechat-compact-container").style.opacity = 0, $("livechat-compact-container").style.zIndex = "-1"
    }, a), $("livechat-eye-catcher") && ($("livechat-eye-catcher").style.visibility = "hidden", $("livechat-eye-catcher").style.opacity = 0), $("livechat-full").style.visibility = "visible", $("livechat-full").style.opacity = 1, $("livechat-full").style.zIndex = "2147483639", $("livechat-full").style.transform = "translateY(0%)"
   }
   LC_API.on_chat_window_opened()
  }
 }
 var __define, __exports;
 if ("undefined" != typeof define && (__define = define, define = void 0), "undefined" != typeof exports && (__exports = exports, exports = void 0), void 0 !== window.__lc_inited) return !0;
 window.__lc_inited = 1;
 var __lc = window.__lc || window.__chatio || {};
 (function() {
  function e(t, i) {
   function r(e, t) {
    try {
     e()
    } catch (e) {
     t && t()
    }
   }

   function a(e) {
    if (null != a[e]) return a[e];
    var t;
    if ("bug-string-char-index" == e) t = "a" != "a" [0];
    else if ("json" == e) t = a("json-stringify") && a("date-serialization") && a("json-parse");
    else if ("date-serialization" == e) {
     if (t = a("json-stringify") && y) {
      var n = i.stringify;
      r(function() {
       t = '"-271821-04-20T00:00:00.000Z"' == n(new d(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == n(new d(864e13)) && '"-000001-01-01T00:00:00.000Z"' == n(new d(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == n(new d(-1))
      })
     }
    } else {
     var o, s = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
     if ("json-stringify" == e) {
      var n = i.stringify,
       u = "function" == typeof n;
      u && ((o = function() {
       return 1
      }).toJSON = o, r(function() {
       u = "0" === n(0) && "0" === n(new c) && '""' == n(new l) && n(v) === m && n(m) === m && n() === m && "1" === n(o) && "[1]" == n([o]) && "[null]" == n([m]) && "null" == n(null) && "[null,null,null]" == n([m, v, null]) && n({
        a: [o, !0, !1, null, "\0\b\n\f\r\t"]
       }) == s && "1" === n(null, o) && "[\n 1,\n 2\n]" == n([1, 2], null, 1)
      }, function() {
       u = !1
      })), t = u
     }
     if ("json-parse" == e) {
      var f, h = i.parse;
      "function" == typeof h && r(function() {
       0 !== h("0") || h(!1) || (o = h(s), (f = 5 == o.a.length && 1 === o.a[0]) && (r(function() {
        f = !h('"\t"')
       }), f && r(function() {
        f = 1 !== h("01")
       }), f && r(function() {
        f = 1 !== h("1.")
       })))
      }, function() {
       f = !1
      }), t = f
     }
    }
    return a[e] = !!t
   }

   function s(e) {
    return x(this)
   }
   t || (t = o.Object()), i || (i = o.Object());
   var c = t.Number || o.Number,
    l = t.String || o.String,
    u = t.Object || o.Object,
    d = t.Date || o.Date,
    f = t.SyntaxError || o.SyntaxError,
    h = t.TypeError || o.TypeError,
    p = t.Math || o.Math,
    _ = t.JSON || o.JSON;
   "object" == typeof _ && _ && (i.stringify = _.stringify, i.parse = _.parse);
   var m, g = u.prototype,
    v = g.toString,
    b = g.hasOwnProperty,
    y = new d(-0xc782b5b800cec);
   if (r(function() {
     y = -109252 == y.getUTCFullYear() && 0 === y.getUTCMonth() && 1 === y.getUTCDate() && 10 == y.getUTCHours() && 37 == y.getUTCMinutes() && 6 == y.getUTCSeconds() && 708 == y.getUTCMilliseconds()
    }), a["bug-string-char-index"] = a["date-serialization"] = a.json = a["json-stringify"] = a["json-parse"] = null, !a("json")) {
    var w = a("bug-string-char-index"),
     A = function(e, t) {
      var i, o, r, a = 0;
      (i = function() {
       this.valueOf = 0
      }).prototype.valueOf = 0, o = new i;
      for (r in o) b.call(o, r) && a++;
      return i = o = null, a ? A = function(e, t) {
       var n, i, o = "[object Function]" == v.call(e);
       for (n in e) o && "prototype" == n || !b.call(e, n) || (i = "constructor" === n) || t(n);
       (i || b.call(e, n = "constructor")) && t(n)
      } : (o = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"], A = function(e, t) {
       var i, r, a = "[object Function]" == v.call(e),
        s = !a && "function" != typeof e.constructor && n[typeof e.hasOwnProperty] && e.hasOwnProperty || b;
       for (i in e) a && "prototype" == i || !s.call(e, i) || t(i);
       for (r = o.length; i = o[--r]; s.call(e, i) && t(i));
      }), A(e, t)
     };
    if (!a("json-stringify") && !a("date-serialization")) {
     var I = {
       92: "\\\\",
       34: '\\"',
       8: "\\b",
       12: "\\f",
       10: "\\n",
       13: "\\r",
       9: "\\t"
      },
      C = function(e, t) {
       return ("000000" + (t || 0)).slice(-e)
      },
      x = function(e) {
       var t, n, i, o, r, a, s, c, l;
       if (y) t = function(e) {
        n = e.getUTCFullYear(), i = e.getUTCMonth(), o = e.getUTCDate(), a = e.getUTCHours(), s = e.getUTCMinutes(), c = e.getUTCSeconds(), l = e.getUTCMilliseconds()
       };
       else {
        var u = p.floor,
         d = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
         f = function(e, t) {
          return d[t] + 365 * (e - 1970) + u((e - 1969 + (t = +(t > 1))) / 4) - u((e - 1901 + t) / 100) + u((e - 1601 + t) / 400)
         };
        t = function(e) {
         for (o = u(e / 864e5), n = u(o / 365.2425) + 1970 - 1; f(n + 1, 0) <= o; n++);
         for (i = u((o - f(n, 0)) / 30.42); f(n, i + 1) <= o; i++);
         o = 1 + o - f(n, i), r = (e % 864e5 + 864e5) % 864e5, a = u(r / 36e5) % 24, s = u(r / 6e4) % 60, c = u(r / 1e3) % 60, l = r % 1e3
        }
       }
       return (x = function(e) {
        return e > -1 / 0 && e < 1 / 0 ? (t(e), e = (n <= 0 || n >= 1e4 ? (n < 0 ? "-" : "+") + C(6, n < 0 ? -n : n) : C(4, n)) + "-" + C(2, i + 1) + "-" + C(2, o) + "T" + C(2, a) + ":" + C(2, s) + ":" + C(2, c) + "." + C(3, l) + "Z", n = i = o = a = s = c = l = null) : e = null, e
       })(e)
      };
     if (a("json-stringify") && !a("date-serialization")) {
      var M = i.stringify;
      i.stringify = function(e, t, n) {
       var i = d.prototype.toJSON;
       d.prototype.toJSON = s;
       var o = M(e, t, n);
       return d.prototype.toJSON = i, o
      }
     } else {
      var T = function(e) {
        var t = e.charCodeAt(0),
         n = I[t];
        return n || "\\u00" + C(2, t.toString(16))
       },
       k = /[\x00-\x1f\x22\x5c]/g,
       L = function(e) {
        return k.lastIndex = 0, '"' + (k.test(e) ? e.replace(k, T) : e) + '"'
       },
       S = function(e, t, n, i, o, a, s) {
        var c, l, u, f, p, _, g, b, y;
        if (r(function() {
          c = t[e]
         }), "object" == typeof c && c && (c.getUTCFullYear && "[object Date]" == v.call(c) && c.toJSON === d.prototype.toJSON ? c = x(c) : "function" == typeof c.toJSON && (c = c.toJSON(e))), n && (c = n.call(t, e, c)), c == m) return c === m ? c : "null";
        switch (l = typeof c, "object" == l && (u = v.call(c)), u || l) {
         case "boolean":
         case "[object Boolean]":
          return "" + c;
         case "number":
         case "[object Number]":
          return c > -1 / 0 && c < 1 / 0 ? "" + c : "null";
         case "string":
         case "[object String]":
          return L("" + c)
        }
        if ("object" == typeof c) {
         for (g = s.length; g--;)
          if (s[g] === c) throw h();
         if (s.push(c), f = [], b = a, a += o, "[object Array]" == u) {
          for (_ = 0, g = c.length; _ < g; _++) p = S(_, c, n, i, o, a, s), f.push(p === m ? "null" : p);
          y = f.length ? o ? "[\n" + a + f.join(",\n" + a) + "\n" + b + "]" : "[" + f.join(",") + "]" : "[]"
         } else A(i || c, function(e) {
          var t = S(e, c, n, i, o, a, s);
          t !== m && f.push(L(e) + ":" + (o ? " " : "") + t)
         }), y = f.length ? o ? "{\n" + a + f.join(",\n" + a) + "\n" + b + "}" : "{" + f.join(",") + "}" : "{}";
         return s.pop(), y
        }
       };
      i.stringify = function(e, t, i) {
       var o, r, a, s;
       if (n[typeof t] && t)
        if ("[object Function]" == (s = v.call(t))) r = t;
        else if ("[object Array]" == s) {
        a = {};
        for (var c, l = 0, u = t.length; l < u; c = t[l++], ("[object String]" == (s = v.call(c)) || "[object Number]" == s) && (a[c] = 1));
       }
       if (i)
        if ("[object Number]" == (s = v.call(i))) {
         if ((i -= i % 1) > 0)
          for (o = "", i > 10 && (i = 10); o.length < i; o += " ");
        } else "[object String]" == s && (o = i.length <= 10 ? i : i.slice(0, 10));
       return S("", (c = {}, c[""] = e, c), r, a, o, "", [])
      }
     }
    }
    if (!a("json-parse")) {
     var O, E, P = l.fromCharCode,
      z = {
       92: "\\",
       34: '"',
       47: "/",
       98: "\b",
       116: "\t",
       110: "\n",
       102: "\f",
       114: "\r"
      },
      D = function() {
       throw O = E = null, f()
      },
      N = function() {
       for (var e, t, n, i, o, r = E, a = r.length; O < a;) switch (o = r.charCodeAt(O)) {
        case 9:
        case 10:
        case 13:
        case 32:
         O++;
         break;
        case 123:
        case 125:
        case 91:
        case 93:
        case 58:
        case 44:
         return e = w ? r.charAt(O) : r[O], O++, e;
        case 34:
         for (e = "@", O++; O < a;)
          if ((o = r.charCodeAt(O)) < 32) D();
          else if (92 == o) switch (o = r.charCodeAt(++O)) {
          case 92:
          case 34:
          case 47:
          case 98:
          case 116:
          case 110:
          case 102:
          case 114:
           e += z[o], O++;
           break;
          case 117:
           for (t = ++O, n = O + 4; O < n; O++)(o = r.charCodeAt(O)) >= 48 && o <= 57 || o >= 97 && o <= 102 || o >= 65 && o <= 70 || D();
           e += P("0x" + r.slice(t, O));
           break;
          default:
           D()
         } else {
          if (34 == o) break;
          for (o = r.charCodeAt(O), t = O; o >= 32 && 92 != o && 34 != o;) o = r.charCodeAt(++O);
          e += r.slice(t, O)
         }
         if (34 == r.charCodeAt(O)) return O++, e;
         D();
        default:
         if (t = O, 45 == o && (i = !0, o = r.charCodeAt(++O)), o >= 48 && o <= 57) {
          for (48 == o && (o = r.charCodeAt(O + 1)) >= 48 && o <= 57 && D(), i = !1; O < a && (o = r.charCodeAt(O)) >= 48 && o <= 57; O++);
          if (46 == r.charCodeAt(O)) {
           for (n = ++O; n < a && (o = r.charCodeAt(n)) >= 48 && o <= 57; n++);
           n == O && D(), O = n
          }
          if (101 == (o = r.charCodeAt(O)) || 69 == o) {
           for (o = r.charCodeAt(++O), 43 != o && 45 != o || O++, n = O; n < a && (o = r.charCodeAt(n)) >= 48 && o <= 57; n++);
           n == O && D(), O = n
          }
          return +r.slice(t, O)
         }
         i && D();
         var s = r.slice(O, O + 4);
         if ("true" == s) return O += 4, !0;
         if ("fals" == s && 101 == r.charCodeAt(O + 4)) return O += 5, !1;
         if ("null" == s) return O += 4, null;
         D()
       }
       return "$"
      },
      B = function(e) {
       var t, n;
       if ("$" == e && D(), "string" == typeof e) {
        if ("@" == (w ? e.charAt(0) : e[0])) return e.slice(1);
        if ("[" == e) {
         for (t = [];
          "]" != (e = N());) n ? "," == e ? "]" == (e = N()) && D() : D() : n = !0, "," == e && D(), t.push(B(e));
         return t
        }
        if ("{" == e) {
         for (t = {};
          "}" != (e = N());) n ? "," == e ? "}" == (e = N()) && D() : D() : n = !0, "," != e && "string" == typeof e && "@" == (w ? e.charAt(0) : e[0]) && ":" == N() || D(), t[e.slice(1)] = B(N());
         return t
        }
        D()
       }
       return e
      },
      j = function(e, t, n) {
       var i = R(e, t, n);
       i === m ? delete e[t] : e[t] = i
      },
      R = function(e, t, n) {
       var i, o = e[t];
       if ("object" == typeof o && o)
        if ("[object Array]" == v.call(o))
         for (i = o.length; i--; j(o, i, n));
        else A(o, function(e) {
         j(o, e, n)
        });
       return n.call(e, t, o)
      };
     i.parse = function(e, t) {
      var n, i;
      return O = 0, E = "" + e, n = B(N()), "$" != N() && D(), O = E = null, t && "[object Function]" == v.call(t) ? R((i = {}, i[""] = n, i), "", t) : n
     }
    }
   }
   return i.runInContext = e, i
  }
  var t = "function" == typeof define && define.amd,
   n = {
    function: !0,
    object: !0
   },
   i = n[typeof exports] && exports && !exports.nodeType && exports,
   o = n[typeof window] && window || this,
   r = i && n[typeof module] && module && !module.nodeType && "object" == typeof global && global;
  if (!r || r.global !== r && r.window !== r && r.self !== r || (o = r), i && !t) e(o, i);
  else {
   var a = o.JSON,
    s = o.JSON3,
    c = !1,
    l = e(o, o.JSON3 = {
     noConflict: function() {
      return c || (c = !0, o.JSON = a, o.JSON3 = s, a = s = null), l
     }
    });
   o.JSON = {
    parse: l.parse,
    stringify: l.stringify
   }
  }
  t && define(function() {
   return l
  })
 }).call(this);
 var json3 = JSON3.noConflict();
 if ("undefined" == typeof JSON3) try {
  delete JSON3
 } catch (e) {}
 var JSON = {
   nativeRegex: /native code/,
   stringifyWith: function(e, t, n) {
    var i = Array.prototype.toJSON;
    delete Array.prototype.toJSON;
    var o = e.apply(t, n);
    return i && (Array.prototype.toJSON = i), o
   },
   stringify: function() {
    return this.nativeRegex.test(window.JSON.stringify) ? this.stringifyWith(window.JSON.stringify, window.JSON, arguments) : this.stringifyWith(json3.stringify, json3, arguments)
   },
   parse: function() {
    return this.nativeRegex.test(window.JSON.parse) ? window.JSON.parse.apply(window.JSON, arguments) : json3.parse.apply(json3, arguments)
   }
  },
  LC3 = function() {
   "use strict";

   function e(e) {
    return null == e ? void 0 === e ? F : U : $ && $ in Object(e) ? function(e) {
     var t = B.call(e, R),
      n = e[R];
     try {
      var i = !(e[R] = void 0)
     } catch (e) {}
     var o = j.call(e);
     return i && (t ? e[R] = n : delete e[R]), o
    }(e) : W.call(e)
   }

   function t(n, i, o) {
    function r() {
     h === f && (h = f.slice())
    }

    function a() {
     return d
    }

    function s(e) {
     if ("function" != typeof e) throw Error("Expected listener to be a function.");
     var t = !0;
     return r(), h.push(e),
      function() {
       if (t) {
        t = !1, r();
        var n = h.indexOf(e);
        h.splice(n, 1)
       }
      }
    }

    function c(t) {
     if (! function(t) {
       if (null == (n = t) || "object" != typeof n || e(t) != q) return !1;
       var n, i = H(t);
       if (null === i) return !0;
       var o = G.call(i, "constructor") && i.constructor;
       return "function" == typeof o && o instanceof o && V.call(o) == J
      }(t)) throw Error("Actions must be plain objects. Use custom middleware for async actions.");
     if (void 0 === t.type) throw Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');
     if (p) throw Error("Reducers may not dispatch actions.");
     try {
      p = !0, d = u(d, t)
     } finally {
      p = !1
     }
     for (var n = f = h, i = 0; i < n.length; i++)(0, n[i])();
     return t
    }
    var l;
    if ("function" == typeof i && void 0 === o && (o = i, i = void 0), void 0 !== o) {
     if ("function" != typeof o) throw Error("Expected the enhancer to be a function.");
     return o(t)(n, i)
    }
    if ("function" != typeof n) throw Error("Expected the reducer to be a function.");
    var u = n,
     d = i,
     f = [],
     h = f,
     p = !1;
    return c({
     type: X.INIT
    }), (l = {
     dispatch: c,
     subscribe: s,
     getState: a,
     replaceReducer: function(e) {
      if ("function" != typeof e) throw Error("Expected the nextReducer to be a function.");
      u = e, c({
       type: X.INIT
      })
     }
    })[Q] = function() {
     var e, t = s;
     return (e = {
      subscribe: function(e) {
       function n() {
        e.next && e.next(a())
       }
       if ("object" != typeof e) throw new TypeError("Expected the observer to be an object.");
       return n(), {
        unsubscribe: t(n)
       }
      }
     })[Q] = function() {
      return this
     }, e
    }, l
   }

   function n() {
    for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    return 0 === t.length ? function(e) {
     return e
    } : 1 === t.length ? t[0] : t.reduce(function(e, t) {
     return function() {
      return e(t.apply(void 0, arguments))
     }
    })
   }

   function i(e, t) {
    return e(t = {
     exports: {}
    }, t.exports), t.exports
   }

   function o(e, t) {
    return 2 == t ? function(t, n) {
     return e(t, n)
    } : function(t) {
     return e(t)
    }
   }

   function r(e) {
    for (var t = e ? e.length : 0, n = Array(t); t--;) n[t] = e[t];
    return n
   }

   function a(e, t) {
    return function() {
     var n = arguments.length;
     if (n) {
      for (var i = Array(n); n--;) i[n] = arguments[n];
      var o = i[0] = t.apply(void 0, i);
      return e.apply(void 0, i), o
     }
    }
   }

   function s(e) {
    this.__wrapped__ = e, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = 4294967295, this.__views__ = []
   }

   function c(e, t) {
    this.__wrapped__ = e, this.__actions__ = [], this.__chain__ = !!t, this.__index__ = 0, this.__values__ = void 0
   }

   function l(e) {
    if (pt(e) && !ht(e) && !(e instanceof st)) {
     if (e instanceof ft) return e;
     if (gt.call(e, "__wrapped__")) return mt(e)
    }
    return new ft(e)
   }

   function u(e) {
    var t = -1,
     n = null == e ? 0 : e.length;
    for (this.clear(); ++t < n;) {
     var i = e[t];
     this.set(i[0], i[1])
    }
   }

   function d(e) {
    var t = -1,
     n = null == e ? 0 : e.length;
    for (this.clear(); ++t < n;) {
     var i = e[t];
     this.set(i[0], i[1])
    }
   }

   function f(e) {
    var t = -1,
     n = null == e ? 0 : e.length;
    for (this.clear(); ++t < n;) {
     var i = e[t];
     this.set(i[0], i[1])
    }
   }

   function h(e) {
    var t = this.__data__ = new Kn(e);
    this.size = t.size
   }

   function p(e, t, n) {
    var i = dn(e, xo, void 0, void 0, void 0, void 0, void 0, t = n ? void 0 : t);
    return i.placeholder = p.placeholder, i
   }

   function _(e) {
    var t = -1,
     n = null == e ? 0 : e.length;
    for (this.__data__ = new mi; ++t < n;) this.add(e[t])
   }

   function m(e, t) {
    if ("function" != typeof e || null != t && "function" != typeof t) throw new TypeError(rr);
    var n = function() {
     var i = arguments,
      o = t ? t.apply(this, i) : i[0],
      r = n.cache;
     if (r.has(o)) return r.get(o);
     var a = e.apply(this, i);
     return n.cache = r.set(o, a) || r, a
    };
    return n.cache = new(m.Cache || mi), n
   }

   function g(e) {
    return -1 !== e.toLowerCase().indexOf("mobile") ? ta : "DESKTOP"
   }

   function v(e, t) {
    return t.style.getPropertyValue(e)
   }

   function b(e, t) {
    Va(e).forEach(function(e) {
     t.style.setProperty(e[0], e[1])
    })
   }

   function y(e, t) {
    var n, i, o = e.subscribe(function() {
     e.getState().app.setUp && (o(), e.getState().view.hidden || b(ec, t))
    });
    Zs(e, t), n = e, i = ea(), n.dispatch(Us(i)), setInterval(function() {
     var e = ea();
     Xs(i, e) || n.dispatch(Us(i = e))
    }, 2e3)
   }

   function w() {}

   function A(e) {
    if (!(this instanceof A)) throw new TypeError("Promises must be constructed via new");
    if ("function" != typeof e) throw new TypeError("not a function");
    this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], k(e, this)
   }

   function I(e, t) {
    for (; 3 === e._state;) e = e._value;
    0 !== e._state ? (e._handled = !0, A._immediateFn(function() {
     var n = 1 === e._state ? t.onFulfilled : t.onRejected;
     if (null !== n) {
      var i;
      try {
       i = n(e._value)
      } catch (n) {
       return void x(t.promise, n)
      }
      C(t.promise, i)
     } else(1 === e._state ? C : x)(t.promise, e._value)
    })) : e._deferreds.push(t)
   }

   function C(e, t) {
    try {
     if (t === e) throw new TypeError("A promise cannot be resolved with itself.");
     if (t && ("object" == typeof t || "function" == typeof t)) {
      var n = t.then;
      if (t instanceof A) return e._state = 3, e._value = t, void M(e);
      if ("function" == typeof n) return void k((i = n, o = t, function() {
       i.apply(o, arguments)
      }), e)
     }
     e._state = 1, e._value = t, M(e)
    } catch (t) {
     x(e, t)
    }
    var i, o
   }

   function x(e, t) {
    e._state = 2, e._value = t, M(e)
   }

   function M(e) {
    2 === e._state && 0 === e._deferreds.length && A._immediateFn(function() {
     e._handled || A._unhandledRejectionFn(e._value)
    });
    for (var t = 0, n = e._deferreds.length; t < n; t++) I(e, e._deferreds[t]);
    e._deferreds = null
   }

   function T(e, t, n) {
    this.onFulfilled = "function" == typeof e ? e : null, this.onRejected = "function" == typeof t ? t : null, this.promise = n
   }

   function k(e, t) {
    var n = !1;
    try {
     e(function(e) {
      n || (n = !0, C(t, e))
     }, function(e) {
      n || (n = !0, x(t, e))
     })
    } catch (e) {
     if (n) return;
     n = !0, x(t, e)
    }
   }

   function L(e, t, n, i) {
    var o = n.getState();
    if (yc[e]) switch (e) {
     case dc:
      for (var r in t) t.hasOwnProperty(r) && i.on(r, t[r]);
      break;
     case hc:
      if (Qa(o) === ta) return;
      var a = "FAKE_AUTHOR_ID_" + Xr();
      if (Ka(o)) {
       var s = document.getElementById("chatio-container");
       s.style.width = "360px", s.style.height = "185px"
      }
      n.dispatch(Ds({
       message: {
        author_id: a,
        id: Xr(),
        text: t.message,
        thread_id: Xr(),
        timestamp: +new Date,
        type: lc
       },
       user: ne({}, t.user, {
        id: a,
        type: t.user.type || uc
       }),
       tag: t.tag,
       saga: !0
      }));
      break;
     case fc:
      n.dispatch(t);
      break;
     case pc:
      n.dispatch(Ns(t));
      break;
     case _c:
      if (!n.getState().app.loaded) return void
      function e() {
       return setTimeout(function() {
        n.getState().app.loaded ? Za(o) || n.dispatch(js()) : e()
       }, 100)
      }();
      Za(o) || n.dispatch(js());
      break;
     case mc:
      Ka(o) || n.dispatch(Rs());
      break;
     case gc:
      n.dispatch(Fs());
      break;
     case bc:
      n.dispatch($s(t));
      break;
     case vc:
      n.dispatch(Bs(t))
    }
   }
   var S, O, E, P = "object" == typeof global && global && global.Object === Object && global,
    z = "object" == typeof self && self && self.Object === Object && self,
    D = (P || z || Function("return this")()).Symbol,
    N = Object.prototype,
    B = N.hasOwnProperty,
    j = N.toString,
    R = D ? D.toStringTag : void 0,
    W = Object.prototype.toString,
    U = "[object Null]",
    F = "[object Undefined]",
    $ = D ? D.toStringTag : void 0,
    H = (S = Object.getPrototypeOf, O = Object, function(e) {
     return S(O(e))
    }),
    q = "[object Object]",
    V = Function.prototype.toString,
    G = Object.prototype.hasOwnProperty,
    J = V.call(Object);
   E = "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof module ? module : Function("return this")();
   var Y, K, Z, Q = ("function" == typeof(K = E.Symbol) ? K.observable ? Y = K.observable : (Y = K("observable"), K.observable = Y) : Y = "@@observable", Y),
    X = {
     INIT: "@@redux/INIT"
    },
    ee = Object.assign || function(e) {
     for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i])
     }
     return e
    },
    te = function() {
     return !!__lc.preview
    },
    ne = Object.assign || function(e) {
     for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i])
     }
     return e
    },
    ie = {
     loaded: !1,
     setUp: !!te(),
     ready: !1
    },
    oe = "HIDE_CHAT_WINDOW",
    re = "EYE_GRABBER_CLOSED",
    ae = "EYE_GRABBER_FIRST_VISIT",
    se = "EYE_GRABBER_TIMER_COMPLETED",
    ce = "MAXIMIZE_CHAT_WINDOW",
    le = "MINIMIZE_CHAT_WINDOW",
    ue = "REVEAL_CHAT_WINDOW",
    de = "SET_CUSTOMER_DETAILS",
    fe = "SET_ENVIRONMENT_PROPERTY",
    he = "SET_LICENSE_SETTINGS",
    pe = "CHAT_WINDOW_MAXIMIZED",
    _e = "CHAT_WINDOW_MINIMIZED",
    me = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {},
    ge = i(function(e, t) {
     t.aliasToReal = {
      each: "forEach",
      eachRight: "forEachRight",
      entries: "toPairs",
      entriesIn: "toPairsIn",
      extend: "assignIn",
      extendAll: "assignInAll",
      extendAllWith: "assignInAllWith",
      extendWith: "assignInWith",
      first: "head",
      conforms: "conformsTo",
      matches: "isMatch",
      property: "get",
      __: "placeholder",
      F: "stubFalse",
      T: "stubTrue",
      all: "every",
      allPass: "overEvery",
      always: "constant",
      any: "some",
      anyPass: "overSome",
      apply: "spread",
      assoc: "set",
      assocPath: "set",
      complement: "negate",
      compose: "flowRight",
      contains: "includes",
      dissoc: "unset",
      dissocPath: "unset",
      dropLast: "dropRight",
      dropLastWhile: "dropRightWhile",
      equals: "isEqual",
      identical: "eq",
      indexBy: "keyBy",
      init: "initial",
      invertObj: "invert",
      juxt: "over",
      omitAll: "omit",
      nAry: "ary",
      path: "get",
      pathEq: "matchesProperty",
      pathOr: "getOr",
      paths: "at",
      pickAll: "pick",
      pipe: "flow",
      pluck: "map",
      prop: "get",
      propEq: "matchesProperty",
      propOr: "getOr",
      props: "at",
      symmetricDifference: "xor",
      symmetricDifferenceBy: "xorBy",
      symmetricDifferenceWith: "xorWith",
      takeLast: "takeRight",
      takeLastWhile: "takeRightWhile",
      unapply: "rest",
      unnest: "flatten",
      useWith: "overArgs",
      where: "conformsTo",
      whereEq: "isMatch",
      zipObj: "zipObject"
     }, t.aryMethod = {
      1: ["assignAll", "assignInAll", "attempt", "castArray", "ceil", "create", "curry", "curryRight", "defaultsAll", "defaultsDeepAll", "floor", "flow", "flowRight", "fromPairs", "invert", "iteratee", "memoize", "method", "mergeAll", "methodOf", "mixin", "nthArg", "over", "overEvery", "overSome", "rest", "reverse", "round", "runInContext", "spread", "template", "trim", "trimEnd", "trimStart", "uniqueId", "words", "zipAll"],
      2: ["add", "after", "ary", "assign", "assignAllWith", "assignIn", "assignInAllWith", "at", "before", "bind", "bindAll", "bindKey", "chunk", "cloneDeepWith", "cloneWith", "concat", "conformsTo", "countBy", "curryN", "curryRightN", "debounce", "defaults", "defaultsDeep", "defaultTo", "delay", "difference", "divide", "drop", "dropRight", "dropRightWhile", "dropWhile", "endsWith", "eq", "every", "filter", "find", "findIndex", "findKey", "findLast", "findLastIndex", "findLastKey", "flatMap", "flatMapDeep", "flattenDepth", "forEach", "forEachRight", "forIn", "forInRight", "forOwn", "forOwnRight", "get", "groupBy", "gt", "gte", "has", "hasIn", "includes", "indexOf", "intersection", "invertBy", "invoke", "invokeMap", "isEqual", "isMatch", "join", "keyBy", "lastIndexOf", "lt", "lte", "map", "mapKeys", "mapValues", "matchesProperty", "maxBy", "meanBy", "merge", "mergeAllWith", "minBy", "multiply", "nth", "omit", "omitBy", "overArgs", "pad", "padEnd", "padStart", "parseInt", "partial", "partialRight", "partition", "pick", "pickBy", "propertyOf", "pull", "pullAll", "pullAt", "random", "range", "rangeRight", "rearg", "reject", "remove", "repeat", "restFrom", "result", "sampleSize", "some", "sortBy", "sortedIndex", "sortedIndexOf", "sortedLastIndex", "sortedLastIndexOf", "sortedUniqBy", "split", "spreadFrom", "startsWith", "subtract", "sumBy", "take", "takeRight", "takeRightWhile", "takeWhile", "tap", "throttle", "thru", "times", "trimChars", "trimCharsEnd", "trimCharsStart", "truncate", "union", "uniqBy", "uniqWith", "unset", "unzipWith", "without", "wrap", "xor", "zip", "zipObject", "zipObjectDeep"],
      3: ["assignInWith", "assignWith", "clamp", "differenceBy", "differenceWith", "findFrom", "findIndexFrom", "findLastFrom", "findLastIndexFrom", "getOr", "includesFrom", "indexOfFrom", "inRange", "intersectionBy", "intersectionWith", "invokeArgs", "invokeArgsMap", "isEqualWith", "isMatchWith", "flatMapDepth", "lastIndexOfFrom", "mergeWith", "orderBy", "padChars", "padCharsEnd", "padCharsStart", "pullAllBy", "pullAllWith", "rangeStep", "rangeStepRight", "reduce", "reduceRight", "replace", "set", "slice", "sortedIndexBy", "sortedLastIndexBy", "transform", "unionBy", "unionWith", "update", "xorBy", "xorWith", "zipWith"],
      4: ["fill", "setWith", "updateWith"]
     }, t.aryRearg = {
      2: [1, 0],
      3: [2, 0, 1],
      4: [3, 2, 0, 1]
     }, t.iterateeAry = {
      dropRightWhile: 1,
      dropWhile: 1,
      every: 1,
      filter: 1,
      find: 1,
      findFrom: 1,
      findIndex: 1,
      findIndexFrom: 1,
      findKey: 1,
      findLast: 1,
      findLastFrom: 1,
      findLastIndex: 1,
      findLastIndexFrom: 1,
      findLastKey: 1,
      flatMap: 1,
      flatMapDeep: 1,
      flatMapDepth: 1,
      forEach: 1,
      forEachRight: 1,
      forIn: 1,
      forInRight: 1,
      forOwn: 1,
      forOwnRight: 1,
      map: 1,
      mapKeys: 1,
      mapValues: 1,
      partition: 1,
      reduce: 2,
      reduceRight: 2,
      reject: 1,
      remove: 1,
      some: 1,
      takeRightWhile: 1,
      takeWhile: 1,
      times: 1,
      transform: 2
     }, t.iterateeRearg = {
      mapKeys: [1],
      reduceRight: [1, 0]
     }, t.methodRearg = {
      assignInAllWith: [1, 0],
      assignInWith: [1, 2, 0],
      assignAllWith: [1, 0],
      assignWith: [1, 2, 0],
      differenceBy: [1, 2, 0],
      differenceWith: [1, 2, 0],
      getOr: [2, 1, 0],
      intersectionBy: [1, 2, 0],
      intersectionWith: [1, 2, 0],
      isEqualWith: [1, 2, 0],
      isMatchWith: [2, 1, 0],
      mergeAllWith: [1, 0],
      mergeWith: [1, 2, 0],
      padChars: [2, 1, 0],
      padCharsEnd: [2, 1, 0],
      padCharsStart: [2, 1, 0],
      pullAllBy: [2, 1, 0],
      pullAllWith: [2, 1, 0],
      rangeStep: [1, 2, 0],
      rangeStepRight: [1, 2, 0],
      setWith: [3, 1, 2, 0],
      sortedIndexBy: [2, 1, 0],
      sortedLastIndexBy: [2, 1, 0],
      unionBy: [1, 2, 0],
      unionWith: [1, 2, 0],
      updateWith: [3, 1, 2, 0],
      xorBy: [1, 2, 0],
      xorWith: [1, 2, 0],
      zipWith: [1, 2, 0]
     }, t.methodSpread = {
      assignAll: {
       start: 0
      },
      assignAllWith: {
       start: 0
      },
      assignInAll: {
       start: 0
      },
      assignInAllWith: {
       start: 0
      },
      defaultsAll: {
       start: 0
      },
      defaultsDeepAll: {
       start: 0
      },
      invokeArgs: {
       start: 2
      },
      invokeArgsMap: {
       start: 2
      },
      mergeAll: {
       start: 0
      },
      mergeAllWith: {
       start: 0
      },
      partial: {
       start: 1
      },
      partialRight: {
       start: 1
      },
      without: {
       start: 1
      },
      zipAll: {
       start: 0
      }
     }, t.mutate = {
      array: {
       fill: !0,
       pull: !0,
       pullAll: !0,
       pullAllBy: !0,
       pullAllWith: !0,
       pullAt: !0,
       remove: !0,
       reverse: !0
      },
      object: {
       assign: !0,
       assignAll: !0,
       assignAllWith: !0,
       assignIn: !0,
       assignInAll: !0,
       assignInAllWith: !0,
       assignInWith: !0,
       assignWith: !0,
       defaults: !0,
       defaultsAll: !0,
       defaultsDeep: !0,
       defaultsDeepAll: !0,
       merge: !0,
       mergeAll: !0,
       mergeAllWith: !0,
       mergeWith: !0
      },
      set: {
       set: !0,
       setWith: !0,
       unset: !0,
       update: !0,
       updateWith: !0
      }
     }, t.placeholder = {
      bind: !0,
      bindKey: !0,
      curry: !0,
      curryRight: !0,
      partial: !0,
      partialRight: !0
     }, t.realToAlias = function() {
      var e = Object.prototype.hasOwnProperty,
       n = t.aliasToReal,
       i = {};
      for (var o in n) {
       var r = n[o];
       e.call(i, r) ? i[r].push(o) : i[r] = [o]
      }
      return i
     }(), t.remap = {
      assignAll: "assign",
      assignAllWith: "assignWith",
      assignInAll: "assignIn",
      assignInAllWith: "assignInWith",
      curryN: "curry",
      curryRightN: "curryRight",
      defaultsAll: "defaults",
      defaultsDeepAll: "defaultsDeep",
      findFrom: "find",
      findIndexFrom: "findIndex",
      findLastFrom: "findLast",
      findLastIndexFrom: "findLastIndex",
      getOr: "get",
      includesFrom: "includes",
      indexOfFrom: "indexOf",
      invokeArgs: "invoke",
      invokeArgsMap: "invokeMap",
      lastIndexOfFrom: "lastIndexOf",
      mergeAll: "merge",
      mergeAllWith: "mergeWith",
      padChars: "pad",
      padCharsEnd: "padEnd",
      padCharsStart: "padStart",
      propertyOf: "get",
      rangeStep: "range",
      rangeStepRight: "rangeRight",
      restFrom: "rest",
      spreadFrom: "spread",
      trimChars: "trim",
      trimCharsEnd: "trimEnd",
      trimCharsStart: "trimStart",
      zipAll: "zip"
     }, t.skipFixed = {
      castArray: !0,
      flow: !0,
      flowRight: !0,
      iteratee: !0,
      mixin: !0,
      rearg: !0,
      runInContext: !0
     }, t.skipRearg = {
      add: !0,
      assign: !0,
      assignIn: !0,
      bind: !0,
      bindKey: !0,
      concat: !0,
      difference: !0,
      divide: !0,
      eq: !0,
      gt: !0,
      gte: !0,
      isEqual: !0,
      lt: !0,
      lte: !0,
      matchesProperty: !0,
      merge: !0,
      multiply: !0,
      overArgs: !0,
      partial: !0,
      partialRight: !0,
      propertyOf: !0,
      random: !0,
      range: !0,
      rangeRight: !0,
      subtract: !0,
      zip: !0,
      zipObject: !0,
      zipObjectDeep: !0
     }
    }),
    ve = {},
    be = Array.prototype.push,
    ye = function e(t, n, i, s) {
     function c(e, t) {
      if (v.cap) {
       var n = ge.iterateeRearg[e];
       if (n) return a = n, h(t, function(e) {
        var t, n = a.length;
        return t = D(o(e, n), a), 2 == n ? function(e, n) {
         return t.apply(void 0, arguments)
        } : function(e) {
         return t.apply(void 0, arguments)
        }
       });
       var i = !m && ge.iterateeAry[e];
       if (i) return r = i, h(t, function(e) {
        return "function" == typeof e ? o(e, r) : e
       })
      }
      var r, a;
      return t
     }

     function l(e, t, n) {
      if (v.fixed && (y || !ge.skipFixed[e])) {
       var i = ge.methodSpread[e],
        o = i && i.start;
       return void 0 === o ? x(t, n) : (r = t, a = o, function() {
        for (var e = arguments.length, t = e - 1, n = Array(e); e--;) n[e] = arguments[e];
        var i = n[a],
         o = n.slice(0, a);
        return i && be.apply(o, i), a != t && be.apply(o, n.slice(a + 1)), r.apply(this, o)
       })
      }
      var r, a;
      return t
     }

     function u(e, t, n) {
      return v.rearg && 1 < n && (w || !ge.skipRearg[e]) ? D(t, ge.methodRearg[e] || ge.aryRearg[n]) : t
     }

     function d(e, t) {
      for (var n = -1, i = (t = B(t)).length, o = i - 1, r = T(Object(e)), a = r; null != a && ++n < i;) {
       var s = t[n],
        c = a[s];
       null == c || E(c) || O(c) || P(c) || (a[s] = T(n == o ? c : Object(c))), a = a[s]
      }
      return r
     }

     function f(t, n) {
      var i = ge.aliasToReal[t] || t,
       o = ge.remap[i] || i,
       r = s;
      return function(t) {
       var a = m ? I : C,
        s = m ? I[o] : n,
        c = M(M({}, r), t);
       return e(a, i, s, c)
      }
     }

     function h(e, t) {
      return function() {
       var n = arguments.length;
       if (!n) return e();
       for (var i = Array(n); n--;) i[n] = arguments[n];
       var o = v.rearg ? 0 : n - 1;
       return i[o] = t(i[o]), e.apply(void 0, i)
      }
     }

     function p(e, t) {
      var n, i, o = ge.aliasToReal[e] || e,
       s = t,
       h = R[o];
      return h ? s = h(t) : v.immutable && (ge.mutate.array[o] ? s = a(t, r) : ge.mutate.object[o] ? s = a(t, (i = t, function(e) {
       return i({}, e)
      })) : ge.mutate.set[o] && (s = a(t, d))), L(j, function(e) {
       return L(ge.aryMethod[e], function(t) {
        if (o == t) {
         var i = ge.methodSpread[o];
         return n = i && i.afterRearg ? l(o, u(o, s, e), e) : u(o, l(o, s, e), e), n = c(o, n), r = n, a = e, n = b || v.curry && 1 < a ? k(r, a) : r, !1
        }
        var r, a
       }), !n
      }), n || (n = s), n == t && (n = b ? k(n, 1) : function() {
       return t.apply(this, arguments)
      }), n.convert = f(o, t), ge.placeholder[o] && (_ = !0, n.placeholder = t.placeholder = A), n
     }
     var _, m = "function" == typeof n,
      g = n === Object(n);
     if (g && (s = i, i = n, n = void 0), null == i) throw new TypeError;
     s || (s = {});
     var v = {
       cap: !("cap" in s) || s.cap,
       curry: !("curry" in s) || s.curry,
       fixed: !("fixed" in s) || s.fixed,
       immutable: !("immutable" in s) || s.immutable,
       rearg: !("rearg" in s) || s.rearg
      },
      b = "curry" in s && s.curry,
      y = "fixed" in s && s.fixed,
      w = "rearg" in s && s.rearg,
      A = m ? i : ve,
      I = m ? i.runInContext() : void 0,
      C = m ? i : {
       ary: t.ary,
       assign: t.assign,
       clone: t.clone,
       curry: t.curry,
       forEach: t.forEach,
       isArray: t.isArray,
       isError: t.isError,
       isFunction: t.isFunction,
       isWeakMap: t.isWeakMap,
       iteratee: t.iteratee,
       keys: t.keys,
       rearg: t.rearg,
       toInteger: t.toInteger,
       toPath: t.toPath
      },
      x = C.ary,
      M = C.assign,
      T = C.clone,
      k = C.curry,
      L = C.forEach,
      S = C.isArray,
      O = C.isError,
      E = C.isFunction,
      P = C.isWeakMap,
      z = C.keys,
      D = C.rearg,
      N = C.toInteger,
      B = C.toPath,
      j = z(ge.aryMethod),
      R = {
       castArray: function(e) {
        return function() {
         var t = arguments[0];
         return S(t) ? e(r(t)) : e.apply(void 0, arguments)
        }
       },
       iteratee: function(e) {
        return function() {
         var t = arguments[1],
          n = e(arguments[0], t),
          i = n.length;
         return v.cap && "number" == typeof t ? (t = 2 < t ? t - 2 : 1, i && i <= t ? n : o(n, t)) : n
        }
       },
       mixin: function(e) {
        return function(t) {
         var n = this;
         if (!E(n)) return e(n, Object(t));
         var i = [];
         return L(z(t), function(e) {
          E(t[e]) && i.push([e, n.prototype[e]])
         }), e(n, Object(t)), L(i, function(e) {
          var t = e[1];
          E(t) ? n.prototype[e[0]] = t : delete n.prototype[e[0]]
         }), n
        }
       },
       nthArg: function(e) {
        return function(t) {
         var n = t < 0 ? 1 : N(t) + 1;
         return k(e(t), n)
        }
       },
       rearg: function(e) {
        return function(t, n) {
         var i = n ? n.length : 0;
         return k(e(t, n), i)
        }
       },
       runInContext: function(n) {
        return function(i) {
         return e(t, n(i), s)
        }
       }
      };
     if (!g) return p(n, i);
     var W = i,
      U = [];
     return L(j, function(e) {
      L(ge.aryMethod[e], function(e) {
       var t = W[ge.remap[e] || e];
       t && U.push([e, p(e, t)])
      })
     }), L(z(W), function(e) {
      var t = W[e];
      if ("function" == typeof t) {
       for (var n = U.length; n--;)
        if (U[n][0] == e) return;
       t.convert = f(e, t), U.push([e, t])
      }
     }), L(U, function(e) {
      W[e[0]] = e[1]
     }), W.convert = function(e) {
      return W.runInContext.convert(e)(void 0)
     }, _ && (W.placeholder = A), L(z(W), function(e) {
      L(ge.realToAlias[e] || [], function(t) {
       W[t] = W[e]
      })
     }), W
    },
    we = function(e) {
     return e
    },
    Ae = "object" == typeof me && me && me.Object === Object && me,
    Ie = "object" == typeof self && self && self.Object === Object && self,
    Ce = Ae || Ie || Function("return this")(),
    xe = Ce.Symbol,
    Me = Object.prototype,
    Te = Me.hasOwnProperty,
    ke = Me.toString,
    Le = xe ? xe.toStringTag : void 0,
    Se = function(e) {
     var t = Te.call(e, Le),
      n = e[Le];
     try {
      var i = !(e[Le] = void 0)
     } catch (e) {}
     var o = ke.call(e);
     return i && (t ? e[Le] = n : delete e[Le]), o
    },
    Oe = Object.prototype.toString,
    Ee = function(e) {
     return Oe.call(e)
    },
    Pe = xe ? xe.toStringTag : void 0,
    ze = function(e) {
     return null == e ? void 0 === e ? "[object Undefined]" : "[object Null]" : Pe && Pe in Object(e) ? Se(e) : Ee(e)
    },
    De = function(e) {
     var t = typeof e;
     return null != e && ("object" == t || "function" == t)
    },
    Ne = function(e) {
     if (!De(e)) return !1;
     var t = ze(e);
     return "[object Function]" == t || "[object GeneratorFunction]" == t || "[object AsyncFunction]" == t || "[object Proxy]" == t
    },
    Be = Ce["__core-js_shared__"],
    je = (Z = /[^.]+$/.exec(Be && Be.keys && Be.keys.IE_PROTO || "")) ? "Symbol(src)_1." + Z : "",
    Re = function(e) {
     return !!je && je in e
    },
    We = Function.prototype.toString,
    Ue = function(e) {
     if (null != e) {
      try {
       return We.call(e)
      } catch (e) {}
      try {
       return e + ""
      } catch (e) {}
     }
     return ""
    },
    Fe = /^\[object .+?Constructor\]$/,
    $e = RegExp("^" + Function.prototype.toString.call(Object.prototype.hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
    He = function(e) {
     return !(!De(e) || Re(e)) && (Ne(e) ? $e : Fe).test(Ue(e))
    },
    qe = function(e, t) {
     return null == e ? void 0 : e[t]
    },
    Ve = function(e, t) {
     var n = qe(e, t);
     return He(n) ? n : void 0
    },
    Ge = Ve(Ce, "WeakMap"),
    Je = Ge && new Ge,
    Ye = Je ? function(e, t) {
     return Je.set(e, t), e
    } : we,
    Ke = Object.create,
    Ze = function() {
     function e() {}
     return function(t) {
      if (!De(t)) return {};
      if (Ke) return Ke(t);
      e.prototype = t;
      var n = new e;
      return e.prototype = void 0, n
     }
    }(),
    Qe = function(e) {
     return function() {
      var t = arguments;
      switch (t.length) {
       case 0:
        return new e;
       case 1:
        return new e(t[0]);
       case 2:
        return new e(t[0], t[1]);
       case 3:
        return new e(t[0], t[1], t[2]);
       case 4:
        return new e(t[0], t[1], t[2], t[3]);
       case 5:
        return new e(t[0], t[1], t[2], t[3], t[4]);
       case 6:
        return new e(t[0], t[1], t[2], t[3], t[4], t[5]);
       case 7:
        return new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6])
      }
      var n = Ze(e.prototype),
       i = e.apply(n, t);
      return De(i) ? i : n
     }
    },
    Xe = function(e, t, n) {
     var i = 1 & t,
      o = Qe(e);
     return function t() {
      return (this && this !== Ce && this instanceof t ? o : e).apply(i ? n : this, arguments)
     }
    },
    et = function(e, t, n) {
     switch (n.length) {
      case 0:
       return e.call(t);
      case 1:
       return e.call(t, n[0]);
      case 2:
       return e.call(t, n[0], n[1]);
      case 3:
       return e.call(t, n[0], n[1], n[2])
     }
     return e.apply(t, n)
    },
    tt = Math.max,
    nt = function(e, t, n, i) {
     for (var o = -1, r = e.length, a = n.length, s = -1, c = t.length, l = tt(r - a, 0), u = Array(c + l), d = !i; ++s < c;) u[s] = t[s];
     for (; ++o < a;)(d || o < r) && (u[n[o]] = e[o]);
     for (; l--;) u[s++] = e[o++];
     return u
    },
    it = Math.max,
    ot = function(e, t, n, i) {
     for (var o = -1, r = e.length, a = -1, s = n.length, c = -1, l = t.length, u = it(r - s, 0), d = Array(u + l), f = !i; ++o < u;) d[o] = e[o];
     for (var h = o; ++c < l;) d[h + c] = t[c];
     for (; ++a < s;)(f || o < r) && (d[h + n[a]] = e[o++]);
     return d
    },
    rt = function(e, t) {
     for (var n = e.length, i = 0; n--;) e[n] === t && ++i;
     return i
    },
    at = function() {},
    st = (s.prototype = Ze(at.prototype)).constructor = s,
    ct = Je ? function(e) {
     return Je.get(e)
    } : function() {},
    lt = {},
    ut = Object.prototype.hasOwnProperty,
    dt = function(e) {
     for (var t = e.name + "", n = lt[t], i = ut.call(lt, t) ? n.length : 0; i--;) {
      var o = n[i],
       r = o.func;
      if (null == r || r == e) return o.name
     }
     return t
    },
    ft = (c.prototype = Ze(at.prototype)).constructor = c,
    ht = Array.isArray,
    pt = function(e) {
     return null != e && "object" == typeof e
    },
    _t = function(e, t) {
     var n = -1,
      i = e.length;
     for (t || (t = Array(i)); ++n < i;) t[n] = e[n];
     return t
    },
    mt = function(e) {
     if (e instanceof st) return e.clone();
     var t = new ft(e.__wrapped__, e.__chain__);
     return t.__actions__ = _t(e.__actions__), t.__index__ = e.__index__, t.__values__ = e.__values__, t
    },
    gt = Object.prototype.hasOwnProperty,
    vt = (l.prototype = at.prototype).constructor = l,
    bt = function(e) {
     var t = dt(e),
      n = vt[t];
     if ("function" != typeof n || !(t in st.prototype)) return !1;
     if (e === n) return !0;
     var i = ct(n);
     return !!i && e === i[0]
    },
    yt = Date.now,
    wt = function(e) {
     var t = 0,
      n = 0;
     return function() {
      var i = yt(),
       o = 16 - (i - n);
      if (n = i, 0 < o) {
       if (800 <= ++t) return arguments[0]
      } else t = 0;
      return e.apply(void 0, arguments)
     }
    },
    At = wt(Ye),
    It = /\{\n\/\* \[wrapped with (.+)\] \*/,
    Ct = /,? & /,
    xt = function(e) {
     var t = e.match(It);
     return t ? t[1].split(Ct) : []
    },
    Mt = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
    Tt = function(e, t) {
     var n = t.length;
     if (!n) return e;
     var i = n - 1;
     return t[i] = (1 < n ? "& " : "") + t[i], t = t.join(2 < n ? ", " : " "), e.replace(Mt, "{\n/* [wrapped with " + t + "] */\n")
    },
    kt = function(e) {
     return function() {
      return e
     }
    },
    Lt = function() {
     try {
      var e = Ve(Object, "defineProperty");
      return e({}, "", {}), e
     } catch (e) {}
    }(),
    St = wt(Lt ? function(e, t) {
     return Lt(e, "toString", {
      configurable: !0,
      enumerable: !1,
      value: kt(t),
      writable: !0
     })
    } : we),
    Ot = function(e, t) {
     for (var n = -1, i = null == e ? 0 : e.length; ++n < i && !1 !== t(e[n], n, e););
     return e
    },
    Et = function(e, t, n, i) {
     for (var o = e.length, r = n + (i ? 1 : -1); i ? r-- : ++r < o;)
      if (t(e[r], r, e)) return r;
     return -1
    },
    Pt = function(e) {
     return e != e
    },
    zt = function(e, t, n) {
     for (var i = n - 1, o = e.length; ++i < o;)
      if (e[i] === t) return i;
     return -1
    },
    Dt = function(e, t, n) {
     return t == t ? zt(e, t, n) : Et(e, Pt, n)
    },
    Nt = function(e, t) {
     return !(null == e || !e.length) && -1 < Dt(e, t, 0)
    },
    Bt = [
     ["ary", 128],
     ["bind", 1],
     ["bindKey", 2],
     ["curry", 8],
     ["curryRight", 16],
     ["flip", 512],
     ["partial", 32],
     ["partialRight", 64],
     ["rearg", 256]
    ],
    jt = function(e, t) {
     return Ot(Bt, function(n) {
      var i = "_." + n[0];
      t & n[1] && !Nt(e, i) && e.push(i)
     }), e.sort()
    },
    Rt = function(e, t, n) {
     var i = t + "";
     return St(e, Tt(i, jt(xt(i), n)))
    },
    Wt = function(e, t, n, i, o, r, a, s, c, l) {
     var u = 8 & t;
     t |= u ? 32 : 64, 4 & (t &= ~(u ? 64 : 32)) || (t &= -4);
     var d = [e, t, o, u ? r : void 0, u ? a : void 0, u ? void 0 : r, u ? void 0 : a, s, c, l],
      f = n.apply(void 0, d);
     return bt(e) && At(f, d), f.placeholder = i, Rt(f, e, t)
    },
    Ut = function(e) {
     return e.placeholder
    },
    Ft = /^(?:0|[1-9]\d*)$/,
    $t = function(e, t) {
     var n = typeof e;
     return !!(t = null == t ? 9007199254740991 : t) && ("number" == n || "symbol" != n && Ft.test(e)) && -1 < e && e % 1 == 0 && e < t
    },
    Ht = Math.min,
    qt = function(e, t) {
     for (var n = e.length, i = Ht(t.length, n), o = _t(e); i--;) {
      var r = t[i];
      e[i] = $t(r, n) ? o[r] : void 0
     }
     return e
    },
    Vt = "__lodash_placeholder__",
    Gt = function(e, t) {
     for (var n = -1, i = e.length, o = 0, r = []; ++n < i;) {
      var a = e[n];
      a !== t && a !== Vt || (e[n] = Vt, r[o++] = n)
     }
     return r
    },
    Jt = function e(t, n, i, o, r, a, s, c, l, u) {
     var d = 128 & n,
      f = 1 & n,
      h = 2 & n,
      p = 24 & n,
      _ = 512 & n,
      m = h ? void 0 : Qe(t);
     return function g() {
      for (var v = arguments.length, b = Array(v), y = v; y--;) b[y] = arguments[y];
      if (p) var w = Ut(g),
       A = rt(b, w);
      if (o && (b = nt(b, o, r, p)), a && (b = ot(b, a, s, p)), v -= A, p && v < u) {
       var I = Gt(b, w);
       return Wt(t, n, e, g.placeholder, i, b, I, c, l, u - v)
      }
      var C = f ? i : this,
       x = h ? C[t] : t;
      return v = b.length, c ? b = qt(b, c) : _ && 1 < v && b.reverse(), d && l < v && (b.length = l), this && this !== Ce && this instanceof g && (x = m || Qe(x)), x.apply(C, b)
     }
    },
    Yt = function(e, t, n) {
     var i = Qe(e);
     return function o() {
      for (var r = arguments.length, a = Array(r), s = r, c = Ut(o); s--;) a[s] = arguments[s];
      var l = r < 3 && a[0] !== c && a[r - 1] !== c ? [] : Gt(a, c);
      return (r -= l.length) < n ? Wt(e, t, Jt, o.placeholder, void 0, a, l, void 0, void 0, n - r) : et(this && this !== Ce && this instanceof o ? i : e, this, a)
     }
    },
    Kt = function(e, t, n, i) {
     var o = 1 & t,
      r = Qe(e);
     return function t() {
      for (var a = -1, s = arguments.length, c = -1, l = i.length, u = Array(l + s), d = this && this !== Ce && this instanceof t ? r : e; ++c < l;) u[c] = i[c];
      for (; s--;) u[c++] = arguments[++a];
      return et(d, o ? n : this, u)
     }
    },
    Zt = "__lodash_placeholder__",
    Qt = Math.min,
    Xt = function(e, t) {
     var n = e[1],
      i = t[1],
      o = n | i;
     if (o >= 131 && !(128 == i && 8 == n || 128 == i && 256 == n && e[7].length <= t[8] || 384 == i && t[7].length <= t[8] && 8 == n)) return e;
     1 & i && (e[2] = t[2], o |= 1 & n ? 0 : 4);
     var r = t[3];
     if (r) {
      var a = e[3];
      e[3] = a ? nt(a, r, t[4]) : r, e[4] = a ? Gt(e[3], Zt) : t[4]
     }
     return (r = t[5]) && (e[5] = (a = e[5]) ? ot(a, r, t[6]) : r, e[6] = a ? Gt(e[5], Zt) : t[6]), (r = t[7]) && (e[7] = r), 128 & i && (e[8] = null == e[8] ? t[8] : Qt(e[8], t[8])), null == e[9] && (e[9] = t[9]), e[0] = t[0], e[1] = o, e
    },
    en = function(e) {
     return "symbol" == typeof e || pt(e) && "[object Symbol]" == ze(e)
    },
    tn = /^\s+|\s+$/g,
    nn = /^[-+]0x[0-9a-f]+$/i,
    on = /^0b[01]+$/i,
    rn = /^0o[0-7]+$/i,
    an = parseInt,
    sn = function(e) {
     if ("number" == typeof e) return e;
     if (en(e)) return NaN;
     if (De(e)) {
      var t = "function" == typeof e.valueOf ? e.valueOf() : e;
      e = De(t) ? t + "" : t
     }
     if ("string" != typeof e) return 0 === e ? e : +e;
     e = e.replace(tn, "");
     var n = on.test(e);
     return n || rn.test(e) ? an(e.slice(2), n ? 2 : 8) : nn.test(e) ? NaN : +e
    },
    cn = function(e) {
     return e ? (e = sn(e)) === 1 / 0 || e === -1 / 0 ? 1.7976931348623157e308 * (e < 0 ? -1 : 1) : e == e ? e : 0 : 0 === e ? e : 0
    },
    ln = function(e) {
     var t = cn(e),
      n = t % 1;
     return t == t ? n ? t - n : t : 0
    },
    un = Math.max,
    dn = function(e, t, n, i, o, r, a, s) {
     var c = 2 & t;
     if (!c && "function" != typeof e) throw new TypeError("Expected a function");
     var l = i ? i.length : 0;
     if (l || (t &= -97, i = o = void 0), a = void 0 === a ? a : un(ln(a), 0), s = void 0 === s ? s : ln(s), l -= o ? o.length : 0, 64 & t) {
      var u = i,
       d = o;
      i = o = void 0
     }
     var f = c ? void 0 : ct(e),
      h = [e, t, n, i, o, u, d, r, a, s];
     if (f && Xt(h, f), e = h[0], t = h[1], n = h[2], i = h[3], o = h[4], !(s = h[9] = void 0 === h[9] ? c ? 0 : e.length : un(h[9] - l, 0)) && 24 & t && (t &= -25), t && 1 != t) p = 8 == t || 16 == t ? Yt(e, t, s) : 32 != t && 33 != t || o.length ? Jt.apply(void 0, h) : Kt(e, t, n, i);
     else var p = Xe(e, t, n);
     return Rt((f ? Ye : At)(p, h), e, t)
    },
    fn = function(e, t, n) {
     return t = n ? void 0 : t, dn(e, 128, void 0, void 0, void 0, void 0, t = e && null == t ? e.length : t)
    },
    hn = function(e, t, n) {
     "__proto__" == t && Lt ? Lt(e, t, {
      configurable: !0,
      enumerable: !0,
      value: n,
      writable: !0
     }) : e[t] = n
    },
    pn = function(e, t) {
     return e === t || e != e && t != t
    },
    _n = Object.prototype.hasOwnProperty,
    mn = function(e, t, n) {
     var i = e[t];
     _n.call(e, t) && pn(i, n) && (void 0 !== n || t in e) || hn(e, t, n)
    },
    gn = function(e, t, n, i) {
     var o = !n;
     n || (n = {});
     for (var r = -1, a = t.length; ++r < a;) {
      var s = t[r],
       c = i ? i(n[s], e[s], s, n, e) : void 0;
      void 0 === c && (c = e[s]), o ? hn(n, s, c) : mn(n, s, c)
     }
     return n
    },
    vn = function(e, t) {
     for (var n = -1, i = Array(e); ++n < e;) i[n] = t(n);
     return i
    },
    bn = function(e) {
     return pt(e) && "[object Arguments]" == ze(e)
    },
    yn = Object.prototype,
    wn = yn.hasOwnProperty,
    An = yn.propertyIsEnumerable,
    In = bn(function() {
     return arguments
    }()) ? bn : function(e) {
     return pt(e) && wn.call(e, "callee") && !An.call(e, "callee")
    },
    Cn = function() {
     return !1
    },
    xn = i(function(e, t) {
     var n = t && !t.nodeType && t,
      i = n && e && !e.nodeType && e,
      o = i && i.exports === n ? Ce.Buffer : void 0;
     e.exports = (o ? o.isBuffer : void 0) || Cn
    }),
    Mn = function(e) {
     return "number" == typeof e && -1 < e && e % 1 == 0 && e <= 9007199254740991
    },
    Tn = {};
   Tn["[object Float32Array]"] = Tn["[object Float64Array]"] = Tn["[object Int8Array]"] = Tn["[object Int16Array]"] = Tn["[object Int32Array]"] = Tn["[object Uint8Array]"] = Tn["[object Uint8ClampedArray]"] = Tn["[object Uint16Array]"] = Tn["[object Uint32Array]"] = !0, Tn["[object Arguments]"] = Tn["[object Array]"] = Tn["[object ArrayBuffer]"] = Tn["[object Boolean]"] = Tn["[object DataView]"] = Tn["[object Date]"] = Tn["[object Error]"] = Tn["[object Function]"] = Tn["[object Map]"] = Tn["[object Number]"] = Tn["[object Object]"] = Tn["[object RegExp]"] = Tn["[object Set]"] = Tn["[object String]"] = Tn["[object WeakMap]"] = !1;
   var kn = function(e) {
     return pt(e) && Mn(e.length) && !!Tn[ze(e)]
    },
    Ln = function(e) {
     return function(t) {
      return e(t)
     }
    },
    Sn = i(function(e, t) {
     var n = t && !t.nodeType && t,
      i = n && e && !e.nodeType && e,
      o = i && i.exports === n && Ae.process,
      r = function() {
       try {
        return i && i.require && i.require("util").types || o && o.binding && o.binding("util")
       } catch (e) {}
      }();
     e.exports = r
    }),
    On = Sn && Sn.isTypedArray,
    En = On ? Ln(On) : kn,
    Pn = Object.prototype.hasOwnProperty,
    zn = function(e, t) {
     var n = ht(e),
      i = !n && In(e),
      o = !n && !i && xn(e),
      r = !n && !i && !o && En(e),
      a = n || i || o || r,
      s = a ? vn(e.length, String) : [],
      c = s.length;
     for (var l in e) !t && !Pn.call(e, l) || a && ("length" == l || o && ("offset" == l || "parent" == l) || r && ("buffer" == l || "byteLength" == l || "byteOffset" == l) || $t(l, c)) || s.push(l);
     return s
    },
    Dn = Object.prototype,
    Nn = function(e) {
     var t = e && e.constructor;
     return e === ("function" == typeof t && t.prototype || Dn)
    },
    Bn = function(e, t) {
     return function(n) {
      return e(t(n))
     }
    },
    jn = Bn(Object.keys, Object),
    Rn = Object.prototype.hasOwnProperty,
    Wn = function(e) {
     if (!Nn(e)) return jn(e);
     var t = [];
     for (var n in Object(e)) Rn.call(e, n) && "constructor" != n && t.push(n);
     return t
    },
    Un = function(e) {
     return null != e && Mn(e.length) && !Ne(e)
    },
    Fn = function(e) {
     return Un(e) ? zn(e) : Wn(e)
    },
    $n = function(e, t) {
     return e && gn(t, Fn(t), e)
    },
    Hn = function(e, t) {
     for (var n = e.length; n--;)
      if (pn(e[n][0], t)) return n;
     return -1
    },
    qn = Array.prototype.splice,
    Vn = function(e) {
     var t = this.__data__,
      n = Hn(t, e);
     return 0 <= n && (n == t.length - 1 ? t.pop() : qn.call(t, n, 1), --this.size, !0)
    },
    Gn = function(e) {
     var t = this.__data__,
      n = Hn(t, e);
     return n < 0 ? void 0 : t[n][1]
    },
    Jn = function(e) {
     return -1 < Hn(this.__data__, e)
    },
    Yn = function(e, t) {
     var n = this.__data__,
      i = Hn(n, e);
     return i < 0 ? (++this.size, n.push([e, t])) : n[i][1] = t, this
    };
   u.prototype.clear = function() {
    this.__data__ = [], this.size = 0
   }, u.prototype.delete = Vn, u.prototype.get = Gn, u.prototype.has = Jn, u.prototype.set = Yn;
   var Kn = u,
    Zn = function() {
     this.__data__ = new Kn, this.size = 0
    },
    Qn = function(e) {
     var t = this.__data__,
      n = t.delete(e);
     return this.size = t.size, n
    },
    Xn = function(e) {
     return this.__data__.get(e)
    },
    ei = function(e) {
     return this.__data__.has(e)
    },
    ti = Ve(Ce, "Map"),
    ni = Ve(Object, "create"),
    ii = function(e) {
     var t = this.has(e) && delete this.__data__[e];
     return this.size -= t ? 1 : 0, t
    },
    oi = Object.prototype.hasOwnProperty,
    ri = function(e) {
     var t = this.__data__;
     if (ni) {
      var n = t[e];
      return "__lodash_hash_undefined__" === n ? void 0 : n
     }
     return oi.call(t, e) ? t[e] : void 0
    },
    ai = Object.prototype.hasOwnProperty,
    si = function(e) {
     var t = this.__data__;
     return ni ? void 0 !== t[e] : ai.call(t, e)
    },
    ci = function(e, t) {
     var n = this.__data__;
     return this.size += this.has(e) ? 0 : 1, n[e] = ni && void 0 === t ? "__lodash_hash_undefined__" : t, this
    };
   d.prototype.clear = function() {
    this.__data__ = ni ? ni(null) : {}, this.size = 0
   }, d.prototype.delete = ii, d.prototype.get = ri, d.prototype.has = si, d.prototype.set = ci;
   var li = d,
    ui = function(e) {
     var t = typeof e;
     return "string" == t || "number" == t || "symbol" == t || "boolean" == t ? "__proto__" !== e : null === e
    },
    di = function(e, t) {
     var n = e.__data__;
     return ui(t) ? n["string" == typeof t ? "string" : "hash"] : n.map
    },
    fi = function(e) {
     var t = di(this, e).delete(e);
     return this.size -= t ? 1 : 0, t
    },
    hi = function(e) {
     return di(this, e).get(e)
    },
    pi = function(e) {
     return di(this, e).has(e)
    },
    _i = function(e, t) {
     var n = di(this, e),
      i = n.size;
     return n.set(e, t), this.size += n.size == i ? 0 : 1, this
    };
   f.prototype.clear = function() {
    this.size = 0, this.__data__ = {
     hash: new li,
     map: new(ti || Kn),
     string: new li
    }
   }, f.prototype.delete = fi, f.prototype.get = hi, f.prototype.has = pi, f.prototype.set = _i;
   var mi = f,
    gi = function(e, t) {
     var n = this.__data__;
     if (n instanceof Kn) {
      var i = n.__data__;
      if (!ti || i.length < 199) return i.push([e, t]), this.size = ++n.size, this;
      n = this.__data__ = new mi(i)
     }
     return n.set(e, t), this.size = n.size, this
    };
   h.prototype.clear = Zn, h.prototype.delete = Qn, h.prototype.get = Xn, h.prototype.has = ei, h.prototype.set = gi;
   var vi = h,
    bi = function(e) {
     var t = [];
     if (null != e)
      for (var n in Object(e)) t.push(n);
     return t
    },
    yi = Object.prototype.hasOwnProperty,
    wi = function(e) {
     if (!De(e)) return bi(e);
     var t = Nn(e),
      n = [];
     for (var i in e)("constructor" != i || !t && yi.call(e, i)) && n.push(i);
     return n
    },
    Ai = function(e) {
     return Un(e) ? zn(e, !0) : wi(e)
    },
    Ii = function(e, t) {
     return e && gn(t, Ai(t), e)
    },
    Ci = i(function(e, t) {
     var n = t && !t.nodeType && t,
      i = n && e && !e.nodeType && e,
      o = i && i.exports === n ? Ce.Buffer : void 0,
      r = o ? o.allocUnsafe : void 0;
     e.exports = function(e, t) {
      if (t) return e.slice();
      var n = e.length,
       i = r ? r(n) : new e.constructor(n);
      return e.copy(i), i
     }
    }),
    xi = function(e, t) {
     for (var n = -1, i = null == e ? 0 : e.length, o = 0, r = []; ++n < i;) {
      var a = e[n];
      t(a, n, e) && (r[o++] = a)
     }
     return r
    },
    Mi = function() {
     return []
    },
    Ti = Object.prototype.propertyIsEnumerable,
    ki = Object.getOwnPropertySymbols,
    Li = ki ? function(e) {
     return null == e ? [] : xi(ki(e = Object(e)), function(t) {
      return Ti.call(e, t)
     })
    } : Mi,
    Si = function(e, t) {
     return gn(e, Li(e), t)
    },
    Oi = function(e, t) {
     for (var n = -1, i = t.length, o = e.length; ++n < i;) e[o + n] = t[n];
     return e
    },
    Ei = Bn(Object.getPrototypeOf, Object),
    Pi = Object.getOwnPropertySymbols ? function(e) {
     for (var t = []; e;) Oi(t, Li(e)), e = Ei(e);
     return t
    } : Mi,
    zi = function(e, t) {
     return gn(e, Pi(e), t)
    },
    Di = function(e, t, n) {
     var i = t(e);
     return ht(e) ? i : Oi(i, n(e))
    },
    Ni = function(e) {
     return Di(e, Fn, Li)
    },
    Bi = function(e) {
     return Di(e, Ai, Pi)
    },
    ji = Ve(Ce, "DataView"),
    Ri = Ve(Ce, "Promise"),
    Wi = Ve(Ce, "Set"),
    Ui = "[object Map]",
    Fi = "[object Promise]",
    $i = "[object Set]",
    Hi = "[object WeakMap]",
    qi = "[object DataView]",
    Vi = Ue(ji),
    Gi = Ue(ti),
    Ji = Ue(Ri),
    Yi = Ue(Wi),
    Ki = Ue(Ge),
    Zi = ze;
   (ji && Zi(new ji(new ArrayBuffer(1))) != qi || ti && Zi(new ti) != Ui || Ri && Zi(Ri.resolve()) != Fi || Wi && Zi(new Wi) != $i || Ge && Zi(new Ge) != Hi) && (Zi = function(e) {
    var t = ze(e),
     n = "[object Object]" == t ? e.constructor : void 0,
     i = n ? Ue(n) : "";
    if (i) switch (i) {
     case Vi:
      return qi;
     case Gi:
      return Ui;
     case Ji:
      return Fi;
     case Yi:
      return $i;
     case Ki:
      return Hi
    }
    return t
   });
   var Qi = Zi,
    Xi = Object.prototype.hasOwnProperty,
    eo = function(e) {
     var t = e.length,
      n = new e.constructor(t);
     return t && "string" == typeof e[0] && Xi.call(e, "index") && (n.index = e.index, n.input = e.input), n
    },
    to = Ce.Uint8Array,
    no = function(e) {
     var t = new e.constructor(e.byteLength);
     return new to(t).set(new to(e)), t
    },
    io = function(e, t) {
     var n = t ? no(e.buffer) : e.buffer;
     return new e.constructor(n, e.byteOffset, e.byteLength)
    },
    oo = /\w*$/,
    ro = function(e) {
     var t = new e.constructor(e.source, oo.exec(e));
     return t.lastIndex = e.lastIndex, t
    },
    ao = xe ? xe.prototype : void 0,
    so = ao ? ao.valueOf : void 0,
    co = function(e) {
     return so ? Object(so.call(e)) : {}
    },
    lo = function(e, t) {
     var n = t ? no(e.buffer) : e.buffer;
     return new e.constructor(n, e.byteOffset, e.length)
    },
    uo = function(e, t, n) {
     var i = e.constructor;
     switch (t) {
      case "[object ArrayBuffer]":
       return no(e);
      case "[object Boolean]":
      case "[object Date]":
       return new i(+e);
      case "[object DataView]":
       return io(e, n);
      case "[object Float32Array]":
      case "[object Float64Array]":
      case "[object Int8Array]":
      case "[object Int16Array]":
      case "[object Int32Array]":
      case "[object Uint8Array]":
      case "[object Uint8ClampedArray]":
      case "[object Uint16Array]":
      case "[object Uint32Array]":
       return lo(e, n);
      case "[object Map]":
       return new i;
      case "[object Number]":
      case "[object String]":
       return new i(e);
      case "[object RegExp]":
       return ro(e);
      case "[object Set]":
       return new i;
      case "[object Symbol]":
       return co(e)
     }
    },
    fo = function(e) {
     return "function" != typeof e.constructor || Nn(e) ? {} : Ze(Ei(e))
    },
    ho = function(e) {
     return pt(e) && "[object Map]" == Qi(e)
    },
    po = Sn && Sn.isMap,
    _o = po ? Ln(po) : ho,
    mo = function(e) {
     return pt(e) && "[object Set]" == Qi(e)
    },
    go = Sn && Sn.isSet,
    vo = go ? Ln(go) : mo,
    bo = "[object Arguments]",
    yo = "[object Function]",
    wo = "[object Object]",
    Ao = {};
   Ao[bo] = Ao["[object Array]"] = Ao["[object ArrayBuffer]"] = Ao["[object DataView]"] = Ao["[object Boolean]"] = Ao["[object Date]"] = Ao["[object Float32Array]"] = Ao["[object Float64Array]"] = Ao["[object Int8Array]"] = Ao["[object Int16Array]"] = Ao["[object Int32Array]"] = Ao["[object Map]"] = Ao["[object Number]"] = Ao[wo] = Ao["[object RegExp]"] = Ao["[object Set]"] = Ao["[object String]"] = Ao["[object Symbol]"] = Ao["[object Uint8Array]"] = Ao["[object Uint8ClampedArray]"] = Ao["[object Uint16Array]"] = Ao["[object Uint32Array]"] = !0, Ao["[object Error]"] = Ao[yo] = Ao["[object WeakMap]"] = !1;
   var Io = function e(t, n, i, o, r, a) {
     var s, c = 1 & n,
      l = 2 & n,
      u = 4 & n;
     if (i && (s = r ? i(t, o, r, a) : i(t)), void 0 !== s) return s;
     if (!De(t)) return t;
     var d = ht(t);
     if (d) {
      if (s = eo(t), !c) return _t(t, s)
     } else {
      var f = Qi(t),
       h = f == yo || "[object GeneratorFunction]" == f;
      if (xn(t)) return Ci(t, c);
      if (f == wo || f == bo || h && !r) {
       if (s = l || h ? {} : fo(t), !c) return l ? zi(t, Ii(s, t)) : Si(t, $n(s, t))
      } else {
       if (!Ao[f]) return r ? t : {};
       s = uo(t, f, c)
      }
     }
     a || (a = new vi);
     var p = a.get(t);
     if (p) return p;
     if (a.set(t, s), vo(t)) return t.forEach(function(o) {
      s.add(e(o, n, i, o, t, a))
     }), s;
     if (_o(t)) return t.forEach(function(o, r) {
      s.set(r, e(o, n, i, r, t, a))
     }), s;
     var _ = u ? l ? Bi : Ni : l ? keysIn : Fn,
      m = d ? void 0 : _(t);
     return Ot(m || t, function(o, r) {
      m && (o = t[r = o]), mn(s, r, e(o, n, i, r, t, a))
     }), s
    },
    Co = function(e) {
     return Io(e, 4)
    },
    xo = 8;
   p.placeholder = {};
   var Mo = p,
    To = Function.prototype.toString,
    ko = Object.prototype.hasOwnProperty,
    Lo = To.call(Object),
    So = function(e) {
     if (!pt(e) || "[object Object]" != ze(e)) return !1;
     var t = Ei(e);
     if (null === t) return !0;
     var n = ko.call(t, "constructor") && t.constructor;
     return "function" == typeof n && n instanceof n && To.call(n) == Lo
    },
    Oo = function(e) {
     if (!pt(e)) return !1;
     var t = ze(e);
     return "[object Error]" == t || "[object DOMException]" == t || "string" == typeof e.message && "string" == typeof e.name && !So(e)
    },
    Eo = function(e) {
     return pt(e) && "[object WeakMap]" == Qi(e)
    },
    Po = function(e) {
     return this.__data__.has(e)
    };
   _.prototype.add = _.prototype.push = function(e) {
    return this.__data__.set(e, "__lodash_hash_undefined__"), this
   }, _.prototype.has = Po;
   var zo = _,
    Do = function(e, t) {
     for (var n = -1, i = null == e ? 0 : e.length; ++n < i;)
      if (t(e[n], n, e)) return !0;
     return !1
    },
    No = function(e, t) {
     return e.has(t)
    },
    Bo = function(e, t, n, i, o, r) {
     var a = 1 & n,
      s = e.length,
      c = t.length;
     if (!(s == c || a && s < c)) return !1;
     var l = r.get(e);
     if (l && r.get(t)) return l == t;
     var u = -1,
      d = !0,
      f = 2 & n ? new zo : void 0;
     for (r.set(e, t), r.set(t, e); ++u < s;) {
      var h = e[u],
       p = t[u];
      if (i) var _ = a ? i(p, h, u, t, e, r) : i(h, p, u, e, t, r);
      if (void 0 !== _) {
       if (_) continue;
       d = !1;
       break
      }
      if (f) {
       if (!Do(t, function(e, t) {
         if (!No(f, t) && (h === e || o(h, e, n, i, r))) return f.push(t)
        })) {
        d = !1;
        break
       }
      } else if (h !== p && !o(h, p, n, i, r)) {
       d = !1;
       break
      }
     }
     return r.delete(e), r.delete(t), d
    },
    jo = function(e) {
     var t = -1,
      n = Array(e.size);
     return e.forEach(function(e, i) {
      n[++t] = [i, e]
     }), n
    },
    Ro = function(e) {
     var t = -1,
      n = Array(e.size);
     return e.forEach(function(e) {
      n[++t] = e
     }), n
    },
    Wo = xe ? xe.prototype : void 0,
    Uo = Wo ? Wo.valueOf : void 0,
    Fo = function(e, t, n, i, o, r, a) {
     switch (n) {
      case "[object DataView]":
       if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) return !1;
       e = e.buffer, t = t.buffer;
      case "[object ArrayBuffer]":
       return !(e.byteLength != t.byteLength || !r(new to(e), new to(t)));
      case "[object Boolean]":
      case "[object Date]":
      case "[object Number]":
       return pn(+e, +t);
      case "[object Error]":
       return e.name == t.name && e.message == t.message;
      case "[object RegExp]":
      case "[object String]":
       return e == t + "";
      case "[object Map]":
       var s = jo;
      case "[object Set]":
       if (s || (s = Ro), e.size != t.size && !(1 & i)) return !1;
       var c = a.get(e);
       if (c) return c == t;
       i |= 2, a.set(e, t);
       var l = Bo(s(e), s(t), i, o, r, a);
       return a.delete(e), l;
      case "[object Symbol]":
       if (Uo) return Uo.call(e) == Uo.call(t)
     }
     return !1
    },
    $o = Object.prototype.hasOwnProperty,
    Ho = function(e, t, n, i, o, r) {
     var a = 1 & n,
      s = Ni(e),
      c = s.length;
     if (c != Ni(t).length && !a) return !1;
     for (var l = c; l--;) {
      var u = s[l];
      if (!(a ? u in t : $o.call(t, u))) return !1
     }
     var d = r.get(e);
     if (d && r.get(t)) return d == t;
     var f = !0;
     r.set(e, t), r.set(t, e);
     for (var h = a; ++l < c;) {
      var p = e[u = s[l]],
       _ = t[u];
      if (i) var m = a ? i(_, p, u, t, e, r) : i(p, _, u, e, t, r);
      if (!(void 0 === m ? p === _ || o(p, _, n, i, r) : m)) {
       f = !1;
       break
      }
      h || (h = "constructor" == u)
     }
     if (f && !h) {
      var g = e.constructor,
       v = t.constructor;
      g != v && "constructor" in e && "constructor" in t && !("function" == typeof g && g instanceof g && "function" == typeof v && v instanceof v) && (f = !1)
     }
     return r.delete(e), r.delete(t), f
    },
    qo = "[object Arguments]",
    Vo = "[object Array]",
    Go = "[object Object]",
    Jo = Object.prototype.hasOwnProperty,
    Yo = function(e, t, n, i, o, r) {
     var a = ht(e),
      s = ht(t),
      c = a ? Vo : Qi(e),
      l = s ? Vo : Qi(t),
      u = (c = c == qo ? Go : c) == Go,
      d = (l = l == qo ? Go : l) == Go,
      f = c == l;
     if (f && xn(e)) {
      if (!xn(t)) return !1;
      u = !(a = !0)
     }
     if (f && !u) return r || (r = new vi), a || En(e) ? Bo(e, t, n, i, o, r) : Fo(e, t, c, n, i, o, r);
     if (!(1 & n)) {
      var h = u && Jo.call(e, "__wrapped__"),
       p = d && Jo.call(t, "__wrapped__");
      if (h || p) {
       var _ = h ? e.value() : e,
        m = p ? t.value() : t;
       return r || (r = new vi), o(_, m, n, i, r)
      }
     }
     return !!f && (r || (r = new vi), Ho(e, t, n, i, o, r))
    },
    Ko = function e(t, n, i, o, r) {
     return t === n || (null == t || null == n || !pt(t) && !pt(n) ? t != t && n != n : Yo(t, n, i, o, e, r))
    },
    Zo = function(e, t, n, i) {
     var o = n.length,
      r = o,
      a = !i;
     if (null == e) return !r;
     for (e = Object(e); o--;) {
      var s = n[o];
      if (a && s[2] ? s[1] !== e[s[0]] : !(s[0] in e)) return !1
     }
     for (; ++o < r;) {
      var c = (s = n[o])[0],
       l = e[c],
       u = s[1];
      if (a && s[2]) {
       if (void 0 === l && !(c in e)) return !1
      } else {
       var d = new vi;
       if (i) var f = i(l, u, c, e, t, d);
       if (!(void 0 === f ? Ko(u, l, 3, i, d) : f)) return !1
      }
     }
     return !0
    },
    Qo = function(e) {
     return e == e && !De(e)
    },
    Xo = function(e) {
     for (var t = Fn(e), n = t.length; n--;) {
      var i = t[n],
       o = e[i];
      t[n] = [i, o, Qo(o)]
     }
     return t
    },
    er = function(e, t) {
     return function(n) {
      return null != n && n[e] === t && (void 0 !== t || e in Object(n))
     }
    },
    tr = function(e) {
     var t = Xo(e);
     return 1 == t.length && t[0][2] ? er(t[0][0], t[0][1]) : function(n) {
      return n === e || Zo(n, e, t)
     }
    },
    nr = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    ir = /^\w*$/,
    or = function(e, t) {
     if (ht(e)) return !1;
     var n = typeof e;
     return !("number" != n && "symbol" != n && "boolean" != n && null != e && !en(e)) || ir.test(e) || !nr.test(e) || null != t && e in Object(t)
    },
    rr = "Expected a function";
   m.Cache = mi;
   var ar = m,
    sr = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
    cr = /\\(\\)?/g,
    lr = function(e) {
     var t = ar(e, function(e) {
       return 500 === n.size && n.clear(), e
      }),
      n = t.cache;
     return t
    }(function(e) {
     var t = [];
     return 46 === e.charCodeAt(0) && t.push(""), e.replace(sr, function(e, n, i, o) {
      t.push(i ? o.replace(cr, "$1") : n || e)
     }), t
    }),
    ur = function(e, t) {
     for (var n = -1, i = null == e ? 0 : e.length, o = Array(i); ++n < i;) o[n] = t(e[n], n, e);
     return o
    },
    dr = xe ? xe.prototype : void 0,
    fr = dr ? dr.toString : void 0,
    hr = function e(t) {
     if ("string" == typeof t) return t;
     if (ht(t)) return ur(t, e) + "";
     if (en(t)) return fr ? fr.call(t) : "";
     var n = t + "";
     return "0" == n && 1 / t == -1 / 0 ? "-0" : n
    },
    pr = function(e) {
     return null == e ? "" : hr(e)
    },
    _r = function(e, t) {
     return ht(e) ? e : or(e, t) ? [e] : lr(pr(e))
    },
    mr = function(e) {
     if ("string" == typeof e || en(e)) return e;
     var t = e + "";
     return "0" == t && 1 / e == -1 / 0 ? "-0" : t
    },
    gr = function(e, t) {
     for (var n = 0, i = (t = _r(t, e)).length; null != e && n < i;) e = e[mr(t[n++])];
     return n && n == i ? e : void 0
    },
    vr = function(e, t, n) {
     var i = null == e ? void 0 : gr(e, t);
     return void 0 === i ? n : i
    },
    br = function(e, t) {
     return null != e && t in Object(e)
    },
    yr = function(e, t, n) {
     for (var i = -1, o = (t = _r(t, e)).length, r = !1; ++i < o;) {
      var a = mr(t[i]);
      if (!(r = null != e && n(e, a))) break;
      e = e[a]
     }
     return r || ++i != o ? r : !!(o = null == e ? 0 : e.length) && Mn(o) && $t(a, o) && (ht(e) || In(e))
    },
    wr = function(e, t) {
     return null != e && yr(e, t, br)
    },
    Ar = function(e, t) {
     return or(e) && Qo(t) ? er(mr(e), t) : function(n) {
      var i = vr(n, e);
      return void 0 === i && i === t ? wr(n, e) : Ko(t, i, 3)
     }
    },
    Ir = function(e) {
     return function(t) {
      return null == t ? void 0 : t[e]
     }
    },
    Cr = function(e) {
     return function(t) {
      return gr(t, e)
     }
    },
    xr = function(e) {
     return or(e) ? Ir(mr(e)) : Cr(e)
    },
    Mr = function(e) {
     return "function" == typeof e ? e : null == e ? we : "object" == typeof e ? ht(e) ? Ar(e[0], e[1]) : tr(e) : xr(e)
    },
    Tr = function(e) {
     return Mr("function" == typeof e ? e : Io(e, 1))
    },
    kr = xe ? xe.isConcatSpreadable : void 0,
    Lr = function(e) {
     return ht(e) || In(e) || !!(kr && e && e[kr])
    },
    Sr = function e(t, n, i, o, r) {
     var a = -1,
      s = t.length;
     for (i || (i = Lr), r || (r = []); ++a < s;) {
      var c = t[a];
      0 < n && i(c) ? 1 < n ? e(c, n - 1, i, o, r) : Oi(r, c) : o || (r[r.length] = c)
     }
     return r
    },
    Or = function(e) {
     return null != e && e.length ? Sr(e, 1) : []
    },
    Er = Math.max,
    Pr = function(e, t, n) {
     return t = Er(void 0 === t ? e.length - 1 : t, 0),
      function() {
       for (var i = arguments, o = -1, r = Er(i.length - t, 0), a = Array(r); ++o < r;) a[o] = i[t + o];
       o = -1;
       for (var s = Array(t + 1); ++o < t;) s[o] = i[o];
       return s[t] = n(a), et(e, this, s)
      }
    },
    zr = function(e) {
     return St(Pr(e, void 0, Or), e + "")
    },
    Dr = zr(function(e, t) {
     return dn(e, 256, void 0, void 0, void 0, t)
    }),
    Nr = function(e) {
     return ht(e) ? ur(e, mr) : en(e) ? [e] : _t(lr(pr(e)))
    },
    Br = {
     ary: fn,
     assign: $n,
     clone: Co,
     curry: Mo,
     forEach: Ot,
     isArray: ht,
     isError: Oo,
     isFunction: Ne,
     isWeakMap: Eo,
     iteratee: Tr,
     keys: Wn,
     rearg: Dr,
     toInteger: ln,
     toPath: Nr
    },
    jr = function(e, t, n) {
     return ye(Br, e, t, n)
    },
    Rr = jr("get", vr);
   Rr.placeholder = ve;
   var Wr = Rr,
    Ur = function(e, t, n) {
     (void 0 === n || pn(e[t], n)) && (void 0 !== n || t in e) || hn(e, t, n)
    },
    Fr = function(e) {
     return function(e, t, n) {
      for (var i = -1, o = Object(e), r = n(e), a = r.length; a--;) {
       var s = r[++i];
       if (!1 === t(o[s], s, o)) break
      }
      return e
     }
    }(),
    $r = function(e) {
     return pt(e) && Un(e)
    },
    Hr = function(e, t) {
     return "__proto__" == t ? void 0 : e[t]
    },
    qr = function(e) {
     return gn(e, Ai(e))
    },
    Vr = function(e, t, n, i, o, r, a) {
     var s = Hr(e, n),
      c = Hr(t, n),
      l = a.get(c);
     if (l) Ur(e, n, l);
     else {
      var u = r ? r(s, c, n + "", e, t, a) : void 0,
       d = void 0 === u;
      if (d) {
       var f = ht(c),
        h = !f && xn(c),
        p = !f && !h && En(c);
       u = c, f || h || p ? u = ht(s) ? s : $r(s) ? _t(s) : h ? Ci(c, !(d = !1)) : p ? lo(c, !(d = !1)) : [] : So(c) || In(c) ? In(u = s) ? u = qr(s) : (!De(s) || i && Ne(s)) && (u = fo(c)) : d = !1
      }
      d && (a.set(c, u), o(u, c, i, r, a), a.delete(c)), Ur(e, n, u)
     }
    },
    Gr = function e(t, n, i, o, r) {
     t !== n && Fr(n, function(a, s) {
      if (De(a)) r || (r = new vi), Vr(t, n, s, i, e, o, r);
      else {
       var c = o ? o(Hr(t, s), a, s + "", t, n, r) : void 0;
       void 0 === c && (c = a), Ur(t, s, c)
      }
     }, Ai)
    },
    Jr = function(e, t) {
     return St(Pr(e, t, we), e + "")
    },
    Yr = function(e, t, n) {
     if (!De(n)) return !1;
     var i = typeof t;
     return !!("number" == i ? Un(n) && $t(t, n.length) : "string" == i && t in n) && pn(n[t], e)
    },
    Kr = function(e) {
     return Jr(function(t, n) {
      var i = -1,
       o = n.length,
       r = 1 < o ? n[o - 1] : void 0,
       a = 2 < o ? n[2] : void 0;
      for (r = 3 < e.length && "function" == typeof r ? (o--, r) : void 0, a && Yr(n[0], n[1], a) && (r = o < 3 ? void 0 : r, o = 1), t = Object(t); ++i < o;) {
       var s = n[i];
       s && e(t, s, i)
      }
      return t
     })
    }(function(e, t, n) {
     Gr(e, t, n)
    }),
    Zr = jr("merge", Kr);
   Zr.placeholder = ve;
   var Qr = Zr,
    Xr = function() {
     return "" + 1e4 * Math.random()
    },
    ea = function() {
     return {
      url: document.location.href,
      title: document.title
     }
    },
    ta = "MOBILE",
    na = jr("flowRight", function(e) {
     return zr(function(e) {
      var t = e.length,
       n = t,
       i = ft.prototype.thru;
      for (e.reverse(); n--;) {
       var o = e[n];
       if ("function" != typeof o) throw new TypeError("Expected a function");
       if (i && !r && "wrapper" == dt(o)) var r = new ft([], !0)
      }
      for (n = r ? n : t; ++n < t;) {
       var a = dt(o = e[n]),
        s = "wrapper" == a ? ct(o) : void 0;
       r = s && bt(s[0]) && 424 == s[1] && !s[4].length && 1 == s[9] ? r[dt(s[0])].apply(r, s[3]) : 1 == o.length && bt(o) ? r[a]() : r.thru(o)
      }
      return function() {
       var n = arguments,
        i = n[0];
       if (r && 1 == n.length && ht(i)) return r.plant(i).value();
       for (var o = 0, a = t ? e[o].apply(this, n) : i; ++o < t;) a = e[o].call(this, a);
       return a
      }
     })
    }());
   na.placeholder = ve;
   var ia = na,
    oa = function(e, t, n, i) {
     var o = -1,
      r = null == e ? 0 : e.length;
     for (i && r && (n = e[++o]); ++o < r;) n = t(n, e[o], o, e);
     return n
    },
    ra = function(e, t) {
     return function(t, n) {
      if (null == t) return t;
      if (!Un(t)) return e(t, n);
      for (var i = t.length, o = -1, r = Object(t); ++o < i && !1 !== n(r[o], o, r););
      return t
     }
    }(function(e, t) {
     return e && Fr(e, t, Fn)
    }),
    aa = function(e, t, n, i, o) {
     return o(e, function(e, o, r) {
      n = i ? (i = !1, e) : t(n, e, o, r)
     }), n
    },
    sa = jr("reduce", function(e, t, n) {
     var i = ht(e) ? oa : aa,
      o = arguments.length < 3;
     return i(e, Mr(t), n, o, ra)
    });
   sa.placeholder = ve;
   var ca = sa,
    la = function(e, t, n, i) {
     if (!De(e)) return e;
     for (var o = -1, r = (t = _r(t, e)).length, a = r - 1, s = e; null != s && ++o < r;) {
      var c = mr(t[o]),
       l = n;
      if (o != a) {
       var u = s[c];
       void 0 === (l = i ? i(u, c, s) : void 0) && (l = De(u) ? u : $t(t[o + 1]) ? [] : {})
      }
      mn(s, c, l), s = s[c]
     }
     return e
    },
    ua = jr("set", function(e, t, n) {
     return null == e ? e : la(e, t, n)
    });
   ua.placeholder = ve;
   var da = ua,
    fa = jr("eq", pn);
   fa.placeholder = ve;
   var ha = fa,
    pa = function(e, t) {
     var n = [];
     return ra(e, function(e, i, o) {
      t(e, i, o) && n.push(e)
     }), n
    },
    _a = jr("filter", function(e, t) {
     return (ht(e) ? xi : pa)(e, Mr(t))
    });
   _a.placeholder = ve;
   var ma = _a,
    ga = {
     cap: !1,
     curry: !1,
     fixed: !1,
     immutable: !1,
     rearg: !1
    },
    va = jr("head", function(e) {
     return e && e.length ? e[0] : void 0
    }, ga);
   va.placeholder = ve;
   var ba = va,
    ya = Object.prototype.hasOwnProperty,
    wa = function(e, t) {
     return null != e && ya.call(e, t)
    },
    Aa = jr("has", function(e, t) {
     return null != e && yr(e, t, wa)
    });
   Aa.placeholder = ve;
   var Ia = Aa,
    Ca = jr("isNil", function(e) {
     return null == e
    }, ga);
   Ca.placeholder = ve;
   var xa = Ca,
    Ma = function(e, t) {
     var n = -1,
      i = Un(e) ? Array(e.length) : [];
     return ra(e, function(e, o, r) {
      i[++n] = t(e, o, r)
     }), i
    },
    Ta = jr("map", function(e, t) {
     return (ht(e) ? ur : Ma)(e, Mr(t))
    });
   Ta.placeholder = ve;
   var ka = Ta,
    La = jr("mergeAll", Kr);
   La.placeholder = ve;
   var Sa = La,
    Oa = function(e) {
     if ("function" != typeof e) throw new TypeError("Expected a function");
     return function() {
      var t = arguments;
      switch (t.length) {
       case 0:
        return !e.call(this);
       case 1:
        return !e.call(this, t[0]);
       case 2:
        return !e.call(this, t[0], t[1]);
       case 3:
        return !e.call(this, t[0], t[1], t[2])
      }
      return !e.apply(this, t)
     }
    },
    Ea = function(e, t, n) {
     for (var i = -1, o = t.length, r = {}; ++i < o;) {
      var a = t[i],
       s = gr(e, a);
      n(s, a) && la(r, _r(a, e), s)
     }
     return r
    },
    Pa = function(e, t) {
     if (null == e) return {};
     var n = ur(Bi(e), function(e) {
      return [e]
     });
     return t = Mr(t), Ea(e, n, function(e, n) {
      return t(e, n[0])
     })
    },
    za = jr("omitBy", function(e, t) {
     return Pa(e, Oa(Mr(t)))
    });
   za.placeholder = ve;
   var Da = za,
    Na = function(e, t) {
     return ur(t, function(t) {
      return [t, e[t]]
     })
    },
    Ba = function(e) {
     var t = -1,
      n = Array(e.size);
     return e.forEach(function(e) {
      n[++t] = [e, e]
     }), n
    },
    ja = jr("toPairs", function(e) {
     return function(t) {
      var n = Qi(t);
      return "[object Map]" == n ? jo(t) : "[object Set]" == n ? Ba(t) : Na(t, e(t))
     }
    }(Fn), ga);
   ja.placeholder = ve;
   var Ra = ja,
    Wa = function(e, t, n) {
     for (var i = -1, o = null == e ? 0 : e.length; ++i < o;)
      if (n(t, e[i])) return !0;
     return !1
    },
    Ua = function(e, t, n, i) {
     var o = -1,
      r = Nt,
      a = !0,
      s = e.length,
      c = [],
      l = t.length;
     if (!s) return c;
     n && (t = ur(t, Ln(n))), i ? (r = Wa, a = !1) : t.length < 200 || (r = No, a = !1, t = new zo(t));
     e: for (; ++o < s;) {
      var u = e[o],
       d = null == n ? u : n(u);
      if (u = i || 0 !== u ? u : 0, a && d == d) {
       for (var f = l; f--;)
        if (t[f] === d) continue e;
       c.push(u)
      } else r(t, d, i) || c.push(u)
     }
     return c
    };
   jr("without", Jr(function(e, t) {
    return $r(e) ? Ua(e, t) : []
   })).placeholder = ve;
   var Fa = jr("identity", we, ga);
   Fa.placeholder = ve;
   var $a = Fa;
   jr("overSome", function(e) {
    return zr(function(t) {
     return t = ur(t, Ln(Mr)), Jr(function(n) {
      var i = this;
      return e(t, function(e) {
       return et(e, i, n)
      })
     })
    })
   }(Do)).placeholder = ve;
   var Ha = function() {
     var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : $a;
     return "function" == typeof e ? function(t) {
      return e(t)
     } : null
    },
    qa = function() {
     return ia(Sa, ka(function() {
      var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "key",
       t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "value",
       n = Ha(e) || Wr(e),
       i = Ha(t) || Wr(t);
      return function(e) {
       var t;
       return (t = {})[n(e)] = i(e), t
      }
     }.apply(void 0, arguments)))
    },
    Va = function(e) {
     return ma(ia(Ia(ve, e), ba), Ra(e))
    },
    Ga = (Da(xa), "chatio-eye-grabber"),
    Ja = {
     configurator: {
      showWidgetThumbnail: !1,
      showMinimizedColorPicker: !1,
      title: "LiveChat widget configurator"
     },
     chatWindow: {
      isAtTheBottom: !0,
      scrollHeight: 0,
      state: _e,
      embedded: !(window.top === window.self),
      input: {
       placeholder: "Type a message here...",
       shouldFocus: !0
      }
     },
     environment: {
      userAgent: navigator.userAgent,
      platform: g(navigator.userAgent)
     },
     licenseSettings: {
      horizontal_position: {
       edge: "right",
       value: "0px"
      },
      width: "400px",
      height: "100%",
      styles: {
       style_name: "light",
       minimized: {
        color: "#509ee3",
        hide: !1,
        style: "bubble"
       }
      },
      title: "LiveChat Support Team",
      placeholder: "Type a message here...",
      minimized_title: "Chat now!"
     },
     customLicenceProperties: {
      prechat_disabled: !1,
      custom_banner: {
       enabled: !1
      }
     }
    },
    Ya = ia(ca(function(e, t) {
     return da(t[0], t[1], e)
    }, {}), Va),
    Ka = ia(ha(_e), Wr("view.chatWindow.state")),
    Za = ia(ha(pe), Wr("view.chatWindow.state")),
    Qa = (Wr("view.chatWindow.state"), Wr("view.environment.platform")),
    Xa = function(e) {
     for (var t = Object.keys(e), n = {}, i = 0; i < t.length; i++) {
      var o = t[i];
      "function" == typeof e[o] && (n[o] = e[o])
     }
     var r, a = Object.keys(n),
      s = void 0;
     try {
      Object.keys(r = n).forEach(function(e) {
       var t = r[e];
       if (void 0 === t(void 0, {
         type: X.INIT
        })) throw Error('Reducer "' + e + "\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");
       if (void 0 === t(void 0, {
         type: "@@redux/PROBE_UNKNOWN_ACTION_" + Math.random().toString(36).substring(7).split("").join(".")
        })) throw Error('Reducer "' + e + "\" returned undefined when probed with a random type. Don't try to handle " + X.INIT + ' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.')
      })
     } catch (e) {
      s = e
     }
     return function() {
      var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {},
       t = arguments[1];
      if (s) throw s;
      for (var i, o, r = !1, c = {}, l = 0; l < a.length; l++) {
       var u = a[l],
        d = e[u],
        f = (0, n[u])(d, t);
       if (void 0 === f) {
        var h = (o = void 0, "Given action " + ((o = (i = t) && i.type) && '"' + o + '"' || "an action") + ', reducer "' + u + '" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.');
        throw Error(h)
       }
       c[u] = f, r = r || f !== d
      }
      return r ? c : e
     }
    }({
     app: function() {
      var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : ie;
      switch (arguments[1].type) {
       case "APP_LOADED":
        return ne({}, e, {
         loaded: !0
        });
       case "APP_SET_UP":
        return ne({}, e, {
         setUp: !0
        });
       case "APP_READY":
        return ne({}, e, {
         ready: !0
        });
       default:
        return e
      }
     },
     view: function() {
      var e, t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : Ja,
       n = arguments[1];
      switch (n.type) {
       case oe:
        return ne({}, t, {
         hidden: !0
        });
       case "persist/REHYDRATE":
        var i = Wr("payload.view.chatWindow.state", n) || Ja.chatWindow.state,
         o = Wr("payload.view.eyeGrabber", n);
        return ne({}, t, {
         chatWindow: ne({}, t.chatWindow, {
          state: i
         }),
         eyeGrabber: o
        });
       case re:
        return ne({}, t, {
         eyeGrabber: ne({}, t.eyeGrabber, {
          closedTimestamp: n.timestamp
         })
        });
       case ae:
        return ne({}, t, {
         eyeGrabber: ne({}, t.eyeGrabber, {
          firstVisit: n.timestamp
         })
        });
       case se:
        return ne({}, t, {
         eyeGrabber: ne({}, t.eyeGrabber, {
          timerCompleted: !0
         })
        });
       case "ACTIVE_THREAD_CHANGED":
        return ne({}, t, {
         chatWindow: ne({}, t.chatWindow, {
          lastActiveThread: n.thread
         })
        });
       case le:
        return ne({}, t, {
         chatWindow: ne({}, t.chatWindow, {
          state: _e
         })
        });
       case ce:
        return ne({}, t, {
         chatWindow: ne({}, t.chatWindow, {
          state: pe
         }),
         hidden: !1
        });
       case fe:
        return ne({}, t, {
         environment: ne({}, t.environment, (e = {}, e[n.property] = n.value, e))
        });
       case he:
        return ne({}, t, {
         licenseSettings: Qr(t.licenseSettings, Ya(n.licenseSettings))
        });
       default:
        return t
      }
     }
    }),
    es = function(e) {
     var t = null == e ? 0 : e.length;
     return t ? e[t - 1] : void 0
    },
    ts = function(e, t, n) {
     var i = -1,
      o = e.length;
     t < 0 && (t = o < -t ? 0 : o + t), (n = o < n ? o : n) < 0 && (n += o), o = n < t ? 0 : n - t >>> 0, t >>>= 0;
     for (var r = Array(o); ++i < o;) r[i] = e[i + t];
     return r
    },
    ns = function(e, t) {
     return t.length < 2 ? e : gr(e, ts(t, 0, -1))
    },
    is = function(e, t) {
     return t = _r(t, e), null == (e = ns(e, t)) || delete e[mr(es(t))]
    },
    os = function(e) {
     return So(e) ? void 0 : e
    };
   jr("omit", zr(function(e, t) {
    var n = {};
    if (null == e) return n;
    var i = !1;
    t = ur(t, function(t) {
     return t = _r(t, e), i || (i = 1 < t.length), t
    }), gn(e, Bi(e), n), i && (n = Io(n, 7, os));
    for (var o = t.length; o--;) is(n, t[o]);
    return n
   })).placeholder = ve;
   var rs = function(e) {
     return function(t) {
      return null == e ? void 0 : e[t]
     }
    }({
     "À": "A",
     "Á": "A",
     "Â": "A",
     "Ã": "A",
     "Ä": "A",
     "Å": "A",
     "à": "a",
     "á": "a",
     "â": "a",
     "ã": "a",
     "ä": "a",
     "å": "a",
     "Ç": "C",
     "ç": "c",
     "Ð": "D",
     "ð": "d",
     "È": "E",
     "É": "E",
     "Ê": "E",
     "Ë": "E",
     "è": "e",
     "é": "e",
     "ê": "e",
     "ë": "e",
     "Ì": "I",
     "Í": "I",
     "Î": "I",
     "Ï": "I",
     "ì": "i",
     "í": "i",
     "î": "i",
     "ï": "i",
     "Ñ": "N",
     "ñ": "n",
     "Ò": "O",
     "Ó": "O",
     "Ô": "O",
     "Õ": "O",
     "Ö": "O",
     "Ø": "O",
     "ò": "o",
     "ó": "o",
     "ô": "o",
     "õ": "o",
     "ö": "o",
     "ø": "o",
     "Ù": "U",
     "Ú": "U",
     "Û": "U",
     "Ü": "U",
     "ù": "u",
     "ú": "u",
     "û": "u",
     "ü": "u",
     "Ý": "Y",
     "ý": "y",
     "ÿ": "y",
     "Æ": "Ae",
     "æ": "ae",
     "Þ": "Th",
     "þ": "th",
     "ß": "ss",
     "Ā": "A",
     "Ă": "A",
     "Ą": "A",
     "ā": "a",
     "ă": "a",
     "ą": "a",
     "Ć": "C",
     "Ĉ": "C",
     "Ċ": "C",
     "Č": "C",
     "ć": "c",
     "ĉ": "c",
     "ċ": "c",
     "č": "c",
     "Ď": "D",
     "Đ": "D",
     "ď": "d",
     "đ": "d",
     "Ē": "E",
     "Ĕ": "E",
     "Ė": "E",
     "Ę": "E",
     "Ě": "E",
     "ē": "e",
     "ĕ": "e",
     "ė": "e",
     "ę": "e",
     "ě": "e",
     "Ĝ": "G",
     "Ğ": "G",
     "Ġ": "G",
     "Ģ": "G",
     "ĝ": "g",
     "ğ": "g",
     "ġ": "g",
     "ģ": "g",
     "Ĥ": "H",
     "Ħ": "H",
     "ĥ": "h",
     "ħ": "h",
     "Ĩ": "I",
     "Ī": "I",
     "Ĭ": "I",
     "Į": "I",
     "İ": "I",
     "ĩ": "i",
     "ī": "i",
     "ĭ": "i",
     "į": "i",
     "ı": "i",
     "Ĵ": "J",
     "ĵ": "j",
     "Ķ": "K",
     "ķ": "k",
     "ĸ": "k",
     "Ĺ": "L",
     "Ļ": "L",
     "Ľ": "L",
     "Ŀ": "L",
     "Ł": "L",
     "ĺ": "l",
     "ļ": "l",
     "ľ": "l",
     "ŀ": "l",
     "ł": "l",
     "Ń": "N",
     "Ņ": "N",
     "Ň": "N",
     "Ŋ": "N",
     "ń": "n",
     "ņ": "n",
     "ň": "n",
     "ŋ": "n",
     "Ō": "O",
     "Ŏ": "O",
     "Ő": "O",
     "ō": "o",
     "ŏ": "o",
     "ő": "o",
     "Ŕ": "R",
     "Ŗ": "R",
     "Ř": "R",
     "ŕ": "r",
     "ŗ": "r",
     "ř": "r",
     "Ś": "S",
     "Ŝ": "S",
     "Ş": "S",
     "Š": "S",
     "ś": "s",
     "ŝ": "s",
     "ş": "s",
     "š": "s",
     "Ţ": "T",
     "Ť": "T",
     "Ŧ": "T",
     "ţ": "t",
     "ť": "t",
     "ŧ": "t",
     "Ũ": "U",
     "Ū": "U",
     "Ŭ": "U",
     "Ů": "U",
     "Ű": "U",
     "Ų": "U",
     "ũ": "u",
     "ū": "u",
     "ŭ": "u",
     "ů": "u",
     "ű": "u",
     "ų": "u",
     "Ŵ": "W",
     "ŵ": "w",
     "Ŷ": "Y",
     "ŷ": "y",
     "Ÿ": "Y",
     "Ź": "Z",
     "Ż": "Z",
     "Ž": "Z",
     "ź": "z",
     "ż": "z",
     "ž": "z",
     "Ĳ": "IJ",
     "ĳ": "ij",
     "Œ": "Oe",
     "œ": "oe",
     "ŉ": "'n",
     "ſ": "s"
    }),
    as = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
    ss = /[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]/g,
    cs = function(e) {
     return (e = pr(e)) && e.replace(as, rs).replace(ss, "")
    },
    ls = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
    us = function(e) {
     return e.match(ls) || []
    },
    ds = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
    fs = function(e) {
     return ds.test(e)
    },
    hs = "\\ud800-\\udfff",
    ps = "\\u2700-\\u27bf",
    _s = "a-z\\xdf-\\xf6\\xf8-\\xff",
    ms = "A-Z\\xc0-\\xd6\\xd8-\\xde",
    gs = "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
    vs = "[" + gs + "]",
    bs = "[" + _s + "]",
    ys = "[^" + hs + gs + "\\d+" + ps + _s + ms + "]",
    ws = "(?:\\ud83c[\\udde6-\\uddff]){2}",
    As = "[\\ud800-\\udbff][\\udc00-\\udfff]",
    Is = "[" + ms + "]",
    Cs = "(?:" + bs + "|" + ys + ")",
    xs = "(?:['’](?:d|ll|m|re|s|t|ve))?",
    Ms = "(?:['’](?:D|LL|M|RE|S|T|VE))?",
    Ts = "(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?",
    ks = "[\\ufe0e\\ufe0f]?",
    Ls = ks + Ts + "(?:\\u200d(?:" + ["[^" + hs + "]", ws, As].join("|") + ")" + ks + Ts + ")*",
    Ss = "(?:" + ["[\\u2700-\\u27bf]", ws, As].join("|") + ")" + Ls,
    Os = RegExp([Is + "?" + bs + "+" + xs + "(?=" + [vs, Is, "$"].join("|") + ")", "(?:[A-Z\\xc0-\\xd6\\xd8-\\xde]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+" + Ms + "(?=" + [vs, Is + Cs, "$"].join("|") + ")", Is + "?" + Cs + "+" + xs, Is + "+" + Ms, "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])|\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", "\\d+", Ss].join("|"), "g"),
    Es = function(e) {
     return e.match(Os) || []
    },
    Ps = function(e, t, n) {
     return e = pr(e), void 0 === (t = n ? void 0 : t) ? fs(e) ? Es(e) : us(e) : e.match(t) || []
    },
    zs = /['’]/g;
   jr("snakeCase", function(e) {
    return function(t) {
     return oa(Ps(cs(t).replace(zs, "")), e, "")
    }
   }(function(e, t, n) {
    return e + (n ? "_" : "") + t.toLowerCase()
   }), ga).placeholder = ve;
   var Ds = function(e) {
     return {
      type: "DISPLAY_INVITATION",
      message: e.message,
      user: e.user,
      tag: e.tag,
      saga: e.saga
     }
    },
    Ns = function(e) {
     return {
      type: "INJECT_EVENT",
      event: e
     }
    },
    Bs = function(e) {
     return {
      type: de,
      data: e
     }
    },
    js = function() {
     return {
      type: ce
     }
    },
    Rs = function() {
     return {
      type: le
     }
    },
    Ws = function(e, t) {
     return {
      type: fe,
      property: e,
      value: t
     }
    },
    Us = function(e) {
     return {
      type: de,
      data: {
       page: e
      }
     }
    },
    Fs = function() {
     return {
      type: ue
     }
    },
    $s = function(e) {
     return {
      type: he,
      licenseSettings: e
     }
    },
    Hs = function(e, t) {
     return Ea(e, t, function(t, n) {
      return wr(e, n)
     })
    },
    qs = jr("pick", zr(function(e, t) {
     return null == e ? {} : Hs(e, t)
    }));
   qs.placeholder = ve;
   var Vs = qs,
    Gs = null,
    Js = function(e, t, n) {
     return Wr(n, e) !== Wr(n, t)
    },
    Ys = function(e) {
     var t, n, i, o, r, a = e.state,
      s = e.appContainer,
      c = e.body,
      l = e.viewport;
     Ka(a) ? function(e) {
      var t = e.state,
       n = e.appContainer,
       i = e.body,
       o = e.viewport;
      clearTimeout(Gs);
      var r = "bubble" === t.view.licenseSettings.styles.minimized.style;
      Gs = setTimeout(function() {
       b({
        width: r ? "108.250px" : "300px",
        height: r ? "108.250px" : "65px"
       }, n), Qa(t) === ta && (b(Vs(["position", "width", "height", "left", "right", "top", "bottom", "overflow-y"], t.view.environment.body), i), o.content = t.view.environment.viewport)
      }, 300)
     }({
      state: a,
      appContainer: s,
      body: c,
      viewport: l
     }) : (n = (t = {
      state: a,
      appContainer: s,
      body: c,
      viewport: l
     }).state, i = t.appContainer, o = t.body, r = t.viewport, clearTimeout(Gs), Qa(n) === ta ? (b({
      width: "100%",
      height: "100%"
     }, i), b({
      position: "fixed",
      "overflow-y": "hidden",
      width: "100%",
      height: "100%",
      left: "0",
      right: "0",
      top: "0",
      bottom: "0"
     }, o), r.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no") : b(Vs(["width", "height"], n.view.licenseSettings), i))
    },
    Ks = function(e) {
     var t, n, i, o = e.state,
      r = e.prevState,
      a = e.body,
      s = e.appContainer,
      c = e.viewport;
     Js(r, o, "view") && (Js(r, o, "view.licenseSettings.horizontal_position.edge") && !te() && (i = (n = (t = {
      state: o,
      appContainer: s
     }).state.view.licenseSettings.horizontal_position).value, b("right" !== n.edge ? {
      right: "auto",
      left: i
     } : {
      right: i,
      left: "auto"
     }, t.appContainer)), Js(r, o, "view.chatWindow.state") && !te() && Ys({
      state: o,
      appContainer: s,
      body: a,
      viewport: c
     }), Ka(o) || (Js(r, o, "view.licenseSettings.width") && Qa(o) !== ta && b(Vs(["width"], o.view.licenseSettings), s), Js(r, o, "view.licenseSettings.height") && Qa(o) !== ta && b(Vs(["height"], o.view.licenseSettings), s)))
    },
    Zs = function(e, t) {
     var n, i = document.body,
      o = document.querySelector('meta[name="viewport"]') || ((n = document.createElement("meta")).name = "viewport", document.getElementsByTagName("head")[0].appendChild(n), n),
      r = {
       position: v("position", i),
       "overflow-y": v("overflow-y", i),
       width: v("width", i),
       height: v("height", i),
       left: v("left", i),
       right: v("right", i),
       top: v("top", i),
       bottom: v("bottom", i)
      };
     e.dispatch(Ws("viewport", o.content || "")), e.dispatch(Ws("body", r)), Ys({
      state: e.getState(),
      appContainer: t,
      body: i,
      viewport: o
     });
     var a = e.getState();
     e.subscribe(function() {
      var n = e.getState();
      Ks({
       state: n,
       prevState: a,
       body: i,
       appContainer: t,
       viewport: o
      }), a = n
     })
    },
    Qs = jr("isEqual", function(e, t) {
     return Ko(e, t)
    });
   Qs.placeholder = ve;
   var Xs = Qs,
    ec = {
     visibility: "visible",
     opacity: 1,
     "z-index": "2147483639"
    },
    tc = setTimeout;
   A.prototype.catch = function(e) {
    return this.then(null, e)
   }, A.prototype.then = function(e, t) {
    var n = new this.constructor(w);
    return I(this, new T(e, t, n)), n
   }, A.prototype.finally = function(e) {
    var t = this.constructor;
    return this.then(function(n) {
     return t.resolve(e()).then(function() {
      return n
     })
    }, function(n) {
     return t.resolve(e()).then(function() {
      return t.reject(n)
     })
    })
   }, A.all = function(e) {
    return new A(function(t, n) {
     function i(e, a) {
      try {
       if (a && ("object" == typeof a || "function" == typeof a)) {
        var s = a.then;
        if ("function" == typeof s) return void s.call(a, function(t) {
         i(e, t)
        }, n)
       }
       o[e] = a, 0 == --r && t(o)
      } catch (a) {
       n(a)
      }
     }
     if (!e || void 0 === e.length) throw new TypeError("Promise.all accepts an array");
     var o = Array.prototype.slice.call(e);
     if (0 === o.length) return t([]);
     for (var r = o.length, a = 0; a < o.length; a++) i(a, o[a])
    })
   }, A.resolve = function(e) {
    return e && "object" == typeof e && e.constructor === A ? e : new A(function(t) {
     t(e)
    })
   }, A.reject = function(e) {
    return new A(function(t, n) {
     n(e)
    })
   }, A.race = function(e) {
    return new A(function(t, n) {
     for (var i = 0, o = e.length; i < o; i++) e[i].then(t, n)
    })
   }, A._immediateFn = "function" == typeof setImmediate && function(e) {
    setImmediate(e)
   } || function(e) {
    tc(e, 0)
   }, A._unhandledRejectionFn = function(e) {
    void 0 !== console && console && console.warn("Possible Unhandled Promise Rejection:", e)
   };
   var nc, ic = /native code/.test(window.Promise) ? window.Promise : A,
    oc = ec,
    rc = function(e) {
     b(oc, e), oc = null
    },
    ac = void 0,
    sc = function(e, t) {
     return function(n) {
      var i = n.dispatch,
       o = n.getState;
      return function(n) {
       return function(r) {
        switch (r.type) {
         case "CHECK_BROWSER_NOTIFICATION_PERMISSION":
          i({
           type: "BROWSER_NOTIFICATION_PERMISSION",
           permission: Notification.permission
          });
          break;
         case "CREATE_BROWSER_NOTIFICATION":
          ac && ac.close(), (ac = new Notification(r.title, r.spec)).onclick = function() {
           window.focus(), ac.close(), i({
            type: "LOG_TO_AMPLITUDE",
            eventName: "Notification clicked",
            params: r.amplitudeParams
           })
          };
          break;
         case oe:
          o().app.setUp && (a = e, oc = Sa(["visibility", "opacity", "zIndex"].map(function(e) {
           var t;
           return (t = {})[e] = a.style.getPropertyValue(e), t
          }))), b({
           visibility: "hidden",
           opacity: 0,
           zIndex: "-1"
          }, e);
          break;
         case "incoming_chat_thread":
          t.on_chat_started();
          break;
         case ce:
          o().view.hidden && rc(e), t.on_chat_window_opened();
          break;
         case le:
          if (o().view.hidden) break;
          t.on_chat_window_minimized();
          break;
         case "REQUEST_BROWSER_NOTIFICATION_PERMISSION":
          new ic(function(e) {
           var t = Notification.requestPermission(e);
           t && "function" == typeof t.then && t.then(e)
          }).then(function(e) {
           i({
            type: "BROWSER_NOTIFICATION_PERMISSION_CHOSEN",
            permission: e
           })
          });
          break;
         case ue:
          o().view.hidden && rc(e)
        }
        var a;
        return n(r)
       }
      }
     }
    },
    cc = function(e) {
     var i;
     return n(function() {
      for (var e = arguments.length, t = Array(e), i = 0; i < e; i++) t[i] = arguments[i];
      return function(e) {
       return function(i, o, r) {
        var a, s = e(i, o, r),
         c = s.dispatch,
         l = {
          getState: s.getState,
          dispatch: function(e) {
           return c(e)
          }
         };
        return a = t.map(function(e) {
         return e(l)
        }), c = n.apply(void 0, a)(s.dispatch), ee({}, s, {
         dispatch: c
        })
       }
      }
     }((i = e.port, function() {
      var e = void 0;
      return i.addEventListener("message", function(t) {
        var n = t.data;
        n.action && e(n.action)
       }),
       function(t) {
        return e = t,
         function(e) {
          return i.postMessage({
           action: e
          }), t(e)
         }
       }
     }), sc(e.container, e.LC2_API)), function(e) {
      return e
     })(t)
    },
    lc = "message",
    uc = "agent",
    dc = "add_listener",
    fc = "dispatch",
    hc = "display_invitation",
    pc = "inject_event",
    _c = "maximize_chat_window",
    mc = "minimize_chat_window",
    gc = "reveal_chat_window",
    vc = "set_customer_details",
    bc = "set_settings",
    yc = ((nc = {})[dc] = !0, nc[hc] = !0, nc[_c] = !0, nc[gc] = !0, nc[bc] = !0, nc[vc] = !0, nc[mc] = !0, nc);
   te() && (yc[pc] = !0, yc[fc] = !0);
   var wc = function(e, t) {
     t.visitor_engaged = function() {
      return !0
     }, t.hide_chat_window = function() {
      e.dispatch({
       type: oe
      }), e.dispatch(Rs())
     }, t.open_chat_window = t.show_full_view = t.open_mobile_window = function() {
      e.dispatch(js())
     }, t.set_custom_variables = function(t) {
      return e.dispatch(Bs(ne({}, qa("name")(t))))
     }, t.get_chats_number = function() {}, t.get_window_type = function() {
      return "embedded"
     }, t.chat_window_maximized = function() {
      return Za(e.getState())
     }, t.chat_window_minimized = function() {
      return Ka(e.getState())
     }, t.chat_window_hidden = function() {
      return e.getState().view.hidden
     }, t.visitor_queued = function() {
      return !1
     }, t.chat_running = function() {}, t.agents_are_available = function() {
      return !0
     }, t.minimize_chat_window = function() {
      return e.dispatch(Rs())
     }, t.hide_eye_catcher = function() {}, t.set_visitor_name = function(t) {
      return e.dispatch(Bs({
       name: t
      }))
     }, t.set_visitor_email = function(t) {
      return e.dispatch(Bs({
       email: t
      }))
     }, t.get_visitor_id = function() {}, t.get_chat_id = function() {}, t.embedded_chat_supported = t.embedded_chat_enabled = function() {
      return !0
     }, t.start_chat = function(t) {
      var n, i, o, r;
      t ? e.dispatch((i = (n = {
       text: t
      }).text, o = n.source, r = {
       type: "SEND_MESSAGE",
       id: Xr(),
       text: i,
       timestamp: Date.now()
      }, o && (r.meta = {
       source: o
      }), r)) : e.dispatch(js())
     }, t.close_chat = function() {
      return e.dispatch({
       type: "close_thread"
      })
     }
    },
    Ac = function(e, t) {
     var n, i = (n = n || Object.create(null), {
      on: function(e, t) {
       (n[e] || (n[e] = [])).push(t)
      },
      off: function(e, t) {
       n[e] && n[e].splice(n[e].indexOf(t) >>> 0, 1)
      },
      emit: function(e, t) {
       (n[e] || []).slice().map(function(e) {
        e(t)
       }), (n["*"] || []).slice().map(function(n) {
        n(e, t)
       })
      }
     });
     return e.addEventListener("message", function(e) {
      var n = e.data;
      if (n.event) {
       var o = n.event,
        r = o.type,
        a = o.data;
       i.emit(r, a);
       var s = "on_" + r;
       "function" == typeof t[s] && t[s](a)
      }
     }), i
    },
    Ic = function(e, t) {
     return new ic(function n(i) {
      try {
       e.appendChild(t), i(t)
      } catch (e) {
       setTimeout(function() {
        return n(i)
       }, 50)
      }
     })
    },
    Cc = ["allowtransparency", "draggable", "id", "frameborder", "name", "scrolling", "src", "onload", "href", "onclick", "onmouseover", "onmouseout"],
    xc = function(e) {
     var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {},
      n = document.createElement(e);
     for (var i in t)
      if (t.hasOwnProperty(i)) {
       var o = t[i]; - 1 === Cc.indexOf(i) ? n.style[i] = o : n.setAttribute(i, o)
      }
     return n
    },
    Mc = function(e) {
     return Wr("view.eyeGrabber.firstVisit", e)
    },
    Tc = function(e) {
     return !Wr("view.eyeGrabber.closedTimestamp", e) && !Za(e) && Wr("view.eyeGrabber.timerCompleted", e) && !Wr("view.chatWindow.lastActiveThread", e) && !!Wr("app.ready", e)
    },
    kc = function(e, t, n) {
     if (g(navigator.userAgent) !== ta && n.lc3 && n.enabled) {
      Mc(e.getState()) || e.dispatch((l = Date.now(), {
       type: ae,
       timestamp: l
      }));
      var i = function(e, t, n, i, o) {
       var r = xc("div", {
         display: "none",
         border: 0,
         bottom: 0,
         right: 0,
         height: 0,
         id: "chatio-eye-grabber-container",
         position: "fixed",
         width: 0,
         zIndex: 2147483700
        }),
        a = xc("iframe", {
         allowtransparency: !0,
         border: 0,
         bottom: 0,
         float: "none",
         frameborder: 0,
         height: "100%",
         id: Ga,
         left: 0,
         name: Ga,
         margin: 0,
         padding: 0,
         position: "absolute",
         right: 0,
         scrolling: "no",
         src: "about:blank",
         top: 0,
         width: "100%"
        }),
        s = xc("a", {
         href: "#",
         display: "block",
         draggable: "false"
        }),
        c = xc("a", {
         id: "x-elem",
         href: "#",
         position: "absolute",
         display: "none",
         top: "0px",
         right: "0px",
         padding: "2px 7px",
         "text-decoration": "none",
         color: "rgba(0, 0, 0, 0.5)",
         "font-size": "20px",
         "font-family": "Arial, sans-serif"
        });
       c.innerHTML = "×";
       var l = xc("img", {
        id: "eye-grabber-img",
        src: e,
        display: "block",
        draggable: "false"
       });
       return l.onload = function() {
        l.style.width = l.naturalWidth / n + "px", l.style.height = l.naturalHeight / n + "px", r.style.right = t.x + "px", r.style.bottom = t.y + "px", r.style.width = l.style.width, r.style.height = l.style.height
       }, a.onload = function() {
        var e = a.contentDocument.body;
        e.style.padding = 0, e.style.margin = 0, Ic(s, l), Ic(e, s), Ic(e, c)
       }, a.onmouseover = function() {
        var e = a.contentWindow.document.getElementById("x-elem");
        e && (e.style.display = "block")
       }, a.onmouseout = function() {
        var e = a.contentWindow.document.getElementById("x-elem");
        e && (e.style.display = "none")
       }, Ic(r, a), s.onclick = i, c.onclick = o, r
      }(n.path, {
       x: (c = n).x,
       y: c.y
      }, (s = n).scale ? s.scale : 2, function() {
       return e.dispatch(js()), !1
      }, function() {
       var t;
       return e.dispatch((t = Date.now(), {
        type: re,
        timestamp: t,
        imageUrl: n.path
       })), !1
      });
      Ic(t, i), e.subscribe(function() {
       var t, o, r, a;
       o = n.path, r = i, (a = Tc((t = e).getState())) !== ("block" === r.style.display) && (a ? (r.style.display = "block", t.dispatch({
        type: "EYE_GRABBER_DISPLAYED",
        imageUrl: o
       })) : r.style.display = "none")
      }), setTimeout(function() {
       e.dispatch({
        type: se
       })
      }, (o = n, r = e.getState(), a = Date.now(), (Mc(r) || a) - a + 1e3 * o.delay))
     }
     var o, r, a, s, c, l
    },
    Lc = function(e) {
     return (t = e, Object.keys(t).map(function(e) {
      return [e, t[e]]
     })).map(function(e) {
      return e.map(encodeURIComponent).join("=")
     }).join("&");
     var t
    },
    Sc = function(e, t) {
     var n;
     return (n = Pc(Ec(t)) || t, n.split("&").map(function(e) {
      return e.split("=").map(decodeURIComponent)
     }).reduce(function(e, t) {
      return e[t[0]] = t[1], e
     }, {}))[e]
    },
    Oc = /.*\?(.+)/,
    Ec = function(e) {
     var t = e.match(Oc);
     return t ? "?" + t[1] : ""
    },
    Pc = function(e) {
     return e.replace(/^\?/, "")
    },
    zc = jr("getOr", vr);
   zc.placeholder = ve;
   var Dc = zc,
    Nc = Math.max,
    Bc = jr("find", function(e) {
     return function(t, n, i) {
      var o = Object(t);
      if (!Un(t)) {
       var r = Mr(n);
       t = Fn(t), n = function(e) {
        return r(o[e], e, o)
       }
      }
      var a = e(t, n, i);
      return -1 < a ? o[r ? t[a] : a] : void 0
     }
    }(function(e, t, n) {
     var i = null == e ? 0 : e.length;
     if (!i) return -1;
     var o = null == n ? 0 : ln(n);
     return o < 0 && (o = Nc(i + o, 0)), Et(e, Mr(t), o)
    }));
   Bc.placeholder = ve;
   var jc = Bc,
    Rc = {
     backgroundColor: "transparent",
     border: 0,
     bottom: 0,
     height: "108.2px",
     id: "chatio-container",
     maxHeight: "100%",
     overflow: "hidden",
     position: "fixed",
     right: 0,
     visibility: "hidden",
     width: "108.2px",
     zIndex: -1
    },
    Wc = function(e) {
     return new ic(function(t) {
      e.custom_selector ? function n() {
       var i = document.getElementById(e.custom_selector);
       i ? t(i) : setTimeout(n, 100)
      }() : t(document.body)
     })
    },
    Uc = function(e) {
     return "https://api.chat.io/customer/open_chat?" + Lc((n = {
      __lc_vv: 3,
      license_id: (t = e).license,
      possible_token: "1"
     }, (i = Sc("host", Pc(location.search))) && (n.host = i), t.preview && (n.preview = !0), t.skip_rehydration && (n.skip_rehydration = 1), n));
     var t, n, i
    };
   return {
    init: function e(t, n, i) {
     if ("undefined" != typeof MessageChannel)
      if (document.body) {
       var o, r = {
         container: xc("div", Rc),
         iframe: xc("iframe", {
          allowtransparency: !0,
          background: "none",
          border: 0,
          bottom: 0,
          float: "none",
          frameborder: 0,
          height: "100%",
          id: "chatio",
          left: 0,
          name: "chatio",
          margin: 0,
          padding: 0,
          position: "absolute",
          right: 0,
          scrolling: "no",
          src: "about:blank",
          top: 0,
          width: "100%"
         })
        },
        a = r.container,
        s = r.iframe;
       Ic(a, s), Wc(n).then(function(e) {
        return Ic(e, a)
       }).then(function() {
        return e = s, t = Uc(n), e.setAttribute("src", t);
        var e, t
       }).then(function() {
        return e = s, new ic(function(t) {
         e.addEventListener("load", function() {
          var n = new MessageChannel,
           i = n.port1;
          e.contentWindow.postMessage("tracking_port", "*", [n.port2]), t(i)
         })
        });
        var e
       }).then(function(e) {
        var o, r, s, c, l, u, d, f, h, p = ((s = cc({
         container: (o = {
          container: a,
          LC2_API: i,
          port: e
         }).container,
         LC2_API: o.LC2_API,
         port: r = o.port
        })(Xa)).startPort = function() {
         return r.start()
        }, s);
        return p.dispatch({
          type: "USE_EXTERNAL_AUTH_TOKEN",
          token: n.access_token || null
         }), delete n.access_token,
         function(e, t, n, i) {
          var o = window.LC_tasks = window.LC_tasks || [],
           r = function() {
            if (!i) return function(t) {
             return L(t[0], t[1], e)
            };
            var t = Ac(i, o);
            return function(n) {
             return L(n[0], n[1], e, t)
            }
           }();
          if (o.forEach(r), o.push = r, t) {
           var a = t.name,
            s = t.nick,
            c = t.email,
            l = qa("name")(t.params || []);
           (a || s) && (l.name = a || s), c && (l.email = c), e.dispatch(Bs(l)), wc(e, n)
          }
         }(p, n, i, e), "function" == typeof i.on_before_load && i.on_before_load({
          widget_version: "3"
         }), p.startPort(), c = p, l = a, u = n, d = i, f = function(e) {
          var t = Dc({}, "group_properties.embedded_chat.eye_grabber", e);
          if (t = da("lc3", !!JSON.parse(t.lc3 + ""), t), t = da("delay", JSON.parse(t.delay + ""), t), t = da("scale", JSON.parse(t.scale + ""), t), t = da("enabled", !1, t), e.embedded_chat.eye_grabber) {
           var n = Dc({}, "embedded_chat.eye_grabber", e);
           t = da("enabled", n.enabled, t), t = da("x", n.x, t), t = da("y", n.y, t), t = da("path", /^(https?:\/\/|\/\/)/.test(n.path) ? n.path : "//cdn.chatio-static.com/api/file/chatio/img/" + n.path, t)
          }
          return t
         }(t), h = c.subscribe(function() {
          c.getState().app.loaded && (h(), y(c, l), u.chatio_disable_eye_grabber || Wc(u).then(function(e) {
           return kc(c, e, f)
          }), "function" == typeof d.on_after_load && d.on_after_load())
         }), p
       }).then((o = t, function(e) {
        if (e.dispatch({
          type: "SET_LOCALIZATION_URL",
          url: o.localization_url
         }), o.custom_licence_properties.length) {
         var t = jc({
          category: "custom"
         }, o.custom_licence_properties);
         t && e.dispatch({
          type: "SET_CUSTOM_LICENSE_PROPERTIES",
          customLicenceProperties: da("prechat_disabled", "1" === t.properties.prechat_disabled, t.properties)
         })
        }
        e.dispatch({
         type: he,
         licenseSettings: da("styles.minimized.hide", !1, Wr("group_properties.lc3.customization", o))
        }), o.skills_online && 0 === o.skills_online.length && e.dispatch({
         type: "AGENTS_WENT_OFFLINE"
        })
       }))
      } else setTimeout(e, 10)
    }
   }
  }(),
  WidgetBridge = function(e) {
   "use strict";

   function t() {
    return new B(function(e) {
     ! function t() {
      if (!document.body) return void setTimeout(t, 100);
      e(document.body)
     }()
    })
   }

   function n(e) {
    return e.parentNode.removeChild(e)
   }

   function i(e, t) {
    return R.call(t, e)
   }

   function o() {
    return o = Object.assign || function(e) {
     for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), o = 1; o < t; o++) n[o - 1] = arguments[o];
     return n.forEach(function(t) {
      for (var n in t) i(n, t) && (e[n] = t[n])
     }), e
    }, o.apply(void 0, arguments)
   }

   function r(e) {
    return "object" === (void 0 === e ? "undefined" : U(e)) && null !== e && !W(e)
   }

   function a(e, t) {
    for (var n = 0; n < t.length; n++) {
     var i = t[n];
     if (e(i)) return i
    }
   }

   function s(e, t) {
    for (var n = t.length - 1; n >= 0; n--)
     if (e(t[n])) return t[n]
   }

   function c(e, t) {
    return Object.keys(t).forEach(function(n) {
     e(t[n], n)
    })
   }

   function l(e, t) {
    for (var n = "string" == typeof e ? e.split(".") : e, i = 0, o = t; o && i < n.length;) o = o[n[i++]];
    return o
   }

   function u(e, t, n) {
    var i = l(t, n);
    return void 0 !== i && null !== i ? i : e
   }

   function d(e) {
    return 0 === (W(e) ? e : Object.keys(e)).length
   }

   function f(e, t) {
    if (d(t)) return e;
    var n = {};
    return c(function(o, a) {
     i(a, t) ? r(e[a]) && r(t[a]) ? n[a] = f(e[a], t[a]) : n[a] = t[a] : n[a] = e[a]
    }, e), c(function(e, o) {
     i(o, n) || (n[o] = t[o])
    }, t), n
   }

   function h(e) {
    if (0 === e.length) return {};
    var t = e[0];
    return e.slice(1).reduce(function(e, t) {
     return f(e, t)
    }, t)
   }

   function p() {}

   function _(e, t) {
    return e === t ? 0 !== e || 0 !== t || 1 / e == 1 / t : e !== e && t !== t
   }

   function m(e, t) {
    if (_(e, t)) return !0;
    if ("object" !== (void 0 === e ? "undefined" : U(e)) || null === e || "object" !== (void 0 === t ? "undefined" : U(t)) || null === t) return !1;
    var n = Object.keys(e),
     o = Object.keys(t);
    if (n.length !== o.length) return !1;
    for (var r = 0; r < n.length; r++)
     if (!i(n[r], t) || !_(e[n[r]], t[n[r]])) return !1;
    return !0
   }

   function g(e) {
    return Object.keys(e).map(function(t) {
     return [t, e[t]]
    })
   }

   function v(e) {
    var t = e.match(V);
    return t && t[1]
   }

   function b(e) {
    return e = e || Object.create(null), {
     on: function(t, n) {
      (e[t] || (e[t] = [])).push(n)
     },
     off: function(t, n) {
      e[t] && e[t].splice(e[t].indexOf(n) >>> 0, 1)
     },
     emit: function(t, n) {
      (e[t] || []).slice().map(function(e) {
       e(n)
      }), (e["*"] || []).slice().map(function(e) {
       e(t, n)
      })
     }
    }
   }

   function y(e, t) {
    return null != t && null != e && "object" === (void 0 === t ? "undefined" : U(t)) && "object" === (void 0 === e ? "undefined" : U(e)) ? w(t, e) : e
   }

   function w(e, t) {
    var n = void 0;
    if (Array.isArray(e)) {
     n = e.slice(0, t.length);
     for (var i = 0; i < t.length; i++) void 0 !== t[i] && (n[i] = y(t[i], n[i]))
    } else {
     n = $({}, e);
     for (var o in t) t.hasOwnProperty(o) && (void 0 === t[o] ? delete n[o] : n[o] = y(t[o], n[o]))
    }
    return n
   }

   function A(e) {
    return void 0 === e && (e = Ce),
     function(t) {
      return function(n, i) {
       if (0 === n) {
        var o, r, a = !1;
        t(0, function(t, n) {
         return 0 === t && (r = n), 1 !== t ? void i(t, n) : a && e(o, n) ? void r(1) : (a = !0, o = n, void i(1, n))
        })
       }
      }
     }
   }

   function I(e) {
    return function(t) {
     return function(n, i) {
      if (0 === n) {
       var o, r = null,
        a = function(e, t) {
         return 0 === e ? void(r = t)(1) : 1 === e ? (i(1, t), void r(1)) : void(2 === e && (r = null))
        },
        s = function(e, t) {
         2 === e && null !== r && r(2, t), o(e, t)
        };
       t(0, function(t, n) {
        if (0 === t) return o = n, void i(0, s);
        if (1 === t) {
         if (null !== r) return;
         return void e(n)(0, a)
        }
        if (2 === t) {
         if (i(2, n), null === r) return;
         r(2, n)
        }
       })
      }
     }
    }
   }

   function C() {
    for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    return function(e, n) {
     if (0 === e)
      for (var i = t.length, o = new Array(i), r = 0, a = 0, s = function(e) {
        if (0 !== e)
         for (var t = 0; t < i; t++) o[t] && o[t](e)
       }, c = 0; c < i; c++) ! function(e) {
       t[e](0, function(t, c) {
        0 === t ? (o[e] = c, 1 == ++r && n(0, s)) : 2 === t ? (o[e] = void 0, ++a === i && n(2)) : n(t, c)
       })
      }(c)
    }
   }

   function x() {
    for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    for (var i = t[0], o = 1, r = t.length; o < r; o++) i = t[o](i);
    return i
   }

   function M() {
    var e = !!document.hasFocus && document.hasFocus(),
     t = Re(Ee(window, "focus"), Be(function() {
      return !0
     })),
     n = Re(Ee(window, "blur"), Be(function() {
      return !1
     }));
    return Re(je(t, n), Ue(e))
   }

   function T(e, t) {
    0 === e && t(0, He)
   }

   function k() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    return function(e, n) {
     if (0 === e) {
      var i = !1;
      n(0, function(e, t) {
       2 === e && (i = !0)
      });
      for (var o = 0; o < t.length; o++) {
       var r = t[o];
       if (i) break;
       n(1, r)
      }
      i || n(2)
     }
    }
   }

   function L(e) {
    return function(t, n) {
     if (0 === t) {
      var i, o, r, a = 0;
      e(0, function(e, t) {
       if (0 === e && (r = t), 1 !== e) return void n(e, t);
       var s = [o, t];
       if (i = s[0], o = s[1], ++a < 2) return void r(1);
       n(1, [i, o])
      })
     }
    }
   }

   function S(e, t) {
    return e === t
   }

   function O(e, t, n) {
    if (null === t || null === n || t.length !== n.length) return !1;
    for (var i = t.length, o = 0; o < i; o++)
     if (!e(t[o], n[o])) return !1;
    return !0
   }

   function E(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : S,
     n = null,
     i = null;
    return function() {
     return O(t, n, arguments) || (i = e.apply(null, arguments)), n = arguments, i
    }
   }

   function P(e) {
    var t = Array.isArray(e[0]) ? e[0] : e;
    if (!t.every(function(e) {
      return "function" == typeof e
     })) {
     var n = t.map(function(e) {
      return void 0 === e ? "undefined" : U(e)
     }).join(", ");
     throw new Error("Selector creators expect all input-selectors to be functions, instead received the following types: [" + n + "]")
    }
    return t
   }

   function z() {
    for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    var i = Qe;
    return function(e) {
     var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      o = void 0,
      r = void 0;
     "function" == typeof n ? (console.warn('[re-reselect] Deprecation warning: "selectorCreator" argument is discouraged and will be removed in the upcoming major release. Please use "options.selectorCreator" instead.'), o = new i, r = n) : (o = n.cacheObject || new i, r = n.selectorCreator || Ke);
     var a = function() {
      var n = e.apply(void 0, arguments);
      if ("string" == typeof n || "number" == typeof n) {
       var i = o.get(n);
       return void 0 === i && (i = r.apply(void 0, t), o.set(n, i)), i.apply(void 0, arguments)
      }
     };
     return a.getMatchingSelector = function() {
      var t = e.apply(void 0, arguments);
      return o.get(t)
     }, a.removeMatchingSelector = function() {
      var t = e.apply(void 0, arguments);
      o.remove(t)
     }, a.clearCache = function() {
      o.clear()
     }, a.resultFunc = t[t.length - 1], a
    }
   }

   function D(e, t) {
    return Re(Ie(function(t) {
     var n = function() {
      return t(1, e.state)
     };
     return e.on("state_diff", n),
      function() {
       return e.off("state_diff", n)
      }
    }), Ue(e.state), Be(t), A(m))
   }

   function N(e) {
    Re(D(e, pt), Ve(1), Se(function(t) {
     t ? (e.call("hideEyeCatcher"), e.hide()) : e.show()
    }))
   }
   var B = function() {
     function e() {}

     function t(e, t) {
      return function() {
       e.apply(t, arguments)
      }
     }

     function n(e) {
      if (!(this instanceof n)) throw new TypeError("Promises must be constructed via new");
      if ("function" != typeof e) throw new TypeError("not a function");
      this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], c(e, this)
     }

     function i(e, t) {
      for (; 3 === e._state;) e = e._value;
      if (0 === e._state) return void e._deferreds.push(t);
      e._handled = !0, n._immediateFn(function() {
       var n = 1 === e._state ? t.onFulfilled : t.onRejected;
       if (null === n) return void(1 === e._state ? o : r)(t.promise, e._value);
       var i;
       try {
        i = n(e._value)
       } catch (e) {
        return void r(t.promise, e)
       }
       o(t.promise, i)
      })
     }

     function o(e, i) {
      try {
       if (i === e) throw new TypeError("A promise cannot be resolved with itself.");
       if (i && ("object" === (void 0 === i ? "undefined" : l(i)) || "function" == typeof i)) {
        var o = i.then;
        if (i instanceof n) return e._state = 3, e._value = i,
         void a(e);
        if ("function" == typeof o) return void c(t(o, i), e)
       }
       e._state = 1, e._value = i, a(e)
      } catch (t) {
       r(e, t)
      }
     }

     function r(e, t) {
      e._state = 2, e._value = t, a(e)
     }

     function a(e) {
      2 === e._state && 0 === e._deferreds.length && n._immediateFn(function() {
       e._handled || n._unhandledRejectionFn(e._value)
      });
      for (var t = 0, o = e._deferreds.length; t < o; t++) i(e, e._deferreds[t]);
      e._deferreds = null
     }

     function s(e, t, n) {
      this.onFulfilled = "function" == typeof e ? e : null, this.onRejected = "function" == typeof t ? t : null, this.promise = n
     }

     function c(e, t) {
      var n = !1;
      try {
       e(function(e) {
        n || (n = !0, o(t, e))
       }, function(e) {
        n || (n = !0, r(t, e))
       })
      } catch (e) {
       if (n) return;
       n = !0, r(t, e)
      }
     }
     var l = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
       return typeof e
      } : function(e) {
       return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
      },
      u = setTimeout;
     return n.prototype.catch = function(e) {
      return this.then(null, e)
     }, n.prototype.then = function(t, n) {
      var o = new this.constructor(e);
      return i(this, new s(t, n, o)), o
     }, n.prototype.finally = function(e) {
      var t = this.constructor;
      return this.then(function(n) {
       return t.resolve(e()).then(function() {
        return n
       })
      }, function(n) {
       return t.resolve(e()).then(function() {
        return t.reject(n)
       })
      })
     }, n.all = function(e) {
      return new n(function(t, n) {
       function i(e, a) {
        try {
         if (a && ("object" === (void 0 === a ? "undefined" : l(a)) || "function" == typeof a)) {
          var s = a.then;
          if ("function" == typeof s) return void s.call(a, function(t) {
           i(e, t)
          }, n)
         }
         o[e] = a, 0 == --r && t(o)
        } catch (e) {
         n(e)
        }
       }
       if (!e || void 0 === e.length) throw new TypeError("Promise.all accepts an array");
       var o = Array.prototype.slice.call(e);
       if (0 === o.length) return t([]);
       for (var r = o.length, a = 0; a < o.length; a++) i(a, o[a])
      })
     }, n.resolve = function(e) {
      return e && "object" === (void 0 === e ? "undefined" : l(e)) && e.constructor === n ? e : new n(function(t) {
       t(e)
      })
     }, n.reject = function(e) {
      return new n(function(t, n) {
       n(e)
      })
     }, n.race = function(e) {
      return new n(function(t, n) {
       for (var i = 0, o = e.length; i < o; i++) e[i].then(t, n)
      })
     }, n._immediateFn = "function" == typeof setImmediate && function(e) {
      setImmediate(e)
     } || function(e) {
      u(e, 0)
     }, n._unhandledRejectionFn = function(e) {
      "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", e)
     }, /native code/.test(window.Promise) ? window.Promise : n
    }(),
    j = {},
    R = j.hasOwnProperty,
    W = Array.isArray,
    U = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
     return typeof e
    } : function(e) {
     return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    },
    F = function(e, t) {
     if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    },
    $ = Object.assign || function(e) {
     for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i])
     }
     return e
    },
    H = function(e, t) {
     var n = {};
     for (var i in e) t.indexOf(i) >= 0 || Object.prototype.hasOwnProperty.call(e, i) && (n[i] = e[i]);
     return n
    },
    q = function(e) {
     return g(e).map(function(e) {
      return e.map(encodeURIComponent).join("=")
     }).join("&")
    },
    V = /(?:[^:]+:\/\/)?([^\/\s]+)/,
    G = /^((http(s)?\:)?\/\/)/,
    J = function(e) {
     return e.replace(G, "")
    },
    Y = "application/x-postmate-v1+json",
    K = Object.prototype.hasOwnProperty,
    Z = 0,
    Q = function() {
     return ++Z
    },
    X = function(e) {
     var t = document.createElement("a");
     return t.href = e, t.origin || t.protocol + "//" + t.hostname
    },
    ee = function(e, t) {
     return e.origin === t && ("object" === U(e.data) && ("postmate" in e.data && (e.data.type === Y && !!{
      "handshake-reply": 1,
      call: 1,
      emit: 1,
      reply: 1,
      request: 1
     }[e.data.postmate])))
    },
    te = function(e, t) {
     var n = "function" == typeof e[t] ? e[t]() : e[t];
     return oe.Promise.resolve(n)
    },
    ne = function() {
     function e(e) {
      var t = this;
      this.parent = e.parent, this.frame = e.frame, this.child = e.child, this.childOrigin = e.childOrigin, this.events = {}, this.listener = function(e) {
       var n = ((e || {}).data || {}).value || {},
        i = n.data,
        o = n.name;
       "emit" === e.data.postmate && o in t.events && t.events[o].call(t, i)
      }, this.parent.addEventListener("message", this.listener, !1)
     }
     var t = e.prototype;
     return t.get = function(e) {
      var t = this;
      return new oe.Promise(function(n) {
       var i = Q(),
        o = function e(o) {
         o.data.uid === i && "reply" === o.data.postmate && (t.parent.removeEventListener("message", e, !1), n(o.data.value))
        };
       t.parent.addEventListener("message", o, !1), t.child.postMessage({
        postmate: "request",
        type: Y,
        property: e,
        uid: i
       }, t.childOrigin)
      })
     }, t.call = function(e, t) {
      this.child.postMessage({
       postmate: "call",
       type: Y,
       property: e,
       data: t
      }, this.childOrigin)
     }, t.on = function(e, t) {
      this.events[e] = t
     }, t.destroy = function() {
      window.removeEventListener("message", this.listener, !1), this.frame.parentNode.removeChild(this.frame)
     }, e
    }(),
    ie = function() {
     function e(e) {
      var t = this;
      this.model = e.model, this.parent = e.parent, this.parentOrigin = e.parentOrigin, this.child = e.child, this.child.addEventListener("message", function(e) {
       if (ee(e, t.parentOrigin)) {
        var n = e.data,
         i = n.property,
         o = n.uid,
         r = n.data;
        if ("call" === e.data.postmate) return void(i in t.model && "function" == typeof t.model[i] && t.model[i].call(t, r));
        te(t.model, i).then(function(t) {
         return e.source.postMessage({
          property: i,
          postmate: "reply",
          type: Y,
          uid: o,
          value: t
         }, e.origin)
        })
       }
      })
     }
     return e.prototype.emit = function(e, t) {
      this.parent.postMessage({
       postmate: "emit",
       type: Y,
       value: {
        name: e,
        data: t
       }
      }, this.parentOrigin)
     }, e
    }(),
    oe = function() {
     function e(e) {
      var t = void 0 === e ? userOptions : e,
       n = t.container,
       i = void 0 === n ? void 0 !== i ? i : document.body : n,
       o = t.model,
       r = t.url;
      return this.parent = window, this.frame = document.createElement("iframe"), i.appendChild(this.frame), this.child = this.frame.contentWindow || this.frame.contentDocument.parentWindow, this.model = o || {}, this.sendHandshake(r)
     }
     return e.prototype.sendHandshake = function(t) {
      var n, i = this,
       o = X(t),
       r = 0;
      return new e.Promise(function(e, a) {
       var s = function t(r) {
        return !!ee(r, o) && ("handshake-reply" === r.data.postmate ? (clearInterval(n), i.parent.removeEventListener("message", t, !1), i.childOrigin = r.origin, e(new ne(i))) : a("Failed handshake"))
       };
       i.parent.addEventListener("message", s, !1);
       var c = function() {
         r++, i.child.postMessage({
          postmate: "handshake",
          type: Y,
          model: i.model
         }, o), 5 === r && clearInterval(n)
        },
        l = function() {
         c(), n = setInterval(c, 500)
        };
       i.frame.attachEvent ? i.frame.attachEvent("onload", l) : i.frame.onload = l, i.frame.src = t
      })
     }, e
    }();
   oe.debug = !1, oe.Promise = function() {
    try {
     return window ? window.Promise : B
    } catch (e) {
     return null
    }
   }(), oe.Model = function() {
    function e(e) {
     return this.child = window, this.model = e, this.parent = this.child.parent, this.sendHandshakeReply()
    }
    return e.prototype.sendHandshakeReply = function() {
     var e = this;
     return new oe.Promise(function(t, n) {
      var i = function i(o) {
       if (o.data.postmate) {
        if ("handshake" === o.data.postmate) {
         e.child.removeEventListener("message", i, !1), o.source.postMessage({
          postmate: "handshake-reply",
          type: Y
         }, o.origin), e.parentOrigin = o.origin;
         var r = o.data.model;
         if (r)
          for (var a = Object.keys(r), s = 0; s < a.length; s++) K.call(r, a[s]) && (e.model[a[s]] = r[a[s]]);
         return t(new ie(e))
        }
        return n("Handshake Reply Failed")
       }
      };
      e.child.addEventListener("message", i, !1)
     })
    }, e
   }();
   var re = function() {
    var e = {},
     t = b(e);
    return $({}, t, {
     off: function(n, i) {
      if (!n) return void Object.keys(e).forEach(function(t) {
       delete e[t]
      });
      t.off(n, i)
     },
     once: function(e, n) {
      t.on(e, function i(o) {
       t.off(e, i), n(o)
      })
     }
    })
   };
   oe.Promise = B;
   var ae, se = function e(t) {
     var n = t.methods,
      i = H(t, ["methods"]);
     return F(this, e), new oe(i).then(function(e) {
      var t = e.on.bind(e),
       i = re(),
       r = {};
      return e.on = function(e, n) {
       i.on(e, n), r[e] || (r[e] = !0, t(e, function(t) {
        return i.emit(e, t)
       }))
      }, e.off = i.off, e.on("remote-call", function(t) {
       var i = t.id,
        o = t.method,
        r = t.args;
       e.call("resolveRemoteCall", {
        id: i,
        value: n[o].apply(e, r)
       })
      }), e.emit = function(t, n) {
       e.call("emitEvent", {
        event: t,
        data: n
       })
      }, e._emit = i.emit, o(e, n)
     })
    },
    ce = function(e, t) {
     c(function(e, n) {
      t.style[n] = e
     }, e)
    },
    le = function(e, t) {
     var n = e.style,
      i = void 0 === n ? {} : n,
      o = H(e, ["style"]);
     c(function(e, n) {
      t.setAttribute(n, e)
     }, o), ce(i, t)
    },
    ue = function(e) {
     var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      n = document.createElement(e);
     return le(t, n), n
    },
    de = function(e) {
     return new B(function(t) {
      var n = function n(i) {
       e.off("state", n), e.state = i, t(i)
      };
      e.on("state", n), e.on("state_diff", function(t) {
       e.state = w(e.state, t)
      }), e.on("store_event", function(t) {
       var n = t[0],
        i = t[1];
       e._emit(n, i)
      }), e.call("startStateSync")
     })
    },
    fe = {
     opacity: 0,
     visibility: "hidden",
     zIndex: -1
    },
    he = {
     opacity: 1,
     visibility: "visible",
     zIndex: 2147483639
    },
    pe = {
     id: "chat-widget-container",
     style: $({}, fe, {
      position: "fixed",
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
      maxWidth: "100%",
      maxHeight: "100%",
      backgroundColor: "transparent",
      border: 0,
      overflow: "hidden"
     })
    },
    _e = {
     id: "livechat-eye-catcher",
     style: {
      position: "fixed",
      visibility: "visible",
      zIndex: 2147483639,
      background: "transparent",
      border: 0,
      padding: "10px 10px 0 0",
      float: "left",
      marginRight: "-10px",
      webkitBackfaceVisibility: "hidden"
     }
    },
    me = {
     href: "#",
     style: {
      position: "absolute",
      display: "none",
      top: "-5px",
      right: "-5px",
      padding: "2px 7px",
      textDecoration: "none",
      color: "#000",
      fontSize: "20px",
      fontFamily: "Arial, sans-serif"
     }
    },
    ge = {
     id: "livechat-eye-catcher-img",
     href: "#",
     style: {
      display: "block",
      overflow: "hidden"
     }
    },
    ve = {
     alt: "",
     style: {
      display: "block",
      border: 0,
      float: "right"
     }
    },
    be = {
     allowtransparency: !0,
     id: "chat-widget",
     frameborder: 0,
     name: "chat-widget",
     scrolling: "no",
     style: {
      width: "100%",
      height: "100%",
      margin: 0,
      padding: 0,
      background: "none",
      border: 0,
      float: "none"
     }
    },
    ye = function() {
     for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
     return function(e, n) {
      if (0 === e) {
       var i = t.length;
       if (0 === i) return n(0, function() {}), void n(2);
       var o = 0,
        r = void 0,
        a = function(e, t) {
         1 !== e && 2 !== e || r(e, t)
        };
       ! function e() {
        if (o === i) return void n(2);
        t[o](0, function(t, i) {
         0 === t ? (r = i, 0 === o ? n(0, a) : r(1)) : 1 === t ? n(1, i) : 2 === t && (o++, e())
        })
       }()
      }
     }
    },
    we = ye,
    Ae = function(e) {
     return function(t, n) {
      if (0 === t) {
       if ("function" != typeof e) return n(0, function() {}), void n(2);
       var i = void 0,
        o = void 0,
        r = function(e) {
         (i = i || 2 === e) && "function" == typeof o && o()
        };
       n(0, r), o = e(function(e, t) {
        i || 0 === e || (n(e, t), r(e))
       })
      }
     }
    },
    Ie = Ae,
    Ce = function(e, t) {
     return e === t
    },
    xe = function(e) {
     return function(t) {
      return function(n, i) {
       if (0 === n) {
        var o = void 0;
        t(0, function(t, n) {
         0 === t ? (o = n, i(t, n)) : 1 === t ? e(n) ? i(t, n) : o(1) : i(t, n)
        })
       }
      }
     }
    },
    Me = xe,
    Te = function(e) {
     return function(t, n) {
      function i(e, t) {
       1 === e && (l || c || a)(1, t), 2 === e && (l && l(2), c && c(2))
      }
      if (0 === t) {
       var o = function(e) {
         return void 0 !== e
        },
        r = function(e) {
         return void 0 === e
        },
        a = function() {},
        s = !1,
        c = void 0,
        l = void 0;
       e(0, function(e, t) {
        if (0 === e) c = t, n(0, i);
        else if (1 === e) {
         var a = t;
         l && l(2), a(0, function(e, t) {
          0 === e ? (l = t)(1) : 1 === e ? n(1, t) : 2 === e && r(t) ? s ? n(2) : (l = void 0, c(1)) : 2 === e && o(t) && n(2, t)
         })
        } else 2 === e && r(t) ? l ? s = !0 : n(2) : 2 === e && o(t) && n(2, t)
       })
      }
     }
    },
    ke = Te,
    Le = function(e) {
     return function(t) {
      var n = void 0;
      t(0, function(t, i) {
       0 === t && (n = i), 1 === t && e(i), 1 !== t && 0 !== t || n(1)
      })
     }
    },
    Se = Le,
    Oe = function(e, t) {
     return function(n, i) {
      if (0 === n) {
       var o = function(e) {
        return i(1, e)
       };
       i(0, function(n) {
        2 === n && e.removeEventListener(t, o)
       }), e.addEventListener(t, o)
      }
     }
    },
    Ee = Oe;
   ae = "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof module ? module : Function("return this")();
   var Pe = function(e) {
     var t, n = e.Symbol;
     return "function" == typeof n ? n.observable ? t = n.observable : (t = n("observable"), n.observable = t) : t = "@@observable", t
    }(ae),
    ze = Object.freeze({
     default: Pe
    }),
    De = ze && Pe || ze,
    Ne = (De.default, function(e) {
     return function(t) {
      return function(n, i) {
       0 === n && t(0, function(t, n) {
        i(t, 1 === t ? e(n) : n)
       })
      }
     }
    }),
    Be = Ne,
    je = C,
    Re = x,
    We = function(e) {
     return function(t) {
      return function(n, i) {
       if (0 === n) {
        var o = void 0;
        t(0, function(t, n) {
         0 === t ? (o = n, i(0, function(e, t) {
          0 !== e && o(e, t)
         }), i(1, e)) : i(t, n)
        })
       }
      }
     }
    },
    Ue = We,
    Fe = function(e) {
     return function(t, n) {
      if (0 === t) {
       var i = 0,
        o = setInterval(function() {
         n(1, i++)
        }, e);
       n(0, function(e) {
        2 === e && clearInterval(o)
       })
      }
     }
    },
    $e = Fe,
    He = function() {},
    qe = function(e) {
     return function(t) {
      return function(n, i) {
       if (0 === n) {
        var o = 0,
         r = void 0;
        t(0, function(t, n) {
         0 === t ? (r = n, i(t, n)) : 1 === t && o < e ? (o++, r(1)) : i(t, n)
        })
       }
      }
     }
    },
    Ve = qe,
    Ge = function(e) {
     return function(t) {
      return function(n, i) {
       function o(t, n) {
        r < e && a(t, n)
       }
       if (0 === n) {
        var r = 0,
         a = void 0;
        t(0, function(t, n) {
         0 === t ? (a = n, i(0, o)) : 1 === t ? r < e && (r++, i(t, n), r === e && (i(2), a(2))) : i(t, n)
        })
       }
      }
     }
    },
    Je = Ge,
    Ye = function(e) {
     return function(t) {
      return function(n, i) {
       var o = void 0,
        r = void 0,
        a = !1;
       0 === n && t(n, function(t, s) {
        t === n && (o = s), e(n, function(e, c) {
         e === n ? (r = c)(1) : 1 === e && (o(2), r(2), i(2), a = !0), !a && i(t, s)
        })
       })
      }
     }
    },
    Ke = function(e) {
     for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
     return function() {
      for (var t = arguments.length, i = Array(t), o = 0; o < t; o++) i[o] = arguments[o];
      var r = 0,
       a = i.pop(),
       s = P(i),
       c = e.apply(void 0, [function() {
        return r++, a.apply(null, arguments)
       }].concat(n)),
       l = E(function() {
        for (var e = [], t = s.length, n = 0; n < t; n++) e.push(s[n].apply(null, arguments));
        return c.apply(null, e)
       });
      return l.resultFunc = a, l.recomputations = function() {
       return r
      }, l.resetRecomputations = function() {
       return r = 0
      }, l
     }
    }(E),
    Ze = function(e, t) {
     if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    },
    Qe = function() {
     function e() {
      Ze(this, e), this._cache = {}
     }
     return e.prototype.set = function(e, t) {
      this._cache[e] = t
     }, e.prototype.get = function(e) {
      return this._cache[e]
     }, e.prototype.remove = function(e) {
      delete this._cache[e]
     }, e.prototype.clear = function() {
      this._cache = {}
     }, e
    }(),
    Xe = function(e, t) {
     return t
    },
    et = function(e) {
     for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
     return l(n, e.views)
    },
    tt = function(e) {
     return e.views.current
    },
    nt = function(e) {
     return e.entities.chats.byIds
    },
    it = function(e, t) {
     return nt(e)[t]
    },
    ot = function(e, t) {
     return it(e, t).events.byIds
    },
    rt = function(e, t) {
     return it(e, t).events.orderedIds
    },
    at = z([rt, ot], function(e, t) {
     return e.map(function(e) {
      return t[e]
     })
    })(Xe),
    st = z([it, at], function(e, t) {
     return $({}, e, {
      events: t
     })
    })(Xe),
    ct = function(e) {
     return e.entities.users.byIds
    },
    lt = function(e) {
     return e.session.id
    },
    ut = function(e) {
     return ct(e)[lt(e)]
    },
    dt = function(e, t) {
     return t === e.session.user ? ut(e) : ct(e)[t]
    },
    ft = function(e) {
     return ut(e).id
    },
    ht = (z([at, ft], function(e, t) {
     return s(function(e) {
      var n = e.delivered,
       i = e.author;
      return n && i === t
     }, e)
    })(Xe), z([at, ft], function(e, t) {
     return s(function(e) {
      var n = e.seen,
       i = e.author;
      return n && i === t
     }, e)
    })(Xe), z([function(e, t) {
     return it(e, t).participants
    }, ct], function(e, t) {
     return e.map(function(e) {
      return t[e]
     })
    })(Xe), function(e, t) {
     return void 0 === t ? e.application : e.application[t]
    }),
    pt = function(e) {
     return ht(e, "hidden") || et(e, "minimized").hidden && !ht(e, "maximized")
    },
    _t = function(e) {
     return h(e.map(function(e) {
      var t, n = e.name,
       i = e.value;
      return t = {}, t[n] = i, t
     }))
    },
    mt = "liveChatChatId",
    gt = function(e, t) {
     window.LC_API = window.LC_API || {};
     var n = window.LC_API,
      i = function(t) {
       e.call("storeMethod", ["requestUpdateUser", ut(e.state).id, t])
      };
     Re(D(e, function(e) {
      return ht(e, "maximized")
     }), Se(function(e) {
      e && "function" == typeof n.on_chat_window_opened ? n.on_chat_window_opened() : "function" == typeof n.on_chat_window_minimized && n.on_chat_window_minimized()
     })), Re(D(e, pt), Me(Boolean), Se(function() {
      "function" == typeof n.on_chat_window_hidden && n.on_chat_window_hidden()
     })), Re(D(e, function(e) {
      return ht(e, "availability")
     }), Se(function(e) {
      "function" == typeof n.on_chat_state_changed && n.on_chat_state_changed({
       state: "online" === e ? "online_for_chat" : "offline"
      })
     })), Re(D(e, function(e) {
      return st(e, mt).active
     }), Ve(1), Be(function(t) {
      return t ? Re(D(e, function(e) {
       return st(e, mt).properties.currentAgent
      }), Me(Boolean), Be(function() {
       return t
      }), Je(1)) : k(t)
     }), ke, Se(function(t) {
      t && "function" == typeof n.on_chat_started ? n.on_chat_started({
       agent_name: dt(e.state, st(e.state, mt).properties.currentAgent).name
      }) : "function" == typeof n.on_chat_ended && n.on_chat_ended()
     })), e.on("widget_resize", function(e) {
      "function" == typeof n.on_widget_resize && n.on_widget_resize(e)
     });
     var o = function(t) {
      e.on(t, function(e) {
       "function" == typeof n[t] && n[t](e)
      })
     };
     o("on_message"), o("on_postchat_survey_submitted"), o("on_prechat_survey_submitted"), o("on_rating_comment_submitted"), o("on_rating_submitted"), o("on_ticket_created"), n.set_custom_variables = function(e) {
      i({
       properties: _t(e)
      })
     }, n.set_visitor_name = function(e) {
      i({
       name: e
      })
     }, n.set_visitor_email = function(e) {
      i({
       email: e
      })
     }, n.open_chat_window = n.show_full_view = n.open_mobile_window = function() {
      e.call("maximize")
     }, n.minimize_chat_window = function() {
      e.call("minimize")
     }, n.hide_eye_catcher = function() {
      e.call("hideEyeCatcher")
     }, n.hide_chat_window = function() {
      e.call("hide")
     }, n.agents_are_available = function() {
      return "online" === ht(e.state, "availability")
     }, n.chat_window_maximized = function() {
      return ht(e.state, "maximized")
     }, n.chat_window_minimized = function() {
      return !ht(e.state, "maximized")
     }, n.chat_window_hidden = function() {
      return pt(e.state)
     }, n.visitor_queued = function() {
      return "queue" === tt(e.state)
     }, n.chat_running = function() {
      return st(e.state, mt).active
     }, n.visitor_engaged = function() {
      return n.visitor_queued() || n.chat_running() || a(function(e) {
       return "invitation" === e.id
      }, at(e.state, mt))
     }, n.get_window_type = function() {
      return "embedded"
     }, n.close_chat = function() {
      e.call("storeMethod", ["requestUpdateChat", mt, {
       active: !1
      }])
     }, n.disable_sounds = function() {
      e.call("storeMethod", ["setApplicationState", {
       muted: !0
      }])
     }, n.get_last_visit_timestamp = function() {
      return t.visitor.last_visit
     }, n.get_visits_number = function() {
      return t.visitor.visit_number
     }, n.get_page_views_number = function() {
      return t.visitor.page_view
     }, n.get_chats_number = function() {
      return t.visitor.chat_number
     }, n.get_visitor_id = function() {
      return ut(e.state).id
     }, n.get_chat_id = function() {
      return st(e.state, mt).serverId
     }
    },
    vt = {
     ga: function(e) {
      var t = e.event,
       n = e.label,
       i = e.nonInteraction,
       o = e.trackerName,
       r = window.GoogleAnalyticsObject || "ga";
      window[r]([o, "send"].filter(Boolean).join("."), {
       hitType: "event",
       eventCategory: "LiveChat",
       eventAction: t,
       eventLabel: n,
       nonInteraction: i
      })
     },
     gaAll: function(e) {
      var t = window.GoogleAnalyticsObject || "ga";
      window[t].getAll().forEach(function(t) {
       vt.ga($({}, e, {
        trackerName: "function" == typeof t.get ? t.get("name") : null
       }))
      })
     },
     gaq: function(e) {
      var t = e.event,
       n = e.label,
       i = e.nonInteraction;
      _gaq.push(["_trackEvent", "LiveChat", t, n, null, i])
     },
     gtm: function(e) {
      var t = e.event,
       n = e.label,
       i = e.nonInteraction;
      dataLayer.push({
       event: "LiveChat",
       eventCategory: "LiveChat",
       eventAction: t,
       eventLabel: n,
       nonInteraction: i
      })
     },
     pageTracker: function(e) {
      function t(t) {
       return e.apply(this, arguments)
      }
      return t.toString = function() {
       return e.toString()
      }, t
     }(function(e) {
      var t = e.event,
       n = e.label,
       i = e.nonInteraction;
      pageTracker._trackEvent("LiveChat", t, n, null, i)
     }),
     urchinTracker: function(e) {
      function t(t) {
       return e.apply(this, arguments)
      }
      return t.toString = function() {
       return e.toString()
      }, t
     }(function(e) {
      var t = e.event;
      urchinTracker(t)
     })
    },
    bt = function(e) {
     var t = e.__lc,
      n = t.ga_version,
      i = t.ga_omit_gtm,
      o = t.ga_send_to_all_trackers;
     if ("function" == typeof vt[n]) return vt[n];
     if ("object" === ("undefined" == typeof pageTracker ? "undefined" : U(pageTracker)) && "function" == typeof pageTracker._trackEvent) return vt.pageTracker;
     if ("function" == typeof urchinTracker) return vt.urchinTracker;
     if (!0 !== i && "object" === ("undefined" == typeof dataLayer ? "undefined" : U(dataLayer)) && "function" == typeof dataLayer.push) return vt.gtm;
     if ("object" === ("undefined" == typeof _gaq ? "undefined" : U(_gaq))) return vt.gaq;
     var r = !1;
     return "function" == typeof ga && ga(function(e) {
      r = "object" === (void 0 === e ? "undefined" : U(e))
     }), r || window.GoogleAnalyticsObject && "string" == typeof window.GoogleAnalyticsObject ? o ? vt.gaAll : vt.ga : null
    },
    yt = function() {
     return null
    },
    wt = function() {
     return null
    },
    At = function(e, t) {
     return Ie(function(n) {
      var i = function(e) {
       return n(1, e)
      };
      return e.on(t, i),
       function() {
        return e.off(t, i)
       }
     })
    },
    It = function(e, t) {
     var n = Object.keys(t.integrations).map(function(e) {
      var n = {
       analytics: bt,
       kissmetrics: yt,
       mixpanel: wt
      }[e];
      return ("function" == typeof n ? n : p)(t)
     }).filter(Boolean);
     if (0 !== n.length) {
      var i = function(t) {
       var i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        o = i.group,
        r = void 0 === o ? ht(e.state, "group") : o,
        a = i.nonInteraction,
        s = void 0 !== a && a;
       n.forEach(function(e) {
        e({
         event: t,
         label: 0 !== r ? "Group ID: " + r : "(no group)",
         nonInteraction: s
        })
       })
      };
      Re(D(e, function(e) {
       return ht(e, "ready")
      }), Me(Boolean), Je(1), Be(function() {
       return At(e, "set_chat_server_id")
      }), ke, Se(function() {
       i("Chat")
      })), e.on("add_event", function(e) {
       var t = e.event.properties;
       t.invitation && t.receivedFirstTime && i("Automated greeting", {
        nonInteraction: !0
       })
      }), e.on("on_prechat_survey_submitted", function() {
       i("Pre-chat survey filled in")
      }), e.on("on_postchat_survey_submitted", function() {
       i("Post-chat survey filled in")
      }), e.on("on_ticket_created", function(e) {
       e.visitor_email;
       i("Ticket form filled in")
      }), ["prechat", "postchat", "offline"].forEach(function(t) {
       Re(At(e, "set_current_view"), Me(function(e) {
        return e.name === t
       }), I(function() {
        var n = {
          offline: ["on_ticket_created", "Ticket form"],
          prechat: ["on_prechat_survey_submitted", "Pre-chat survey"],
          postchat: ["on_postchat_survey_submitted", "Post-chat survey"]
         },
         i = n[t],
         o = i[0],
         r = i[1];
        return Re(we(k(r), T), Ye(At(e, o)))
       }), Se(function(e) {
        i(e)
       }))
      })
     }
    },
    Ct = function() {
     for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
     return t.reduce(function(e, t) {
      return function() {
       return e(t.apply(void 0, arguments))
      }
     })
    }(function(e) {
     return "https://" + e
    }, function(e) {
     return -1 !== e.indexOf("cdn.livechatinc.com/cloud/?uri") ? e : "cdn.livechatinc.com/cloud/?uri=https://" + encodeURI(e)
    }, J),
    xt = /\.([a-z]{1,})$/i,
    Mt = function(e) {
     return e.match(xt)[1]
    },
    Tt = function(e) {
     var t = e.embedded_chat.eye_grabber;
     if (!t.enabled) return {
      enabled: !1
     };
     var n = {
      enabled: !0,
      x: t.x + 15,
      y: t.y,
      src: Ct(t.path)
     };
     if (-1 !== n.src.indexOf("/default/eyeCatchers/")) {
      var i = Mt(n.src);
      n.srcset = {
       "1x": n.src,
       "2x": n.src.replace(new RegExp("\\." + i, "i"), "-2x." + i)
      }
     }
     return n
    },
    kt = function(e, t) {
     var i = Tt(t);
     if (i.enabled) {
      var o = function() {
        var t = ue("div", _e);
        ce({
         bottom: i.y + "px",
         right: i.x + "px"
        }, t);
        var n = ue("a", me);
        n.innerHTML = "&times;";
        var o = ue("a", ge),
         r = $({}, ve, {
          src: i.src
         });
        i.srcset && (r.srcset = g(i.srcset).map(function(e) {
         var t = e[0];
         return e[1] + " " + t
        }).join(", "));
        var a = ue("img", r);
        return o.appendChild(a), a.addEventListener("load", function() {
         ce({
          width: a.width + "px"
         }, o)
        }), t.appendChild(n), t.appendChild(o), document.body.appendChild(t), t.addEventListener("mouseover", function() {
         ce({
          display: "block"
         }, n)
        }), t.addEventListener("mouseout", function() {
         ce({
          display: "none"
         }, n)
        }), t.addEventListener("click", function(t) {
         t.stopPropagation(), e.call("hideEyeCatcher"), e.call("maximize")
        }), n.addEventListener("mouseover", function() {
         ce({
          color: "#666"
         }, n)
        }), n.addEventListener("mouseout", function() {
         ce({
          color: "#000"
         }, n)
        }), n.addEventListener("click", function(t) {
         t.preventDefault(), t.stopPropagation(), e.call("hideEyeCatcher")
        }), t
       },
       r = void 0;
      Re(D(e, function(e) {
       var t = ht(e),
        n = t.maximized;
       return t.eyeCatcher.hidden || n
      }), Se(function(e) {
       if (e) return void(r && (n(r), r = null));
       r = o()
      }))
     }
    },
    Lt = function(e) {
     var t = e.buttons,
      n = e.skills_online,
      i = e.visitor.groups,
      o = ["offline", "online"],
      r = -1 !== n.indexOf(i),
      a = o[Number(r)] + "_value";
     return t.map(function(e) {
      var t = e.id,
       n = e.type,
       i = e[a];
      return {
       id: t,
       type: n,
       value: "image" === n ? Ct(i) : i
      }
     })
    },
    St = function(e) {
     e.innerHTML = ""
    },
    Ot = function(e, t) {
     var n = e.text,
      i = e.url,
      o = e.image;
     St(t);
     var r = ue("a", {
       href: i
      }),
      a = ue("img", {
       src: o,
       alt: n,
       title: n
      });
     r.appendChild(a), t.appendChild(r)
    },
    Et = function(e, t) {
     var n = e.text,
      i = e.url;
     St(t);
     var o = ue("a", {
      href: i
     });
     o.appendChild(document.createTextNode(n)), t.appendChild(o)
    },
    Pt = function(e, t) {
     var n = Lt(t);
     [].forEach.call(document.querySelectorAll(".livechat_button"), function(t) {
      var i = t.getAttribute("data-id"),
       o = a(function(e) {
        return e.id === i
       }, n);
      if (o) {
       var r = o.type,
        s = {
         type: r,
         text: "image" === o.type ? t.textContent : o.value,
         url: u("#", "0.href", t)
        };
       "image" === s.type ? (s.image = o.value, Ot(s, t)) : Et(s, t), t.children[0].addEventListener("click", function(t) {
        t.preventDefault(), e.call("maximize")
       })
      }
     })
    },
    zt = function() {
     return {
      title: document.title,
      url: String(document.location)
     }
    },
    Dt = function(e) {
     Re($e(2e3), Be(zt), A(m), Se(function(t) {
      e.call("storeMethod", ["setApplicationState", {
       page: t
      }])
     }))
    },
    Nt = function(e) {
     Re(M(), Se(function(t) {
      e.emit("focus", t)
     }))
    },
    Bt = function(e, t) {
     return e.reduce(function(e, n) {
      return e[n] = t.style[n], e
     }, {})
    },
    jt = function() {
     var e = ue("meta", {
      name: "viewport"
     });
     return document.getElementsByTagName("head")[0].appendChild(e), e
    },
    Rt = {
     position: "fixed",
     width: "100%",
     height: "100%",
     top: 0,
     right: 0,
     bottom: 0,
     left: 0,
     overflowY: "hidden"
    },
    Wt = function(e) {
     var t = document.querySelector('meta[name="viewport"]') || jt(),
      n = function() {
       var e = t.content,
        n = Bt(Object.keys(Rt), document.body),
        i = document.documentElement.scrollTop;
       return t.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0", ce(Rt, document.body),
        function() {
         ce(n, document.body), t.content = e, document.documentElement.scrollTop = i
        }
      },
      i = void 0;
     ht(e.state, "maximized") && (i = n()), Re(D(e, function(e) {
      return ht(e, "maximized")
     }), L, Se(function(e) {
      if (e[1]) return void(i = n());
      i()
     }))
    },
    Ut = function() {
     return window.parent === window ? window.location.hostname : document.referrer
    },
    Ft = function(e, t) {
     if (0 === e.length) return !0;
     e.push("livechatinc.com");
     var n = v(t);
     return e.some(function(e) {
      var t = n.length - e.length;
      return -1 !== n.indexOf(e, t) && (n.length === e.length || "." === n.charAt(t - 1))
     })
    },
    $t = /mobile/gi.test(navigator.userAgent),
    Ht = function(e) {
     var t = e.split("px");
     return 1 === t.length ? t[0] : Math.ceil(parseFloat(t[0])) + "px"
    },
    qt = function(e) {
     return $t ? {
      width: "100%",
      height: "100%"
     } : "modern" === e.group_properties.chat_window.new_theme.name ? {
      width: "400px",
      height: "450px"
     } : {
      width: "352px",
      height: "652px"
     }
    },
    Vt = function e(t) {
     var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      i = n.customer,
      o = void 0 === i ? {} : i,
      r = n.group,
      a = void 0 === r ? 0 : r,
      s = n.hidden,
      c = void 0 !== s && s,
      l = n.page,
      u = arguments[2],
      d = arguments[3],
      f = qt(u),
      h = f.width,
      p = f.height;
     return new se({
      container: d,
      url: "https://secure.livechatinc.com/licence/" + t + "/v2/open_chat.cgi?" + q({
       license: t,
       group: a,
       embedded: "1",
       widget_version: "3"
      }),
      methods: {
       hide: function() {
        ce(fe, d)
       },
       isFocused: function() {
        return !!document.hasFocus && document.hasFocus()
       },
       resize: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
         t = e.width,
         n = void 0 === t ? h : t,
         i = e.height,
         o = void 0 === i ? p : i,
         r = {
          width: Ht(n),
          height: Ht(o)
         };
        ce(r, d), this._emit("widget_resize", r)
       },
       show: function() {
        ce(he, d)
       }
      },
      model: {
       customer: o,
       fullWidth: h,
       fullHeight: p,
       hidden: c,
       page: l,
       serverConfig: u,
       mobile: $t
      }
     }).then(function(e) {
      return B.all([e, de(e)])
     }).then(function(n) {
      var i = n[0];
      le(be, i.frame), gt(i, u), It(i, u), Dt(i), Nt(i), N(i), Pt(i, u), i.on("protocol_upgraded", function() {
       i.destroy(), e(t, {
        customer: o,
        group: a,
        hidden: c,
        page: l
       }, $({}, u, {
        license_properties: $({}, u.license_properties, {
         lc_version: "3"
        })
       }), d)
      }), $t ? Wt(i) : kt(i, u)
     })
    },
    Gt = function(e) {
     var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      i = n.customer,
      o = void 0 === i ? {} : i,
      r = n.group,
      a = void 0 === r ? 0 : r,
      s = n.hidden,
      c = void 0 !== s && s,
      l = n.page,
      u = arguments[2],
      d = qt(u),
      f = d.width,
      h = d.height;
     if (!Ft(u.domain_whitelist, Ut())) return void console.log("[LiveChat] Current domain is not added to the whitelist. LiveChat has been disabled.");
     var p = ue("div", pe);
     return ce({
      width: f,
      height: h
     }, p), t().then(function(t) {
      return t.appendChild(p), Vt(e, {
       customer: o,
       group: a,
       hidden: c,
       page: l
      }, u, p)
     })
    };
   return e.default = Gt, e
  }({}),
  CustomVariablesParser = {
   parse: function(e) {
    return "string" == typeof e ? this._parseObject(this.getArrayByString(e)) : "object" == typeof e ? this._parseObject(e) : ""
   },
   getArrayByString: function(e) {
    var t, n, i, o;
    try {
     if ("" === e || "$" === e) return "";
     for (e = IncorrectCharactersStripper.strip(e), i = [], o = e.split("&"), t = 0; t < o.length; t++)
      if (n = o[t].split("="), n[1]) try {
       n[0] = decodeURIComponent(n[0]), n[1] = decodeURIComponent(n[1]), i.push({
        name: n[0],
        value: n[1]
       })
      } catch (e) {}
      return i
    } catch (e) {
     return []
    }
   },
   _parseObject: function(e) {
    var t, n, i, o;
    o = IncorrectCharactersStripper.strip, t = [];
    for (n in e) "object" == typeof(i = e[n]) && void 0 !== i.name && void 0 !== i.value && (i.name = String(i.name).substring(0, 500), i.value = String(i.value).substring(0, 3500), t.push(encodeURIComponent(o(i.name)) + "=" + encodeURIComponent(o(i.value))));
    return t.join("&")
   }
  },
  GlobalPropertiesParser = {
   parseRequestsDistribution: function(e, t, n) {
    var i = {};
    if (e)
     for (var o = e.split(","), r = 0; r < o.length; r++) {
      var a = o[r],
       s = a.split(":");
      if (s && 2 === s.length) {
       var c = parseFloat(s[1]) || 0;
       c < 1 && n ? i[s[0]] = !1 : c > Math.random() && (i[s[0]] = !0)
      }
     }
    return i
   }
  },
  IncorrectCharactersStripper = {
   strip: function(e) {
    return "string" != typeof e ? e : e.replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
   }
  },
  Pinger = function() {
   var e, t, n, i, o, r, a, s, c, l, u, d, f, h, p, _, m, g, v, b, y = 5,
    w = IncorrectCharactersStripper.strip,
    A = function(e) {
     return e.replace(/[\/]/g, "\\/").replace(/[\b]/g, "\\b").replace(/[\f]/g, "\\f").replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r").replace(/[\t]/g, "\\t")
    };
   return {
    init: function(o) {
     return e = o.config, t = o.app, n = o.minimized, i = o.loaderInfo, r = o.chatBetweenGroups, a = o.hostname, s = o.skill, c = o.visitorEmail, l = o.scriptVersion, u = o.embedded, p = o.statusChecker, _ = o.pingRatio || 1, m = o.newWebserv, i || (i = {
      pageData: {
       title: document.title,
       url: document.location.toString(),
       referrer: document.referrer
      },
      protocol: "https://"
     }), h = !0, this.resetPingStart(), this
    },
    ping: function(d) {
     var f, h, _, b, I, C, x, M, T, k = this,
      L = "";
     if (d = d || {}, d.forcePing && (o = !0, this.set_force_reload(!0), this.resetPingStart(), p && p.stopChecking()), m && (L = "v2/"), +new Date - this.getPingStart() > 18e5 && (v = !0, t.setPingSent(!1), p && p.startChecking()), this.getPageUnloaded()) return !1;
     if (!o && (!0 === v || e.client_limit_exceeded)) return !1;
     if (g && clearTimeout(g), this.get_force_reload()) {
      this.set_force_reload(!1);
      var S = e.lc && void 0 !== e.lc.groups ? e.lc.groups : e.visitor.groups;
      for (f = {
        visitor: {
         id: LC_API.get_visitor_id(),
         group: S
        }
       }, c && (f.visitor.email = c), "" !== e.nick && "$" !== e.nick && (f.visitor.name = w(e.nick)), _ = w(i.pageData.title), f.page = {}, _ && (f.page.title = _), _ = i.pageData.url, _ && (f.page.url = _), _ = w(i.pageData.referrer), _ && (f.page.referrer = _), l && (f.script_version = l), C = [], _ = e.lc && void 0 !== e.lc.params ? e.lc.params : $.getUrlParam("params") || "", _ = _.split("&"), 1 === _.length && "" === _[0] && (_ = []), h = 0; h < _.length; h++) b = _[h].split("="), C.push({
       name: decodeURIComponent(b[0]),
       value: decodeURIComponent(b[1])
      });
      C.length > 0 && (f.visitor.custom_variables = C)
     } else f = {
      visitor: {
       id: LC_API.get_visitor_id()
      }
     };
     x = Math.ceil(1e6 * Math.random()), window["__lc_ping_" + x] = function(e) {
      n && n.isChattingSupported() && (e.standard_greeting && t.load_standard_invitation && t.load_standard_invitation(), e.personal_greeting && t.load_personal_invitation && t.load_personal_invitation(e.personal_greeting), e.automatic_greeting && t.load_auto_invitation && t.load_auto_invitation(e.automatic_greeting)), e.next_ping_send_full_details ? (k.set_force_reload(!0), k.sendNextPing(0)) : t.setPingSent(!0), null != e.next_ping_delay && (0 === e.next_ping_delay ? g && clearTimeout(g) : y = e.next_ping_delay), e.group_status && ("offline" !== e.group_status && "online_for_chat" !== e.group_status && "online_for_queue" !== e.group_status || LC_API.on_chat_state_changed({
       state: e.group_status
      })), window["__lc_ping_" + x] = void 0
     }, T = "t=" + +new Date, T += "&data=" + encodeURIComponent(A(JSON.stringify(f))), T += "&jsonp=__lc_ping_" + x, I = document.getElementById("livechat-ping"), I && I.parentNode.removeChild(I), M = document.createElement("script"), M.id = "livechat-ping", M.src = r ? i.protocol + a + "/licence/" + e.lic + "/" + L + "ping?" + T : i.protocol + a + "/licence/g" + e.lic + "_" + s + "/" + L + "ping?" + T, u ? DOM.appendToBody(M) : document.body.appendChild(M), this.sendNextPing(y)
    },
    sendNextPing: function(e) {
     var t = this;
     g && clearTimeout(g), g = setTimeout(function() {
      t.ping.call(t)
     }, 1e3 * e * _)
    },
    get_force_reload: function() {
     return b
    },
    set_force_reload: function(e) {
     return this.resetPingStart(), b = e, this
    },
    getPageUnloaded: function() {
     return d
    },
    setPageUnloaded: function(e) {
     return d = e, this
    },
    getPingStart: function() {
     return f
    },
    resetPingStart: function() {
     return f = +new Date, this
    },
    isInited: function() {
     return h
    },
    setConfig: function(t) {
     return e = t, this
    }
   }
  }(),
  UrlsUtils = {
   convertUrlToCdn: function(e) {
    return -1 !== e.indexOf("cdn.livechatinc.com/cloud/?uri") ? UrlsUtils.removeProtocolFromURL(e) : "cdn.livechatinc.com/cloud/?uri=http://" + encodeURI(UrlsUtils.removeProtocolFromURL(e))
   },
   removeProtocolFromURL: function(e) {
    return e.replace(/^(http(s)?\:\/\/)/, "").replace(/^\/\//, "")
   }
  },
  Utils = function() {
   var e = {
     domain: /[^:]+:\/\/[^\/\s]+/
    },
    t = Date.now || function() {
     return +new Date
    },
    n = t(),
    i = function() {
     return Array.isArray || function(e) {
      return "[object Array]" === {}.toString.call(e)
     }
    }(),
    o = function(e, t) {
     var n, o = [];
     if (i(e)) {
      for (n = 0; n < e.length; ++n) o.push(t(e[n], n, e));
      return o
     }
     for (n in e) e.hasOwnProperty(n) && o.push(t(e[n], n, e));
     return o
    };
   return {
    parseChatWindowTheme: function(e) {
     var t = e.chat_window;
     return e.group_properties.chat_window.theme.skin_base && (t.theme.name = e.group_properties.chat_window.theme.skin_base), e.group_properties.chat_window.theme.skin_css && (t.theme.skin_css = e.group_properties.chat_window.theme.skin_css.replace(/\%color\%/gi, e.chat_window.theme.color), t.theme.skin_base = e.group_properties.chat_window.theme.skin_base), e.chat_window.theme.css && e.chat_window.theme.color && (t.theme.css = e.chat_window.theme.css.replace(/\%color\%/gi, e.chat_window.theme.color)), t
    },
    extractDomain: function(t) {
     var n = t.match(e.domain);
     return n && n[0]
    },
    isSkillOnline: function(e, t) {
     return void 0 !== Utils.find(t, function(t) {
      return t === e
     })
    },
    makeItDone: function(e) {
     var t;
     return {
      when: function(n) {
       var i, o, r, a = function() {
         return !!n() && (clearInterval(o), e(), r = !0)
        },
        s = function() {
         t && t(), o = setInterval(a, i || 100)
        };
       return this.tryEach = function(e) {
        r || (i = e, clearInterval(o), s())
       }, a() || s(), this
      },
      doBeforeTrying: function(e) {
       return t = e, this
      }
     }
    },
    inArray: function(e, t, n) {
     var i;
     if (t) {
      if (Array.prototype.indexOf) return Array.prototype.indexOf.call(t, e, n);
      for (i = t.length, n = n ? n < 0 ? Math.max(0, i + n) : n : 0; n < i; n++)
       if (n in t && t[n] === e) return n
     }
     return -1
    },
    forEach: function(e, t) {
     for (var n = 0; n < e.length; ++n) t(e[n], n, e)
    },
    find: function(e, t) {
     for (var n = 0; n < e.length; ++n)
      if (t(e[n], n, e)) return e[n]
    },
    throttle: function(e, n) {
     var i, o, r, a, s;
     n = n || 500;
     var c = function() {
      e.apply(r, a), o = i
     };
     return function() {
      if (r = this, a = [].slice.call(arguments), i = t(), !o) return void c();
      var e = n - (i - o);
      if (e > 0) return clearTimeout(s), void(s = setTimeout(function() {
       c()
      }, e));
      c()
     }
    },
    jsonpRequest: function(e) {
     e = e || {}, e.protocol = "https://", e.callback = e.callback || function() {}, e.requestName = e.requestName || "__lc_jsonp_request", e.queryParams = e.queryParams || {};
     var t = e.requestName + Math.floor(1e6 * Math.random());
     e.queryParams.jsonp = t, window[t] = function(n) {
      delete window[t], e.callback(n)
     };
     var n = document.getElementById(e.requestName);
     n && n.parentNode.removeChild(n);
     var i = document.createElement("script");
     i.id = e.requestName, i.src = e.protocol + e.hostname + e.endpoint + "?" + Utils.encodeQueryParams(e.queryParams), DOM.appendToBody(i)
    },
    encodeQueryParams: function(e) {
     return o(e, function(e, t) {
      return t + "=" + e
     }).join("&")
    },
    once: function(e) {
     var t;
     return function() {
      return t || (t = e())
     }
    },
    getNavigationStart: function() {
     return window.performance && window.performance.timing && window.performance.timing.navigationStart || n
    },
    getServiceAddress: function(e, t, n) {
     var i = new RegExp("(" + e + ")(-)?(labs|lc)?", "i"),
      o = t.match(i)[3];
     return "secure-" + n + (o ? "-" + o : "") + ".livechatinc.com"
    },
    get: function(e, t, n, i) {
     for (i = 0, t = t.split ? t.split(".") : t; e && i < t.length;) e = e[t[i++]];
     return void 0 === e ? n : e
    },
    extend: function(e) {
     for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i])
     }
     return e
    },
    weakEq: function(e, t) {
     return e == t
    },
    checkDomainWhitelist: function(e, t) {
     var n, i;
     if (!e.length) return !0;
     for (t = t.toLowerCase(), "." === t[t.length - 1] && (t = t.slice(0, -1)), e.push("livechatinc.com"), n = 0; n < e.length; n++)
      if (i = e[n], -1 !== t.indexOf(i, t.length - i.length) && (t.length === i.length || "." === t.charAt(t.length - i.length - 1))) return !0;
     return "object" == typeof console && console.log("[LiveChat] Current domain is not added to the whitelist. LiveChat has been disabled."), !1
    },
    callOnceEveryHours: function(e, t, n, i, o) {
     var r = o(n);
     if (r) {
      if ((+new Date - r) / 1e3 / 60 / 60 < t) return !1
     }
     return e(), i(n, +new Date), !0
    },
    isArray: i,
    map: o
   }
  }(),
  AnalyticsIntegrations = {
   enabledIntegrations: [],
   isEnabled: function(e) {
    for (var t = 0; t < this.enabledIntegrations.length; t++)
     if (this.enabledIntegrations[t].name === e) return !0;
    return !1
   },
   removeEmptyValues: function(e) {
    for (var t in e) e.hasOwnProperty(t) && !e[t] && delete e[t]
   },
   trackPageView: function(e, t) {
    t = t || {}, t.nonInteraction = t.nonInteraction || !1, t.onlyMainWindow = void 0 === t.onlyMainWindow || t.onlyMainWindow, t.event_data && this.removeEmptyValues(t.event_data);
    for (var n = 0; n < this.enabledIntegrations.length; n++) - 1 !== Utils.inArray(e, this.enabledIntegrations[n].events) && this.enabledIntegrations[n].callback(e, t)
   },
   subscribe: function(e) {
    this.isEnabled(e.name) || this.enabledIntegrations.push(e)
   }
  },
  AutoInvitation = {
   render: function(e, t) {
    function n() {
     this.get_invitation_content = function() {
      var e = this.config.greeting_message.text;
      return e = e.replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/&lt;br&gt;/g, "<br>")
     }, this.get_layer_html = function() {
      var e = this.get_invitation_content(),
       t = "";
      return e = e.replace(/\n/g, "<br>"), t += '<div style="top:0px;left:0px;width:100%;height:100%;position:relative;overflow:hidden;">', t += '<a style="position:absolute;top:0;left:0;width:100%;height:100%;display:block;cursor:pointer;z-index:9;background:url(//cdn.livechatinc.com/img/pixel.gif)" href="#" onclick="LC_Invite.lc_open_chat(\'' + this.config.unique_id + "', " + this.config.destination_skill + ');return false"></a>', t += '<a style="position:absolute;top:' + this.config.close_button.top + "px;left:" + this.config.close_button.left + "px;width:" + this.config.close_button.width + "px;height:" + this.config.close_button.height + 'px;display:block;cursor:pointer;z-index:10;background:url(//cdn.livechatinc.com/img/pixel.gif)" href="#" onclick="LC_Invite.lc_popup_close();return false"></a>', this.config.greeting_message.color = this.config.greeting_message.color.replace(/^#/, ""), t += '<div style="top:' + this.config.greeting_message.top + "px;left:" + this.config.greeting_message.left + "px;width:" + this.config.greeting_message.width + "px;height:" + this.config.greeting_message.height + "px;overflow:auto;z-index:8;position:absolute;overflow:hidden;color:#" + this.config.greeting_message.color + ";font-size:" + this.config.greeting_message.size + "px;line-height:1.25em;font-family:" + this.config.greeting_message.font + '" id="div_greeting-message">', t += e, t += "</div>", t += '<span><img border="0" src="' + LC_Invite.httpp + this.config.image_url + '" id="lc_auto_invitation_img"></span></div>'
     }, this.load_invite = function() {
      LC_API.embedded_chat_enabled() ? (LC_API.display_embedded_invitation(this.get_invitation_content(), this.config.unique_id, this.config.destination_skill, this.config.agent, this.maximize_on_load), !0 !== LC_Invite.conf.lc2 || Cookie.get("autoinvite_callback") || (LC_API.on_message({
       text: this.get_invitation_content(),
       user_type: "agent",
       agent_login: this.config.agent.login,
       agent_name: this.config.agent.name,
       timestamp: Math.round(new Date / 1e3)
      }), Cookie.set("autoinvite_callback", !0))) : LC_Invite.display_invitation(this.get_layer_html(), this.config.position)
     }, this.autoInvited = !1, this.ignoreFirstMessage = !1
    }
    if (e.error) return !1;
    t = t || {}, window.LC_AutoInvite = new n, window.LC_AutoInvite.config = e, window.LC_AutoInvite.config.position = {
     arg1: e.position.y,
     arg2: e.position.x,
     option: e.position.h_align
    }, t.maximizeWindow && (window.LC_AutoInvite.maximize_on_load = !0), window.LC_AutoInvite.load_invite()
   }
  };
 window.AutoInvitation = AutoInvitation;
 var Chat = {
   init: function() {
    "1" === Cookie.get("chat_running") && (this._running = "1"), "1" === Cookie.get("waiting_in_queue") && (this._waitingInQueue = "1")
   },
   running: function(e) {
    return null != e && (this._running = e, "1" === e && Cookie.set("chat_running", e)), this._running
   },
   waitingInQueue: function(e) {
    return null != e && (this._waitingInQueue = e, "1" === e && Cookie.set("waiting_in_queue", e)), this._waitingInQueue
   }
  },
  Client = {
   setName: function(e) {
    NotifyChild.send("nick;" + encodeURIComponent(e))
   },
   setEmail: function(e) {
    NotifyChild.send("email;" + encodeURIComponent(e))
   }
  },
  Cookie = {
   set: function(e, t, n) {
    var i, o, r, a, s;
    n ? (r = new Date, r.setTime(r.getTime() + 24 * n * 60 * 60 * 1e3), a = "; expires=" + r.toGMTString()) : a = "", s = location.host, 1 === s.split(".").length ? (!1 === __lc.chat_between_groups && __lc.skill > 0 && (e = e + ".group" + __lc.skill), document.cookie = e + "=" + t + a + "; path=/") : (o = s.split("."), o.shift(), i = "." + o.join("."), !1 === __lc.chat_between_groups && __lc.skill > 0 && (e = e + ".group" + __lc.skill), document.cookie = e + "=" + t + a + "; path=/; domain=" + i, null != Cookie.get(e) && Cookie.get(e) == t || (i = "." + s, document.cookie = e + "=" + t + a + "; path=/; domain=" + i))
   },
   get: function(e) {
    !1 === __lc.chat_between_groups && __lc.skill > 0 && (e = e + ".group" + __lc.skill);
    for (var t = e + "=", n = document.cookie.split(";"), i = 0; i < n.length; i++) {
     for (var o = n[i];
      " " == o.charAt(0);) o = o.substring(1, o.length);
     if (0 == o.indexOf(t)) return o.substring(t.length, o.length)
    }
    return null
   },
   erase: function(e) {
    Cookie.set(e, "", -1)
   }
  },
  DOM = {
   appendToBody: function(e, t) {
    var n, i;
    (n = function() {
     try {
      return document.body.appendChild(e), i && (clearInterval(i), i = null), "function" == typeof t && t(), !0
     } catch (e) {
      return !1
     }
    })() || (i = setInterval(n, 100))
   },
   isReady: !1,
   ready: function(e) {
    document.attachEvent ? this.waitForDOMReady(e) : e()
   },
   waitForDOMReady: function(e) {
    DOM.readyFn = e, document.attachEvent("onreadystatechange", function() {
     "complete" === document.readyState && DOM.itsReady()
    }), window.attachEvent("onload", DOM.itsReady);
    var t = !1;
    try {
     t = null == window.frameElement
    } catch (e) {}
    document.documentElement.doScroll && t && DOM.doScrollCheck()
   },
   doScrollCheck: function() {
    if (!DOM.isReady) {
     try {
      document.documentElement.doScroll("left")
     } catch (e) {
      return void setTimeout(DOM.doScrollCheck, 1)
     }
     DOM.itsReady()
    }
   },
   itsReady: function() {
    if (!DOM.isReady) {
     if (!document.body) return setTimeout(DOM.itsReady, 1);
     DOM.isReady = !0, "function" == typeof DOM.readyFn && DOM.readyFn()
    }
   },
   innerHTML: function(e, t) {
    var n;
    try {
     e.innerHTML = t
    } catch (i) {
     n = document.createElement(e.tagName), n.id = e.id, n.className = e.className;
     try {
      n.innerHTML = t, e.parentNode.replaceChild(n, e)
     } catch (i) {
      t = t.replace(/<div([^>]*)>/g, "<span$1>"), t = t.replace(/<\/div>/g, "</span>"), n.innerHTML = t, e.parentNode.replaceChild(n, e)
     }
    }
   }
  },
  Events = {
   _receivedEvents: [],
   _isErlang: !1,
   _storedMetrics: [],
   track: function(e, t) {
    var n, i;
    n = new Image, i = "https://queue.livechatinc.com/logs", i += "?licence_id=" + __lc.license, i += "&event_id=" + encodeURIComponent(e), i += "&message=" + encodeURIComponent(t), n.src = i
   },
   setErlang: function(e) {
    this._isErlang = e
   },
   isErlang: function() {
    return this._isErlang
   },
   sendStoredMetrics: function() {
    var e = this;
    Utils.forEach(this._storedMetrics, function(t) {
     e.trackEngagement(t)
    })
   },
   trackEngagement: function(e) {
    NotifyChild.send("track_engagement;" + JSON.stringify(e))
   },
   trackSpeed: function(e, t, n) {
    if (!window.performance || !window.performance.timing) return !1;
    if (-1 !== Utils.inArray(e, this._receivedEvents)) return !1;
    this._receivedEvents.push(e);
    var i = (new Date).getTime(),
     o = i - window.performance.timing.navigationStart;
    if (n) return t.navigation_load_duration_ms = o, void this.trackToRealTimeStatistics(e, __lc.license, t);
    var r = t || {};
    r.name = e, r.page_load_time = o, this._storedMetrics.push(r)
   },
   trackToRealTimeStatistics: function(e, t, n) {
    if (-1 === __lc.hostname.indexOf("-fra")) {
     var i, o;
     i = new Image;
     var r = encodeURIComponent(JSON.stringify(n));
     o = "https://" + __lc.hostname + "/licence/" + t + "/v2/metrics/" + e, o += "?data=" + r, i.src = o
    }
   }
  },
  EyeCatcher = {
   imageAppended: !1,
   init: function(e) {
    this.config = e;
    var t = this.config.embedded.eye_grabber.path,
     n = "";
    if (window.devicePixelRatio && parseInt(window.devicePixelRatio) > 1 && -1 !== t.indexOf("/default/eyeCatchers/")) {
     var i = t.match(/(.*)\.([a-z]{3,})$/i);
     t = i[1] + "-2x." + i[2], n = 'onload="this.width/=2;this.onload=null;"'
    }
    this.imageHTML = '<img src="//' + UrlsUtils.convertUrlToCdn(t) + '" style="border:0;display:block;" alt="" ' + n + ">"
   },
   enabled: function() {
    return this.config.embedded.eye_grabber.enabled
   },
   shouldBeDisplayed: function() {
    return !LC_API.mobile_is_detected() && !LC_API.new_mobile_is_detected() && (!0 === this.enabled() && "1" !== Cookie.get("hide_eye_catcher"))
   },
   appendToDOM: function() {
    var e, t, n, i = this;
    if (!this.shouldBeDisplayed()) return !1;
    e = document.createElement("div"), e.setAttribute("id", "livechat-eye-catcher"), e.setAttribute("onmouseover", 'var els = this.getElementsByTagName("a"); if (els.length) els[0].style.display = "block";'), e.setAttribute("onmouseout", 'var els = this.getElementsByTagName("a"); if (els.length) els[0].style.display = "none";'), document.getElementsByTagName && (e.onmouseover = function() {
     var e = this.getElementsByTagName("a");
     e.length && (e[0].style.display = "block")
    }, e.onmouseout = function() {
     var e = this.getElementsByTagName("a");
     e.length && (e[0].style.display = "none")
    }), t = e.style, t.position = "fixed", t.right = this.config.embedded.eye_grabber.x + this.config.embedded.eye_grabber.point_zero.x + "px", t.bottom = this.config.embedded.eye_grabber.y + this.config.embedded.eye_grabber.point_zero.y + "px", t.visibility = "hidden", t.zIndex = "2147483639", t.background = "transparent", t.border = "0", t.padding = "10px 10px 0 0", t.float = "left", t.marginRight = "-10px", !1 === Mobile.isDetected() && (t.webkitBackfaceVisibility = "hidden"), t = ["position:absolute", "display:none", "top:-5px", "right:-5px", "padding:2px 7px", "text-decoration:none", "color:#000", "font-size:20px", "font-family:Arial,sans-serif"], "online" === this.config.status ? (n = this.imageHTML, this.imageAppended = !0) : n = "", e.innerHTML = '\t\t<a href="#" onclick="LC_API.hide_eye_catcher();return false" style="' + t.join(";") + '" onmouseover="this.style.color=\'#666\'" onmouseout="this.style.color=\'#000\'">&times;</a>\t\t<a href="#" onclick="LC_API.open_chat_window({source:\'eye catcher\'});return false" style="display:block" id="livechat-eye-catcher-img">' + n + "</a>", DOM.appendToBody(e, function() {
     i.setState("online" === i.config.status ? "online" : "offline")
    })
   },
   appendImage: function() {
    $("livechat-eye-catcher-img").innerHTML = this.imageHTML
   },
   setState: function(e) {
    var t;
    if (!(t = $("livechat-eye-catcher"))) return !1;
    "online" === e && LC_API.chat_window_minimized() && !LC_Invite.embedded_chat_hidden_by_api ? (!1 === this.imageAppended && this.appendImage(), t.style.visibility = "visible") : t.style.visibility = "hidden"
   }
  },
  Full = {
   _loaded: !1,
   _afterLoad: null,
   isLoaded: function(e) {
    return null != e && (this._loaded = e), this._loaded
   },
   onAfterLoad: function(e) {
    this._afterLoad = e
   },
   onload: function() {
    this.isLoaded(!0), this._afterLoad && this._afterLoad()
   }
  },
  GoogleAnalytics = {
   enabled: null,
   gaType: null,
   setEnabled: function(e) {
    var t = this;
    this.enabled = e, AnalyticsIntegrations.subscribe({
     name: "GoogleAnalytics",
     events: ["Standard greeting", "Personal greeting", "Automated greeting", "Chat", "Ticket form", "After-hours form", "Pre-chat survey", "Post-chat survey"],
     callback: function() {
      t.track.apply(t, arguments)
     }
    })
   },
   _trackpageTracker: function(e, t, n) {
    "object" == typeof pageTracker && "function" == typeof pageTracker._trackEvent && pageTracker._trackEvent("LiveChat", e, t, null, n)
   },
   _trackurchinTracker: function(e) {
    "function" == typeof urchinTracker && urchinTracker(e)
   },
   _trackgtm: function(e, t, n) {
    1 != __lc.ga_omit_gtm && "object" == typeof dataLayer && "function" == typeof dataLayer.push && dataLayer.push({
     event: "LiveChat",
     eventCategory: "LiveChat",
     eventAction: e,
     eventLabel: t,
     nonInteraction: n
    })
   },
   _trackgaq: function(e, t, n) {
    "object" == typeof _gaq && _gaq.push(["_trackEvent", "LiveChat", e, t, null, n])
   },
   _sendToGaTracker: function(e, t, n, i, o) {
    var r = o ? o + ".send" : "send";
    window[i](r, {
     hitType: "event",
     eventCategory: "LiveChat",
     eventAction: e,
     eventLabel: t,
     nonInteraction: n
    })
   },
   _trackga: function(e, t, n) {
    var i = window.GoogleAnalyticsObject || "ga";
    if (__lc.ga_send_to_all_trackers)
     for (var o = window[i].getAll(), r = 0; r < o.length; r++) {
      var a = o[r].get && o[r].get("name");
      this._sendToGaTracker(e, t, n, i, a)
     } else "function" == typeof window[i] && function() {
      var e = !1;
      return window[i](function(t) {
       "object" == typeof t && (e = !0)
      }), e
     }() && this._sendToGaTracker(e, t, n, i)
   },
   _trackgtag: function(e, t, n) {
    gtag("event", e, {
     event_category: "LiveChat",
     event_label: t
    })
   },
   _doTrack: function(e, t, n) {
    var i = this.getGaType();
    if (i && this["_track" + i]) return this["_track" + i](e, t, n)
   },
   track: function(e, t) {
    this.trackPageView(e, t)
   },
   trackPageView: function(e, t) {
    var n;
    if (t = t || {}, t.nonInteraction = t.nonInteraction || !1, !0 === t.onlyMainWindow && !0 !== LC_Invite.is_main_window) return !1;
    if (!0 !== this.enabled) return !1;
    n = "(no group)";
    var i = t.event_data && t.event_data.skill || __lc.skill;
    i > 0 && (n = "Group ID: " + parseInt(i, 10)), this._doTrack(e, n, t.nonInteraction)
   },
   detectGaType: function() {
    __lc.ga_version && this["_track" + __lc.ga_version] ? this.gaType = __lc.ga_version : "object" == typeof pageTracker && "function" == typeof pageTracker._trackEvent ? this.gaType = "pageTracker" : "function" == typeof urchinTracker ? this.gaType = "urchinTracker" : "function" == typeof gtag ? this.gaType = "gtag" : 1 != __lc.ga_omit_gtm && "object" == typeof dataLayer && "function" == typeof dataLayer.push ? this.gaType = "gtm" : "object" == typeof _gaq ? this.gaType = "gaq" : "function" == typeof ga && function() {
     var e = !1;
     return ga(function(t) {
      "object" == typeof t && (e = !0)
     }), e
    }() ? (this.gaType = "ga", this.gaName = "ga") : window.GoogleAnalyticsObject && "string" == typeof window.GoogleAnalyticsObject && (this.gaType = "ga")
   },
   getGaType: function() {
    return this.gaType ? this.gaType : (this.detectGaType(), this.gaType)
   }
  },
  Kissmetrics = {
   enabled: null,
   setEnabled: function(e) {
    var t = this;
    this.enabled = e, AnalyticsIntegrations.subscribe({
     name: "Kissmetrics",
     events: ["Standard greeting", "Personal greeting", "Automated greeting", "Chat", "Ticket form", "Ticket form filled in", "After-hours form", "Pre-chat survey", "Pre-chat survey filled in", "Post-chat survey", "Post-chat survey filled in"],
     callback: function() {
      t.track.apply(t, arguments)
     }
    })
   },
   eventsMapper: {
    "Standard greeting": "LiveChat Standard greeting displayed",
    "Personal greeting": "LiveChat Personal greeting displayed",
    "Automated greeting": "LiveChat Automated greeting displayed",
    Chat: "LiveChat Chat started",
    "Ticket form": "LiveChat Ticket form displayed",
    "Ticket form filled in": "LiveChat Ticket form filled in",
    "After-hours form": "LiveChat After-hours form displayed",
    "Pre-chat survey": "LiveChat Pre-chat survey displayed",
    "Pre-chat survey filled in": "LiveChat Pre-chat survey filled in",
    "Post-chat survey": "LiveChat Post-chat survey displayed",
    "Post-chat survey filled in": "LiveChat Post-chat survey filled in"
   },
   track: function(e, t) {
    if ("object" == typeof _kmq) {
     var n = "(no group)";
     t = t || {}, t.event_data = t.event_data || {};
     var i = t.event_data && t.event_data.skill || __lc.skill;
     i > 0 && (n = "Group ID: " + parseInt(i, 10)), t.event_data.group = n, this.eventsMapper[e] && (e = this.eventsMapper[e]), _kmq.push(["record", e, t.event_data]), t.user_data && _kmq.push(["set", t.user_data]), t.event_data && t.event_data.email && _kmq.push(["alias", t.event_data.email, KM.i()])
    }
   }
  },
  Minimized = {
   STATE_OFFLINE: 0,
   STATE_PRE_CHAT: 1,
   STATE_QUEUE: 2,
   STATE_CHATTING: 3,
   STATE_POST_CHAT: 4,
   STATE_CHAT_ENDED: 5,
   STATE_INVITATION: 6,
   STATE_INVITATION_WITH_AGENT: 7,
   previous_state: null,
   state: null,
   welcomeMessage: null,
   inited: !1,
   rendered: !1,
   _onRender: null,
   onStateChanged: null,
   operator_display_name: null,
   text_label: "",
   circle_group_property: null,
   custom_css: "",
   skin_css: "",
   titleNotification: "",
   originalTitle: "",
   TITLE_NOTIFICATION_HIDDEN: !0,
   TITLE_NOTIFICATION_APPENDED: !1,
   titleNotificationInterval: null,
   titleNotificationAnimateSpeed: 1e3,
   titleNotificationFlag: !0,
   tabActive: !0,
   langPhrases: {},
   styles: {
    mobileFonts: "@font-face%20%7B%0A%20%20%20%20font-family:%20'livechat-mobile';%0A%20%20%20%20src:%20%20%20%20url('//cdn.livechatinc.com/fonts/mobile/livechat-mobile_cdfaf5185d.eot?3i1s7d');%0A%20%20%20%20src:%20%20%20%20url('//cdn.livechatinc.com/fonts/mobile/livechat-mobile_cdfaf5185d.eot?3i1s7d#iefix')%20format('embedded-opentype'),%0A%20%20%20%20%20%20%20%20url('//cdn.livechatinc.com/fonts/mobile/livechat-mobile_fbd9d3a5be.ttf?3i1s7d')%20format('truetype'),%0A%20%20%20%20%20%20%20%20url('//cdn.livechatinc.com/fonts/mobile/livechat-mobile_2972642f7a.woff?3i1s7d')%20format('woff'),%0A%20%20%20%20%20%20%20%20url('//cdn.livechatinc.com/fonts/mobile/livechat-mobile_9f69825941.svg?3i1s7d#icomoon')%20format('svg');%0A%20%20%20%20font-weight:%20normal;%0A%20%20%20%20font-style:%20normal;%0A%7D%0A%0A%5Bclass%5E=%22icon-%22%5D,%20%5Bclass*=%22%20icon-%22%5D%20%7B%0A%20%20%20%20/*%20use%20!important%20to%20prevent%20issues%20with%20browser%20extensions%20that%20change%20fonts%20*/%0A%20%20%20%20font-family:%20'livechat-mobile'%20!important;%0A%20%20%20%20speak:%20none;%0A%20%20%20%20font-style:%20normal;%0A%20%20%20%20font-weight:%20normal;%0A%20%20%20%20font-variant:%20normal;%0A%20%20%20%20text-transform:%20none;%0A%20%20%20%20line-height:%201;%0A%0A%20%20%20%20/*%20Better%20Font%20Rendering%20===========%20*/%0A%20%20%20%20-webkit-font-smoothing:%20antialiased;%0A%20%20%20%20-moz-osx-font-smoothing:%20grayscale;%0A%7D%0A%0A.icon-tick:before%20%7B%0A%20%20%20%20content:%20%22%5Ce900%22;%0A%7D%0A.icon-leavemessage:before%20%7B%0A%20%20%20%20content:%20%22%5Ce90a%22;%0A%7D%0A.icon-agentonline:before%20%7B%0A%20%20%20%20content:%20%22%5Ce90b%22;%0A%7D%0A.icon-clip:before%20%7B%0A%20%20%20%20content:%20%22%5Ce90c%22;%0A%7D%0A.icon-close:before%20%7B%0A%20%20%20%20content:%20%22%5Ce90d%22;%0A%7D%0A.icon-email:before%20%7B%0A%20%20%20%20content:%20%22%5Ce90e%22;%0A%7D%0A.icon-maximize:before%20%7B%0A%20%20%20%20content:%20%22%5Ce90f%22;%0A%7D%0A.icon-menu:before%20%7B%0A%20%20%20%20content:%20%22%5Ce910%22;%0A%7D%0A.icon-minimize:before%20%7B%0A%20%20%20%20content:%20%22%5Ce911%22;%0A%7D%0A.icon-mobile:before%20%7B%0A%20%20%20%20content:%20%22%5Ce912%22;%0A%7D%0A.icon-thumbs-down:before%20%7B%0A%20%20%20%20content:%20%22%5Ce913%22;%0A%7D%0A.icon-thumbs-up:before%20%7B%0A%20%20%20%20content:%20%22%5Ce914%22;%0A%7D%0A",
    mobileCSS: "#content-container.new-mobile%20#content,#extra.new-mobile%7Bmargin-top:2em!important%7D#body%20input,#body%20label,#body%20select,#body%20table,#body%20textarea,a,body,input,label,select,table,table#content,textarea%7Bfont:12px/16px%20%22Lucida%20Grande%22,%22Lucida%20Sans%20Unicode%22,Arial,Verdana,sans-serif%7D.new-mobile%20#content%20a#full-view-button%20#open-label%7Bfont-size:1.1em!important;line-height:3em;padding-top:0!important%7D.new-mobile%20#full-view-button,.new-mobile%20#title%20#title-text%7Bfont-size:1em!important%7D.new-mobile%20a#full-view-button%20span:nth-child(2)%7Bpadding:.1em%20.5em!important;width:60%25!important%7D.new-mobile%20.s-maximize%7Bdisplay:none!important%7D#content-container.new-mobile%7Bpadding:0%20.5em!important;box-sizing:border-box;line-height:1em%7D#content-container.new-mobile%20#content%7Bheight:100%25;box-shadow:0%20.05em%202em%20rgba(0,0,0,.2)!important%7D.lc2%20#content%20#open-icon%7Bfont-family:livechat-mobile;speak:none;font-style:normal;font-weight:400;font-variant:normal;text-transform:none;top:0;right:0;font-size:.9em;line-height:4em;color:#fff;display:inline-block;margin-right:.8em;float:right%7D#open-icon.icon-maximize:before%7Bcontent:%22%5Ce90f%22%7D#extra.new-mobile%7Bleft:.5em!important;right:.5em!important;width:auto!important%7D",
    modernFonts: "@font-face%20%7B%0A%20%20%20%20font-family:%20'livechat-modern';%0A%20%20%20%20src:%20%20%20%20url('//cdn.livechatinc.com/fonts/modern/livechat-modern_fa44078c17.eot?ekgvz6');%0A%20%20%20%20src:%20%20%20%20url('//cdn.livechatinc.com/fonts/modern/livechat-modern_fa44078c17.eot?ekgvz6#iefix')%20format('embedded-opentype'),%0A%20%20%20%20%20%20%20%20url('//cdn.livechatinc.com/fonts/modern/livechat-modern_7cf45543dc.ttf?ekgvz6')%20format('truetype'),%0A%20%20%20%20%20%20%20%20url('//cdn.livechatinc.com/fonts/modern/livechat-modern_27a85e5f71.woff?ekgvz6')%20format('woff'),%0A%20%20%20%20%20%20%20%20url('//cdn.livechatinc.com/fonts/modern/livechat-modern_bfb0fd8212.svg?ekgvz6#icomoon')%20format('svg');%0A%20%20%20%20font-weight:%20normal;%0A%20%20%20%20font-style:%20normal;%0A%7D%0A%0A%5Bclass%5E=%22icon-%22%5D,%20%5Bclass*=%22%20icon-%22%5D%20%7B%0A%20%20%20%20/*%20use%20!important%20to%20prevent%20issues%20with%20browser%20extensions%20that%20change%20fonts%20*/%0A%20%20%20%20font-family:%20'livechat-modern'%20!important;%0A%20%20%20%20speak:%20none;%0A%20%20%20%20font-style:%20normal;%0A%20%20%20%20font-weight:%20normal;%0A%20%20%20%20font-variant:%20normal;%0A%20%20%20%20text-transform:%20none;%0A%20%20%20%20line-height:%201;%0A%0A%20%20%20%20/*%20Better%20Font%20Rendering%20===========%20*/%0A%20%20%20%20-webkit-font-smoothing:%20antialiased;%0A%20%20%20%20-moz-osx-font-smoothing:%20grayscale;%0A%7D%0A%0A.icon-tick:before%20%7B%0A%20%20%20%20content:%20%22%5Ce915%22;%0A%7D%0A.icon-leavemessage:before%20%7B%0A%20%20%20%20content:%20%22%5Ce90b%22;%0A%7D%0A.icon-agentonline:before%20%7B%0A%20%20%20%20content:%20%22%5Ce90c%22;%0A%7D%0A.icon-clip:before%20%7B%0A%20%20%20%20content:%20%22%5Ce90d%22;%0A%7D%0A.icon-close:before%20%7B%0A%20%20%20%20content:%20%22%5Ce90e%22;%0A%7D%0A.icon-email:before%20%7B%0A%20%20%20%20content:%20%22%5Ce90f%22;%0A%7D%0A.icon-maximize:before%20%7B%0A%20%20%20%20content:%20%22%5Ce910%22;%0A%7D%0A.icon-minimize:before%20%7B%0A%20%20%20%20content:%20%22%5Ce911%22;%0A%7D%0A.icon-mobile:before%20%7B%0A%20%20%20%20content:%20%22%5Ce912%22;%0A%7D%0A.icon-thumbs-down:before%20%7B%0A%20%20%20%20content:%20%22%5Ce913%22;%0A%7D%0A.icon-thumbs-up:before%20%7B%0A%20%20%20%20content:%20%22%5Ce914%22;%0A%7D%0A @font-face%20%7B%0A%20%20font-family:%20'Lato';%0A%20%20font-style:%20normal;%0A%20%20font-weight:%20400;%0A%20%20src:%20local('Lato%20Regular'),%20local('Lato-Regular'),%20url(https://themes.googleusercontent.com/static/fonts/lato/v6/9k-RPmcnxYEPm8CNFsH2gg.woff)%20format('woff');%0A%7D%0A",
    modernCSS: "body%20%7B%0A%09font-family:%20'Lato',%20sans-serif%20!important;%0A%7D%0A%0A#content%20%7B%0A%09padding:%200;%0A%09background:%20#FFF;%0A%09border-radius:%204px%204px%200%200%20!important;%0A%09box-shadow:%20none;%0A%09background-clip:%20padding-box%20!important;%0A%09border:%200%20!important;%0A%09height:%20100%25;%0A%7D%0A%0A#content%20#open-icon%20%7B%0A%09top:%208px;%0A%09right:%208px;%0A%7D%0A.icon-maximize%20%7B%0A%09font-size:%2018px;%0A%7D%0A%0A.lc2%20#content%20#full-view-button%20%7B%0A%09white-space:%20nowrap;%0A%09font-size:%2016px;%0A%09font-weight:%20400;%0A%7D%0A%0A#full-view-button%20span:nth-child(2)%20%7B%0A%09width:%20100%25!important;%0A%09box-sizing:%20border-box;%0A%09overflow:%20hidden;%0A%09text-overflow:%20ellipsis;%0A%09padding-right:%2038px%20!important;%0A%09display:%20inline-block!important;%0A%7D%0A%0A.rtl-lang%20#full-view-button%20span:nth-child(2)%20%7B%0A%09padding-left:%2038px%20!important;%0A%09padding-right:%2015px%20!important;%0A%7D%0A",
    postmodernFonts: "@font-face%20%7B%0A%20%20%20%20font-family:%20'livechat-circle';%0A%20%20%20%20src:%20%20%20%20url('//cdn.livechatinc.com/fonts/circle/livechat-circle_7d31e3ce2a.eot?boihvb');%0A%20%20%20%20src:%20%20%20%20url('//cdn.livechatinc.com/fonts/circle/livechat-circle_7d31e3ce2a.eot?boihvb#iefix')%20format('embedded-opentype'),%0A%20%20%20%20%20%20%20%20url('//cdn.livechatinc.com/fonts/circle/livechat-circle_e24970c490.ttf?boihvb')%20format('truetype'),%0A%20%20%20%20%20%20%20%20url('//cdn.livechatinc.com/fonts/circle/livechat-circle_b2f4faff07.woff?boihvb')%20format('woff'),%0A%20%20%20%20%20%20%20%20url('//cdn.livechatinc.com/fonts/circle/livechat-circle_fb831257c0.svg?boihvb#icomoon')%20format('svg');%0A%20%20%20%20font-weight:%20normal;%0A%20%20%20%20font-style:%20normal;%0A%7D%0A%0A%5Bclass%5E=%22icon-%22%5D,%20%5Bclass*=%22%20icon-%22%5D%20%7B%0A%20%20%20%20/*%20use%20!important%20to%20prevent%20issues%20with%20browser%20extensions%20that%20change%20fonts%20*/%0A%20%20%20%20font-family:%20'livechat-circle'%20!important;%0A%20%20%20%20speak:%20none;%0A%20%20%20%20font-style:%20normal;%0A%20%20%20%20font-weight:%20normal;%0A%20%20%20%20font-variant:%20normal;%0A%20%20%20%20text-transform:%20none;%0A%20%20%20%20line-height:%201;%0A%0A%20%20%20%20/*%20Better%20Font%20Rendering%20===========%20*/%0A%20%20%20%20-webkit-font-smoothing:%20antialiased;%0A%20%20%20%20-moz-osx-font-smoothing:%20grayscale;%0A%7D%0A%0A.icon-tick:before%20%7B%0A%20%20%20%20content:%20%22%5Ce90b%22;%0A%7D%0A.icon-leavemessage:before%20%7B%0A%20%20%20%20content:%20%22%5Ce900%22;%0A%7D%0A.icon-agentonline:before%20%7B%0A%20%20%20%20content:%20%22%5Ce901%22;%0A%7D%0A.icon-clip:before%20%7B%0A%20%20%20%20content:%20%22%5Ce902%22;%0A%7D%0A.icon-close:before%20%7B%0A%20%20%20%20content:%20%22%5Ce903%22;%0A%7D%0A.icon-email:before%20%7B%0A%20%20%20%20content:%20%22%5Ce904%22;%0A%7D%0A.icon-maximize:before%20%7B%0A%20%20%20%20content:%20%22%5Ce905%22;%0A%7D%0A.icon-menu:before%20%7B%0A%20%20%20%20content:%20%22%5Ce906%22;%0A%7D%0A.icon-minimize:before%20%7B%0A%20%20%20%20content:%20%22%5Ce907%22;%0A%7D%0A.icon-mobile:before%20%7B%0A%20%20%20%20content:%20%22%5Ce908%22;%0A%7D%0A.icon-thumbs-down:before%20%7B%0A%20%20%20%20content:%20%22%5Ce909%22;%0A%7D%0A.icon-thumbs-up:before%20%7B%0A%20%20%20%20content:%20%22%5Ce90a%22;%0A%7D%0A @font-face%7Bfont-family:Lato;font-style:normal;font-weight:400;src:local('Lato%20Regular'),local('Lato-Regular'),url(https://themes.googleusercontent.com/static/fonts/lato/v6/9k-RPmcnxYEPm8CNFsH2gg.woff)%20format('woff')%7D",
    postmodernCSS: "#body%20input,#body%20label,#body%20select,#body%20table,#body%20textarea,a,body,input,label,select,table,table#content,textarea%7Bfont-family:Lato,sans-serif!important%7D#content%7Bbackground:#FFF;border-radius:4px%204px%200%200!important;box-shadow:0%202px%2010px%20rgba(0,0,0,.1)!important;background-clip:padding-box!important;border:1px%20solid%20rgba(0,0,0,.02)!important;height:100%25%7D#content-container%7Bpadding:10px!important;box-sizing:border-box%7D#content-container.new-mobile%7Bpadding:0%20.5em!important%7D#content-container.new-mobile%20#content%7Bmargin-top:2em!important;border-radius:.5em!important%7D.icon-maximize%7Btop:11px;right:11px;font-size:19px;color:#5c5c5c%7D#full-view-button,#title%20#title-text%7Bcolor:#FFF;font-size:16px!important;font-weight:400!important;text-shadow:none!important%7D#full-view-button%7Bcolor:#000!important;font-size:14px!important;white-space:nowrap%7D#full-view-button%20span:nth-child(2)%7Bpadding:10px%2038px%2010px%2011px!important;width:100%25!important;box-sizing:border-box;overflow:hidden;text-overflow:ellipsis;display:inline-block!important%7D.new-mobile%20#open-icon.icon-maximize:before%7Bcolor:#000%7D.new-mobile%20#full-view-button%7Bline-height:2em%7D.rtl-lang%20#full-view-button%20span:nth-child(2)%7Bpadding-left:38px!important;padding-right:11px!important%7D",
    minimalFonts: "@font-face%20%7B%0A%20%20%20%20font-family:%20'livechat-minimal';%0A%20%20%20%20src:%20%20%20%20url('//cdn.livechatinc.com/fonts/minimal/livechat-minimal_750d47d198.eot?i0ym10');%0A%20%20%20%20src:%20%20%20%20url('//cdn.livechatinc.com/fonts/minimal/livechat-minimal_750d47d198.eot?i0ym10#iefix')%20format('embedded-opentype'),%0A%20%20%20%20%20%20%20%20url('//cdn.livechatinc.com/fonts/minimal/livechat-minimal_337558d286.ttf?i0ym10')%20format('truetype'),%0A%20%20%20%20%20%20%20%20url('//cdn.livechatinc.com/fonts/minimal/livechat-minimal_56b8359e5a.woff?i0ym10')%20format('woff'),%0A%20%20%20%20%20%20%20%20url('//cdn.livechatinc.com/fonts/minimal/livechat-minimal_91c8f9da62.svg?i0ym10#icomoon')%20format('svg');%0A%20%20%20%20font-weight:%20normal;%0A%20%20%20%20font-style:%20normal;%0A%7D%0A%0A%5Bclass%5E=%22icon-%22%5D,%20%5Bclass*=%22%20icon-%22%5D%20%7B%0A%20%20%20%20/*%20use%20!important%20to%20prevent%20issues%20with%20browser%20extensions%20that%20change%20fonts%20*/%0A%20%20%20%20font-family:%20'livechat-minimal'%20!important;%0A%20%20%20%20speak:%20none;%0A%20%20%20%20font-style:%20normal;%0A%20%20%20%20font-weight:%20normal;%0A%20%20%20%20font-variant:%20normal;%0A%20%20%20%20text-transform:%20none;%0A%20%20%20%20line-height:%201;%0A%0A%20%20%20%20/*%20Better%20Font%20Rendering%20===========%20*/%0A%20%20%20%20-webkit-font-smoothing:%20antialiased;%0A%20%20%20%20-moz-osx-font-smoothing:%20grayscale;%0A%7D%0A%0A.icon-agentonline:before%20%7B%0A%20%20%20%20content:%20%22%5Ce900%22;%0A%7D%0A.icon-leavemessage:before%20%7B%0A%20%20%20%20content:%20%22%5Ce901%22;%0A%7D%0A.icon-tick:before%20%7B%0A%20%20%20%20content:%20%22%5Ce902%22;%0A%7D%0A.icon-clip:before%20%7B%0A%20%20%20%20content:%20%22%5Ce903%22;%0A%7D%0A.icon-close:before%20%7B%0A%20%20%20%20content:%20%22%5Ce904%22;%0A%7D%0A.icon-maximize:before%20%7B%0A%20%20%20%20content:%20%22%5Ce905%22;%0A%7D%0A.icon-minimize:before%20%7B%0A%20%20%20%20content:%20%22%5Ce906%22;%0A%7D%0A.icon-mobile:before%20%7B%0A%20%20%20%20content:%20%22%5Ce907%22;%0A%7D%0A.icon-thumbs-down:before%20%7B%0A%20%20%20%20content:%20%22%5Ce908%22;%0A%7D%0A.icon-thumbs-up:before%20%7B%0A%20%20%20%20content:%20%22%5Ce909%22;%0A%7D%0A%0A @font-face%7Bfont-family:Lato;font-style:normal;font-weight:400;src:local('Lato%20Regular'),local('Lato-Regular'),url(https://themes.googleusercontent.com/static/fonts/lato/v6/9k-RPmcnxYEPm8CNFsH2gg.woff)%20format('woff')%7D",
    minimalCSS: "#body%20input,#body%20label,#body%20select,#body%20table,#body%20textarea,a,body,input,label,select,table,table#content,textarea%7Bfont-family:Lato,sans-serif!important%7D#content%7Bpadding:0;background:#fff;border-radius:0!important;box-shadow:none!important;background-clip:padding-box!important;border:0!important;height:100%25;margin-top:3px%7D#content%20#open-icon%7Btop:11px;right:11px%7D#open-icon.icon-maximize%7Bfont-size:10px%7D#content%20#open-label%7Bfont-size:10px!important;letter-spacing:.13em!important;color:#FFF!important;font-weight:400!important;text-transform:uppercase;padding-top:5px!important;text-overflow:ellipsis%7D.new-mobile%20#full-view-button%20span%7Bfont-size:.8em!important%7D#content-container.new-mobile%20#content%7Bborder-radius:0!important%7D#full-view-button%7Bwhite-space:nowrap%7D#full-view-button%20span:nth-child(2)%7Bwidth:100%25!important;box-sizing:border-box;overflow:hidden;text-overflow:ellipsis;padding-right:28px!important;display:inline-block!important%7D#full-view-button,#title%20#title-text%7Bcolor:#FFF;font-size:16px!important;font-weight:400!important;text-shadow:none!important%7D.rtl-lang%20#full-view-button%20span:nth-child(2)%7Bpadding-left:28px!important;padding-right:15px!important%7D",
    classicFonts: "@font-face%20%7B%0A%20%20%20%20font-family:%20'livechat-classic';%0A%20%20%20%20src:%20%20%20%20url('//cdn.livechatinc.com/fonts/classic/livechat-classic_2fa490e037.eot?uw2fw7');%0A%20%20%20%20src:%20%20%20%20url('//cdn.livechatinc.com/fonts/classic/livechat-classic_2fa490e037.eot?uw2fw7#iefix')%20format('embedded-opentype'),%0A%20%20%20%20%20%20%20%20url('//cdn.livechatinc.com/fonts/classic/livechat-classic_f726105e9a.ttf?uw2fw7')%20format('truetype'),%0A%20%20%20%20%20%20%20%20url('//cdn.livechatinc.com/fonts/classic/livechat-classic_59701eb4b0.woff?uw2fw7')%20format('woff'),%0A%20%20%20%20%20%20%20%20url('//cdn.livechatinc.com/fonts/classic/livechat-classic_898ec71fdc.svg?uw2fw7#icomoon')%20format('svg');%0A%20%20%20%20font-weight:%20normal;%0A%20%20%20%20font-style:%20normal;%0A%7D%0A%0A%5Bclass%5E=%22icon-%22%5D,%20%5Bclass*=%22%20icon-%22%5D%20%7B%0A%20%20%20%20/*%20use%20!important%20to%20prevent%20issues%20with%20browser%20extensions%20that%20change%20fonts%20*/%0A%20%20%20%20font-family:%20'livechat-classic'%20!important;%0A%20%20%20%20speak:%20none;%0A%20%20%20%20font-style:%20normal;%0A%20%20%20%20font-weight:%20normal;%0A%20%20%20%20font-variant:%20normal;%0A%20%20%20%20text-transform:%20none;%0A%20%20%20%20line-height:%201;%0A%0A%20%20%20%20/*%20Better%20Font%20Rendering%20===========%20*/%0A%20%20%20%20-webkit-font-smoothing:%20antialiased;%0A%20%20%20%20-moz-osx-font-smoothing:%20grayscale;%0A%7D%0A%0A.icon-tick:before%20%7B%0A%20%20%20%20content:%20%22%5Ce90a%22;%0A%7D%0A.icon-leavemessage:before%20%7B%0A%20%20%20%20content:%20%22%5Ce900%22;%0A%7D%0A.icon-agentonline:before%20%7B%0A%20%20%20%20content:%20%22%5Ce901%22;%0A%7D%0A.icon-clip:before%20%7B%0A%20%20%20%20content:%20%22%5Ce902%22;%0A%7D%0A.icon-close:before%20%7B%0A%20%20%20%20content:%20%22%5Ce903%22;%0A%7D%0A.icon-email:before%20%7B%0A%20%20%20%20content:%20%22%5Ce904%22;%0A%7D%0A.icon-maximize:before%20%7B%0A%20%20%20%20content:%20%22%5Ce905%22;%0A%7D%0A.icon-minimize:before%20%7B%0A%20%20%20%20content:%20%22%5Ce906%22;%0A%7D%0A.icon-mobile:before%20%7B%0A%20%20%20%20content:%20%22%5Ce907%22;%0A%7D%0A.icon-thumbs-down:before%20%7B%0A%20%20%20%20content:%20%22%5Ce908%22;%0A%7D%0A.icon-thumbs-up:before%20%7B%0A%20%20%20%20content:%20%22%5Ce909%22;%0A%7D%0A",
    classicCSS: ".lc2%20#content%20#full-view-button,body%7Bfont-family:'Lucida%20Grande','Lucida%20Sans%20Unicode',Arial,Verdana,sans-serif%7D.lc2%20#content%20#open-icon%7Btop:13px;right:12px%7D.lc2%20.icon-maximize%7Bfont-size:10px%7D#content-container.new-mobile%20#content%7Bborder-size:.1em;text-shadow:none%7D",
    cloud: "#extra%7Bbackground:#a4b4bf;background:rgba(75,107,130,.5)%7D#content%7Bbackground:#EBEBEB%7D#open-label%7Bcolor:#333;text-shadow:1px%201px%200%20#fff%7D#open-icon%7Bbackground-color:#b2c5d4%7D",
    fire: "#extra%7Bbackground:#d99;background:rgba(189,60,60,.5)%7D#content%7Bbackground:#EBEBEB%7D#open-label%7Bcolor:#333;text-shadow:1px%201px%200%20#fff%7D#open-icon%7Bbackground-color:#d3d3d3%7D",
    sun: "#extra%7Bbackground:#f9ccaa;background:rgba(240,149,103,.5)%7D#content%7Bbackground:#EBEBEB%7D#open-label%7Bcolor:#333;text-shadow:1px%201px%200%20#fff%7D#open-icon%7Bbackground-color:#d3d3d3%7D",
    grass: "#extra%7Bbackground:#9b7;background:rgba(66,119,12,.5)%7D#content%7Bbackground:#EBEBEB%7D#open-label%7Bcolor:#333;text-shadow:1px%201px%200%20#fff%7D#open-icon%7Bbackground-color:#d3d3d3%7D",
    night: "#extra%7Bbackground:#999;background:rgba(54,54,54,.5)%7D#content%7Bbackground:#EBEBEB%7D#open-label%7Bcolor:#333;text-shadow:1px%201px%200%20#fff%7D#open-icon%7Bbackground-color:#d3d3d3%7D"
   },
   mobileInvitationText: "",
   operator_avatar_url: "",
   showMobileInvitation: !1,
   showMobileInvitationText: !0,
   mobileInvitationOpened: !1,
   invitationOpened: !1,
   visitor_name: "",
   displayAvatar: null,
   __supportsChatting: !0,
   hiddenByInputFocus: !1,
   supportRoundedInvitations: function() {
    return Mobile.isNewMobile() || "circle" === this.circle_group_property
   },
   init: function() {
    if (!1 === LC_API.embedded_chat_enabled()) return !1;
    this.inited = !0, __lc_settings.automatic_greeting && Minimized.setState(Minimized.STATE_INVITATION_WITH_AGENT), this.originalTitle = Loader.pageData.title, this.checkIfTabActive(), this.mobileInvitationOpened = this.mobileInvitationOpened || Cookie.get("lc_mobile_invitation_opened"), this.invitationOpened = this.invitationOpened || Cookie.get("lc_invitation_opened")
   },
   __t: function() {
    var e, t;
    if (e = "", t = arguments[0], void 0 === this.langPhrases[t]) return "";
    if (e = this.langPhrases[t], arguments[1])
     for (var n in arguments[1]) e = e.replace("%" + n + "%", arguments[1][n]), e = e.replace("%" + n, arguments[1][n]);
    return e
   },
   setLangPhrases: function(e) {
    this.langPhrases = e
   },
   setLC2Theme: function(e) {
    this.LC2Theme = e
   },
   setTheme: function(e, t) {
    var n;
    "false" === t && (t = ""), t || !0 !== this.useLC2Theme() || (n = {
     sun: "#cf992d",
     cloud: "#799BB3",
     fire: "#c2613e",
     grass: "#949c41",
     night: "#3B3B3B"
    }, n[e] && (t = n[e], e = "classic")), this.theme = e, this.color = t
   },
   setMinimizedTheme: function(e) {
    this.circle_group_property = e
   },
   getMinimizedTheme: function() {
    return this.circle_group_property || "bar"
   },
   setDisplayAvatar: function(e) {
    this.displayAvatar = e
   },
   parseMinimizedMessage: function(e) {
    return visitor_name = this.getVisitorName(), operator_name = this.getOperatorName(), operator_name && (e = e.replace(/%agent%/g, operator_name)), visitor_name && (e = e.replace(/%name%/g, visitor_name)), e = Minimized.shortenTooLongText(e, 70)
   },
   reparseMinimizedMessages: function() {
    var e = this.getWelcomeMessage(),
     t = this.getMobileInvitationText();
    e && this.setWelcomeMessage(e), t && this.setMobileInvitationText(t)
   },
   setWelcomeMessage: function(e) {
    var t = this.parseMinimizedMessage(e);
    this.welcomeMessage = t
   },
   getWelcomeMessage: function() {
    return this.welcomeMessage
   },
   getDisplayAvatar: function() {
    return this.displayAvatar
   },
   useLC2Theme: function() {
    return this.LC2Theme
   },
   isInternetExplorer: function() {
    var e = navigator.userAgent.toLowerCase();
    return -1 != e.indexOf("msie") && parseInt(e.split("msie")[1])
   },
   checkIfTabActive: function() {
    fnFocus = function() {
     Minimized.tabActive = !0, NotifyChild.send("tab_active")
    }, fnBlur = function() {
     Minimized.tabActive = !1, NotifyChild.send("tab_inactive")
    }, window.onfocus = fnFocus, window.onblur = fnBlur
   },
   getIFrameBody: function() {
    var e;
    return document.frames && document.frames["livechat-compact-view"] ? e = document.frames["livechat-compact-view"].document : (e = $("livechat-compact-view"), e = e.contentWindow || e.contentDocument, e.document && (e = e.document)), e
   },
   escapeString: function(e) {
    return e ? (e = e.replace(/</g, "&lt;"), e = e.replace(/>/g, "&gt;")) : ""
   },
   modifyColor: function(e, t) {
    var n, i;
    e = String(e).replace(/[^0-9a-f]/gi, ""), e.length < 6 && (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]), t = t || 0, n = "#";
    for (var o = 0; o < 3; o++) i = parseInt(e.substr(2 * o, 2), 16), i = Math.round(Math.min(Math.max(0, i + i * t), 255)).toString(16), n += ("00" + i).substr(i.length);
    return n
   },
   styleForTheme: function(e, t) {
    var n, i;
    return t && (n = this.modifyColor(t, -.1)), i = {
     classic: "#content { background-color: " + t + "; border: 1px solid " + n + "; text-shadow: 1px 1px 0 " + n + " } #operator_avatar { background-color: " + t + "; }",
     modern: "#content { background-color: " + t + "; } #operator_avatar { background-color: " + t + "; }",
     minimal: "#content { background-color: " + t + "; } #operator_avatar { background-color: " + t + "; }",
     postmodern: "#operator_avatar { background-color: " + t + "; }"
    }, i[e] || ""
   },
   onRender: function(e) {
    this._onRender = e
   },
   setCompactSize: function(e) {
    if (Mobile.isNewMobile()) return !1;
    var t = e ? "330px" : "75px";
    this.customStyle = this.customStyle || new CustomStyle, this.compactSizeSet = !0, this.customStyle.cssProperties("livechat-compact-container", {
     height: "105px",
     width: t
    }, null, !0)
   },
   setNormalSize: function() {
    if (!this.rendered) return !0;
    if (Mobile.isNewMobile()) return !1;
    var e = {};
    this.customStyle = this.customStyle || new CustomStyle, "minimal" === this.theme ? (e.width = "240px", e.padding = "0 15px") : "postmodern" === this.theme ? (e.width = "280px", e.padding = "0 15px", e.height = "70px") : e.width = "250px", this.customStyle.cssProperties("livechat-compact-container", e, null, !0)
   },
   getPlatform: function() {
    return Mobile.isNewMobile() ? "newMobile" : Mobile.isOldMobile() ? "oldMobile" : "desktop"
   },
   shouldRenderRoundedMinimized: function(e, t, n, i) {
    return 8 !== Minimized.isInternetExplorer() && ("oldMobile" !== e && "circle" === n || "newMobile" === e && (t === Minimized.STATE_CHATTING || t === Minimized.STATE_INVITATION_WITH_AGENT))
   },
   shouldRenderRoundedMinimizedText: function(e, t, n, i) {
    return 8 !== Minimized.isInternetExplorer() && (!("newMobile" !== e || t !== Minimized.STATE_CHATTING && t !== Minimized.STATE_INVITATION_WITH_AGENT || i) || ("desktop" === e && t === Minimized.STATE_CHATTING && !i || "desktop" === e && t === Minimized.STATE_INVITATION_WITH_AGENT))
   },
   addMinimizedClass: function(e) {
    var t = Minimized.getIFrameBody();
    return !(!t || !t.body) && (t = t.body, -1 !== t.className.indexOf(e) || void(t.className = t.className + " " + e))
   },
   removeMinimizedClass: function(e) {
    var t = Minimized.getIFrameBody();
    if (!t || !t.body) return !1;
    t = t.body;
    var n = new RegExp(e);
    t.className = t.className.replace(n, "")
   },
   render: function() {
    var e, t, n, i, o, r, a, s, c, l, u, d = [],
     f = "",
     h = "",
     p = this;
    if (!1 === this.inited) return !1;
    if (this.$iframeBody = Minimized.getIFrameBody(), this.invitationOpened = this.invitationOpened || Cookie.get("lc_invitation_opened"), isNewMobile = Mobile.isNewMobile(), r = Mobile.isNewMobile() ? "new-mobile" : "", circleInvitation = Minimized.shouldRenderRoundedMinimized(Minimized.getPlatform(), this.state, this.getMinimizedTheme(), "opened" === Minimized.invitationOpened), circleInvitationText = Minimized.shouldRenderRoundedMinimizedText(Minimized.getPlatform(), this.state, this.getMinimizedTheme(), "opened" === Minimized.invitationOpened), o = circleInvitationText ? "table-cell" : "none", circleInvitation ? (i = "none", a = "block", this.setCompactSize(circleInvitationText), circleInvitationText ? Mobile.setContainerSize("normal") : Mobile.setContainerSize("small")) : (i = "block", a = "none", this.setNormalSize(), Mobile.setContainerSize("normal")), c = !1, /trident/i.test(navigator.userAgent) && (l = /(ie) ([\w.]+)/i.exec(navigator.userAgent) || [], (u = l[2]) && parseInt(u, 10) <= 8 && (c = !0)), t = "", this.styles[this.theme + "Fonts"] ? (t += decodeURI(this.styles[this.theme + "Fonts"]), t += decodeURI(this.styles[this.theme + "CSS"])) : t += decodeURI(this.styles[this.theme]), Mobile.isNewMobile() && (t += decodeURI(this.styles.mobileFonts), t += decodeURI(this.styles.mobileCSS)), t = t.replace(/url\(\'\/\//g, "url('https://"), t = !0 === this.useLC2Theme() ? decodeURI("#content-container%7Bposition:absolute;top:0;right:0;bottom:0;left:0;width:100%25;height:100%25;z-index:6;line-height:22px%7D#content%7Bborder-radius:10px%2010px%200%200;box-shadow:inset%201px%201px%201px%20rgba(255,255,255,.2)%7D#content%20#full-view-button%7Bdisplay:block;position:relative;padding:0;outline:0;color:#fff;font-size:14px;text-decoration:none;font-weight:700%7D#content%20#open-label%7Bdisplay:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:6px%2015px%7D.lc2%20#content%20#open-icon%7Bfloat:right;position:relative%7D#mobile_invitation_container%7Bposition:absolute;left:0;right:0;width:100%25;font-size:.9em%7D#mobile_invitation_container:hover%7Bcursor:pointer%7D.invitation_message%7Bmargin-right:1em;display:table-cell;vertical-align:middle;width:100%25%7D#operator_avatar_container%7Bdisplay:table-cell;padding:.1em%7D#invitation_message_text%7Bfloat:right;color:#4a546c;background:#e7eaf1;border-radius:.3em;font-size:1em;padding:.7em%20.9em;margin-right:.8em;max-height:3.2em;line-height:1.15em;overflow:hidden;display:block;border:1px%20solid%20rgba(0,0,0,.07);box-shadow:0%201px%205px%20rgba(0,0,0,.1);margin-left:.5em%7D.invitation_message:after%7Bborder:.5em%20solid%20transparent;border-color:transparent%20transparent%20transparent%20#DFE1E4;display:block;position:absolute;content:%22%22;margin-top:.5em;right:5.1em;top:1.5em%7D#operator_avatar%7Bfloat:right;border-radius:50%25;width:4.5em;height:4.5em;box-shadow:0%201px%203px%20rgba(0,0,0,.2);border:.3em%20solid%20#fff;box-sizing:content-box;overflow:hidden;color:#fff;text-align:center;position:relative;transition:background-color%20.2s%20ease-in-out%20.2s;-webkit-transition:background-color%20.2s%20ease-in-out%20.2s;-ms-transition:background-color%20.2s%20ease-in-out%20.2s;-o-transition:background-color%20.2s%20ease-in-out%20.2s%7D.avatar-loaded%20#operator_avatar%7Bbackground-color:#fff%7D#operator_avatar%20img%7Bwidth:0;height:0;border-radius:50%25;overflow:hidden;box-sizing:border-box;margin-top:50%25;margin-left:50%25;opacity:.5;position:absolute;top:0;left:0;transition:all%201s;-webkit-transition:all%20.2s%20ease-in-out;-moz-transition:all%20.2s%20ease-in-out;-ms-transition:all%20.2s%20ease-in-out;-o-transition:all%20.2s%20ease-in-out%7D.avatar-loaded%20#operator_avatar%20img%7Bwidth:4.5em;height:4.5em;margin-top:0;margin-left:0;opacity:1;background-color:#fff%7D#content-container.new-mobile%20#content,#extra.new-mobile%7Bmargin-top:1.5em!important;border-radius:.5em!important%7D#extra.new-mobile%7Bleft:.5em!important;right:.5em!important;width:auto!important%7D#content%20%5Bclass*=%22%20icon-%22%5D,#content%20%5Bclass%5E=icon-%5D%7B-webkit-font-smoothing:none%7D.icon-agentonline:before%7Bfont-size:2em%7D.icon-leavemessage:before%7Bfont-size:1.8em%7D.icon-leavemessage%7Bline-height:4.5em!important%7D.icon-agentonline%7Bline-height:4.6em!important%7D.rtl-lang%7Bdirection:rtl%7D.rtl-lang.lc2%20#content%20#open-icon%7Bleft:12px;right:auto;float:left%7D.rtl-lang%20#content%20#open-label%7Btext-align:right%7D") + t : decodeURI(".lc1%20#content%20#full-view-button,body%7Bfont-family:'Lucida%20Grande','Lucida%20Sans%20Unicode',Arial,Verdana,sans-serif%7D.lc1%20#content-container%7Bposition:absolute;top:0;right:0;bottom:0;left:0;width:100%25;height:100%25;z-index:6;line-height:22px%7D.lc1%20#content%7Bmargin:7px%207px%200;padding:2px%208px;border-radius:10px%2010px%200%200%7D.lc1%20#content%20#full-view-button%7Bdisplay:block;position:relative;padding:0;outline:0;color:#fff;font-size:14px;text-decoration:none;font-weight:700%7D.lc1%20#content%20#open-label%7Bdisplay:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis%7D.lc1%20#content%20#open-icon%7Bposition:relative;display:block;float:right;width:19px;height:19px;margin-top:2px;background-repeat:no-repeat;background-position:-16px%20-153px%7D.lc1.http%20#content%20#open-icon%7Bbackground-image:url(http://cdn.livechatinc.com/img/sprite.20111206.png)%7D.lc1.https%20#content%20#open-icon%7Bbackground-image:url(https://cdn.livechatinc.com/img/sprite.20111206.png)%7D#extra%7Bdisplay:block;position:absolute;top:0;right:0;bottom:0;left:0;width:100%25;height:100%25;z-index:5;border-radius:15px%2015px%200%200%7D") + t, t += this.styleForTheme(this.theme, this.color), this.skin_css.length && (t += this.skin_css), this.custom_css.length && (t += this.custom_css), e = "", c || (e += '<style type="text/css">' + t + "</style>"), !0 === this.useLC2Theme() ? (f = "display:" + i, h = r, s = '<span id="open-icon" class="icon-maximize"></span>') : (e += '<div id="extra"></div>', s = '<span id="open-icon"></span>'), e += '</div>", this.supportRoundedInvitations()) {
     var _ = "";
     Minimized.state === Minimized.STATE_CHATTING && !(Minimized.state === Minimized.STATE_CHAT_ENDED) && this.operator_avatar_url && "" !== this.operator_avatar_url && this.getDisplayAvatar();
     _ = this.operator_avatar_url && "" !== this.operator_avatar_url && this.getDisplayAvatar() && (Minimized.state === Minimized.STATE_CHATTING || Minimized.state === Minimized.STATE_INVITATION_WITH_AGENT) ? '<span class="icon-agentonline"></span><img src="//' + this.operator_avatar_url + '">' : Minimized.state === Minimized.STATE_OFFLINE ? '<span class="icon-leavemessage"></span>' : '<span class="icon-agentonline"></span>', e = e + '<div id="mobile_invitation_container" style="display:' + a + '"><div', __lc.mute_csp_errors || (e += " onclick=\"parent.LC_API.open_chat_window({source:'minimized'}); return false\""), e += ' class="invitation_message" style="display:' + o + '"><div id="invitation_message_text">' + this.escapeString(this.mobileInvitationText) + '</div></div><div id="operator_avatar_container"><div id="operator_avatar"', __lc.mute_csp_errors || (e += " onclick=\"parent.LC_API.open_chat_window({source:'minimized'}); return false\""), e += ">" + _ + "</div></div></div>"
    }
    d.push(this.useLC2Theme() ? "lc2" : "lc1"), d.push("ar" === __lc_settings.lang || "he" === __lc_settings.lang ? "rtl-lang" : ""), d.push("https"), Utils.makeItDone(function() {
     p.$iframeBody.body.className = d.join(" "), p.$iframeBody.body.innerHTML = e, p.$iframeBody.body.style.margin = "0px", p.$iframeBody.body.style.padding = "0px", c && (n = document.createElement("style"), n.type = "text/css", p.$iframeBody.body.appendChild(n), n.styleSheet ? n.styleSheet.cssText = t : n.appendChild(document.createTextNode(t))), p.rendered = !0, "function" == typeof p._onRender && p._onRender()
    }).when(function() {
     return p.$iframeBody.body
    })
   },
   updateWindowHTML: function() {
    var e, t, n, i, o, r, a;
    return !1 !== this.inited && (!1 !== this.rendered && (this.invitationOpened = this.invitationOpened || Cookie.get("lc_invitation_opened"), circleInvitation = Minimized.shouldRenderRoundedMinimized(Minimized.getPlatform(), this.state, this.getMinimizedTheme(), "opened" === Minimized.invitationOpened), circleInvitationText = Minimized.shouldRenderRoundedMinimizedText(Minimized.getPlatform(), this.state, this.getMinimizedTheme(), "opened" === Minimized.invitationOpened), e = circleInvitationText ? "table-cell" : "none", circleInvitation ? (t = "none", n = "block", this.setCompactSize(circleInvitationText), circleInvitationText ? Mobile.setContainerSize("normal") : Mobile.setContainerSize("small")) : (t = "block", n = "none", this.setNormalSize(), Mobile.setContainerSize("normal")), i = this.$iframeBody.getElementById("content-container"), i && (i.style.display = t), i = this.$iframeBody.getElementById("mobile_invitation_container"), i && (i.style.display = n, circleInvitationText && !LC_API.chat_window_maximized() && LC_Invite.embedded_chat_hidden_by_api && LC_API.minimize_chat_window()), i = this.$iframeBody.getElementById("operator_avatar"), i && (o = "", this.operator_avatar_url && "" !== this.operator_avatar_url && this.getDisplayAvatar() && (Minimized.state === Minimized.STATE_CHATTING || Minimized.state === Minimized.STATE_INVITATION_WITH_AGENT) ? (o = '<span class="icon-agentonline"></span><img src="//' + this.operator_avatar_url + '"', __lc.mute_csp_errors ? LC_API._add_minimized_body_class("avatar-loaded") : o += " onload=\"(function(){parent.LC_API._add_minimized_body_class('avatar-loaded')})()\"", o += ">") : Minimized.state === Minimized.STATE_OFFLINE ? (Minimized.removeMinimizedClass("avatar-loaded"), o = '<span class="icon-leavemessage"></span>') : (Minimized.removeMinimizedClass("avatar-loaded"), o = '<span class="icon-agentonline"></span>'), i.innerHTML = o), a = this.mobileInvitationText || Minimized.getWelcomeMessage(), void(document.getElementById && document.getElementsByClassName && (i = this.$iframeBody.getElementById("invitation_message_text"), i && (i.innerHTML = this.escapeString(a)), (r = this.$iframeBody.getElementsByClassName("invitation_message")[0]) && (r.style.display = e)))))
   },
   setState: function(e) {
    if (!1 === this.inited) return !1;
    this.previous_state = this.state, this.state = parseInt(e, 10), this.onStateChanged && this.onStateChanged(this.state === Minimized.STATE_OFFLINE ? "offline" : "online"), this.state === Minimized.STATE_CHATTING ? Chat.running("1") : "1" === Chat.running() && Cookie.erase("chat_running"), this.state === Minimized.STATE_QUEUE ? Chat.waitingInQueue("1") : Cookie.erase("waiting_in_queue"), this.updateWindowHTML()
   },
   setStateCallback: function(e) {
    this.onStateChanged = e
   },
   getState: function() {
    return this.state
   },
   disableMobileInvitationText: function() {
    this.showMobileInvitationText = !1
   },
   getPreviousState: function() {
    return this.previous_state
   },
   setOperatorDisplayName: function(e) {
    if (!1 === this.inited) return !1;
    this.operator_display_name = e, this.setOperatorName(e), this.updateText(), this.updateWindowHTML(), this.titleNotification = this.__t("Embedded_new_message", {
     operator: this.operator_display_name
    })
   },
   setOperatorAvatarUrl: function(e) {
    if (!1 === this.inited) return !1;
    e = UrlsUtils.convertUrlToCdn(e), this.operator_avatar_url = e.replace(/^(\/)+/, ""), this.updateWindowHTML()
   },
   setOperatorsOnline: function(e) {
    e ? void 0 === typeof this.getState() && this.setState(Minimized.STATE_PRE_CHAT) : this.setState(Minimized.STATE_OFFLINE), this.updateText()
   },
   displayLoadingMessage: function() {
    this._setText(this.__t("Loading") + "...")
   },
   updateText: function() {
    if (!1 === this.inited) return !1;
    switch (Minimized.state) {
     case Minimized.STATE_OFFLINE:
      this._setText(this.__t("Embedded_leave_message"));
      break;
     case Minimized.STATE_PRE_CHAT:
     case Minimized.STATE_INVITATION:
     case Minimized.STATE_INVITATION_WITH_AGENT:
      this._setText(this.__t("Embedded_chat_now"));
      break;
     case Minimized.STATE_QUEUE:
      this._setText(this.__t("Embedded_waiting_for_operator"));
      break;
     case Minimized.STATE_CHATTING:
      this._setText(this.__t("Embedded_chat_with", {
       operator: this.operator_display_name
      }));
      break;
     case Minimized.STATE_POST_CHAT:
     case Minimized.STATE_CHAT_ENDED:
      this._setText(this.__t("Embedded_chat_ended"))
    }
   },
   _setText: function(e) {
    var t;
    this.text_label = e, this.$iframeBody && (t = this.$iframeBody.getElementById("open-label")) && (t.innerHTML = this.escapeString(e))
   },
   setCustomCSS: function(e) {
    this.custom_css = e
   },
   setSkinCSS: function(e) {
    this.skin_css = e
   },
   newMessageNotification: function(e) {
    var t;
    return !1 !== this.inited && (!0 === this.tabActive && !0 === LC_API.chat_window_maximized() || (!0 === LC_API.chat_window_minimized() && this._setText(this.__t("Embedded_new_message", {
     operator: this.operator_display_name
    })), null === this.titleNotificationInterval && (this.titleNotificationInterval = setInterval(function() {
     Minimized.animateTitleTag()
    }, this.titleNotificationAnimateSpeed)), t = $("livechat-badge"), t.innerHTML = e, !0 === LC_API.chat_window_minimized() && (t.style.visibility = "visible", t.style.opacity = 1, Mobile.isNewMobile() && (t.className = "new-mobile")), void(LC_API.mobile_is_detected() && Mobile.playSound())))
   },
   disableNewMessageNotification: function() {
    if (!1 === this.inited) return !1;
    $("livechat-badge").innerHTML = "", $("livechat-badge").style.visibility = "hidden", $("livechat-badge").style.opacity = 0, this.animateTitleTag({
     force_hide: !0
    }), this.updateText()
   },
   setFontSize: function(e) {
    this.$iframeBody && (this.$iframeBody.body.style.fontSize = e + "px")
   },
   animateTitleTag: function(e) {
    var e = {
     force_hide: e && e.force_hide || !1
    };
    this.titleNotificationFlag === Minimized.TITLE_NOTIFICATION_HIDDEN ? !0 === e.force_hide || !1 !== Minimized.tabActive && !0 !== LC_API.chat_window_minimized() || (document.title = this.titleNotification, this.titleNotificationFlag = Minimized.TITLE_NOTIFICATION_APPENDED) : (document.title = this.originalTitle, this.titleNotificationFlag = Minimized.TITLE_NOTIFICATION_HIDDEN), !0 === e.force_hide && (clearInterval(this.titleNotificationInterval), this.titleNotificationInterval = null)
   },
   hide: function() {
    document.getElementById("livechat-compact-container").style.setProperty("display", "none")
   },
   show: function() {
    document.getElementById("livechat-compact-container").style.setProperty("display", "block")
   },
   renderMobileInvitation: function(e, t, n) {
    if (!Minimized.supportRoundedInvitations()) return !1;
    this.showMobileInvitation = !0, e && this.setOperatorAvatarUrl(e), this.setOperatorName(t), this.setMobileInvitationText(n), LC_API.hide_eye_catcher(), this.updateWindowHTML()
   },
   shortenTooLongText: function(e, t) {
    for (var n = e.split(" "), i = 0, o = "", r = 0; r < n.length; r++) {
     if (!(i + n[r].length < t)) {
      o += "...";
      break
     }
     o = o + " " + n[r], i += n[r].length
    }
    return o
   },
   setMobileInvitationText: function(e) {
    var t = this.parseMinimizedMessage(e);
    this.mobileInvitationText = t
   },
   getMobileInvitationText: function() {
    return this.mobileInvitationText
   },
   setVisitorName: function(e) {
    this.visitor_name = e, this.reparseMinimizedMessages()
   },
   getVisitorName: function() {
    return this.visitor_name
   },
   setOperatorName: function(e) {
    this.operator_name = e, this.reparseMinimizedMessages()
   },
   getOperatorName: function() {
    return this.operator_name
   },
   setSupportsChatting: function(e) {
    this.__supportsChatting = e
   },
   isChattingSupported: function() {
    return this.__supportsChatting
   }
  },
  Mixpanel = {
   enabled: null,
   setEnabled: function(e) {
    var t = this;
    this.enabled = e, AnalyticsIntegrations.subscribe({
     name: "Mixpanel",
     events: ["Standard greeting", "Personal greeting", "Automated greeting", "Chat", "Ticket form", "Ticket form filled in", "After-hours form", "Pre-chat survey", "Pre-chat survey filled in", "Post-chat survey", "Post-chat survey filled in"],
     callback: function() {
      t.track.apply(t, arguments)
     }
    })
   },
   eventsMapper: {
    "Standard greeting": "LiveChat Standard greeting displayed",
    "Personal greeting": "LiveChat Personal greeting displayed",
    "Automated greeting": "LiveChat Automated greeting displayed",
    Chat: "LiveChat Chat started",
    "Ticket form": "LiveChat Ticket form displayed",
    "Ticket form filled in": "LiveChat Ticket form filled in",
    "After-hours form": "LiveChat After-hours form displayed",
    "Pre-chat survey": "LiveChat Pre-chat survey displayed",
    "Pre-chat survey filled in": "LiveChat Pre-chat survey filled in",
    "Post-chat survey": "LiveChat Post-chat survey displayed",
    "Post-chat survey filled in": "LiveChat Post-chat survey filled in"
   },
   track: function(e, t) {
    if ("object" == typeof mixpanel && "function" == typeof mixpanel.track) {
     var n = "(no group)";
     t = t || {}, t.event_data = t.event_data || {};
     var i = t.event_data && t.event_data.skill || __lc.skill;
     i > 0 && (n = "Group ID: " + parseInt(i, 10)), t.event_data.group = n, this.eventsMapper[e] && (e = this.eventsMapper[e]), t.user_data && mixpanel.register(t.user_data), mixpanel.track(e, t.event_data)
    }
   }
  },
  Mobile = {
   CONTAINER_WITH_FACTOR: 5.3,
   $sound: null,
   $htmlTag: document.getElementsByTagName("html")[0],
   previousSoundTime: 0,
   hasAudioSupport: !!document.createElement("audio").canPlayType,
   preloadedOnMobile: !1,
   setWindowHeight: null,
   positionSet: !1,
   lockResize: !1,
   customStyle: new CustomStyle,
   storedDocumentHeight: null,
   storedDocumentWidth: null,
   minimizedContainerSize: "normal",
   mobileWebsite: null,
   storedBodyPosition: null,
   storedHeadPosition: null,
   storedBodyOverflowY: null,
   storedBodyWidth: null,
   storedBodyHeight: null,
   storedBodyLeft: null,
   storedBodyRight: null,
   storedBodyTop: null,
   storedBodyBottom: null,
   storedInnerWidth: null,
   storedInnerHeight: null,
   storedBottomPosition: null,
   storedHorizontalPosition: null,
   lockTimeout: null,
   userAgent: function() {
    return navigator && navigator.userAgent ? navigator.userAgent : null
   }(),
   isDetected: function() {
    return Mobile.userAgent && /mobile/gi.test(Mobile.userAgent)
   },
   isNewMobile: function() {
    return LC_Invite.embedded_chat_enabled() && LC_Invite.conf.chat_window.beta && LC_Invite.conf.chat_window.use_lc2_theme && Mobile.userAgent && /mobile/gi.test(Mobile.userAgent) && !this.isWindowsPhone() && !this.isOldAndroid() && !this.isIOSChromeAndNonMobileWebsite() && (/(Chrome).*(Mobile)/gi.test(Mobile.userAgent) || /(Android).*/gi.test(Mobile.userAgent) || /(iPhone|iPod).*Apple.*Mobile/g.test(Mobile.userAgent) || /(Android).*(Mobile)/gi.test(Mobile.userAgent))
   },
   isOldMobile: function() {
    return this.isDetected() && !this.isNewMobile()
   },
   isIOSChromeAndNonMobileWebsite: function() {
    return !this.isWebsiteMobile() && this.isiOSChrome() && this.getChromeVersion() < 48
   },
   getAndroidVersion: function() {
    var e = Mobile.userAgent.toLowerCase(),
     t = e.match(/android\s([0-9\.]*)/);
    return !!t && t[1]
   },
   isAndroid: function() {
    return Mobile.userAgent && /android/gi.test(Mobile.userAgent)
   },
   isSamsung: function() {
    return Mobile.userAgent && /samsung/i.test(Mobile.userAgent)
   },
   isOldAndroid: function() {
    if (!this.isAndroid()) return !1;
    var e = (parseInt(this.getAndroidVersion(), 10), parseFloat(this.getAndroidVersion()));
    return Mobile.userAgent && Mobile.isAndroid() && (Mobile.getAppleWebkitVersion() < 537 || Mobile.isSamsung() && e < 4.4)
   },
   getPixelRatio: function() {
    return window.devicePixelRatio ? window.devicePixelRatio : 1
   },
   isiOSSafari: function() {
    return Mobile.userAgent && /(iPad|iPhone|iPod).*Apple(?!.*CriOS).*Mobile/g.test(Mobile.userAgent)
   },
   isiOSChrome: function() {
    return Mobile.userAgent && /(iPad|iPhone|iPod).*Apple.*CriOS/g.test(Mobile.userAgent)
   },
   getAppleWebkitVersion: function() {
    var e = new RegExp(/AppleWebKit\/([\d.]+)/);
    return null === e.exec(Mobile.userAgent) ? null : parseFloat(e.exec(Mobile.userAgent)[1])
   },
   getChromeVersion: function() {
    var e = new RegExp(/Chrome|CriOS\/([\d.]+)/);
    return null === e.exec(Mobile.userAgent) ? null : parseFloat(e.exec(Mobile.userAgent)[1])
   },
   isWindowsPhone: function() {
    return Mobile.userAgent && /Windows Phone/gi.test(Mobile.userAgent)
   },
   isiOS: function() {
    return Mobile.userAgent && !this.isWindowsPhone() && /(?!.*IEMobile).*(iPad|iPhone|iPod)/g.test(Mobile.userAgent)
   },
   isIOS8: function() {
    return Mobile.userAgent && /Apple(?!.*CriOS).*Mobile/g.test(Mobile.userAgent) && (/OS 8_/g.test(Mobile.userAgent) || /Version\/8\./g.test(Mobile.userAgent))
   },
   isIOS7: function() {
    return Mobile.userAgent && /Apple(?!.*CriOS).*Mobile/g.test(Mobile.userAgent) && (/OS 7_/g.test(Mobile.userAgent) || /Version\/7\./g.test(Mobile.userAgent))
   },
   isLandscapeMode: function() {
    return window.orientation && (-90 === window.orientation || 90 === window.orientation)
   },
   isTablet: function() {
    return !!(screen && screen.width > 500)
   },
   setContainerSize: function(e) {
    this.minimizedContainerSize = e, this.resizeMobileWindow({
     force: !0
    })
   },
   getContainerSize: function() {
    return this.minimizedContainerSize
   },
   getWindowSize: function(e) {
    var t = {
     full: {},
     minimized: {}
    };
    Mobile.getDocumentWidth(), Mobile.getDocumentHeight();
    return e = e || {}, t.width = window.innerWidth, t.height = window.innerHeight, Mobile.storedInnerWidth = window.innerWidth, Mobile.storedInnerHeight = window.innerHeight, t.fontHeight = t.width / 24, t.addBackground = !0, e.landscapeMode ? (t.width > 3 * t.height ? (t.height = t.width, t.fontHeight = t.width / 25) : (t.width = 1.2 * t.height, t.fontHeight = t.height / 24), t.addBackground = !1) : e.tablet && (t.width = .85 * t.width, t.height = .7 * t.height, t.fontHeight = .7 * t.fontHeight, t.addBackground = !1), t.fontHeight = Math.floor(t.fontHeight), t
   },
   getDocumentHeight: function() {
    return "offsetHeight" === Mobile.storedDocumentHeight || document.body.offsetHeight === document.body.scrollHeight ? (Mobile.storedDocumentHeight = "offsetHeight", document.body.offsetHeight) : Mobile.isWebsiteMobile() && Mobile.storedDocumentHeight ? Mobile.storedDocumentHeight : (Mobile.storedDocumentHeight = document.body.scrollHeight, Mobile.storedDocumentHeight)
   },
   getDocumentWidth: function() {
    return Mobile.storedDocumentWidth = Mobile.storedDocumentWidth || window.innerWidth, Math.max(document.body.offsetWidth, Mobile.storedDocumentWidth)
   },
   getWindowsPosition: function(e) {
    var t = Mobile.getDocumentHeight(),
     n = Mobile.getDocumentWidth(),
     i = function() {
      return document.compatMode && "BackCompat" === document.compatMode ? document.body.clientHeight : document.documentElement.clientHeight
     }(),
     o = function() {
      return document.body.offsetHeight > 0 ? i : 0
     }(),
     r = -1 * (Math.max(window.innerHeight, t) - o),
     a = Math.floor(n - e.windowWidth),
     s = Math.floor(Math.max(i - (window.pageYOffset + e.windowHeight), r)),
     c = Math.floor(Math.min(window.innerWidth - e.windowWidth + window.pageXOffset, a)),
     l = {
      full: {},
      minimized: {}
     };
    return e = e || {}, Mobile.storedBottomPosition = window.pageYOffset, Mobile.storedHorizontalPosition = window.pageXOffset, (LC_API.chat_window_minimized() || LC_API.chat_window_hidden()) && (0, r = 0), l.full.top = "auto", l.full.position = "fixed", l.full.bottom = 0, l.full.right = 0, l.full.left = "auto",
     e.mobileSite ? (l.minimized.left = "auto", l.minimized.bottom = 0, l.minimized.right = 0, l.minimized.position = "fixed") : (l.minimized.left = c, "small" === Mobile.getContainerSize() && (l.minimized.left = Math.floor(c + (e.windowWidth - e.fontHeight * Mobile.CONTAINER_WITH_FACTOR))), "relative" === window.getComputedStyle(document.body).position && (s = s + parseInt(window.getComputedStyle(document.body).height) - i), l.minimized.bottom = s, l.minimized.right = "auto", l.minimized.position = "absolute"), l
   },
   checkIfResizeIsNeeded: function() {
    if (Mobile.isWebsiteMobile()) {
     if (Mobile.lockResize || Mobile.storedInnerWidth && Mobile.storedInnerWidth === window.innerWidth && Mobile.storedInnerHeight === window.innerHeight) return !1
    } else if (Mobile.lockResize || Mobile.storedInnerWidth && Mobile.storedInnerWidth === window.innerWidth && Mobile.storedInnerHeight === window.innerHeight && Mobile.storedBottomPosition === window.pageYOffset && Mobile.storedHorizontalPosition === window.pageXOffset) return !1;
    return !0
   },
   resizeMobileWindow: function(e) {
    var e = e || {};
    if (!Mobile.isNewMobile()) return !1;
    if (!Mobile.checkIfResizeIsNeeded() && !e.force) return !1;
    var t, n, i, o = document.getElementById("livechat-compact-container"),
     r = document.getElementById("livechat-full"),
     a = document.getElementById("livechat-badge");
    if (e.orientationReset) return Mobile.customStyle.cssProperties(r, {
     width: 0,
     left: 0
    }), Mobile.customStyle.cssProperties(o, {
     width: 0,
     left: 0
    }), void(Mobile.positionSet = !1);
    t = Mobile.getWindowSize({
     landscapeMode: Mobile.isLandscapeMode(),
     tablet: Mobile.isTablet(),
     iOS: Mobile.isiOS()
    }), n = Mobile.getWindowsPosition({
     landscapeMode: Mobile.isLandscapeMode(),
     tablet: Mobile.isTablet(),
     iOS: Mobile.isiOS(),
     mobileSite: Mobile.isWebsiteMobile(),
     windowWidth: t.width,
     windowHeight: t.height,
     fontHeight: t.fontHeight
    }), i = "small" === Mobile.getContainerSize() ? t.fontHeight * Mobile.CONTAINER_WITH_FACTOR : t.width, n.minimized.left === parseInt(n.minimized.left, 10) && (n.minimized.left = n.minimized.left + "px"), n.minimized.right === parseInt(n.minimized.right, 10) && (n.minimized.right = n.minimized.right + "px"), n.full.top === parseInt(n.full.top, 10) && (n.full.top = n.full.top + "px"), n.full.bottom === parseInt(n.full.bottom, 10) && (n.full.bottom = n.full.bottom + "px"), n.full.right === parseInt(n.full.right, 10) && (n.full.right = n.full.right + "px"), n.full.left === parseInt(n.full.left, 10) && (n.full.left = n.full.left + "px"), Mobile.setWindowHeight = t.height, Mobile.customStyle.cssProperties(o, {
     left: n.minimized.left,
     right: n.minimized.right,
     bottom: n.minimized.bottom + "px",
     position: n.minimized.position,
     width: i + "px",
     height: 5.5 * t.fontHeight + "px"
    }), Mobile.customStyle.cssProperties(r, {
     left: n.full.left,
     right: n.full.right,
     position: n.full.position,
     bottom: n.full.bottom,
     top: n.full.top,
     width: Mobile.isiOS() ? "100%" : t.width + "px",
     height: Mobile.isiOS() ? "100%" : t.height + "px"
    }), Mobile.customStyle.cssProperties(a, {
     width: t.fontHeight + "px",
     height: t.fontHeight + "px",
     "font-size": t.fontHeight / 1.3 + "px",
     "line-height": t.fontHeight + "px",
     border: t.fontHeight / 5 + "px solid #ffffff",
     right: t.fontHeight / 4 + "px",
     top: 0
    }), LC_API.update_height(t.fontHeight, t.addBackground)
   },
   initNewMobile: function() {
    var e = this;
    Mobile.storedInnerWidth = null, Mobile.storedInnerHeight = null, window.addEventListener("scroll", function(e) {
     Mobile.onScroll()
    }), setInterval(function() {
     Mobile.resizeMobileWindow()
    }, 200), window.addEventListener("orientationchange", function(t) {
     NotifyChild.send("mobile_input_blur"), e.resizeMobileWindow({
      orientationReset: !0
     })
    })
   },
   setWindowStyle: function() {
    Mobile.customStyle.cssProperties("livechat-compact-container", {
     position: "absolute",
     left: 0,
     right: "auto",
     padding: 0,
     "box-sizing": "border-box",
     top: "auto",
     "-webkit-transition": "none",
     "-moz-transition": "none",
     "-o-transition": "none",
     transition: "none"
    }), Mobile.customStyle.cssProperties("livechat-compact-view", {
     top: 0,
     width: "100%",
     height: "inherit"
    }), Mobile.customStyle.cssProperties("livechat-full-view", {
     width: "100%",
     height: "100%"
    }), Mobile.customStyle.cssProperties("livechat-badge", {
     background: "#D93328",
     padding: 0,
     "border-radius": "50%",
     "text-align": "center",
     "box-shadow": "none",
     left: "auto"
    }), Mobile.resizeMobileWindow()
   },
   isWebsiteMobile: function() {
    if (null != Mobile.mobileWebsite) return Mobile.mobileWebsite;
    var e, t = document.querySelector('meta[name="viewport"]');
    if (!t) return Mobile.mobileWebsite = !1, !1;
    if (e = t.content.replace(/\s/gi, ""), -1 !== e.indexOf("width=device-width")) return Mobile.mobileWebsite = !0, !0;
    if (-1 !== e.indexOf("user-scalable=no")) return Mobile.mobileWebsite = !0, !0;
    if (-1 !== e.indexOf("user-scalable=0")) return Mobile.mobileWebsite = !0, !0;
    var n = e.match(/width=([0-9]*)/);
    return n && n[1] && 1 * n[1] <= 320 ? (Mobile.mobileWebsite = !0, !0) : (Mobile.mobileWebsite = !1, !1)
   },
   onMinimizeChatWindow: function() {
    var e = document.querySelector('meta[name="viewport"]'),
     t = document.getElementById("livechat-full");
    Mobile.lockResize = !1, e && this.storedViewport && ("no-viewport" === this.storedViewport ? e.content = "user-scalable=yes" : e.content = this.storedViewport), Mobile.customStyle.cssProperties(t, {
     bottom: 0
    }), Mobile.customStyle.cssProperties(document.body, "position", Mobile.storedBodyPosition || "", !0), Mobile.customStyle.cssProperties(document.body, "overflow-y", Mobile.storedBodyOverflowY || "", !0), Mobile.customStyle.cssProperties(document.body, "width", Mobile.storedBodyWidth || "", !0), Mobile.customStyle.cssProperties(document.body, "height", Mobile.storedBodyHeight || "", !0), Mobile.customStyle.cssProperties(document.body, "left", Mobile.storedBodyLeft || "", !0), Mobile.customStyle.cssProperties(document.body, "right", Mobile.storedBodyRight || "", !0), Mobile.customStyle.cssProperties(document.body, "top", Mobile.storedBodyTop || "", !0), Mobile.customStyle.cssProperties(document.body, "bottom", Mobile.storedBodyBottom || "", !0), Mobile.$htmlTag.style.position = Mobile.storedHeadPosition, Mobile.resizeMobileWindow({
     force: !0
    })
   },
   onShowFullView: function() {
    var e = document.querySelector('meta[name="viewport"]');
    this.storedPosition = document.body.scrollTop, Mobile.storedDocumentHeight = null, this.storedViewport || (e ? this.storedViewport = e.content : (e = document.createElement("meta"), e.name = "viewport", document.getElementsByTagName("head")[0].appendChild(e), this.storedViewport = "no-viewport")), e.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no", Mobile.storedBodyPosition = Mobile.customStyle.cssProperties(document.body, "position"), Mobile.storedBodyOverflowY = Mobile.customStyle.cssProperties(document.body, "overflow-y"), Mobile.storedBodyWidth = Mobile.customStyle.cssProperties(document.body, "width"), Mobile.storedBodyHeight = Mobile.customStyle.cssProperties(document.body, "height"), Mobile.storedBodyLeft = Mobile.customStyle.cssProperties(document.body, "left"), Mobile.storedBodyRight = Mobile.customStyle.cssProperties(document.body, "right"), Mobile.storedBodyTop = Mobile.customStyle.cssProperties(document.body, "top"), Mobile.storedBodyBottom = Mobile.customStyle.cssProperties(document.body, "bottom"), Mobile.storedHeadPosition = Mobile.$htmlTag.ownerDocument.defaultView.getComputedStyle(Mobile.$htmlTag, null).position, document.body.style.setProperty("position", "fixed", "important"), document.body.style.setProperty("overflow-y", "hidden", "important"), document.body.style.setProperty("width", "100%", "important"), document.body.style.setProperty("height", "100%", "important"), document.body.style.setProperty("left", "0", "important"), document.body.style.setProperty("right", "0", "important"), document.body.style.setProperty("top", "0", "important"), document.body.style.setProperty("bottom", "0", "important"), Minimized.showMobileInvitation && (Minimized.mobileInvitationOpened = "opened", Minimized.invitationOpened = "opened", Cookie.set("lc_mobile_invitation_opened", "opened"), Cookie.set("lc_invitation_opened", "opened"), Minimized.updateWindowHTML()), Mobile.resizeMobileWindow()
   },
   onScroll: function() {
    Mobile.resizeMobileWindow()
   },
   onMessageInputFocus: function() {
    Mobile.lockResize = !0, clearTimeout(Mobile.lockTimeout)
   },
   onMessageInputBlur: function() {
    Mobile.lockTimeout = setTimeout(function() {
     Mobile.lockResize = !1
    }, 200)
   },
   preloadSound: function() {
    var e, t = this;
    if ($("livechat_sound")) return !1;
    e = document.createElement("audio"), e.setAttribute("id", "livechat_sound"), e.setAttribute("style", "position:absolute;top:-9999em;left:-9999em;visibility:hidden"), e.innerHTML = ['<source src="//cdn.livechatinc.com/sounds/message.ogg" type="audio/ogg" />', '<source src="//cdn.livechatinc.com/sounds/message.mp3" type="audio/mp3" />', '<source src="//cdn.livechatinc.com/sounds/message.wav" type="audio/wav" />'].join("\n"), DOM.appendToBody(e, function() {
     t.$sound = $("livechat_sound")
    })
   },
   playSound: function(e) {
    if (!this.disabledSounds) {
     var t = this;
     if (null == e && (e = {
       preloadOnMobile: !1
      }), !$("livechat_sound")) return !1;
     if (+new Date - this.previousSoundTime < 2e3) return !0;
     if (this.previousSoundTime = +new Date, !0 === this.hasAudioSupport) {
      if (e.preloadOnMobile && this.preloadedOnMobile) return !1;
      this.$sound.play(), e.preloadOnMobile && !this.preloadedOnMobile && (this.preloadedOnMobile = !0, setTimeout(function() {
       t.$sound.pause(), t.$sound.currentTime = 0
      }, 10))
     }
    }
   },
   disableSounds: function() {
    this.disabledSounds = !0
   }
  },
  NotifyChild = {
   chat_reloaded: !1,
   welcome_message: null,
   maximize_on_init: !1,
   set_mobile_invitation_after_message: !1,
   init: function() {
    this.bindReceive()
   },
   send: function(e) {
    var t = LC_Invite.windowRef || frames["livechat-full-view"];
    return !!t && (XD.postMessage(encodeURIComponent(e), __lc_iframe_src_hash, t), !1)
   },
   bindReceive: function() {
    var e, t = this;
    e = Loader.getChatHost(), XD.receiveMessage(function(e) {
     t.receive(e)
    }, e.replace(/^http:/, "https:")), XD.receiveMessage(function(e) {
     t.receive(e)
    }, e.replace(/^https/, "http"))
   },
   receive: function(e) {
    var t, n, i, o, r, a, s, c = this,
     l = function(e) {
      null == LC_Invite.invoked_callbacks[e] && (LC_Invite.invoked_callbacks[e] = !0, LC_API[e]())
     };
    if (Loader.is_iframe_loaded = !0, t = e.data, "load_languages" === (t = decodeURIComponent(t))) {
     if (null == LC_Invite.conf.lang_phrases) return !1;
     LC_Invite.sendLangPhrasesToEmbedded()
    } else if ("load_window_config" === t) this.manualInvitation && (s = {
     skipPrechat: !0
    }), LC_Invite.sendWindowConfigToEmbedded(s);
    else if (/^force_ping;/.test(t)) {
     var u = t.split(";");
     LC_Invite.pinger.ping({
      forcePing: "true" === u[1]
     })
    } else if (/^new_messages;/.test(t)) o = parseInt(t.split(";")[1], 10), Minimized.newMessageNotification(o);
    else if (/^message_sent;/.test(t)) LC_API.on_message({
     text: decodeURIComponent(t.split(";")[1]),
     user_type: "visitor",
     visitor_name: decodeURIComponent(t.split(";")[2]),
     timestamp: Math.round(decodeURIComponent(t.split(";")[3]) / 1e3)
    }), window.LC_AutoInvite && window.LC_AutoInvite.autoInvited && (window.LC_AutoInvite.ignoreFirstMessage = !0);
    else if (/^ticket_created;/.test(t)) {
     var d = t.split(";"),
      f = {
       ticket_id: d[1],
       text: decodeURIComponent(d[2]),
       visitor_name: decodeURIComponent(d[5]),
       visitor_email: decodeURIComponent(d[3]),
       form_data: JSON.parse(decodeURIComponent(d[7]))
      };
     "null" !== decodeURIComponent(d[6]) && (f.ticket_subject = decodeURIComponent(d[6])), LC_API.on_ticket_created(f)
    } else if (/^prechat_sent;/.test(t)) {
     var d = t.split(";"),
      f = {};
     f.form_data = JSON.parse(decodeURIComponent(d[1])), LC_API.on_prechat_survey_submitted(f)
    } else if (/^postchat_sent;/.test(t)) {
     var d = t.split(";"),
      f = {};
     f.form_data = JSON.parse(decodeURIComponent(d[1])), LC_API.on_postchat_survey_submitted(f)
    } else if (/^rating_sent;/.test(t)) {
     var h = t.split(";")[1];
     LC_API.on_rating_submitted(h)
    } else if (/^rating_comment_sent;/.test(t)) {
     var p = t.split(";")[1];
     LC_API.on_rating_comment_submitted(p)
    } else if (/^message_received;/.test(t)) LC_API.on_message({
     text: decodeURIComponent(t.split(";")[1]),
     user_type: "agent",
     agent_login: decodeURIComponent(t.split(";")[2]),
     agent_name: decodeURIComponent(t.split(";")[4]),
     timestamp: Math.round(decodeURIComponent(t.split(";")[3]) / 1e3)
    }), this.set_mobile_invitation_after_message && (Minimized.renderMobileInvitation(!1, decodeURIComponent(t.split(";")[4]), decodeURIComponent(t.split(";")[1])), this.set_mobile_invitation_after_message = !1);
    else if (/autoinvitation_data/.test(t)) {
     var _ = t.split(";"),
      m = JSON.parse(decodeURIComponent(_[2]));
     Minimized.renderMobileInvitation(m.avatar_url, m.name, decodeURIComponent(_[1]))
    } else if (/^welcome_message/.test(t)) Minimized.setWelcomeMessage(decodeURIComponent(t.split(";")[1])), Minimized.updateWindowHTML();
    else if ("minimize" == t) !1 === LC_API.chat_window_hidden() && LC_API.minimize_chat_window();
    else if ("maximize" == t) LC_API.show_full_view();
    else if ("resize_mobile_window" == t) Mobile.resizeMobileWindow();
    else if ("message_input_focus" === t) Mobile.isNewMobile() && Mobile.onMessageInputFocus();
    else if ("message_input_blur" === t) Mobile.isNewMobile() && Mobile.onMessageInputBlur();
    else if ("invitation_refused" == t || "invitation_operators_offline" == t) "invitation_refused" == t && (document.createElement("img").src = LC_Invite.httpp + LC_Invite.conf.serv + "/licence/" + LC_Invite.conf.lic + "/tunnel.cgi?IWCS0014C^inviterefused^" + LC_API.get_visitor_id() + "^$^&rand=" + Math.floor(1e3 * Math.random())), LC_Invite.getVisitorInteraction() || LC_API.minimize_chat_window();
    else if ("chose_destination_skill" === t) LC_Invite.destinationSkillChosen = !0;
    else if (/^new_chat;/.test(t)) {
     var g;
     try {
      g = JSON.parse(decodeURIComponent(t.split(";")[1]))
     } catch (e) {
      g = {
       agent_name: decodeURIComponent(t.split(";")[1])
      }
     }
     LC_API.hide_eye_catcher(), LC_API.on_chat_started(g), t.split(";")[2] && (Minimized.setOperatorAvatarUrl(decodeURIComponent(t.split(";")[2])), Mobile.isNewMobile() && (this.set_mobile_invitation_after_message = !0))
    } else if (/^chat_ended$/.test(t)) LC_Invite.chat_ended = !0, LC_API.on_chat_ended();
    else if (/^chat_reload;/.test(t)) {
     if (!1 === LC_API.embedded_chat_enabled()) return !1;
     LC_Invite.invoked_callbacks = {};
     var e = t.split(";");
     this.welcome_message = decodeURIComponent(e[1]), this.manualInvitation = "true" === e[2], "" === this.welcome_message && (this.welcome_message = null), $("livechat-full").style.visibility = "hidden", $("livechat-full").style.opacity = 0, this.chat_reloaded = !0, Loader.pendingConfigRequest = !0, Loader.removeUsedStaticCallbackId(), Loader.loadData()
    } else if ("main_window" == t) LC_Invite.is_main_window = !0;
    else if (/^operator;/.test(t)) r = decodeURIComponent(t.split(";")[1]), avatar_url = decodeURIComponent(t.split(";")[2]), Minimized.setOperatorDisplayName(r), Minimized.setOperatorAvatarUrl(avatar_url);
    else if (/^chat_id;/.test(t)) a = decodeURIComponent(t.split(";")[1]), LC_Invite.chat_id = a || null;
    else if (/^visitor_name;/.test(t)) n = t.split(";"), Minimized.setVisitorName(n[1]);
    else if (/^state;/.test(t)) n = t.split(";"), Minimized.setState(n[1]), Minimized.updateText(), !0 !== LC_Invite.embedded_hide_when_offline() || LC_Invite.getVisitorInteraction() || (Minimized.getState() === Minimized.STATE_OFFLINE ? LC_Invite.hideChatWindow() : Minimized.getPreviousState() !== Minimized.STATE_OFFLINE || LC_Invite.embedded_chat_hidden_by_api || LC_API.minimize_chat_window());
    else if (/^firefly_request_url;/.test(t)) LC_Invite.init_firefly({
     callback: function() {
      window.fireflyAPI.set("message", "Waiting for the agent..."), n = t.split(";"), window.fireflyAPI.startAPI(LC_Invite.conf.integrations.firefly.api_key, function(e) {
       NotifyChild.send("firefly_url;" + encodeURIComponent(e) + ";" + encodeURIComponent(decodeURIComponent(n[1])))
      })
     }
    });
    else if ("firefly_load_script" === t) LC_Invite.init_firefly();
    else if (/^pushpage;/.test(t)) n = t.split(";"), window.location.href = n[1];
    else if (/^message_read$/.test(t)) Minimized.disableNewMessageNotification();
    else if (/^ga_enabled;/.test(t)) {
     var v = "1" === t.split(";")[1];
     GoogleAnalytics.setEnabled(v)
    } else if (/^ga;/.test(t)) {
     n = t.split(";");
     var b = decodeURIComponent(n[1]),
      y = decodeURIComponent(n[2]);
     if (y) var w = JSON.parse(y);
     var A = decodeURIComponent(n[3]);
     if (A) var I = JSON.parse(A);
     AnalyticsIntegrations.trackPageView(b, {
      event_data: w,
      user_data: I
     })
    } else if (/^init;/.test(t)) {
     var C = function() {
      if (LC_Invite.setEmbeddedLoaded(), !1 === LC_API.embedded_chat_enabled()) return !1;
      var e, o, r;
      return n = t.split(";"), Minimized.setDisplayAvatar(LC_Invite.conf.chat_window.display_avatar), "" !== n[7] && (Minimized.setState(n[7]), Minimized.updateText()), e = n[7] == Minimized.STATE_CHATTING, o = n[7] == Minimized.STATE_QUEUE, r = LC_Invite.embedded_hide_when_offline(), "" !== n[8] && Minimized.setOperatorDisplayName(decodeURIComponent(n[8])), "" !== n[10] && Minimized.setOperatorAvatarUrl(decodeURIComponent(n[10])), NotifyChild.send("navigation_start;" + Utils.getNavigationStart()), "" !== __lc_settings.nick && "$" !== __lc_settings.nick && NotifyChild.send("nick;" + encodeURIComponent(__lc_settings.nick)), "" !== __lc_settings.email && NotifyChild.send("email;" + encodeURIComponent(__lc_settings.email)), "" !== __lc_settings.lc.params && !1 !== __lc_settings.lc.params && NotifyChild.send("params;" + encodeURIComponent(__lc_settings.lc.params)), !0 === c.chat_reloaded && (c.manualInvitation && NotifyChild.send("manual_invitation"), NotifyChild.send("welcome_message;" + encodeURIComponent(c.welcome_message || "")), LC_API.show_full_view(), c.welcome_message = null, c.manualInvitation = !1), !0 === __lc_settings.client_limit_exceeded && NotifyChild.send("client_limit_exceeded"), __lc.wix && NotifyChild.send("wix;" + encodeURIComponent(Loader.pageData.url)), __lc.always_start_chat && NotifyChild.send("always_start_chat"), l("on_before_load"), Minimized.getState() === Minimized.STATE_OFFLINE && !0 === r ? (LC_API.hide_chat_window(), l("on_after_load"), Full.onload(), !0) : !0 === LC_Invite.embedded_chat_hidden_by_api ? (l("on_after_load"), Full.onload(), !0) : (__lc_settings.automatic_greeting && ("full" === Cookie.get("lc_window_state") && (c.maximize_on_init = !0), LC_Invite.trackAndRenderAutoInvitation(__lc_settings.automatic_greeting)), !0 === e || !0 === o || !0 === c.maximize_on_init ? (i = Cookie.get("lc_window_state"), "full" === i || !0 === c.maximize_on_init ? (LC_Invite.open_chat_window({
       source: "stored chat window state"
      }), c.maximize_on_init = !1) : LC_API.minimize_chat_window({
       callAPI: !1
      })) : !0 !== c.chat_reloaded && LC_API.minimize_chat_window({
       callAPI: !1
      }), l("on_after_load"), Full.onload(), LC_API.new_mobile_is_detected() && Mobile.setWindowStyle(), void Events.sendStoredMetrics())
     };
     Utils.makeItDone(C).when(function() {
      return !Loader.pendingConfigRequest
     })
    } else if (/^supports_chatting;/.test(t)) {
     var x = "true" === t.split(";")[1];
     Minimized.setSupportsChatting(x)
    }
   },
   maximizeOnInit: function() {
    this.maximize_on_init = !0
   }
  },
  PersonalInvitation = {
   render: function(e) {
    function t() {
     this.construct_invite = function() {
      var e, t = this.config.greeting_message.message,
       n = "";
      return e = /op\.cgi/.test(this.config.operator.picture.url) ? LC_Invite.httpp + this.config.serv + this.config.operator.picture.url : LC_Invite.httpp + this.config.operator.picture.url, n += '<div style="top:0px;left:0px;width:100%;height:100%;position:relative;overflow:hidden">', n += '<a style="position:absolute;top:0;left:0;width:100%;height:100%;display:block;cursor:pointer;background:url(//cdn.livechatinc.com/img/pixel.gif);z-index:16777262" href="#" onclick="LC_Invite.lc_open_chat(\'manual\');return false"></a>', n += '<a style="position:absolute;top:' + this.config.close_button.top + "px;left:" + this.config.close_button.left + "px;width:" + this.config.close_button.width + "px;height:" + this.config.close_button.height + 'px;display:block;cursor:pointer;z-index:16777262;background:url(//cdn.livechatinc.com/img/pixel.gif)" href="#" onclick="LC_Invite.lc_popup_close();return false"></a>', n += '<img src="' + e + '" height="120" style="top:' + this.config.operator.picture.top + "px;left:" + this.config.operator.picture.left + 'px;position:absolute;overflow:hidden;padding:1px;border:1px solid #999;z-index:16777261" id="div_operator-picture" alt="">', n += '<div style="top:' + this.config.operator.name.top + "px;left:" + this.config.operator.name.left + "px;width:" + this.config.operator.name.width + "px;height:" + this.config.operator.name.height + 'px;position:absolute;overflow:hidden;white-space:nowrap;color:#000000;font-size:12px;font-size:12px;line-height:19px;font-family:Arial,sans-serif;z-index:16777261" id="div_operator-name">', n += this.config.operator.name.name, n += "</div>", n += '<div style="top:' + this.config.greeting_message.top + "px;left:" + this.config.greeting_message.left + "px;width:" + this.config.greeting_message.width + "px;height:" + this.config.greeting_message.height + 'px;position:absolute;overflow:hidden;color:#000000;font-size:12px;line-height:19px;font-family:Arial,sans-serif;z-index:16777261" id="div_greeting-message">', n += t, n += "</div>", n += '<span><img border="0" src="' + LC_Invite.httpp + this.config.image_url + '" id="lc_personal_invitation_img"></span></div>'
     }, this.load_invite = function() {
      var e = this.construct_invite();
      LC_Invite.display_invitation(e, this.config.position)
     }
    }
    if (e.error) return !1;
    window.LC_PrivateInvite = new t, window.LC_PrivateInvite.config = e, window.LC_PrivateInvite.config.position = {
     arg1: e.position.y,
     arg2: e.position.x,
     option: e.position.h_align
    }, window.LC_PrivateInvite.load_invite()
   }
  };
 window.PersonalInvitation = PersonalInvitation;
 var XD = function() {
   var e, t = this;
   return {
    postMessage: function(e, n, i) {
     if (n && (i = i || parent, t.postMessage)) {
      if (!0 !== Loader.is_iframe_loaded) return !1;
      try {
       i.postMessage(e, Utils.extractDomain(n))
      } catch (e) {}
     }
    },
    receiveMessage: function(n, i) {
     t.postMessage && (n && (e = function(e) {
      if ("string" == typeof i && e.origin !== i || "[object Function]" === Object.prototype.toString.call(i) && !1 === i(e.origin)) return !1;
      n(e)
     }), t.addEventListener ? t[n ? "addEventListener" : "removeEventListener"]("message", e, !1) : t[n ? "attachEvent" : "detachEvent"]("onmessage", e))
    }
   }
  }(),
  StatusChecker = function() {
   var e, t, n, i, o, r, a = function(e) {
    o !== e.status && (o = e.status, LC_API.on_chat_state_changed({
     state: e.status
    }))
   };
   return {
    init: function(e) {
     t = e.protocol, n = e.hostname, i = e.licence, r = e.checkRatio || 1
    },
    startChecking: function() {
     if (!e) {
      var o = function() {
       Utils.jsonpRequest({
        protocol: t,
        hostname: n,
        endpoint: "/licence/" + i + "/group_status",
        queryParams: {
         group: __lc.skill
        },
        requestName: "__lc_status_check",
        callback: a
       })
      };
      e = setInterval(o, 3e3 * r), o()
     }
    },
    stopChecking: function() {
     clearInterval(e), e = void 0
    }
   }
  }(),
  Timer = {
   time: +new Date,
   checkpoint: function() {
    return +new Date - this.time
   }
  },
  VisitorDetailsParser = {
   parse: function(e) {
    return "object" == typeof e && (e.constructor === Object && (void 0 !== e.name && (e.name = String(e.name), __lc_settings.nick = IncorrectCharactersStripper.strip(e.name)), void(void 0 !== e.email && (e.email = String(e.email), __lc_settings.email = IncorrectCharactersStripper.strip(e.email)))))
   }
  },
  i, col, src, matches, query_matches, __lc_settings = {},
  __lc_dynamic_settings = {},
  __lc_iframe_src = "",
  __lc_iframe_src_hash = "",
  __config_response, __lc_script_tracking_version = {};
 if (__lc.license = parseInt(__lc.license, 10) || null, __lc.skill = __lc.group = function() {
   return void 0 !== __lc.group ? __lc.group : void 0 !== __lc.skill ? __lc.skill : void 0
  }(), __lc.params = __lc.params || "", __lc.visitor = __lc.visitor || {}, 0 != __lc.chat_between_groups && (__lc.chat_between_groups = !0), __lc.mute_csp_errors = __lc.mute_csp_errors || !1, __lc_script_version = {
   tracking_env: "production",
   tracking_version: "20180530100503"
  }, null == __lc.license)
  for (col = document.getElementsByTagName("script"), i = 0; i < col.length; i++)
   if ((src = col[i].src) && (matches = src.match(/licence\/(\d+)\/script.cgi(.*)$/)) && (__lc.license = parseInt(matches[1], 10), query_matches = matches[2].match(/groups=(\d+)/), query_matches && (__lc.skill = parseInt(query_matches[1], 10)), query_matches = matches[2].match(/params=([^&]+)/))) try {
    __lc.params = CustomVariablesParser.getArrayByString(decodeURIComponent(query_matches[1]))
   } catch (e) {}
   null == __lc.hostname && (__lc.hostname = "1520" === String(__lc.license) ? "secure-lc.livechatinc.com" : "secure.livechatinc.com");
 var Loader = {
  protocol: "https://",
  pageData: {
   title: document.title,
   url: document.location.toString(),
   referrer: document.referrer
  },
  requestTime: null,
  is_iframe_loaded: !1,
  usedCallbackIDs: {},
  callback_static_config_id: "static_config",
  requestsDistributor: {},
  init: function() {
   var e;
   if (__lc.wix) Wix.getSiteInfo(function(e) {
    Loader.pageData.title = e.pageTitle, void 0 !== e.referrer ? Loader.pageData.referrer = e.referrer : Loader.pageData.referrer = e.referer, e.baseUrl.length > 0 && -1 === e.url.indexOf(e.baseUrl) ? Loader.pageData.url = e.baseUrl : Loader.pageData.url = e.url, Loader.loadData()
   });
   else if (!0 === __lc.embedded_in_iframe) {
    e = document.location.hash.replace(/^#/, "");
    try {
     e && (e = JSON.parse(decodeURIComponent(e))), Loader.pageData.title = e.title || "", Loader.pageData.referrer = e.referrer || "", Loader.pageData.url = document.referrer, Loader.loadData()
    } catch (e) {}
   } else Loader.loadData()
  },
  parseResponseError: function(e, t) {
   if ("incorrect region" === e) return __lc.hostname = Utils.getServiceAddress("secure", __lc.hostname, t.region), this.correctRegion = t.region, this.loadData(), !1;
   "object" == typeof console && ("License expired" === e ? console.log("[LiveChat] Your account has expired. Visit www.livechatinc.com to sign in and renew your subscription.") : /is banned!/.test(e) && console.log("[LiveChat] " + e))
  },
  prepareButtonUrl: function(e, t) {
   return t.value = e ? t.online_value : t.offline_value, "image" === t.type && (t.value = UrlsUtils.convertUrlToCdn(t.value)), t
  },
  prepareButtonsValues: function(e, t, n) {
   var i = this;
   return Utils.map(e, function(e) {
    var o = Utils.isSkillOnline(n, t);
    return i.prepareButtonUrl(o, e)
   })
  },
  parseConfigResponse: function(e, t, n) {
   var i = __lc.params || e.visitor && e.visitor.params;
   return {
    automatic_greeting: e.automatic_greeting,
    buttons: this.prepareButtonsValues(e.buttons, e.skills_online, e.visitor.groups),
    position: {
     option: e.invitation.align,
     arg1: parseInt(e.invitation.y, 10),
     arg2: parseInt(e.invitation.x, 10)
    },
    overlay: {
     enabled: !0,
     opacity: .8,
     color: "#000"
    },
    embedded: {
     enabled: Boolean(Number(e.embedded_chat.enabled)),
     hide_when_offline: Boolean(Number(e.embedded_chat.hide_when_offline)),
     eye_grabber: {
      enabled: Boolean(Number(e.embedded_chat.eye_grabber.enabled)),
      x: parseInt(e.embedded_chat.eye_grabber.x, 10),
      y: parseInt(e.embedded_chat.eye_grabber.y, 10),
      path: e.embedded_chat.eye_grabber.path,
      point_zero: {
       x: 15,
       y: 0
      }
     },
     dimensions: {
      margin: t,
      width: n.w,
      height: n.h,
      width_minimized: n.w_minimized
     }
    },
    chat_window: Utils.parseChatWindowTheme(e),
    skills: e.skills || [],
    group_properties: e.group_properties,
    lc: {
     last_visit: e.visitor.last_visit,
     session: e.visitor.session,
     page_view: e.visitor.page_view,
     visit_number: e.visitor.visit_number,
     chat_number: e.visitor.chat_number,
     all_invitation: e.visitor.all_invitation,
     ok_invitation: e.visitor.ok_invitation,
     last_operator_id: e.visitor.last_operator_id,
     client_version: e.visitor.client_version,
     params: CustomVariablesParser.parse(i),
     groups: parseInt(__lc.skill, 10)
    },
    lic: __lc.license,
    lc2: e.lc2,
    serv: e.serv,
    nick: e.visitor.nick,
    email: "",
    hostname: e.visitor.hostname,
    status: e.status,
    invite_img_name: UrlsUtils.convertUrlToCdn(e.invitation.image),
    redirect_url: e.redirect_url,
    lang: e.lang,
    client_limit_exceeded: void 0 !== e.client_limit_exceeded && Boolean(Number(e.client_limit_exceeded)),
    domain_whitelist: e.domain_whitelist,
    integrations: e.integrations,
    localization_basic: e.localization_basic,
    offline_form: e.offline_form,
    pre_chat_survey: e.pre_chat_survey,
    global_properties: {
     ping_ratio: parseFloat(e.global_properties.prod.ping_ratio),
     status_check_ratio: parseFloat(e.global_properties.prod.status_check_ratio)
    }
   }
  },
  initMainScript: function(e, t) {
   void 0 !== t.visitor.groups && (__lc_settings.lc.groups = t.visitor.groups, __lc.group = t.visitor.groups, __lc.skill = t.visitor.groups), VisitorDetailsParser.parse(__lc.visitor), __lc_iframe_src = Loader.getChatUrl({
    groups: e.lc.groups,
    embedded: e.embedded.enabled ? "1" : "0",
    newWebserv: Loader.requestsDistributor && Loader.requestsDistributor.open_chat
   }), __lc_iframe_src_hash = __lc_iframe_src + "#" + document.location.toString(), __lc_iframe_current_skill = e.lc.groups, "undefined" == typeof LC_Invite ? LC_Invite = new LiveChat(e) : LC_Invite.setConfig(e), LC_Invite.init(), __lc.license != e.lic && Events.track("chat_window", "config incorrect data - received license " + e.lic + " instead of " + __lc.license)
  },
  configRequest: function(e, t, n, i, o, r, a, s, c) {
   var l = document.createElement("script"),
    u = "",
    d = "",
    f = e.match(/[^.]*/)[0];
   "get_dynamic_config" === e && (Loader.requestTime = (new Date).getTime(), u += "t=" + +new Date, u += "&referrer=" + encodeURIComponent(IncorrectCharactersStripper.strip(a)), u += "&url=" + encodeURIComponent(o), u += "&params=" + encodeURIComponent(CustomVariablesParser.parse(r))), u += "&jsonp=__lc_data_" + i, 1 === s && (u += "&test=1"), void 0 !== n && (n = parseInt(n, 10), u += "&groups=" + (n || 0)), Loader.requestsDistributor && Loader.requestsDistributor[f] && (d = "v2/"), "get_dynamic_config" === e && -1 === __lc.hostname.indexOf("-fra") && (d = "v2/"), l.src = !1 === c && void 0 !== n ? Loader.protocol + __lc.hostname + "/licence/g" + t + "_" + n + "/" + d + e + ".js?" + u : Loader.protocol + __lc.hostname + "/licence/" + t + "/" + d + e + ".js?" + u, DOM.appendToBody(l)
  },
  loadData: function() {
   var e, t = this;
   if (e = Math.ceil(1e6 * Math.random()), !1 === __lc.chat_between_groups) {
    var n, i = Math.ceil(1e6 * Math.random());
    window["__lc_data_" + i] = function(o) {
     if (!t.wasIDUsed(i)) {
      if (t.addUsedID(i), n = o, void 0 !== o.error) return t.parseResponseError(n.error, n), !1;
      if (n.visitor.groups === __lc.group) return void window["__lc_data_" + e](o);
      __lc.skill = n.visitor.groups, __lc.group = n.visitor.groups, t.configRequest("get_dynamic_config", __lc.license, __lc.skill, e, Loader.pageData.url, __lc.params, Loader.pageData.referrer, __lc.test, __lc.chat_between_groups)
     }
    }, this.configRequest("get_dynamic_config", __lc.license, __lc.skill, i, Loader.pageData.url, __lc.params, Loader.pageData.referrer, __lc.test, __lc.chat_between_groups)
   }
   window["__lc_data_" + e] = function(n) {
    if (!t.wasIDUsed(e)) {
     if (void 0 !== n.error) return t.parseResponseError(n.error, n), !1;
     var i = n.static_config_version,
      o = "get_static_config." + n.visitor.groups + "." + i;
     __lc_dynamic_settings = n, Loader.requestsDistributor = GlobalPropertiesParser.parseRequestsDistribution(n.global_properties.prod.requests_distribution, __lc.hostname);
     var r = function() {
       t.configRequest(o, __lc.license, __lc.skill, t.callback_static_config_id, Loader.pageData.url, __lc.params, Loader.pageData.referrer, __lc.test, __lc.chat_between_groups)
      },
      a = function() {
       var e = document.createElement("script");
       e.src = "https://accounts.livechatinc.com/licence/" + __lc.license, e.onload = function() {
        r()
       }, e.onerror = function() {
        r()
       }, DOM.appendToBody(e)
      },
      s = function(e, t) {
       Cookie.set(e, t, 1e3)
      };
     if (Loader.requestsDistributor.accounts && !1 !== __lc.chat_between_groups) {
      if (Utils.callOnceEveryHours(a, 8, "lc_sso" + __lc.license, s, Cookie.get)) return
     }
     r()
    }
   }, window["__lc_data_" + this.callback_static_config_id] = function(e) {
    if (!t.wasIDUsed(t.callback_static_config_id)) {
     if (void 0 !== e.error) return t.parseResponseError(e.error, e), !1;
     void 0 !== e.t && !1 === e.t && (Loader.requestsDistributor = GlobalPropertiesParser.parseRequestsDistribution(__lc_dynamic_settings.global_properties.prod.requests_distribution, __lc.hostname, !0));
     var n, i = (new Date).getTime() - Loader.requestTime,
      o = t.calculateWindowDimensions(15);
     __config_response = Utils.extend({}, e, __lc_dynamic_settings), __config_response.status = Utils.isSkillOnline(__config_response.visitor.groups, __config_response.skills_online) ? "online" : "offline", __lc_settings = t.parseConfigResponse(__config_response, 15, o), Loader.requestsDistributor.metrics && Events.trackSpeed("chat_widget_init", {
      script_load_duration_ms: i,
      license_number: __lc.license,
      lc_version: e.license_properties.lc_version,
      chat_widget_type: !0 === e.embedded_chat.enabled ? "embedded" : "popup",
      timezone_offset: (new Date).getTimezoneOffset() + "",
      region: "dal",
      script_version: __lc_script_version.tracking_version + ""
     }, !0);
     if ("1" === ("function" == typeof [].map && "function" == typeof [].reduce ? function() {
       try {
        return location.search.replace(/^\?/, "").split("&").map(function(e) {
         return e.split("=").map(decodeURIComponent)
        }).reduce(function(e, t) {
         return e[t[0]] = t[1], e
        }, {})
       } catch (e) {
        return {}
       }
      }() : {}).__new_widget || "livechat" === e.license_properties.product && "3" === e.license_properties.widget_version || "livechat" === e.license_properties.product && "3" === e.license_properties.lc_version) {
      var r, a = !1;
      LC_API.hide_chat_window = function() {
       a = !0
      }, LC_API.get_window_type = function() {
       return "embedded"
      }, LC_API.set_custom_variables = function(e) {
       r = e.reduce(function(e, t) {
        return e[t.name] = t.value, e
       }, {})
      }, LC_API.on_before_load();
      var s = __lc.visitor.name || __lc_dynamic_settings.nick,
       c = __lc.visitor.email,
       l = Utils.extend({}, __lc_dynamic_settings, e, {
        __lc: Utils.extend({}, __lc)
       }),
       u = WidgetBridge.default(__lc.license, {
        hidden: a,
        group: l.visitor.groups,
        customer: {
         name: s ? String(s) : null,
         email: c ? String(c) : null,
         properties: r
        },
        page: {
         url: Loader.pageData.url,
         title: Loader.pageData.title
        }
       }, l);
      return void(u && "function" == typeof u.then && u.then(function() {
       LC_API.on_after_load()
      }))
     }
     if ("3" === e.license_properties.lc_version) return void LC3.init(Utils.extend({}, __lc_dynamic_settings, e), __lc, LC_API);
     t.addUsedID(t.callback_static_config_id), Events.trackSpeed("first_time_init", {
       request_length: i
      }), window.__lc_lang = function(e) {
       var t = e.localization;
       LC_Invite.conf.lang_phrases = t, LC_Invite.sendLangPhrasesToEmbedded(t)
      }, n = document.createElement("script"),
      n.src = Loader.protocol + __lc.hostname + e.localization_url + "?jsonp=__lc_lang", DOM.appendToBody(n), t.initMainScript(__lc_settings, __config_response), t.pendingConfigRequest = !1
    }
   }, !1 !== __lc.chat_between_groups && this.configRequest("get_dynamic_config", __lc.license, __lc.skill, e, Loader.pageData.url, __lc.params, Loader.pageData.referrer, __lc.test, __lc.chat_between_groups)
  },
  calculateWindowDimensions: function(e) {
   var t, n = 400;
   return window.screen && window.screen.availWidth ? n = window.screen.availWidth : window.innerWidth ? n = window.innerWidth : document.body && document.body.clientWidth && (n = document.body.clientWidth), n = parseInt(n, 10), n < 400 ? (t = n - 2 * e, {
    w: t,
    w_minimized: t,
    h: 350
   }) : {
    w: 400,
    h: 450,
    w_minimized: 250
   }
  },
  getChatHost: function() {
   return null != __lc.chat_absolute_url ? Utils.extractDomain(__lc.chat_absolute_url) : Utils.extractDomain(Loader.protocol + __lc_settings.serv)
  },
  getChatUrl: function(e, t) {
   var n, i, o, r, a, s;
   e = e || {}, e.__lc_vv = 2, t = t || {}, document.documentMode && document.documentMode <= 9 && (t.force_ssl = !0), o = "?", null != __lc.chat_absolute_url ? (/\?/.test(__lc.chat_absolute_url) && (o = "&"), n = __lc.chat_absolute_url + o + "license=" + __lc_settings.lic, o = "&") : (n = "https://", skillUrlPart = "", s = "v2/", void 0 !== __lc.skill && (a = parseInt(__lc.skill, 10), skillUrlPart = "_" + (a || 0)), !1 === __lc.chat_between_groups ? n += __lc_settings.serv + "/licence/g" + __lc_settings.lic + skillUrlPart + "/" + s + "open_chat.cgi" : n += __lc_settings.serv + "/licence/" + __lc_settings.lic + "/" + s + "open_chat.cgi"), !1 === __lc.chat_between_groups && (e.unique_group = "1"), r = [];
   for (i in e) e.hasOwnProperty(i) && r.push(i + "=" + encodeURIComponent(e[i]));
   return n += o + r.join("&"), o = "&", n += o + "session_id=" + LC_API.get_visitor_id(), __lc.hostname && (n += "&server=" + __lc.hostname), t.include_current_page_address && (n += "#" + encodeURIComponent(Loader.pageData.url)), n
  },
  wasIDUsed: function(e) {
   if (this.usedCallbackIDs[e]) return !0
  },
  removeUsedStaticCallbackId: function() {
   return this.usedCallbackIDs[this.callback_static_config_id] = !1, this
  },
  addUsedID: function(e) {
   return this.usedCallbackIDs[e] = !0, this
  }
 };
 DOM.ready(Loader.init);
 var noop = function() {};
 LC_API = {
  on_before_load: function() {
   return "object" == typeof LC_API && "function" == typeof LC_API.on_before_load ? LC_API.on_before_load : "object" == typeof LC_API && "function" == typeof LC_API.on_load ? LC_API.on_load : noop
  }(),
  on_after_load: "object" == typeof LC_API && "function" == typeof LC_API.on_after_load ? LC_API.on_after_load : noop,
  on_chat_window_opened: "object" == typeof LC_API && "function" == typeof LC_API.on_chat_window_opened ? LC_API.on_chat_window_opened : noop,
  on_chat_window_minimized: "object" == typeof LC_API && "function" == typeof LC_API.on_chat_window_minimized ? LC_API.on_chat_window_minimized : noop,
  on_chat_window_hidden: "object" == typeof LC_API && "function" == typeof LC_API.on_chat_window_hidden ? LC_API.on_chat_window_hidden : noop,
  on_chat_state_changed: "object" == typeof LC_API && "function" == typeof LC_API.on_chat_state_changed ? LC_API.on_chat_state_changed : noop,
  on_chat_started: "object" == typeof LC_API && "function" == typeof LC_API.on_chat_started ? LC_API.on_chat_started : noop,
  on_chat_ended: "object" == typeof LC_API && "function" == typeof LC_API.on_chat_ended ? LC_API.on_chat_ended : noop,
  on_message: "object" == typeof LC_API && "function" == typeof LC_API.on_message ? LC_API.on_message : noop,
  on_ticket_created: "object" == typeof LC_API && "function" == typeof LC_API.on_ticket_created ? LC_API.on_ticket_created : noop,
  on_prechat_survey_submitted: "object" == typeof LC_API && "function" == typeof LC_API.on_prechat_survey_submitted ? LC_API.on_prechat_survey_submitted : noop,
  on_postchat_survey_submitted: "object" == typeof LC_API && "function" == typeof LC_API.on_postchat_survey_submitted ? LC_API.on_postchat_survey_submitted : noop,
  on_rating_submitted: "object" == typeof LC_API && "function" == typeof LC_API.on_rating_submitted ? LC_API.on_rating_submitted : noop,
  on_rating_comment_submitted: "object" == typeof LC_API && "function" == typeof LC_API.on_rating_comment_submitted ? LC_API.on_rating_comment_submitted : noop,
  on_widget_resize: "object" == typeof LC_API && "function" == typeof LC_API.on_widget_resize ? LC_API.on_widget_resize : noop,
  get_window_type: function() {
   return !0 === this.embedded_chat_enabled() ? "embedded" : "popup"
  },
  chat_window_maximized: function() {
   var e = $("livechat-full");
   return !!(e && "visible" === e.style.visibility && e.offsetWidth && e.offsetHeight)
  },
  chat_window_minimized: function() {
   var e = $("livechat-compact-container");
   return !!(e && "visible" === e.style.visibility && e.offsetWidth && e.offsetHeight)
  },
  chat_window_hidden: function() {
   return !1 === this.chat_window_maximized() && !1 === this.chat_window_minimized()
  },
  visitor_queued: function() {
   return Minimized.getState() === Minimized.STATE_QUEUE
  },
  chat_running: function() {
   return Minimized.getState() === Minimized.STATE_CHATTING
  },
  visitor_engaged: function() {
   return this.visitor_queued() || this.chat_running() || Minimized.getState() === Minimized.STATE_INVITATION_WITH_AGENT
  },
  agents_are_available: function() {
   return Minimized.getState() !== Minimized.STATE_OFFLINE
  },
  show_full_view: function(e) {
   e = e || {}, e.source = e.source || "?", LC_Invite.show_full_view(e)
  },
  minimize_chat_window: function(e) {
   LC_Invite.minimize_chat_window(e)
  },
  hide_eye_catcher: function() {
   var e = $("livechat-eye-catcher");
   e && (Cookie.set("hide_eye_catcher", "1"), e.parentNode.removeChild(e))
  },
  hide_chat_window: function() {
   Mobile.isNewMobile() && LC_API.chat_window_maximized() && LC_API.minimize_chat_window({
    callAPI: !1
   }), LC_Invite.embedded_chat_hidden_by_api = !0, LC_Invite.hideChatWindow()
  },
  set_custom_variables: function(e) {
   LC_Invite.set_custom_variables(e)
  },
  trigger_sales_tracker: function(e, t) {
   Utils.isArray(t) || (t = []), "string" == typeof e && "" !== e && (t.push = {
    name: "__sales_tracker_" + e,
    value: "1"
   }, LC_Invite.set_custom_variables(t))
  },
  set_visitor_name: Client.setName,
  set_visitor_email: Client.setEmail,
  open_chat_window: function(e) {
   e = e || {}, LC_Invite.setVisitorInteraction(!0), LC_Invite.open_chat_window(e)
  },
  open_mobile_window: function(e) {
   LC_Invite.open_mobile_window(e)
  },
  get_visitor_id: function() {
   var e, t;
   return t = !1 === __lc.chat_between_groups ? "__lc.visitor_id.g" + __lc.license + "_" + __lc.skill : "__lc.visitor_id." + __lc.license, e = Cookie.get(t), e || (e = __lc_settings.lc.session, Cookie.set(t, e, 1e3)), e
  },
  get_chat_id: function() {
   return LC_Invite.chat_id
  },
  get_last_visit_timestamp: function() {
   return parseInt(__lc_settings.lc.last_visit, 10)
  },
  get_chats_number: function() {
   return parseInt(__lc_settings.lc.chat_number, 10)
  },
  get_page_views_number: function() {
   return parseInt(__lc_settings.lc.page_view, 10)
  },
  get_visits_number: function() {
   return parseInt(__lc_settings.lc.visit_number, 10)
  },
  get_invitations_number: function() {
   return parseInt(__lc_settings.lc.all_invitation, 10)
  },
  get_accepted_invitations_number: function() {
   return parseInt(__lc_settings.lc.ok_invitation, 10)
  },
  get_last_operator_login: function() {
   return __lc_settings.lc.last_operator_id.replace(/^\$$/, "")
  },
  embedded_chat_supported: function() {
   return "undefined" == typeof LC_Invite || !1 !== LC_Invite.embeddedWindowSupported
  },
  embedded_chat_enabled: function() {
   return "undefined" != typeof LC_Invite && !0 === LC_Invite.embedded_chat_enabled()
  },
  display_embedded_invitation: function(e, t, n, i, o) {
   var r, a, s = this;
   return !1 === this.embedded_chat_enabled() && "undefined" != typeof LC_AutoInvite ? (r = "function" == typeof LC_AutoInvite.get_layer_html ? LC_AutoInvite.get_layer_html() : "function" == typeof LC_AutoInvite.construct_invite ? LC_AutoInvite.construct_invite() : "", LC_Invite.display_invitation(r, LC_AutoInvite.config.position), !0) : LC_Invite.getEmbeddedLoaded() ? !1 !== this.embedded_chat_supported() && (!0 === this.chat_window_maximized() && null == i || (!0 === this.chat_running() || (Minimized.supportRoundedInvitations() || Mobile.isNewMobile() ? (Minimized.renderMobileInvitation(i.avatar_url, i.name, e), NotifyChild.send("invitation_with_agent;" + encodeURIComponent(t) + ";" + encodeURIComponent(e) + ";" + encodeURIComponent(JSON.stringify(i)) + ";0"), !0) : !!Mobile.isDetected() || (void 0 === t && (t = ""), n = void 0 === n ? "" : parseInt(n, 10), void(null == i ? (NotifyChild.send("invitation;" + encodeURIComponent(t) + ";" + n + ";" + encodeURIComponent(e)), this.show_full_view({
    source: "embedded invitation"
   })) : (a = "0", NotifyChild.send("invitation_with_agent;" + encodeURIComponent(t) + ";" + encodeURIComponent(e) + ";" + encodeURIComponent(JSON.stringify(i)) + ";" + encodeURIComponent(a)), o && this.show_full_view({
    source: "embedded invitation"
   }))))))) : (setTimeout(function() {
    s.display_embedded_invitation(e, t, n, i, o)
   }, 500), !1)
  },
  start_chat: function(e) {
   void 0 !== e ? NotifyChild.send("start_chat;" + encodeURIComponent(e)) : NotifyChild.send("start_chat"), !1 === Mobile.isDetected() && this.open_chat_window()
  },
  close_chat: function() {
   NotifyChild.send("close_chat")
  },
  reload_window: function() {
   NotifyChild.send("reload_window")
  },
  repaint_window: function() {
   NotifyChild.send("update_body_height")
  },
  mobile_is_detected: function() {
   return Mobile.isDetected()
  },
  new_mobile_is_detected: function() {
   return Mobile.isNewMobile()
  },
  update_height: function(e, t) {
   NotifyChild.send("new_font_height;" + e + ";" + t), Minimized.setFontSize(e)
  },
  diagnose: function() {
   var e = [],
    t = "\nscript version: " + __lc_script_version.trackingVersion + ", env: " + __lc_script_version.env,
    n = GoogleAnalytics.getGaType() ? "\nGA: " + GoogleAnalytics.getGaType() : "";
   return /native code/.test(window.open) || e.push("window.open() overridden"), window.location.hostname !== document.domain && e.push("document.domain overridden"), window.frames != window && e.push('global variable "frames" or "window.frames" overridden'), /native code/.test(window.JSON.stringify) && /native code/.test(window.JSON.parse) || e.push("JSON object overridden"), ["livechat-compact-container", "livechat-full"].some(function(e) {
    return $(e).parentNode !== document.body
   }) && e.push("LC containers moved from body"), (e.length ? e.join("\n") : "all OK") + n + t
  },
  _add_minimized_body_class: Minimized.addMinimizedClass,
  _remove_minimized_body_class: Minimized.removeMinimizedClass,
  disable_sounds: function() {
   NotifyChild.send("disable_sounds")
  }
 }, void 0 !== __define && (define = __define), void 0 !== __exports && (exports = __exports)
}();