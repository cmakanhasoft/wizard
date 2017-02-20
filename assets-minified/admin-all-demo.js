function progress(a, b) {
	var c = a * b.width() / 100;
	b.find(".progressbar-value").animate({
		width: c
	}, 1200)
}

function body_sizer() {
	if ($("body").hasClass("fixed-sidebar")) {
		var a = $(window).height(),
			b = $("#page-header").height(),
			c = a - b;
		$("#page-sidebar").css("height", c), $(".scroll-sidebar").css("height", c), $("#page-content").css("min-height", c)
	} else {
		var a = $(document).height(),
			b = $("#page-header").height(),
			c = a - b;
		$("#page-sidebar").css("height", c), $(".scroll-sidebar").css("height", c), $("#page-content").css("min-height", c)
	}
}

function pageTransitions() {
	var a = [".pt-page-moveFromLeft", "pt-page-moveFromRight", "pt-page-moveFromTop", "pt-page-moveFromBottom", "pt-page-fade", "pt-page-moveFromLeftFade", "pt-page-moveFromRightFade", "pt-page-moveFromTopFade", "pt-page-moveFromBottomFade", "pt-page-scaleUp", "pt-page-scaleUpCenter", "pt-page-flipInLeft", "pt-page-flipInRight", "pt-page-flipInBottom", "pt-page-flipInTop", "pt-page-rotatePullRight", "pt-page-rotatePullLeft", "pt-page-rotatePullTop", "pt-page-rotatePullBottom", "pt-page-rotateUnfoldLeft", "pt-page-rotateUnfoldRight", "pt-page-rotateUnfoldTop", "pt-page-rotateUnfoldBottom"];
	for (var b in a) {
		var c = a[b];
		if ($(".add-transition").hasClass(c)) return $(".add-transition").addClass(c + "-init page-transition"), void setTimeout(function () {
			$(".add-transition").removeClass(c + " " + c + "-init page-transition")
		}, 1200)
	}
}

