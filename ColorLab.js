/*
 * Mathematical transformations for color
 * @author Martin Chaov
 *
 * Some solutions are coming directly from the web
 * others are implementing formulas from Wikipedia.
 * Further reading:
 * https://www.cs.rit.edu/~ncs/color/t_convert.html
 * http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
 *
 */

var ColorLab = (function () {
    'use strict';

    function ColorLab()
    {
        Object.defineProperties(this, {
            '_shorthandHEXRegEx': {
                writable: false,
                enumerable: false,
                configurable: false,
                value: /^#?([a-f\d])([a-f\d])([a-f\d])$/i
            },
            '_HEXExpand': {
                writable: false,
                enumerable: false,
                configurable: false,
                value: function(m, r, g, b)
                {
                    return r + r + g + g + b + b;
                }
            },
            '_HEXRegEx': {
                writable: false,
                enumerable: false,
                configurable: false,
                value: /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
            },
            '_hueTransform': {
                writable: false,
                enumerable: false,
                configurable: false,
                value: function (p, q, t)
                {
                    if (t < 0)
                    {
                        t += 1;
                    }

                    if (t > 1)
                    {
                        t -= 1;
                    }

                    if (t < 1 / 6)
                    {
                        return p + (q - p) * 6 * t;
                    }

                    if (t < 1 / 2)
                    {
                        return q;
                    }

                    if (t < 2 / 3)
                    {
                        return p + (q - p) * (2 / 3 - t) * 6;
                    }

                    return p;
                }
            },
            'random': {
                writable: false,
                enumerable: false,
                configurable: false,
                value: function (type)
                {
                    var type = type || '',
                        randColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

                    switch (type.toLowerCase())
                    {
                        case 'rgb':
                            return this.HEX2RGB(randColor);

                        case 'hsl':
                            var rgb = this.HEX2RGB(randColor);
                            return this.RGB2HSL(rgb.r, rgb.g, rgb.b);

                        default:
                            return randColor;

                    }
                }
            },
            'RGB2HSL': {
                writable: false,
                enumerable: false,
                configurable: false,
                value: function (r, g, b)
                {
                    r /= 255, g /= 255, b /= 255;

                    var max = Math.max(r, g, b),
                        min = Math.min(r, g, b),
                        h, d, s, l = (max + min) / 2;

                    if (max == min)
                    {
                        h = s = 0;
                    }
                    else
                    {
                        d = max - min;
                        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

                        switch (max)
                        {
                            case r:
                                h = (g - b) / d + (g < b ? 6 : 0);
                                break;

                            case g:
                                h = (b - r) / d + 2;
                                break;

                            case b:
                                h = (r - g) / d + 4;
                                break;
                        }
                        h /= 6;
                    }

                    return {
                        h: Math.round(h * 360),
                        s: Math.round(s * 100),
                        l: Math.round(l * 100)
                    };
                }
            },
            'HSL2RGB': {
                writable: false,
                enumerable: false,
                configurable: false,
                value: function (h, s, l)
                {
                    h /= 360, s /= 100, l /= 100;

                    var r, g, b, q, p;

                    if (s === 0)
                    {
                        r = g = b = l;
                    }
                    else
                    {
                        q = l < 0.5 ? l * (1 + s) : l + s - l * s,
                        p = 2 * l - q;

                        r = this._hueTransform(p, q, h + 1 / 3);
                        g = this._hueTransform(p, q, h);
                        b = this._hueTransform(p, q, h - 1 / 3);
                    }

                    return {
                        r: Math.round(r * 255),
                        g: Math.round(g * 255),
                        b: Math.round(b * 255),
                    };
                }
            },
            'RGB2HEX': {
                writable: false,
                enumerable: false,
                configurable: false,
                value: function (r, g, b)
                {
                    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                }
            },
            'HEX2RGB': {
                writable: false,
                enumerable: false,
                configurable: false,
                value: function (hex)
                {
                    (hex.length < 7) && (hex = hex.replace(this._shorthandHEXRegEx, this._HEXExpand));

                    var result = this._HEXRegEx.exec(hex);
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;
                }
            }
        });

        return this;
    }

    return new ColorLab();
}());