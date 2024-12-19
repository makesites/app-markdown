/**
 * @name {{name}}
 * {{description}}
 *
 * Version: {{version}} ({{build_date}})
 * Source: {{repository}}
 *
 * @author {{author}}
 * Initiated by: Makis Tracend (@tracend)
 * Distributed through [Makesites.org](http://makesites.org)
 *
 * @cc_on Copyright © Makesites.org
 * @license Released under the [{{license}} license](http://makesites.org/licenses/{{license}})
 */

// imports
import { APP } from "./app.js";
import * as $ from "https://cdn.jsdelivr.net/gh/jquery/jquery@3.7.1/dist/jquery.min.js";
import * as _ from "https://cdn.jsdelivr.net/npm/underscore@1.12.1/underscore-esm-min.js";

var Showdown  = window.showdown || false;
// prerequisite #1
//if( !Showdown ) return null; // throw error?

{{{lib}}}

// for module loaders:
export { Template, Markdown as View };
