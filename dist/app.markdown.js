/**
 * @name app.markdown
 * An APP() extension to parse and display Markdown pages as views
 *
 * Version: 0.0.0 (Thu, 19 Dec 2024 07:23:49 GMT)
 * Source: http://github.com/makesites/app-markdown
 *
 * @author makesites
 * Initiated by: Makis Tracend (@tracend)
 * Distributed through [Makesites.org](http://makesites.org)
 *
 * @cc_on Copyright © Makesites.org
 * @license Released under the [MIT license](http://makesites.org/licenses/MIT)
 */

// imports
import { APP } from "https://cdn.jsdelivr.net/gh/makesites/app/dist/app.min.js";
import * as $ from "https://cdn.jsdelivr.net/gh/jquery/jquery@3.7.1/dist/jquery.min.js";
import * as _ from "https://cdn.jsdelivr.net/npm/underscore@1.12.1/underscore-esm-min.js";

var Showdown  = window.showdown || false;
// prerequisite #1
//if( !Showdown ) return null; // throw error?


// Helpers
// Source: https://gist.github.com/tracend/8434259
_.mixin({
	// Uppercase the first character of each word in a string
	// From: http://phpjs.org/functions/ucwords/
	ucwords : function(str) {
		return (str + '').replace(/^([a-z])|\s+([a-z])|-([a-z])/g, function ($1) {
			return $1.toUpperCase();
		});
	}
});

// Supports a template written in markdown
// ( showdown.js assumed loaded )
// options:
// - url : for a file containing the temaplte
// - html : for a string directly used as the template
//

// init compiler
var compiler;
if( Showdown.Converter ){
	// newer API...
	var lib = new Showdown.Converter();
	compiler = lib.makeHtml.bind(lib);
} else {
	// legacy API < v1
	compiler = (new Showdown.converter()).makeHtml;
}

// prerequisite #2
//if( !compiler ) return null;

var TemplateParent = APP.Template;

class Template extends TemplateParent {}

Template.prototype.compile = compiler;

var ViewParent = APP.View;

class Markdown extends ViewParent {
	/*
	options: {
		template: Template,
		parseName: false,
		mdRoot: "assets/html/", // with trailing slash please...
		pathRoot: ""
	}

	events: {
		"click a" : "processLink"
	},
	*/
	initialize( options ){
		//
		var page = ( options. parseName || this.options. parseName ) ? this._parseName( options.page ) : options.page;
		this.options.url = this.options.mdRoot + page +".md";
		//
		return super.initialize( options );
	}

	processLink( e ){
		e.preventDefault();
		var el = ( e.target.tagName == "A") ?  $(e.target) : $(e.target).closest("a");
		var url = this.options.pathRoot;
		url += el.attr("href");
		// if a full http link allow the clickthrough
		if(/(file|http).*/.test(url)) window.location = url;
		// 'clean' all the wiki paths
		url= url.replace("./wiki", "").replace("./", "");
		// goto the new page
		app.navigate(url, true);
	}

	// bridges the gap between the url and the actual filename
	// update with your own logic
	_parseName( page ){
		// by default just capitalizing page name
		page = _.ucwords( page );
		return page;
	}

}


// for module loaders:
export { Template, Markdown as View };
