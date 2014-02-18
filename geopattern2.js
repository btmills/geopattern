/*global jQuery */

// Color
!function(a,b,c){function d(c,f){if(!b[c]){if(!a[c]){var g="function"==typeof require&&require;if(!f&&g)return g(c,!0);if(e)return e(c,!0);throw new Error("Cannot find module '"+c+"'")}var h=b[c]={exports:{}};a[c][0].call(h.exports,function(b){var e=a[c][1][b];return d(e?e:b)},h,h.exports)}return b[c].exports}for(var e="function"==typeof require&&require,f=0;f<c.length;f++)d(c[f]);return d}({1:[function(a){Color=a("./color")},{"./color":2}],2:[function(a,b){var c=a("color-convert"),d=a("color-string");b.exports=function(a){return new e(a)};var e=function(a){if(this.values={rgb:[0,0,0],hsl:[0,0,0],hsv:[0,0,0],cmyk:[0,0,0,0],alpha:1},"string"==typeof a){var b=d.getRgba(a);b?this.setValues("rgb",b):(b=d.getHsla(a))&&this.setValues("hsl",b)}else if("object"==typeof a){var b=a;void 0!==b.r||void 0!==b.red?this.setValues("rgb",b):void 0!==b.l||void 0!==b.lightness?this.setValues("hsl",b):void 0!==b.v||void 0!==b.value?this.setValues("hsv",b):(void 0!==b.c||void 0!==b.cyan)&&this.setValues("cmyk",b)}};e.prototype={rgb:function(){return this.setSpace("rgb",arguments)},hsl:function(){return this.setSpace("hsl",arguments)},hsv:function(){return this.setSpace("hsv",arguments)},cmyk:function(){return this.setSpace("cmyk",arguments)},rgbArray:function(){return this.values.rgb},hslArray:function(){return this.values.hsl},hsvArray:function(){return this.values.hsv},cmykArray:function(){return this.values.cmyk},rgbaArray:function(){var a=this.values.rgb;return a.concat([this.values.alpha])},hslaArray:function(){var a=this.values.hsl;return a.concat([this.values.alpha])},alpha:function(a){return void 0===a?this.values.alpha:(this.setValues("alpha",a),this)},red:function(a){return this.setChannel("rgb",0,a)},green:function(a){return this.setChannel("rgb",1,a)},blue:function(a){return this.setChannel("rgb",2,a)},hue:function(a){return this.setChannel("hsl",0,a)},saturation:function(a){return this.setChannel("hsl",1,a)},lightness:function(a){return this.setChannel("hsl",2,a)},saturationv:function(a){return this.setChannel("hsv",1,a)},value:function(a){return this.setChannel("hsv",2,a)},cyan:function(a){return this.setChannel("cmyk",0,a)},magenta:function(a){return this.setChannel("cmyk",1,a)},yellow:function(a){return this.setChannel("cmyk",2,a)},black:function(a){return this.setChannel("cmyk",3,a)},hexString:function(){return d.hexString(this.values.rgb)},rgbString:function(){return d.rgbString(this.values.rgb,this.values.alpha)},rgbaString:function(){return d.rgbaString(this.values.rgb,this.values.alpha)},percentString:function(){return d.percentString(this.values.rgb,this.values.alpha)},hslString:function(){return d.hslString(this.values.hsl,this.values.alpha)},hslaString:function(){return d.hslaString(this.values.hsl,this.values.alpha)},keyword:function(){return d.keyword(this.values.rgb,this.values.alpha)},luminosity:function(){for(var a=this.values.rgb,b=[],c=0;c<a.length;c++){var d=a[c]/255;b[c]=.03928>=d?d/12.92:Math.pow((d+.055)/1.055,2.4)}return.2126*b[0]+.7152*b[1]+.0722*b[2]},contrast:function(a){var b=this.luminosity(),c=a.luminosity();return b>c?(b+.05)/(c+.05):(c+.05)/(b+.05)},dark:function(){var a=this.values.rgb,b=(299*a[0]+587*a[1]+114*a[2])/1e3;return 128>b},light:function(){return!this.dark()},negate:function(){for(var a=[],b=0;3>b;b++)a[b]=255-this.values.rgb[b];return this.setValues("rgb",a),this},lighten:function(a){return this.values.hsl[2]+=this.values.hsl[2]*a,this.setValues("hsl",this.values.hsl),this},darken:function(a){return this.values.hsl[2]-=this.values.hsl[2]*a,this.setValues("hsl",this.values.hsl),this},saturate:function(a){return this.values.hsl[1]+=this.values.hsl[1]*a,this.setValues("hsl",this.values.hsl),this},desaturate:function(a){return this.values.hsl[1]-=this.values.hsl[1]*a,this.setValues("hsl",this.values.hsl),this},greyscale:function(){var a=this.values.rgb,b=.3*a[0]+.59*a[1]+.11*a[2];return this.setValues("rgb",[b,b,b]),this},clearer:function(a){return this.setValues("alpha",this.values.alpha-this.values.alpha*a),this},opaquer:function(a){return this.setValues("alpha",this.values.alpha+this.values.alpha*a),this},rotate:function(a){var b=this.values.hsl[0];return b=(b+a)%360,b=0>b?360+b:b,this.values.hsl[0]=b,this.setValues("hsl",this.values.hsl),this},mix:function(a,b){b=1-(null==b?.5:b);for(var c=2*b-1,d=this.alpha()-a.alpha(),e=((-1==c*d?c:(c+d)/(1+c*d))+1)/2,f=1-e,g=this.rgbArray(),h=a.rgbArray(),i=0;i<g.length;i++)g[i]=g[i]*e+h[i]*f;this.setValues("rgb",g);var j=this.alpha()*b+a.alpha()*(1-b);return this.setValues("alpha",j),this},toJSON:function(){return this.rgb()}},e.prototype.getValues=function(a){for(var b={},c=0;c<a.length;c++)b[a[c]]=this.values[a][c];return 1!=this.values.alpha&&(b.a=this.values.alpha),b},e.prototype.setValues=function(a,b){var d={rgb:["red","green","blue"],hsl:["hue","saturation","lightness"],hsv:["hue","saturation","value"],cmyk:["cyan","magenta","yellow","black"]},e={rgb:[255,255,255],hsl:[360,100,100],hsv:[360,100,100],cmyk:[100,100,100,100]},f=1;if("alpha"==a)f=b;else if(b.length)this.values[a]=b.slice(0,a.length),f=b[a.length];else if(void 0!==b[a[0]]){for(var g=0;g<a.length;g++)this.values[a][g]=b[a[g]];f=b.a}else if(void 0!==b[d[a][0]]){for(var h=d[a],g=0;g<a.length;g++)this.values[a][g]=b[h[g]];f=b.alpha}if(this.values.alpha=Math.max(0,Math.min(1,void 0!==f?f:this.values.alpha)),"alpha"!=a){for(var i in d){i!=a&&(this.values[i]=c[a][i](this.values[a]));for(var g=0;g<i.length;g++){var j=Math.max(0,Math.min(e[i][g],this.values[i][g]));this.values[i][g]=Math.round(j)}}return!0}},e.prototype.setSpace=function(a,b){var c=b[0];return void 0===c?this.getValues(a):("number"==typeof c&&(c=Array.prototype.slice.call(b)),this.setValues(a,c),this)},e.prototype.setChannel=function(a,b,c){return void 0===c?this.values[a][b]:(this.values[a][b]=c,this.setValues(a,this.values[a]),this)}},{"color-convert":3,"color-string":4}],3:[function(a,b,c){var d=a("./conversions"),c={};b.exports=c;for(var e in d){c[e+"Raw"]=function(a){return function(b){return"number"==typeof b&&(b=Array.prototype.slice.call(arguments)),d[a](b)}}(e);var f=/(\w+)2(\w+)/.exec(e),g=f[1],h=f[2];c[g]=c[g]||{},c[g][h]=c[e]=function(a){return function(b){"number"==typeof b&&(b=Array.prototype.slice.call(arguments));var c=d[a](b);if("string"==typeof c||void 0===c)return c;for(var e=0;e<c.length;e++)c[e]=Math.round(c[e]);return c}}(e)}},{"./conversions":5}],5:[function(a,b){function c(a){var b,c,d,e=a[0]/255,f=a[1]/255,g=a[2]/255,h=Math.min(e,f,g),i=Math.max(e,f,g),j=i-h;return i==h?b=0:e==i?b=(f-g)/j:f==i?b=2+(g-e)/j:g==i&&(b=4+(e-f)/j),b=Math.min(60*b,360),0>b&&(b+=360),d=(h+i)/2,c=i==h?0:.5>=d?j/(i+h):j/(2-i-h),[b,100*c,100*d]}function d(a){var b,c,d,e=a[0],f=a[1],g=a[2],h=Math.min(e,f,g),i=Math.max(e,f,g),j=i-h;return c=0==i?0:1e3*(j/i)/10,i==h?b=0:e==i?b=(f-g)/j:f==i?b=2+(g-e)/j:g==i&&(b=4+(e-f)/j),b=Math.min(60*b,360),0>b&&(b+=360),d=1e3*(i/255)/10,[b,c,d]}function e(a){var b,c,d,e,f=a[0]/255,g=a[1]/255,h=a[2]/255;return e=Math.min(1-f,1-g,1-h),b=(1-f-e)/(1-e),c=(1-g-e)/(1-e),d=(1-h-e)/(1-e),[100*b,100*c,100*d,100*e]}function f(a){return A[JSON.stringify(a)]}function g(a){var b=a[0]/255,c=a[1]/255,d=a[2]/255;b=b>.04045?Math.pow((b+.055)/1.055,2.4):b/12.92,c=c>.04045?Math.pow((c+.055)/1.055,2.4):c/12.92,d=d>.04045?Math.pow((d+.055)/1.055,2.4):d/12.92;var e=.4124*b+.3576*c+.1805*d,f=.2126*b+.7152*c+.0722*d,g=.0193*b+.1192*c+.9505*d;return[100*e,100*f,100*g]}function h(a){var b,c,d,e=g(a),f=e[0],h=e[1],i=e[2];return f/=95.047,h/=100,i/=108.883,f=f>.008856?Math.pow(f,1/3):7.787*f+16/116,h=h>.008856?Math.pow(h,1/3):7.787*h+16/116,i=i>.008856?Math.pow(i,1/3):7.787*i+16/116,b=116*h-16,c=500*(f-h),d=200*(h-i),[b,c,d]}function i(a){var b,c,d,e,f,g=a[0]/360,h=a[1]/100,i=a[2]/100;if(0==h)return f=255*i,[f,f,f];c=.5>i?i*(1+h):i+h-i*h,b=2*i-c,e=[0,0,0];for(var j=0;3>j;j++)d=g+1/3*-(j-1),0>d&&d++,d>1&&d--,f=1>6*d?b+6*(c-b)*d:1>2*d?c:2>3*d?b+6*(c-b)*(2/3-d):b,e[j]=255*f;return e}function j(a){var b,c,d=a[0],e=a[1]/100,f=a[2]/100;return f*=2,e*=1>=f?f:2-f,c=(f+e)/2,b=2*e/(f+e),[d,100*e,100*c]}function k(a){return e(i(a))}function l(a){return f(i(a))}function m(a){var b=a[0]/60,c=a[1]/100,d=a[2]/100,e=Math.floor(b)%6,f=b-Math.floor(b),g=255*d*(1-c),h=255*d*(1-c*f),i=255*d*(1-c*(1-f)),d=255*d;switch(e){case 0:return[d,i,g];case 1:return[h,d,g];case 2:return[g,d,i];case 3:return[g,h,d];case 4:return[i,g,d];case 5:return[d,g,h]}}function n(a){var b,c,d=a[0],e=a[1]/100,f=a[2]/100;return c=(2-e)*f,b=e*f,b/=1>=c?c:2-c,c/=2,[d,100*b,100*c]}function o(a){return e(m(a))}function p(a){return f(m(a))}function q(a){var b,c,d,e=a[0]/100,f=a[1]/100,g=a[2]/100,h=a[3]/100;return b=1-Math.min(1,e*(1-h)+h),c=1-Math.min(1,f*(1-h)+h),d=1-Math.min(1,g*(1-h)+h),[255*b,255*c,255*d]}function r(a){return c(q(a))}function s(a){return d(q(a))}function t(a){return f(q(a))}function u(a){var b,c,d,e=a[0]/100,f=a[1]/100,g=a[2]/100;return b=3.2406*e+-1.5372*f+g*-.4986,c=e*-.9689+1.8758*f+.0415*g,d=.0557*e+f*-.204+1.057*g,b=b>.0031308?1.055*Math.pow(b,1/2.4)-.055:b=12.92*b,c=c>.0031308?1.055*Math.pow(c,1/2.4)-.055:c=12.92*c,d=d>.0031308?1.055*Math.pow(d,1/2.4)-.055:d=12.92*d,b=0>b?0:b,c=0>c?0:c,d=0>d?0:d,[255*b,255*c,255*d]}function v(a){return z[a]}function w(a){return c(v(a))}function x(a){return d(v(a))}function y(a){return e(v(a))}b.exports={rgb2hsl:c,rgb2hsv:d,rgb2cmyk:e,rgb2keyword:f,rgb2xyz:g,rgb2lab:h,hsl2rgb:i,hsl2hsv:j,hsl2cmyk:k,hsl2keyword:l,hsv2rgb:m,hsv2hsl:n,hsv2cmyk:o,hsv2keyword:p,cmyk2rgb:q,cmyk2hsl:r,cmyk2hsv:s,cmyk2keyword:t,keyword2rgb:v,keyword2hsl:w,keyword2hsv:x,keyword2cmyk:y,xyz2rgb:u};var z={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]},A={};for(var B in z)A[JSON.stringify(z[B])]=B},{}],4:[function(a,b){function c(a){if(a){var b=/^#([a-fA-F0-9]{3})$/,c=/^#([a-fA-F0-9]{6})$/,d=/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d\.]+)\s*)?\)$/,e=/^rgba?\(\s*([\d\.]+)\%\s*,\s*([\d\.]+)\%\s*,\s*([\d\.]+)\%\s*(?:,\s*([\d\.]+)\s*)?\)$/,f=/(\D+)/,g=[0,0,0],h=1,i=a.match(b);if(i){i=i[1];for(var j=0;j<g.length;j++)g[j]=parseInt(i[j]+i[j],16)}else if(i=a.match(c)){i=i[1];for(var j=0;j<g.length;j++)g[j]=parseInt(i.slice(2*j,2*j+2),16)}else if(i=a.match(d)){for(var j=0;j<g.length;j++)g[j]=parseInt(i[j+1]);h=parseFloat(i[4])}else if(i=a.match(e)){for(var j=0;j<g.length;j++)g[j]=Math.round(2.55*parseFloat(i[j+1]));h=parseFloat(i[4])}else if(i=a.match(f)){if("transparent"==i[1])return[0,0,0,0];if(g=r.keyword2rgb(i[1]),!g)return}for(var j=0;j<g.length;j++)g[j]=p(g[j],0,255);return h=h||0==h?p(h,0,1):1,g.push(h),g}}function d(a){if(a){var b=/^hsla?\(\s*(\d+)\s*,\s*([\d\.]+)%\s*,\s*([\d\.]+)%\s*(?:,\s*([\d\.]+)\s*)?\)/,c=a.match(b);if(c){var d=p(parseInt(c[1]),0,360),e=p(parseFloat(c[2]),0,100),f=p(parseFloat(c[3]),0,100),g=p(parseFloat(c[4])||1,0,1);return[d,e,f,g]}}}function e(a){return c(a).slice(0,3)}function f(a){return d(a).slice(0,3)}function g(a){var b=c(a);return b?b[3]:(b=d(a))?b[3]:void 0}function h(a){return"#"+q(a[0])+q(a[1])+q(a[2])}function i(a,b){return 1>b||a[3]&&a[3]<1?j(a,b):"rgb("+a[0]+", "+a[1]+", "+a[2]+")"}function j(a,b){return void 0===b&&(b=void 0!==a[3]?a[3]:1),"rgba("+a[0]+", "+a[1]+", "+a[2]+", "+b+")"}function k(a,b){if(1>b||a[3]&&a[3]<1)return l(a,b);var c=Math.round(100*(a[0]/255)),d=Math.round(100*(a[1]/255)),e=Math.round(100*(a[2]/255));return"rgb("+c+"%, "+d+"%, "+e+"%)"}function l(a,b){var c=Math.round(100*(a[0]/255)),d=Math.round(100*(a[1]/255)),e=Math.round(100*(a[2]/255));return"rgba("+c+"%, "+d+"%, "+e+"%, "+(b||a[3]||1)+")"}function m(a,b){return 1>b||a[3]&&a[3]<1?n(a,b):"hsl("+a[0]+", "+a[1]+"%, "+a[2]+"%)"}function n(a,b){return"hsla("+a[0]+", "+a[1]+"%, "+a[2]+"%, "+(b||a[3]||1)+")"}function o(a){return r.rgb2keyword(a.slice(0,3))}function p(a,b,c){return Math.min(Math.max(b,a),c)}function q(a){var b=a.toString(16).toUpperCase();return b.length<2?"0"+b:b}var r=a("color-convert");b.exports={getRgba:c,getHsla:d,getRgb:e,getHsl:f,getAlpha:g,hexString:h,rgbString:i,rgbaString:j,percentString:k,percentaString:l,hslString:m,hslaString:n,keyword:o}},{"color-convert":3}]},{},[1]);

// SHA1
function SHA1 (msg) {

    function rotate_left(n,s) {
        var t4 = ( n<<s ) | (n>>>(32-s));
        return t4;
    };

    function lsb_hex(val) {
        var str="";
        var i;
        var vh;
        var vl;

        for( i=0; i<=6; i+=2 ) {
            vh = (val>>>(i*4+4))&0x0f;
            vl = (val>>>(i*4))&0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };

    function cvt_hex(val) {
        var str="";
        var i;
        var v;

        for( i=7; i>=0; i-- ) {
            v = (val>>>(i*4))&0x0f;
            str += v.toString(16);
        }
        return str;
    };


    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;

    msg = Utf8Encode(msg);

    var msg_len = msg.length;

    var word_array = new Array();
    for( i=0; i<msg_len-3; i+=4 ) {
        j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
        msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
        word_array.push( j );
    }

    switch( msg_len % 4 ) {
        case 0:
            i = 0x080000000;
        break;
        case 1:
            i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
        break;

        case 2:
            i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
        break;

        case 3:
            i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8    | 0x80;
        break;
    }

    word_array.push( i );

    while( (word_array.length % 16) != 14 ) word_array.push( 0 );

    word_array.push( msg_len>>>29 );
    word_array.push( (msg_len<<3)&0x0ffffffff );


    for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {

        for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
        for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);

        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;

        for( i= 0; i<=19; i++ ) {
            temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
        }

        for( i=20; i<=39; i++ ) {
            temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
        }

        for( i=40; i<=59; i++ ) {
            temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
        }

        for( i=60; i<=79; i++ ) {
            temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
        }

        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;

    }

    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

    return temp.toLowerCase();

}

(function ($) {

'use strict';

var DEFAULTS = {
	baseColor: '#933c3c'
};

var PATTERNS = [
	'octogons',
	'overlappingCircles',
	'plusSigns',
	'xes',
	'sineWaves',
	'hexagons',
	'overlappingRings',
	'plaid',
	'triangles',
	'squares',
	'concentricCircles',
	'diamonds',
	'tessellation',
	'nestedSquares',
	'mosaicSquares',
	'trianglesRotated',
	'chevrons'
];

var FILL_COLOR_DARK  = '#222';
var FILL_COLOR_LIGHT = '#ddd';
var STROKE_COLOR     = '#000';
var STROKE_OPACITY   = 0.02;
var OPACITY_MIN      = 0.02;
var OPACITY_MAX      = 0.15;



// Helpers

/*
 * Merge all object args into a new object, trying $.extend first
 */
var merge = function () {
	var args = Array.prototype.slice.call(arguments);
	var obj;

	if (typeof $ !== 'undefined' && typeof $.extend === 'function') {
		return $.extend.apply(null, [{}].concat(args));
	} else {
		// Really simple implementation, not even recursive
		obj = {};
		args.forEach(function (arg) {
			if (typeof arg !== 'object') return;

			Object.keys(arg).forEach(function (key) {
				obj[key] = arg[key];
			});
		});
		return obj;
	}
}

/*
 * Format a string
 * String.format('{0} is dead, but {1} is alive! {0} {2}', 'ASP', 'ASP.NET');
 * http://stackoverflow.com/questions/610406/#answer-4673436
 */
if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

/**
 * Extract a substring from a hex string and parse it as an integer
 * @param {string} hash - Source hex string
 * @param {number} index - Start index of substring
 * @param {number} [length] - Length of substring. Defaults to 1.
 */
function hexVal(hash, index, len) {
	return parseInt(hash.substr(index, len || 1), 16);
}

/*
 * Re-maps a number from one range to another
 * http://processing.org/reference/map_.html
 */
function map(value, vMin, vMax, dMin, dMax) {
	var vValue = parseFloat(value);
	var vRange = vMax - vMin;
	var dRange = dMax - dMin;

	return (vValue - vMin) * dRange / vRange + dMin;
}

function fillColor(val) {
	return (val % 2 === 0) ? FILL_COLOR_LIGHT : FILL_COLOR_DARK;
}

function fillOpacity(val) {
	return map(val, 0, 15, OPACITY_MIN, OPACITY_MAX);
}

/**
 * Set a pattern's dimensions
 * @param {Snap} s - Snap.svg instance
 * @param {number} width - Pattern width in pixels
 * @param {number} [height] - Pattern height in pixels. Defaults to width.
 */
// function setDimensions(s, width, height) {
// 	s.node.setAttribute('width', width);
// 	s.node.setAttribute('height', height || width);
// }



// SVG

var SVG = function () {
	this.width = 100;
	this.height = 100;
	this.svg = document.createElement('svg');
	this.setAttributes(this.svg, {
		xmlns: 'http://www.w3.org/2000/svg',
		width: this.width,
		height: this.height
	});

	return this;
}

SVG.prototype.setAttributes = function (el, attrs) {
	Object.keys(attrs).forEach(function (attr) {
		el.setAttribute(attr, attrs[attr]);
	});
};

SVG.prototype.setWidth = function (width) {
	this.svg.setAttribute('width', Math.floor(width));
};

SVG.prototype.setHeight = function (height) {
	this.svg.setAttribute('height', Math.floor(height));
};

SVG.prototype.toString = function () {
	return this.svg.outerHTML;
};

SVG.prototype.rect = function (x, y, width, height, args) {
	var rect = document.createElement('rect');
	this.svg.appendChild(rect);
	this.setAttributes(rect, merge({
		x: x,
		y: y,
		width: width,
		height: height
	}, args));

	return rect;
};

SVG.prototype.circle = function (cx, cy, r, args) {
	var circle = document.createElement('circle');
	this.svg.appendChild(circle);
	this.setAttributes(circle, merge({
		cx: cx,
		cy: cy,
		r: r
	}, args));

	return circle;
};

SVG.prototype.path = function (str, args) {
	var path = document.createElement('path');
	this.svg.appendChild(path);
	this.setAttributes(path, merge({
		d: str
	}, args));

	return path;
};

SVG.prototype.polyline = function (str, args) {
	var polyline = document.createElement('polyline');
	this.svg.appendChild(polyline);
	this.setAttributes(polyline, merge({
		points: str
	}, args));

	return polyline;
};

/*SVG.prototype.group = function (elements, args) {
	var group = document.createElement('group');
}*/



// Pattern

var Pattern = function (string, options) {
	this.opts = merge(DEFAULTS, options);
	this.hash = options.hash || SHA1(string);
	this.svg = new SVG();

	this.generateBackground();
	this.generatePattern();

	return this;
}

Pattern.prototype.toSvg = function () {
	return this.svg.toString();
};

Pattern.prototype.toString = function () {
	return this.toSvg();
};

Pattern.prototype.toBase64 = function () {
	return window.btoa(this.toSvg());
};

Pattern.prototype.toDataUri = function () {
	return 'data:image/svg+xml;base64,' + this.toBase64();
};

Pattern.prototype.toDataUrl = function () {
	return 'url("'+ this.toDataUri() + '")';
};

Pattern.prototype.generateBackground = function () {
	var hueOffset = map(hexVal(this.hash, 14, 3), 0, 4095, 0, 359);
	var satOffset = hexVal(this.hash, 17, 1);
	var baseColor = Color(this.opts.baseColor);

	baseColor.rotate(-hueOffset);

	if (satOffset % 2 === 0) {
		baseColor.saturation(baseColor.saturation() + satOffset);
	} else {
		baseColor.saturation(baseColor.saturation() - satOffset);
	}

	this.svg.rect(0, 0, '100%', '100%', {
		fill: baseColor.rgbString()
	});
};

Pattern.prototype.generatePattern = function () {
	var generator = this.opts.generator;

	if (generator) {
		if (PATTERNS.indexOf(generator) < 0) {
			throw new Error('The generator '
				+ generator
				+ ' does not exist.');
		}
	} else {
		generator = PATTERNS[hexVal(this.hash, 20)];
	}

	return this['geo_' + generator]();
};

function buildHexagonShape(sideLength) {
	var c = sideLength;
	var a = c / 2;
	var b = Math.sin(60 * Math.PI / 180) * c;
	return [
		0, b,
		a, 0,
		a + c, 0,
		2 * c, b,
		a + c, 2 * b,
		a, 2 * b,
		0, b
	].join(',');
}

Pattern.prototype.geo_hexagons = function () {
	var scale      = hexVal(this.hash, 0);
	var sideLength = map(scale, 0, 15, 8, 60);
	var hexHeight  = sideLength * Math.sqrt(3);
	var hexWidth   = sideLength * 2;
	var hex        = buildHexagonShape(sideLength);
	var dy, fill, i, opacity, styles, val, x, y;

	this.svg.setWidth(hexWidth * 3 + sideLength * 3);
	this.svg.setHeight(hexHeight * 6);

	i = 0;
	for (y = 0; y < 6; y++) {
		for (x = 0; x < 6; x++) {
			val     = hexVal(this.hash, i);
			dy      = x % 2 === 0 ? y * hexHeight : y * hexHeight + hexHeight / 2;
			opacity = fillOpacity(val);
			fill    = fillColor(val);

			styles = {
				fill: fill,
				'fill-opacity': opacity,
				stroke: STROKE_COLOR,
				'stroke-opacity': STROKE_OPACITY
			};

			this.svg.polyline(hex, merge(styles, {
				transform: 'translate(' + [
					x * sideLength * 1.5 - hexWidth / 2,
					dy - hexHeight / 2
				] + ')'
			}));

			// Add an extra one at top-right, for tiling.
			if (x === 0) {
				this.svg.polyline(hex, merge(styles, {
					transform: 'translate(' + [
						6 * sideLength * 1.5 - hexWidth / 2,
						dy - hexHeight / 2
					] + ')'
				}));
			}

			// Add an extra row at the end that matches the first row, for tiling.
			if (y === 0) {
				dy = x % 2 === 0 ? 6 * hexHeight : 6 * hexHeight + hexHeight / 2;
				this.svg.polyline(hex, merge(styles, {
					transform: 'translate(' + [
						x * sideLength * 1.5 - hexWidth / 2,
						dy - hexHeight / 2
					] + ')'
				}));
			}

			// Add an extra one at bottom-right, for tiling.
			if (x === 0 && y === 0) {
				this.svg.polyline(hex, merge(styles, {
					transform: 'translate(' + [
						6 * sideLength * 1.5 - hexWidth / 2,
						5 * hexHeight + hexHeight / 2
					] + ')'
				}));
			}

			i++;
		}
	}
};

Pattern.prototype.geo_sineWaves = function () {
	var period    = Math.floor(map(hexVal(this.hash, 0), 0, 15, 100, 400));
	var amplitude = Math.floor(map(hexVal(this.hash, 1), 0, 15, 30, 100));
	var waveWidth = Math.floor(map(hexVal(this.hash, 2), 0, 15, 3, 30));
	var fill, i, line, opacity, str, styles, val, xOffset;

	this.svg.setWidth(period);
	this.svg.setHeight(waveWidth * 36);

	for (i = 0; i < 36; i++) {
		val     = hexVal(this.hash, i);
		opacity = fillOpacity(val);
		fill    = fillColor(val);
		xOffset = period / 4 * 0.7;

		styles = {
			fill: 'none',
			stroke: fill,
			opacity: opacity,
			'stroke-width': '' + waveWidth + 'px'
		};

		str = 'M0 ' + amplitude +
			' C ' + xOffset + ' 0, ' + (period / 2 - xOffset) + ' 0, ' + (period / 2) + ' ' + amplitude +
			' S ' + (period - xOffset) + ' ' + (amplitude * 2) + ', ' + period + ' ' + amplitude +
			' S ' + (period * 1.5 - xOffset) + ' 0, ' + (period * 1.5) + ', ' + amplitude;

		this.svg.path(str, merge(styles, {
			transform: 'translate(' + [
				-period / 4,
				waveWidth * i - amplitude * 1.5
			] + ')'
		}));
		this.svg.path(str, merge(styles, {
			transform: 'translate(' + [
				-period / 4,
				waveWidth * i - amplitude * 1.5 + waveWidth * 36
			] + ')'
		}));
	}
};



// Exports

/*
 * Normalize arguments, if not given, to:
 * string: (new Date()).toString()
 * options: {}
 */
function optArgs(cb) {
	return function (string, options) {
		if (typeof string === 'object') {
			options = string;
			string = null;
		}
		if (string === null || string === undefined) {
			string = (new Date()).toString();
		}
		if (!options) {
			options = {};
		}

		cb.call(this, string, options);
	};
}

if ($) {

	// If jQuery, add plugin
	$.fn.geopattern = optArgs(function (string, options) {
		return this.each(function () {
			var titleSha = $(this).attr('data-title-sha');
			if (titleSha) {
				options = $.extend({
					hash: titleSha
				}, options);
			}
			var pattern = new Pattern(string, options);
			$(this).css('background-image', pattern.toDataUrl());
			console.log(pattern);
			console.log(pattern.toString());
			//console.log(pattern.toDataUrl());
		});
	});

} else {

	// If no jQuery, register global
	window.GeoPattern = {
		generate: optArgs(function (string, options) {
			return new Pattern(string, options);
		})
	};

}

}(jQuery));
