(function(global) {
	var SiphUrl = 'kaleidoscope.js';

	// Globals
	if(!global.Siph)
		global.Siph = {};
	var Siph = global.Siph;
 
	// To keep track of which embeds we have already processed
	if(!Siph.foundEls)
		Siph.foundEls = [];
	var foundEls = Siph.foundEls;
 
	// Settings for each widget instance
	if(!Siph.settings)
		Siph.settings = [];
	var settings = Siph.settings;
 
	// Find all widget instances, read their parametres
	var els = document.getElementsByTagName('script');
	var re = /.*siphonophore-load\.js/;
	var foundEls=[];
	for(var i = 0; i < els.length; i++) {
		var el = els[i];
		if(el.src.match(re) && foundEls.indexOf(el) < 0) {
			foundEls.push(el);
			var info = parseQueryString(el.src);

			// Create container div
			var d = document.createElement('div');
			var container = document.createElement('div');
			el.parentNode.insertBefore(container, el);
			info['container'] = container;
			settings.push(info);
		}
	}

	// Load main javascript
	var s = document.createElement('script');
	s.async = true;
	s.src = SiphUrl;
	document.body.appendChild(s);
 
	function parseQueryString(url) {
		var a = document.createElement('a');
		a.href = url;
		str = a.search.replace(/\?/, '');
		return deparam(str);
	}
 
	function deparam(params) {
		var obj = {};
 
		// Iterate over all name=value pairs.
		params.replace( /\+/g, ' ' ).split( '&' ).forEach(function(v, j) {
			var param = v.split( '=' );
			var	key = decodeURIComponent( param[0] );
			var	val = decodeURIComponent( param[1] );
				obj[key] = val;
		});
 
		return obj;
	}; 
}(this));