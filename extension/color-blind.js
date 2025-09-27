"use strict";
var colorBlind = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // onecolor.js
  var require_onecolor = __commonJS({
    "onecolor.js"(exports, module) {
      !(function(t, r) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = r() : "function" == typeof define && define.amd ? define(r) : ((t = t || self).one = t.one || {}, t.one.color = r());
      })(exports, function() {
        "use strict";
        var t = [], r = function(t2) {
          return void 0 === t2;
        }, e = /\s*(\.\d+|\d+(?:\.\d+)?)(%|deg)?\s*/, n = /\s*(\.\d+|100|\d?\d(?:\.\d+)?)%\s*/, a = new RegExp(
          "^(rgb|hsl|hsv)a?\\(" + e.source + "[, ]" + e.source + "[, ]" + e.source + "(?:[,/]" + e.source + ")?\\)$",
          "i"
        );
        function o(t2, r2, e2) {
          return "%" === t2 ? 100 : "deg" === t2 || e2 && 0 === r2 ? 360 : t2 ? void 0 : 255;
        }
        function s(t2) {
          if (Array.isArray(t2)) {
            if ("string" == typeof t2[0] && "function" == typeof s[t2[0]])
              return new s[t2[0]](t2.slice(1, t2.length));
            if (4 === t2.length)
              return new s.RGB(t2[0] / 255, t2[1] / 255, t2[2] / 255, t2[3] / 255);
          } else if ("string" == typeof t2) {
            var e2 = t2.toLowerCase();
            s.namedColors[e2] && (t2 = "#" + s.namedColors[e2]), "transparent" === e2 && (t2 = "rgba(0,0,0,0)");
            var i2 = t2.match(a);
            if (i2) {
              var u = i2[1].toUpperCase(), h = "H" === u[0];
              if (r(s[u])) throw new Error("color." + u + " is not installed.");
              let t3 = r(i2[8]) ? 1 : void 0;
              return void 0 === t3 && (t3 = "%" === i2[9] ? parseFloat(i2[8]) / 100 : parseFloat(i2[8])), new s[u](
                parseFloat(i2[2]) / o(i2[3], 0, h),
                parseFloat(i2[4]) / o(i2[5], 1, h),
                parseFloat(i2[6]) / o(i2[7], 2, h),
                t3
              );
            }
            t2.length < 6 && (t2 = t2.replace(
              /^#?([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i,
              "$1$1$2$2$3$3$4$4"
            ));
            var c = t2.match(
              /^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])?$/i
            );
            if (c)
              return new s.RGB(
                parseInt(c[1], 16) / 255,
                parseInt(c[2], 16) / 255,
                parseInt(c[3], 16) / 255,
                c[4] ? parseInt(c[4], 16) / 255 : 1
              );
            if (s.CMYK) {
              var f = t2.match(
                new RegExp(
                  "^cmyk\\(" + n.source + "," + n.source + "," + n.source + "," + n.source + "\\)$",
                  "i"
                )
              );
              if (f)
                return new s.CMYK(
                  parseFloat(f[1]) / 100,
                  parseFloat(f[2]) / 100,
                  parseFloat(f[3]) / 100,
                  parseFloat(f[4]) / 100
                );
            }
          } else if ("object" == typeof t2 && t2.isColor) return t2;
          return false;
        }
        s.namedColors = {}, s.installColorSpace = function(e2, n2, a2) {
          s[e2] = function(t2) {
            var r2 = Array.isArray(t2) ? t2 : arguments;
            n2.forEach(function(t3, a3) {
              var o3 = r2[a3];
              if ("alpha" === t3)
                this._alpha = isNaN(o3) || o3 > 1 ? 1 : o3 < 0 ? 0 : o3;
              else {
                if (isNaN(o3))
                  throw new Error(
                    "[" + e2 + "]: Invalid color: (" + n2.join(",") + ")"
                  );
                "hue" === t3 ? this._hue = o3 < 0 ? o3 - Math.floor(o3) : o3 % 1 : this["_" + t3] = o3 < 0 ? 0 : o3 > 1 ? 1 : o3;
              }
            }, this);
          }, s[e2].propertyNames = n2;
          var o2 = s[e2].prototype;
          for (var i2 in ["valueOf", "hex", "hexa", "css", "cssa"].forEach(
            function(t2) {
              o2[t2] = o2[t2] || ("RGB" === e2 ? o2.hex : function() {
                return this.rgb()[t2]();
              });
            }
          ), o2.isColor = true, o2.equals = function(t2, a3) {
            r(a3) && (a3 = 1e-10), t2 = t2[e2.toLowerCase()]();
            for (var o3 = 0; o3 < n2.length; o3 += 1)
              if (Math.abs(this["_" + n2[o3]] - t2["_" + n2[o3]]) > a3) return false;
            return true;
          }, o2.toJSON = function() {
            return [e2].concat(
              n2.map(function(t2) {
                return this["_" + t2];
              }, this)
            );
          }, a2)
            if (Object.prototype.hasOwnProperty.call(a2, i2)) {
              var u = i2.match(/^from(.*)$/);
              u ? s[u[1].toUpperCase()].prototype[e2.toLowerCase()] = a2[i2] : o2[i2] = a2[i2];
            }
          function h(t2, r2) {
            var e3 = {};
            for (var n3 in e3[r2.toLowerCase()] = function() {
              return this.rgb()[r2.toLowerCase()]();
            }, s[r2].propertyNames.forEach(function(t3) {
              var n4 = "black" === t3 ? "k" : t3.charAt(0);
              e3[t3] = e3[n4] = function(e4, n5) {
                return this[r2.toLowerCase()]()[t3](e4, n5);
              };
            }), e3)
              Object.prototype.hasOwnProperty.call(e3, n3) && void 0 === s[t2].prototype[n3] && (s[t2].prototype[n3] = e3[n3]);
          }
          return o2[e2.toLowerCase()] = function() {
            return this;
          }, o2.toString = function() {
            return "[" + e2 + " " + n2.map(function(t2) {
              return this["_" + t2];
            }, this).join(", ") + "]";
          }, n2.forEach(function(t2) {
            var r2 = "black" === t2 ? "k" : t2.charAt(0);
            o2[t2] = o2[r2] = function(r3, e3) {
              return void 0 === r3 ? this["_" + t2] : e3 ? new this.constructor(
                n2.map(function(e4) {
                  return this["_" + e4] + (t2 === e4 ? r3 : 0);
                }, this)
              ) : new this.constructor(
                n2.map(function(e4) {
                  return t2 === e4 ? r3 : this["_" + e4];
                }, this)
              );
            };
          }), t.forEach(function(t2) {
            h(e2, t2), h(t2, e2);
          }), t.push(e2), s;
        }, s.pluginList = [], s.use = function(t2) {
          return -1 === s.pluginList.indexOf(t2) && (this.pluginList.push(t2), t2(s)), s;
        }, s.installMethod = function(r2, e2) {
          return t.forEach(function(t2) {
            s[t2].prototype[r2] = e2;
          }), this;
        }, s.installColorSpace("RGB", ["red", "green", "blue", "alpha"], {
          hex: function() {
            var t2 = (65536 * Math.round(255 * this._red) + 256 * Math.round(255 * this._green) + Math.round(255 * this._blue)).toString(16);
            return "#" + "00000".substr(0, 6 - t2.length) + t2;
          },
          hexa: function() {
            var t2 = Math.round(255 * this._alpha).toString(16);
            return this.hex() + "00".substr(0, 2 - t2.length) + t2;
          },
          css: function() {
            return "rgb(" + Math.round(255 * this._red) + "," + Math.round(255 * this._green) + "," + Math.round(255 * this._blue) + ")";
          },
          cssa: function() {
            return "rgba(" + Math.round(255 * this._red) + "," + Math.round(255 * this._green) + "," + Math.round(255 * this._blue) + "," + this._alpha + ")";
          }
        });
        var i = function(t2) {
          t2.installColorSpace("HSV", ["hue", "saturation", "value", "alpha"], {
            rgb: function() {
              var r2, e2, n2, a2 = this._hue, o2 = this._saturation, s2 = this._value, i2 = Math.min(5, Math.floor(6 * a2)), u = 6 * a2 - i2, h = s2 * (1 - o2), c = s2 * (1 - u * o2), f = s2 * (1 - (1 - u) * o2);
              switch (i2) {
                case 0:
                  r2 = s2, e2 = f, n2 = h;
                  break;
                case 1:
                  r2 = c, e2 = s2, n2 = h;
                  break;
                case 2:
                  r2 = h, e2 = s2, n2 = f;
                  break;
                case 3:
                  r2 = h, e2 = c, n2 = s2;
                  break;
                case 4:
                  r2 = f, e2 = h, n2 = s2;
                  break;
                case 5:
                  r2 = s2, e2 = h, n2 = c;
              }
              return new t2.RGB(r2, e2, n2, this._alpha);
            },
            hsl: function() {
              var r2, e2 = (2 - this._saturation) * this._value, n2 = this._saturation * this._value, a2 = e2 <= 1 ? e2 : 2 - e2;
              return r2 = a2 < 1e-9 ? 0 : n2 / a2, new t2.HSL(this._hue, r2, e2 / 2, this._alpha);
            },
            fromRgb: function() {
              var r2, e2 = this._red, n2 = this._green, a2 = this._blue, o2 = Math.max(e2, n2, a2), s2 = o2 - Math.min(e2, n2, a2), i2 = 0 === o2 ? 0 : s2 / o2, u = o2;
              if (0 === s2) r2 = 0;
              else
                switch (o2) {
                  case e2:
                    r2 = (n2 - a2) / s2 / 6 + (n2 < a2 ? 1 : 0);
                    break;
                  case n2:
                    r2 = (a2 - e2) / s2 / 6 + 1 / 3;
                    break;
                  case a2:
                    r2 = (e2 - n2) / s2 / 6 + 2 / 3;
                }
              return new t2.HSV(r2, i2, u, this._alpha);
            }
          });
        };
        return s.use(i).use(function(t2) {
          t2.use(i), t2.installColorSpace("HSL", ["hue", "saturation", "lightness", "alpha"], {
            hsv: function() {
              var r2, e2 = 2 * this._lightness, n2 = this._saturation * (e2 <= 1 ? e2 : 2 - e2);
              return r2 = e2 + n2 < 1e-9 ? 0 : 2 * n2 / (e2 + n2), new t2.HSV(this._hue, r2, (e2 + n2) / 2, this._alpha);
            },
            rgb: function() {
              return this.hsv().rgb();
            },
            fromRgb: function() {
              return this.hsv().hsl();
            }
          });
        });
      });
    }
  });

  // blind.js
  var require_blind = __commonJS({
    "blind.js"(exports) {
      "use strict";
      var colorProfile = "sRGB";
      var gammaCorrection = 2.2;
      var matrixXyzRgb = [
        3.240712470389558,
        -0.969259258688888,
        0.05563600315398933,
        -1.5372626602963142,
        1.875996969313966,
        -0.2039948802843549,
        -0.49857440415943116,
        0.041556132211625726,
        1.0570636917433989
      ];
      var matrixRgbXyz = [
        0.41242371206635076,
        0.21265606784927693,
        0.019331987577444885,
        0.3575793401363035,
        0.715157818248362,
        0.11919267420354762,
        0.1804662232369621,
        0.0721864539171564,
        0.9504491124870351
      ];
      var blinder = {
        protan: {
          x: 0.7465,
          y: 0.2535,
          m: 1.273463,
          yi: -0.073894
        },
        deutan: {
          x: 1.4,
          y: -0.4,
          m: 0.968437,
          yi: 3331e-6
        },
        tritan: {
          x: 0.1748,
          y: 0,
          m: 0.062921,
          yi: 0.292119
        },
        custom: {
          x: 0.735,
          y: 0.265,
          m: -1.059259,
          yi: 1.026914
        }
      };
      var convertRgbToXyz = function(o) {
        var M = matrixRgbXyz;
        var z = {};
        var R = o.R / 255;
        var G = o.G / 255;
        var B = o.B / 255;
        if (colorProfile === "sRGB") {
          R = R > 0.04045 ? Math.pow((R + 0.055) / 1.055, 2.4) : R / 12.92;
          G = G > 0.04045 ? Math.pow((G + 0.055) / 1.055, 2.4) : G / 12.92;
          B = B > 0.04045 ? Math.pow((B + 0.055) / 1.055, 2.4) : B / 12.92;
        } else {
          R = Math.pow(R, gammaCorrection);
          G = Math.pow(G, gammaCorrection);
          B = Math.pow(B, gammaCorrection);
        }
        z.X = R * M[0] + G * M[3] + B * M[6];
        z.Y = R * M[1] + G * M[4] + B * M[7];
        z.Z = R * M[2] + G * M[5] + B * M[8];
        return z;
      };
      var convertXyzToXyy = function(o) {
        var n = o.X + o.Y + o.Z;
        if (n === 0) {
          return { x: 0, y: 0, Y: o.Y };
        }
        return { x: o.X / n, y: o.Y / n, Y: o.Y };
      };
      exports.Blind = function(rgb, type, anomalize) {
        var z, v, n, line, c, slope, yi, dx, dy, dX, dY, dZ, dR, dG, dB, _r, _g, _b, ngx, ngz, M, adjust;
        if (type === "achroma") {
          z = rgb.R * 0.212656 + rgb.G * 0.715158 + rgb.B * 0.072186;
          z = { R: z, G: z, B: z };
          if (anomalize) {
            v = 1.75;
            n = v + 1;
            z.R = (v * z.R + rgb.R) / n;
            z.G = (v * z.G + rgb.G) / n;
            z.B = (v * z.B + rgb.B) / n;
          }
          return z;
        }
        line = blinder[type];
        c = convertXyzToXyy(convertRgbToXyz(rgb));
        slope = (c.y - line.y) / (c.x - line.x);
        yi = c.y - c.x * slope;
        dx = (line.yi - yi) / (slope - line.m);
        dy = slope * dx + yi;
        dY = 0;
        z = {};
        z.X = dx * c.Y / dy;
        z.Y = c.Y;
        z.Z = (1 - (dx + dy)) * c.Y / dy;
        ngx = 0.312713 * c.Y / 0.329016;
        ngz = 0.358271 * c.Y / 0.329016;
        dX = ngx - z.X;
        dZ = ngz - z.Z;
        M = matrixXyzRgb;
        dR = dX * M[0] + dY * M[3] + dZ * M[6];
        dG = dX * M[1] + dY * M[4] + dZ * M[7];
        dB = dX * M[2] + dY * M[5] + dZ * M[8];
        z.R = z.X * M[0] + z.Y * M[3] + z.Z * M[6];
        z.G = z.X * M[1] + z.Y * M[4] + z.Z * M[7];
        z.B = z.X * M[2] + z.Y * M[5] + z.Z * M[8];
        _r = ((z.R < 0 ? 0 : 1) - z.R) / dR;
        _g = ((z.G < 0 ? 0 : 1) - z.G) / dG;
        _b = ((z.B < 0 ? 0 : 1) - z.B) / dB;
        _r = _r > 1 || _r < 0 ? 0 : _r;
        _g = _g > 1 || _g < 0 ? 0 : _g;
        _b = _b > 1 || _b < 0 ? 0 : _b;
        adjust = _r > _g ? _r : _g;
        if (_b > adjust) {
          adjust = _b;
        }
        z.R += adjust * dR;
        z.G += adjust * dG;
        z.B += adjust * dB;
        z.R = 255 * (z.R <= 0 ? 0 : z.R >= 1 ? 1 : Math.pow(z.R, 1 / gammaCorrection));
        z.G = 255 * (z.G <= 0 ? 0 : z.G >= 1 ? 1 : Math.pow(z.G, 1 / gammaCorrection));
        z.B = 255 * (z.B <= 0 ? 0 : z.B >= 1 ? 1 : Math.pow(z.B, 1 / gammaCorrection));
        if (anomalize) {
          v = 1.75;
          n = v + 1;
          z.R = (v * z.R + rgb.R) / n;
          z.G = (v * z.G + rgb.G) / n;
          z.B = (v * z.B + rgb.B) / n;
        }
        return z;
      };
    }
  });

  // color-blind.js
  var require_color_blind = __commonJS({
    "color-blind.js"(exports) {
      var onecolor = require_onecolor();
      var Blind = require_blind().Blind;
      var colorVisionData = {
        protanomaly: { type: "protan", anomalize: true },
        protanopia: { type: "protan" },
        deuteranomaly: { type: "deutan", anomalize: true },
        deuteranopia: { type: "deutan" },
        tritanomaly: { type: "tritan", anomalize: true },
        tritanopia: { type: "tritan" },
        achromatomaly: { type: "achroma", anomalize: true },
        achromatopsia: { type: "achroma" }
      };
      var denorm = function(ratio) {
        return Math.round(ratio * 255);
      };
      var createBlinder = function(key2) {
        return function(colorString, returnRgb) {
          var color = onecolor(colorString);
          if (!color) {
            return returnRgb ? { R: 0, G: 0, B: 0 } : "#000000";
          }
          var rgb = new Blind(
            {
              R: denorm(color.red() || 0),
              G: denorm(color.green() || 0),
              B: denorm(color.blue() || 0)
            },
            colorVisionData[key2].type,
            colorVisionData[key2].anomalize
          );
          rgb.R = rgb.R || 0;
          rgb.G = rgb.G || 0;
          rgb.B = rgb.B || 0;
          if (returnRgb) {
            delete rgb.X;
            delete rgb.Y;
            delete rgb.Z;
            return rgb;
          }
          return new onecolor.RGB(
            rgb.R % 256 / 255,
            rgb.G % 256 / 255,
            rgb.B % 256 / 255,
            1
          ).hex();
        };
      };
      for (key in colorVisionData) {
        exports[key] = createBlinder(key);
      }
      var key;
    }
  });
  return require_color_blind();
})();