function swither_resizer() {
	var a = $(window).height();
	$("#theme-switcher-wrapper").height(a / 1.4)
}
$(document).on("ready", function () {
		$(".progressbar").each(function () {
			var a = $(this),
				b = $(this).attr("data-value");
			progress(b, a)
		})
	}), $(function () {
		$("#header-right, .updateEasyPieChart, .complete-user-profile, #progress-dropdown, .progress-box").hover(function () {
			$(".progressbar").each(function () {
				var a = $(this),
					b = $(this).attr("data-value");
				progress(b, a)
			})
		})
	}),
	function (a) {
		var b = function () {
			var b = {
					bcClass: "sf-breadcrumb",
					menuClass: "sf-js-enabled",
					anchorClass: "sf-with-ul",
					menuArrowClass: "sf-arrows"
				},
				c = (function () {
					a(window).load(function () {
						a("body").children().on("click.superclick", function () {
							var b = a(".sf-js-enabled");
							b.superclick("reset")
						})
					})
				}(), function (a, c) {
					var d = b.menuClass;
					c.cssArrows && (d += " " + b.menuArrowClass), a.toggleClass(d)
				}),
				d = function (c, d) {
					return c.find("li." + d.pathClass).slice(0, d.pathLevels).addClass(d.activeClass + " " + b.bcClass).filter(function () {
						return a(this).children(".sidebar-submenu").hide().show().length
					}).removeClass(d.pathClass)
				},
				e = function (a) {
					a.children("a").toggleClass(b.anchorClass)
				},
				f = function (a) {
					var b = a.css("ms-touch-action");
					b = "pan-y" === b ? "auto" : "pan-y", a.css("ms-touch-action", b)
				},
				g = function (b) {
					var c, d = a(this),
						e = d.siblings(".sidebar-submenu");
					return e.length ? (c = e.is(":hidden") ? h : i, a.proxy(c, d.parent("li"))(), !1) : void 0
				},
				h = function () {
					var b = a(this);
					l(b);
					b.siblings().superclick("hide").end().superclick("show")
				},
				i = function () {
					var b = a(this),
						c = l(b);
					a.proxy(j, b, c)()
				},
				j = function (b) {
					b.retainPath = a.inArray(this[0], b.$path) > -1, this.superclick("hide"), this.parents("." + b.activeClass).length || (b.onIdle.call(k(this)), b.$path.length && a.proxy(h, b.$path)())
				},
				k = function (a) {
					return a.closest("." + b.menuClass)
				},
				l = function (a) {
					return k(a).data("sf-options")
				};
			return {
				hide: function (b) {
					if (this.length) {
						var c = this,
							d = l(c);
						if (!d) return this;
						var e = d.retainPath === !0 ? d.$path : "",
							f = c.find("li." + d.activeClass).add(this).not(e).removeClass(d.activeClass).children(".sidebar-submenu"),
							g = d.speedOut;
						b && (f.show(), g = 0), d.retainPath = !1, d.onBeforeHide.call(f), f.stop(!0, !0).animate(d.animationOut, g, function () {
							var b = a(this);
							d.onHide.call(b)
						})
					}
					return this
				},
				show: function () {
					var a = l(this);
					if (!a) return this;
					var b = this.addClass(a.activeClass),
						c = b.children(".sidebar-submenu");
					return a.onBeforeShow.call(c), c.stop(!0, !0).animate(a.animation, a.speed, function () {
						a.onShow.call(c)
					}), this
				},
				destroy: function () {
					return this.each(function () {
						var d = a(this),
							g = d.data("sf-options"),
							h = d.find("li:has(ul)");
						return g ? (c(d, g), e(h), f(d), d.off(".superclick"), h.children(".sidebar-submenu").attr("style", function (a, b) {
							return b.replace(/display[^;]+;?/g, "")
						}), g.$path.removeClass(g.activeClass + " " + b.bcClass).addClass(g.pathClass), d.find("." + g.activeClass).removeClass(g.activeClass), g.onDestroy.call(d), void d.removeData("sf-options")) : !1
					})
				},
				reset: function () {
					return this.each(function () {
						var b = a(this),
							c = l(b),
							d = a(b.find("." + c.activeClass).toArray().reverse());
						d.children("a").trigger("click")
					})
				},
				init: function (h) {
					return this.each(function () {
						var i = a(this);
						if (i.data("sf-options")) return !1;
						var j = a.extend({}, a.fn.superclick.defaults, h),
							k = i.find("li:has(ul)");
						j.$path = d(i, j), i.data("sf-options", j), c(i, j), e(k), f(i), i.on("click.superclick", "a", g), k.not("." + b.bcClass).superclick("hide", !0), j.onInit.call(this)
					})
				}
			}
		}();
		a.fn.superclick = function (c, d) {
			return b[c] ? b[c].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof c && c ? a.error("Method " + c + " does not exist on jQuery.fn.superclick") : b.init.apply(this, arguments)
		}, a.fn.superclick.defaults = {
			activeClass: "sfHover",
			pathClass: "overrideThisToUse",
			pathLevels: 1,
			animation: {
				opacity: "show"
			},
			animationOut: {
				opacity: "hide"
			},
			speed: "normal",
			speedOut: "fast",
			cssArrows: !0,
			onInit: a.noop,
			onBeforeShow: a.noop,
			onShow: a.noop,
			onBeforeHide: a.noop,
			onHide: a.noop,
			onIdle: a.noop,
			onDestroy: a.noop
		}
	}(jQuery),
	function (a) {
		a.fn.simpleCheckbox = function (b) {
			var c = {
					newElementClass: "switch-toggle",
					activeElementClass: "switch-on"
				},
				b = a.extend(c, b);
			this.each(function () {
				var c = a(this),
					d = a("<div/>", {
						id: "#" + c.attr("id"),
						"class": b.newElementClass,
						style: "display: block;"
					}).insertAfter(this);
				if (c.is(":checked") && d.addClass(b.activeElementClass), c.hide(), a("[for=" + c.attr("id") + "]").length) {
					var e = a("[for=" + c.attr("id") + "]");
					e.click(function () {
						return d.trigger("click"), !1
					})
				}
				d.click(function () {
					var c = a(this);
					return c.hasClass(b.activeElementClass) ? (c.removeClass(b.activeElementClass), a(c.attr("id")).attr("checked", !1)) : (c.addClass(b.activeElementClass), a(c.attr("id")).attr("checked", !0)), !1
				})
			})
		}
	}(jQuery),
	function (a) {
		jQuery.fn.extend({
			slimScroll: function (b) {
				var c = {
						width: "auto",
						height: "250px",
						size: "7px",
						color: "#000",
						position: "right",
						distance: "1px",
						start: "top",
						opacity: .4,
						alwaysVisible: !1,
						disableFadeOut: !1,
						railVisible: !1,
						railColor: "#333",
						railOpacity: .2,
						railDraggable: !0,
						railClass: "slimScrollRail",
						barClass: "slimScrollBar",
						wrapperClass: "slimScrollDiv",
						allowPageScroll: !1,
						wheelStep: 20,
						touchScrollStep: 200,
						borderRadius: "7px",
						railBorderRadius: "7px"
					},
					d = a.extend(c, b);
				return this.each(function () {
					function c(b) {
						if (j) {
							var b = b || window.event,
								c = 0;
							b.wheelDelta && (c = -b.wheelDelta / 120), b.detail && (c = b.detail / 3);
							var f = b.target || b.srcTarget || b.srcElement;
							a(f).closest("." + d.wrapperClass).is(v.parent()) && e(c, !0), b.preventDefault && !u && b.preventDefault(), u || (b.returnValue = !1)
						}
					}

					function e(a, b, c) {
						u = !1;
						var e = a,
							f = v.outerHeight() - A.outerHeight();
						if (b && (e = parseInt(A.css("top")) + a * parseInt(d.wheelStep) / 100 * A.outerHeight(), e = Math.min(Math.max(e, 0), f), e = a > 0 ? Math.ceil(e) : Math.floor(e), A.css({
								top: e + "px"
							})), p = parseInt(A.css("top")) / (v.outerHeight() - A.outerHeight()), e = p * (v[0].scrollHeight - v.outerHeight()), c) {
							e = a;
							var g = e / v[0].scrollHeight * v.outerHeight();
							g = Math.min(Math.max(g, 0), f), A.css({
								top: g + "px"
							})
						}
						v.scrollTop(e), v.trigger("slimscrolling", ~~e), h(), i()
					}

					function f() {
						window.addEventListener ? (this.addEventListener("DOMMouseScroll", c, !1), this.addEventListener("mousewheel", c, !1), this.addEventListener("MozMousePixelScroll", c, !1)) : document.attachEvent("onmousewheel", c)
					}

					function g() {
						o = Math.max(v.outerHeight() / v[0].scrollHeight * v.outerHeight(), s), A.css({
							height: o + "px"
						});
						var a = o == v.outerHeight() ? "none" : "block";
						A.css({
							display: a
						})
					}

					function h() {
						if (g(), clearTimeout(m), p == ~~p) {
							if (u = d.allowPageScroll, q != p) {
								var a = 0 == ~~p ? "top" : "bottom";
								v.trigger("slimscroll", a)
							}
						} else u = !1;
						return q = p, o >= v.outerHeight() ? void(u = !0) : (A.stop(!0, !0).fadeIn("fast"), void(d.railVisible && z.stop(!0, !0).fadeIn("fast")))
					}

					function i() {
						d.alwaysVisible || (m = setTimeout(function () {
							d.disableFadeOut && j || k || l || (A.fadeOut("slow"), z.fadeOut("slow"))
						}, 1e3))
					}
					var j, k, l, m, n, o, p, q, r = "<div></div>",
						s = 30,
						u = !1,
						v = a(this);
					if (v.parent().hasClass(d.wrapperClass)) {
						var w = v.scrollTop();
						if (A = v.parent().find("." + d.barClass), z = v.parent().find("." + d.railClass), g(), a.isPlainObject(b)) {
							if ("height" in b && "auto" == b.height) {
								v.parent().css("height", "auto"), v.css("height", "auto");
								var x = v.parent().parent().height();
								v.parent().css("height", x), v.css("height", x)
							}
							if ("scrollTo" in b) w = parseInt(d.scrollTo);
							else if ("scrollBy" in b) w += parseInt(d.scrollBy);
							else if ("destroy" in b) return A.remove(), z.remove(), void v.unwrap();
							e(w, !1, !0)
						}
					} else {
						d.height = "auto" == d.height ? v.parent().height() : d.height;
						var y = a(r).addClass(d.wrapperClass).css({
							position: "relative",
							overflow: "hidden",
							width: d.width,
							height: d.height
						});
						v.css({
							overflow: "hidden",
							width: d.width,
							height: d.height
						});
						var z = a(r).addClass(d.railClass).css({
								width: d.size,
								height: "100%",
								position: "absolute",
								top: 0,
								display: d.alwaysVisible && d.railVisible ? "block" : "none",
								"border-radius": d.railBorderRadius,
								background: d.railColor,
								opacity: d.railOpacity,
								zIndex: 90
							}),
							A = a(r).addClass(d.barClass).css({
								background: d.color,
								width: d.size,
								position: "absolute",
								top: 0,
								opacity: d.opacity,
								display: d.alwaysVisible ? "block" : "none",
								"border-radius": d.borderRadius,
								BorderRadius: d.borderRadius,
								MozBorderRadius: d.borderRadius,
								WebkitBorderRadius: d.borderRadius,
								zIndex: 99
							}),
							B = "right" == d.position ? {
								right: d.distance
							} : {
								left: d.distance
							};
						z.css(B), A.css(B), v.wrap(y), v.parent().append(A), v.parent().append(z), d.railDraggable && A.bind("mousedown", function (b) {
							var c = a(document);
							return l = !0, t = parseFloat(A.css("top")), pageY = b.pageY, c.bind("mousemove.slimscroll", function (a) {
								currTop = t + a.pageY - pageY, A.css("top", currTop), e(0, A.position().top, !1)
							}), c.bind("mouseup.slimscroll", function (a) {
								l = !1, i(), c.unbind(".slimscroll")
							}), !1
						}).bind("selectstart.slimscroll", function (a) {
							return a.stopPropagation(), a.preventDefault(), !1
						}), z.hover(function () {
							h()
						}, function () {
							i()
						}), A.hover(function () {
							k = !0
						}, function () {
							k = !1
						}), v.hover(function () {
							j = !0, h(), i()
						}, function () {
							j = !1, i()
						}), v.bind("touchstart", function (a, b) {
							a.originalEvent.touches.length && (n = a.originalEvent.touches[0].pageY)
						}), v.bind("touchmove", function (a) {
							if (u || a.originalEvent.preventDefault(), a.originalEvent.touches.length) {
								var b = (n - a.originalEvent.touches[0].pageY) / d.touchScrollStep;
								e(b, !0), n = a.originalEvent.touches[0].pageY
							}
						}), g(), "bottom" === d.start ? (A.css({
							top: v.outerHeight() - A.outerHeight()
						}), e(0, !0)) : "top" !== d.start && (e(a(d.start).position().top, null, !0), d.alwaysVisible || A.hide()), f()
					}
				}), this
			}
		}), jQuery.fn.extend({
			slimscroll: jQuery.fn.slimScroll
		})
	}(jQuery),
	function () {
		"use strict";
		var a = "undefined" != typeof module && module.exports,
			b = "undefined" != typeof Element && "ALLOW_KEYBOARD_INPUT" in Element,
			c = function () {
				for (var a, b, c = [
						["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
						["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"],
						["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"],
						["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"],
						["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
					], d = 0, e = c.length, f = {}; e > d; d++)
					if (a = c[d], a && a[1] in document) {
						for (d = 0, b = a.length; b > d; d++) f[c[0][d]] = a[d];
						return f
					}
				return !1
			}(),
			d = {
				request: function (a) {
					var d = c.requestFullscreen;
					a = a || document.documentElement, /5\.1[\.\d]* Safari/.test(navigator.userAgent) ? a[d]() : a[d](b && Element.ALLOW_KEYBOARD_INPUT)
				},
				exit: function () {
					document[c.exitFullscreen]()
				},
				toggle: function (a) {
					this.isFullscreen ? this.exit() : this.request(a)
				},
				onchange: function () {},
				onerror: function () {},
				raw: c
			};
		return c ? (Object.defineProperties(d, {
			isFullscreen: {
				get: function () {
					return !!document[c.fullscreenElement]
				}
			},
			element: {
				enumerable: !0,
				get: function () {
					return document[c.fullscreenElement]
				}
			},
			enabled: {
				enumerable: !0,
				get: function () {
					return !!document[c.fullscreenEnabled]
				}
			}
		}), document.addEventListener(c.fullscreenchange, function (a) {
			d.onchange.call(d, a)
		}), document.addEventListener(c.fullscreenerror, function (a) {
			d.onerror.call(d, a)
		}), void(a ? module.exports = d : window.screenfull = d)) : void(a ? module.exports = !1 : window.screenfull = !1)
	}(),
	function (a) {
		a.easyPieChart = function (b, c) {
			var d, e, f, g, h, i, j, k, l = this;
			return this.el = b, this.$el = a(b), this.$el.data("easyPieChart", this), this.init = function () {
				var b, d;
				return l.options = a.extend({}, a.easyPieChart.defaultOptions, c), b = parseInt(l.$el.data("percent"), 10), l.percentage = 0, l.canvas = a("<canvas width='" + l.options.size + "' height='" + l.options.size + "'></canvas>").get(0), l.$el.append(l.canvas), "undefined" != typeof G_vmlCanvasManager && null !== G_vmlCanvasManager && G_vmlCanvasManager.initElement(l.canvas), l.ctx = l.canvas.getContext("2d"), window.devicePixelRatio > 1 && (d = window.devicePixelRatio, a(l.canvas).css({
					width: l.options.size,
					height: l.options.size
				}), l.canvas.width *= d, l.canvas.height *= d, l.ctx.scale(d, d)), l.ctx.translate(l.options.size / 2, l.options.size / 2), l.ctx.rotate(l.options.rotate * Math.PI / 180), l.$el.addClass("easyPieChart"), l.$el.css({
					width: l.options.size,
					height: l.options.size,
					lineHeight: "" + l.options.size + "px"
				}), l.update(b), l
			}, this.update = function (a) {
				return a = parseFloat(a) || 0, l.options.animate === !1 ? f(a) : e(l.percentage, a), l
			}, j = function () {
				var a, b, c;
				for (l.ctx.fillStyle = l.options.scaleColor, l.ctx.lineWidth = 1, c = [], a = b = 0; 24 >= b; a = ++b) c.push(d(a));
				return c
			}, d = function (a) {
				var b;
				b = a % 6 === 0 ? 0 : .017 * l.options.size, l.ctx.save(), l.ctx.rotate(a * Math.PI / 12), l.ctx.fillRect(l.options.size / 2 - b, 0, .05 * -l.options.size + b, 1), l.ctx.restore()
			}, k = function () {
				var a;
				a = l.options.size / 2 - l.options.lineWidth / 2, l.options.scaleColor !== !1 && (a -= .08 * l.options.size), l.ctx.beginPath(), l.ctx.arc(0, 0, a, 0, 2 * Math.PI, !0), l.ctx.closePath(), l.ctx.strokeStyle = l.options.trackColor, l.ctx.lineWidth = l.options.lineWidth, l.ctx.stroke()
			}, i = function () {
				l.options.scaleColor !== !1 && j(), l.options.trackColor !== !1 && k()
			}, f = function (b) {
				var c;
				i(), l.ctx.strokeStyle = a.isFunction(l.options.barColor) ? l.options.barColor(b) : l.options.barColor, l.ctx.lineCap = l.options.lineCap, l.ctx.lineWidth = l.options.lineWidth, c = l.options.size / 2 - l.options.lineWidth / 2, l.options.scaleColor !== !1 && (c -= .08 * l.options.size), l.ctx.save(), l.ctx.rotate(-Math.PI / 2), l.ctx.beginPath(), l.ctx.arc(0, 0, c, 0, 2 * Math.PI * b / 100, !1), l.ctx.stroke(), l.ctx.restore()
			}, h = function () {
				return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (a) {
					return window.setTimeout(a, 1e3 / 60)
				}
			}(), e = function (a, b) {
				var c, d;
				l.options.onStart.call(l), l.percentage = b, d = Date.now(), c = function () {
					var e, j;
					return j = Date.now() - d, j < l.options.animate && h(c), l.ctx.clearRect(-l.options.size / 2, -l.options.size / 2, l.options.size, l.options.size), i.call(l), e = [g(j, a, b - a, l.options.animate)], l.options.onStep.call(l, e), f.call(l, e), j >= l.options.animate ? l.options.onStop.call(l) : void 0
				}, h(c)
			}, g = function (a, b, c, d) {
				var e, f;
				return e = function (a) {
					return Math.pow(a, 2)
				}, f = function (a) {
					return 1 > a ? e(a) : 2 - e(a / 2 * -2 + 2)
				}, a /= d / 2, c / 2 * f(a) + b
			}, this.init()
		}, a.easyPieChart.defaultOptions = {
			barColor: "#ef1e25",
			trackColor: "#f2f2f2",
			scaleColor: "#dfe0e0",
			lineCap: "round",
			rotate: 0,
			size: 110,
			lineWidth: 3,
			animate: !1,
			onStart: a.noop,
			onStop: a.noop,
			onStep: a.noop
		}, a.fn.easyPieChart = function (b) {
			return a.each(this, function (c, d) {
				var e, f;
				return e = a(d), e.data("easyPieChart") ? void 0 : (f = a.extend({}, b, e.data()), e.data("easyPieChart", new a.easyPieChart(d, f)))
			})
		}
	}(jQuery);
var initPieChart = function () {
	$(".chart").easyPieChart({
		barColor: function (a) {
			return a /= 100, "rgb(" + Math.round(254 * (1 - a)) + ", " + Math.round(255 * a) + ", 0)"
		},
		animate: 1e3,
		scaleColor: "#ccc",
		lineWidth: 3,
		size: 100,
		lineCap: "cap",
		onStep: function (a) {
			this.$el.find("span").text(~~a)
		}
	}), $(".chart-home").easyPieChart({
		barColor: "rgba(255,255,255,0.5)",
		trackColor: "rgba(255,255,255,0.1)",
		animate: 1e3,
		scaleColor: "rgba(255,255,255,0.3)",
		lineWidth: 3,
		size: 100,
		lineCap: "cap",
		onStep: function (a) {
			this.$el.find("span").text(~~a)
		}
	}), $(".chart-alt").easyPieChart({
		barColor: function (a) {
			return a /= 100, "rgb(" + Math.round(255 * (1 - a)) + ", " + Math.round(255 * a) + ", 0)"
		},
		trackColor: "#333",
		scaleColor: !1,
		lineCap: "butt",
		rotate: -90,
		lineWidth: 20,
		animate: 1500,
		onStep: function (a) {
			this.$el.find("span").text(~~a)
		}
	}), $(".chart-alt-1").easyPieChart({
		barColor: function (a) {
			return a /= 100, "rgb(" + Math.round(255 * (1 - a)) + ", " + Math.round(255 * a) + ", 0)"
		},
		trackColor: "#e1ecf1",
		scaleColor: "#c4d7e0",
		lineCap: "cap",
		rotate: -90,
		lineWidth: 10,
		size: 80,
		animate: 2500,
		onStep: function (a) {
			this.$el.find("span").text(~~a)
		}
	}), $(".chart-alt-2").easyPieChart({
		barColor: function (a) {
			return a /= 100, "rgb(" + Math.round(255 * (1 - a)) + ", " + Math.round(255 * a) + ", 0)"
		},
		trackColor: "#fff",
		scaleColor: !1,
		lineCap: "butt",
		rotate: -90,
		lineWidth: 4,
		size: 50,
		animate: 1500,
		onStep: function (a) {
			this.$el.find("span").text(~~a)
		}
	}), $(".chart-alt-3").easyPieChart({
		barColor: function (a) {
			return a /= 100, "rgb(" + Math.round(255 * (1 - a)) + ", " + Math.round(255 * a) + ", 0)"
		},
		trackColor: "#333",
		scaleColor: !0,
		lineCap: "butt",
		rotate: -90,
		lineWidth: 4,
		size: 50,
		animate: 1500,
		onStep: function (a) {
			this.$el.find("span").text(~~a)
		}
	}), $(".chart-alt-10").easyPieChart({
		barColor: "rgba(255,255,255,255.4)",
		trackColor: "rgba(255,255,255,0.1)",
		scaleColor: "transparent",
		lineCap: "round",
		rotate: -90,
		lineWidth: 4,
		size: 100,
		animate: 2500,
		onStep: function (a) {
			this.$el.find("span").text(~~a)
		}
	}), $(".updateEasyPieChart").on("click", function (a) {
		a.preventDefault(), $(".chart-home, .chart, .chart-alt, .chart-alt-1, .chart-alt-2, .chart-alt-3, .chart-alt-10").each(function () {
			$(this).data("easyPieChart").update(Math.round(100 * Math.random()))
		})
	})
};
$(document).ready(function () {
		initPieChart()
	}),
	function (a) {
		a.slidebars = function (b) {
			function c() {
				!j.disableOver || "number" == typeof j.disableOver && j.disableOver >= w ? (v = !0, a("html").addClass("sb-init"), j.hideControlClasses && x.removeClass("sb-hide"), d()) : "number" == typeof j.disableOver && j.disableOver < w && (v = !1, a("html").removeClass("sb-init"), j.hideControlClasses && x.addClass("sb-hide"), q.css("minHeight", ""), (s || u) && g())
			}

			function d() {
				q.css("minHeight", ""), q.css("minHeight", a("html").height() + "px"), r && r.hasClass("sb-width-custom") && r.css("width", r.attr("data-sb-width")), t && t.hasClass("sb-width-custom") && t.css("width", t.attr("data-sb-width")), r && (r.hasClass("sb-style-push") || r.hasClass("sb-style-overlay")) && r.css("marginLeft", "-" + r.css("width")), t && (t.hasClass("sb-style-push") || t.hasClass("sb-style-overlay")) && t.css("marginRight", "-" + t.css("width")), j.scrollLock && a("html").addClass("sb-scroll-lock")
			}

			function e(a, b, c) {
				var e;
				if (e = a.hasClass("sb-style-push") ? q.add(a).add(y) : a.hasClass("sb-style-overlay") ? a : q.add(y), "translate" === z) e.css("transform", "translate(" + b + ")");
				else if ("side" === z) "-" === b[0] && (b = b.substr(1)), "0px" !== b && e.css(c, "0px"), setTimeout(function () {
					e.css(c, b)
				}, 1);
				else if ("jQuery" === z) {
					"-" === b[0] && (b = b.substr(1));
					var f = {};
					f[c] = b, e.stop().animate(f, 400)
				}
				setTimeout(function () {
					"0px" === b && (e.removeAttr("style"), d())
				}, 400)
			}

			function f(b, c) {
				function d() {
					v && "left" === b && r ? (a("html").addClass("sb-active sb-active-left"), r.addClass("sb-active"), e(r, r.css("width"), "left"), setTimeout(function () {
						s = !0, "function" == typeof c && c()
					}, 400)) : v && "right" === b && t && (a("html").addClass("sb-active sb-active-right"), t.addClass("sb-active"), e(t, "-" + t.css("width"), "right"), setTimeout(function () {
						u = !0, "function" == typeof c && c()
					}, 400))
				}
				"left" === b && r && u || "right" === b && t && s ? (g(), setTimeout(d, 400)) : d()
			}

			function g(b) {
				(s || u) && (s && (e(r, "0px", "left"), s = !1), u && (e(t, "0px", "right"), u = !1), setTimeout(function () {
					a("html").removeClass("sb-active sb-active-left sb-active-right"), r && r.removeClass("sb-active"), t && t.removeClass("sb-active"), "function" == typeof b && b()
				}, 400))
			}

			function h(a, b) {
				"left" === a && r && (s ? g(null, b) : f("left", b)), "right" === a && t && (u ? g(null, b) : f("right", b))
			}

			function i(a, b) {
				a.stopPropagation(), a.preventDefault(), "touchend" === a.type && b.off("click")
			}
			var j = a.extend({
					siteClose: !0,
					scrollLock: !1,
					disableOver: !1,
					hideControlClasses: !1
				}, b),
				k = document.createElement("div").style,
				l = !1,
				m = !1;
			("" === k.MozTransition || "" === k.WebkitTransition || "" === k.OTransition || "" === k.transition) && (l = !0), ("" === k.MozTransform || "" === k.WebkitTransform || "" === k.OTransform || "" === k.transform) && (m = !0);
			var n = navigator.userAgent,
				o = !1,
				p = !1;
			/Android/.test(n) ? o = n.substr(n.indexOf("Android") + 8, 3) : /(iPhone|iPod|iPad)/.test(n) && (p = n.substr(n.indexOf("OS ") + 3, 3).replace("_", ".")), (o && 3 > o || p && 5 > p) && a("html").addClass("sb-static");
			var q = a("#sb-site, .sb-site-container");
			if (a(".sb-left").length) var r = a(".sb-left"),
				s = !1;
			if (a(".sb-right").length) var t = a(".sb-right"),
				u = !1;
			var v = !1,
				w = a(window).width(),
				x = a(".sb-toggle-left, .sb-toggle-right, .sb-open-left, .sb-open-right, .sb-close"),
				y = a(".sb-slide");
			c(), a(window).resize(function () {
				var b = a(window).width();
				w !== b && (w = b, c(), s && f("left"), u && f("right"))
			});
			var z;
			l && m ? (z = "translate", o && 4.4 > o && (z = "side")) : z = "jQuery", this.slidebars = {
				open: f,
				close: g,
				toggle: h,
				init: function () {
					return v
				},
				reInit: c,
				resetCSS: d,
				active: function (a) {
					return "left" === a && r ? s : "right" === a && t ? u : void 0
				},
				destroy: function (a) {
					"left" === a && r && (s && g(), setTimeout(function () {
						r.remove(), r = !1
					}, 400)), "right" === a && t && (u && g(), setTimeout(function () {
						t.remove(), t = !1
					}, 400))
				}
			}, a(".sb-toggle-left").on("touchend click", function (b) {
				i(b, a(this)), h("left")
			}), a(".sb-toggle-right").on("touchend click", function (b) {
				i(b, a(this)), h("right")
			}), a(".sb-open-left").on("touchend click", function (b) {
				i(b, a(this)), f("left")
			}), a(".sb-open-right").on("touchend click", function (b) {
				i(b, a(this)), f("right")
			}), a(".sb-close").on("touchend click", function (b) {
				if (a(this).is("a") || a(this).children().is("a")) {
					if ("click" === b.type) {
						b.preventDefault();
						var c = a(this).is("a") ? a(this).attr("href") : a(this).find("a").attr("href");
						g(function () {
							window.location = c
						})
					}
				} else i(b, a(this)), g()
			}), q.on("touchend click", function (b) {
				j.siteClose && (s || u) && (i(b, a(this)), g())
			})
		}
	}(jQuery),
       $(document).ready(function () {
		$(".switch-button").click(function (a) {
			a.preventDefault();
			var b = $(this).attr("switch-parent"),
				c = $(this).attr("switch-target");
			$(b).slideToggle(), $(c).slideToggle()
		}), $(".hidden-button").hover(function () {
			$(".btn-hide", this).fadeIn("fast")
		}, function () {
			$(".btn-hide", this).fadeOut("normal")
		}), $(".toggle-button").click(function (a) {
			a.preventDefault(), $(".glyph-icon", this).toggleClass("icon-rotate-180"), $(this).parents(".content-box:first").find(".content-box-wrapper").slideToggle()
		}), $(".remove-button").click(function (a) {
			a.preventDefault();
			var b = $(this).attr("data-animation"),
				c = $(this).parents(".content-box:first");
			$(c).addClass("animated"), $(c).addClass(b);
			window.setTimeout(function () {
				$(c).slideUp()
			}, 500), window.setTimeout(function () {
				$(c).removeClass(b).fadeIn()
			}, 2500)
		}), $(function () {
			"use strict";
			$(".infobox-close").click(function (a) {
				a.preventDefault(), $(this).parent().fadeOut()
			})
		})
	}), $(document).ready(function () {
		$(".overlay-button").click(function () {
			var a = $(this).attr("data-theme"),
				b = $(this).attr("data-opacity"),
				c = $(this).attr("data-style"),
				d = '<div id="loader-overlay" class="ui-front loader ui-widget-overlay ' + a + " opacity-" + b + '"><img src="../../assets/images/spinner/loader-' + c + '.gif" alt="" /></div>';
			$("#loader-overlay").length && $("#loader-overlay").remove(), $("body").append(d), $("#loader-overlay").fadeIn("fast"), setTimeout(function () {
				$("#loader-overlay").fadeOut("fast")
			}, 3e3)
		}), $(".refresh-button").click(function (a) {
			$(".glyph-icon", this).addClass("icon-spin"), a.preventDefault();
			var b = $(this).parents(".content-box"),
				c = $(this).attr("data-theme"),
				d = $(this).attr("data-opacity"),
				e = $(this).attr("data-style"),
				f = '<div id="refresh-overlay" class="ui-front loader ui-widget-overlay ' + c + " opacity-" + d + '"><img src="../../assets/images/spinner/loader-' + e + '.gif" alt="" /></div>';
			$("#refresh-overlay").length && $("#refresh-overlay").remove(), $(b).append(f), $("#refresh-overlay").fadeIn("fast"), setTimeout(function () {
				$("#refresh-overlay").fadeOut("fast"), $(".glyph-icon", this).removeClass("icon-spin")
			}, 1500)
		})
	}), $(function () {
		"use strict";
		$('a[href="#"]').click(function (a) {
			a.preventDefault()
		})
	}), $(function () {
		"use strict";
		$(".todo-box li input").on("click", function () {
			$(this).parent().toggleClass("todo-done")
		})
	}), $(function () {
		"use strict";
		var a = 0;
		$(".timeline-scroll .tl-row").each(function (b, c) {
			var d = $(c);
			a += d.outerWidth() + parseInt(d.css("margin-left"), 10) + parseInt(d.css("margin-right"), 10)
		}), $(".timeline-horizontal", this).width(a)
	}), $(function () {
		"use strict";
		$(".input-switch-alt").simpleCheckbox()
	}), $(function () {
		"use strict";
		$(".scrollable-slim").slimScroll({
			color: "#8da0aa",
			size: "10px",
			alwaysVisible: !0
		})
	}), $(function () {
		"use strict";
		$(".scrollable-slim-sidebar").slimScroll({
			color: "#8da0aa",
			size: "10px",
			height: "100%",
			alwaysVisible: !0
		})
	}), $(function () {
		"use strict";
		$(".scrollable-slim-box").slimScroll({
			color: "#8da0aa",
			size: "6px",
			alwaysVisible: !1
		})
	}), $(function () {
		"use strict";
		$(".loading-button").click(function () {
			var a = $(this);
			a.button("loading")
		})
	}), $(function () {
		"use strict";
		$(".tooltip-button").tooltip({
			container: "body"
		})
	}), $(function () {
		"use strict";
		$(".alert-close-btn").click(function () {
			$(this).parent().addClass("animated fadeOutDown")
		})
	}), $(function () {
		"use strict";
		$(".popover-button").popover({
			container: "body",
			html: !0,
			animation: !0,
			content: function () {
				var a = $(this).attr("data-id");
				return $(a).html()
			}
		}).click(function (a) {
			a.preventDefault()
		})
	}), $(function () {
		"use strict";
		$(".popover-button-default").popover({
			container: "body",
			html: !0,
			animation: !0
		}).click(function (a) {
			a.preventDefault()
		})
	});
var mUIColors = {
		"default": "#3498db",
		gray: "#d6dde2",
		primary: "#00bca4",
		success: "#2ecc71",
		warning: "#e67e22",
		danger: "#e74c3c",
		info: "#3498db"
	},
	getUIColor = function (a) {
		return mUIColors[a] ? mUIColors[a] : mUIColors["default"]
	};
document.getElementById("fullscreen-btn") && document.getElementById("fullscreen-btn").addEventListener("click", function () {
	screenfull.enabled && screenfull.request()
}), $(document).ready(function () {
	body_sizer(), $("div[id='#fixed-sidebar']").on("click", function () {
		if ($(this).hasClass("switch-on")) {
			var a = $(window).height(),
				b = $("#page-header").height(),
				c = a - b;
			$("#page-sidebar").css("height", c), $(".scroll-sidebar").css("height", c), $(".scroll-sidebar").slimscroll({
				height: "100%",
				color: "rgba(155, 164, 169, 0.68)",
				size: "6px"
			});
			var d = $("#page-header").attr("class");
			$("#header-logo").addClass(d)
		} else {
			var a = $(document).height(),
				b = $("#page-header").height(),
				c = a - b;
			$("#page-sidebar").css("height", c), $(".scroll-sidebar").css("height", c), $(".scroll-sidebar").slimScroll({
				destroy: !0
			}), $("#header-logo").removeClass("bg-gradient-9")
		}
	})
}), $(window).on("resize", function () {
	body_sizer()
}), $(document).ready(function () {
	pageTransitions(), $(".dropdown").on("show.bs.dropdown", function (a) {
		$(this).find(".dropdown-menu").first().stop(!0, !0).slideDown()
	}), $(".dropdown").on("hide.bs.dropdown", function (a) {
		$(this).find(".dropdown-menu").first().stop(!0, !0).slideUp()
	}), $(function () {
		$("#sidebar-menu").superclick({
			animation: {
				height: "show"
			},
			animationOut: {
				height: "hide"
			}
		});
		var a = window.location.pathname.split("/");
		a = a[a.length - 1], void 0 !== a && ($("#sidebar-menu").find("a[href$='" + a + "']").addClass("sfActive"), $("#sidebar-menu").find("a[href$='" + a + "']").parents().eq(3).superclick("show"))
	}), $(function () {
		$("#close-sidebar").click(function () {
			$("body").toggleClass("closed-sidebar"), $(".glyph-icon", this).toggleClass("icon-angle-right").toggleClass("icon-angle-left")
		})
	})
}), $(document).on("ready", function () {
	$("#theme-switcher-wrapper .switch-toggle").on("click", this, function () {
		var a = $(this).prev().attr("data-toggletarget");
		$("body").toggleClass(a), (a = "closed-sidebar") && $("#close-sidebar .glyph-icon").toggleClass("icon-angle-right").toggleClass("icon-angle-left");
	}), $('.switch-toggle[id="#boxed-layout"]').click(function () {
		$("#boxed-layout").attr("checked") ? $(".boxed-bg-wrapper").slideDown() : $(".boxed-bg-wrapper").slideUp()
	})
}), $(function () {
	$(".theme-switcher").click(function () {
		$("#theme-options").toggleClass("active")
	})
}), $(function () {
	$(".set-adminheader-style").click(function () {
		$(".set-adminheader-style").removeClass("active"), $(this).addClass("active");
		var a = $(this).attr("data-header-bg");
		$("#page-header").removeClass(function (a, b) {
			return (b.match(/(^|\s)bg-\S+/g) || []).join(" ")
		}), $("#page-header").removeClass(function (a, b) {
			return (b.match(/(^|\s)font-\S+/g) || []).join(" ")
		}), $("#page-header").addClass(a)
	})
}), $(function () {
	$(".set-sidebar-style").click(function () {
		$(".set-sidebar-style").removeClass("active"), $(this).addClass("active");
		var a = $(this).attr("data-header-bg");
		$("#page-sidebar").removeClass(function (a, b) {
			return (b.match(/(^|\s)bg-\S+/g) || []).join(" ")
		}), $("#page-sidebar").removeClass(function (a, b) {
			return (b.match(/(^|\s)font-\S+/g) || []).join(" ")
		}), $("#page-sidebar").addClass(a)
	})
}), $(function () {
	$(".set-background-style").click(function () {
		$(".set-background-style").removeClass("active"), $(this).addClass("active");
		var a = $(this).attr("data-header-bg");
		$("body").removeClass(function (a, b) {
			return (b.match(/(^|\s)pattern-\S+/g) || []).join(" ")
		}), $("body").removeClass(function (a, b) {
			return (b.match(/(^|\s)full-\S+/g) || []).join(" ")
		}), $("body").removeClass(function (a, b) {
			return (b.match(/(^|\s)bg-\S+/g) || []).join(" ")
		}), $("body").removeClass(function (a, b) {
			return (b.match(/(^|\s)fixed-\S+/g) || []).join(" ")
		}), $("body").addClass(a)
	})
}), $(function () {
	$(".set-header-style").click(function () {
		$(".set-header-style").removeClass("active"), $(this).addClass("active");
		var a = $(this).attr("data-header-bg");
		$(".main-header").removeClass(function (a, b) {
			return (b.match(/(^|\s)bg-\S+/g) || []).join(" ")
		}), $(".main-header").removeClass(function (a, b) {
			return (b.match(/(^|\s)font-\S+/g) || []).join(" ")
		}), $(".main-header").addClass(a)
	})
}), $(function () {
	$(".set-footer-style").click(function () {
		$(".set-footer-style").removeClass("active"), $(this).addClass("active");
		var a = $(this).attr("data-header-bg");
		$(".main-footer").removeClass(function (a, b) {
			return (b.match(/(^|\s)bg-\S+/g) || []).join(" ")
		}), $(".main-footer").removeClass(function (a, b) {
			return (b.match(/(^|\s)font-\S+/g) || []).join(" ")
		}), $(".main-footer").addClass(a)
	})
}), $(function () {
	$(".set-topmenu-style").click(function () {
		$(".set-topmenu-style").removeClass("active"), $(this).addClass("active");
		var a = $(this).attr("data-header-bg");
		$(".top-bar").removeClass(function (a, b) {
			return (b.match(/(^|\s)bg-\S+/g) || []).join(" ")
		}), $(".top-bar").removeClass(function (a, b) {
			return (b.match(/(^|\s)font-\S+/g) || []).join(" ")
		}), $(".top-bar").addClass(a)
	})
}), $(function () {
	$(".scroll-switcher").slimscroll({
		height: "100%",
		color: "rgba(0,0,0,0.3)",
		size: "10px",
		alwaysVisible: !0
	})
}), $(document).on("ready", function () {
	swither_resizer()
}), $(window).on("resize", function () {
	swither_resizer()
});