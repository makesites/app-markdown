// # Build script using Node.js
//
// Single script build,used as a lightweight alternative
// when a build platform (grunt/gulp wtc.) feels like overkill
//
// - Dependencies: NPM/Node.js
// - Conventions:
// * code is in a lib/ folder with a main.js as the main context (closure)
// * a bower.json on the root contains all the info about the lib: name, description, author, license
// * compiled files are saved in a build folder

// settings
var FILE_ENCODING = 'utf-8',
	EOL = '\n';

// Dependencies
var cli = require('commander'),
	terser = require("terser"),
	jshint = require('jshint'),
	handlebars = require('hbs'),
	fs = require('fs'),
	zlib = require('zlib');


// will generate a CSV if package info contains multiple licenses
/*
handlebars.registerHelper('license', function(items){
	items = items.map(function(val){
		return val.type;
	});
	return items.join(', ');
});
*/

// Logic
// - read module name from bower file
var package = JSON.parse( fs.readFileSync('bower.json', FILE_ENCODING) ); // condition the existance of package.json or component.json...
var name = package.name;
// - list files in the lib folder
var src = libFiles();
// - concatinate all files
var src = [
	// third-party helpers
	//'deps/...',
	// main lib
	'lib/helpers.js',
	'lib/template.js',
	'lib/view.js'
];

// - concatinate all files
concat({
	src: src,
	dest: 'dist/'+ name +'.js'
});


// - Validate js
lint('dist/'+ name +'.js', function(){

	// - Create / save minified file
	minify('dist/'+ name +'.js', 'dist/'+ name +'.min.js');

});


//
// Methods
function concat(opts) {
	var fileList = opts.src;
	var distPath = opts.dest;

	var lib = fileList.map(function(filePath){
			return fs.readFileSync(filePath, FILE_ENCODING);
		});

	var wrapper = fs.readFileSync('lib/main.js', FILE_ENCODING);

	var template = handlebars.compile( wrapper );

	//reuse package.json data and add build date
	var data = package;
	data.lib = lib.join(EOL);
	data.build_date = (new Date()).toUTCString();

	// Save uncompressed file
	fs.writeFileSync(distPath, template(data), FILE_ENCODING);
	console.log(' '+ distPath +' built.');

}


function minify(srcPath, distPath) {

	var source = fs.readFileSync(srcPath, FILE_ENCODING);

	terser.minify(source, {
		mangle: true,
		output: {
			comments : /@name|@author|@cc_on|@url|@license/
		},
		//sourceMap: {
		//	filename: "dist/app.min.js.map",
		//	url: "app.min.js.map"
		//},
		//ecma: 8,
		//compress: false
	}).then(function(result){

		fs.writeFileSync(distPath, result.code, FILE_ENCODING);


		console.log(' '+ distPath +' built.');

		// disable gzip
		return;

		// gzip
		zlib.gzip(result.code, function (error, bytes) {
			if (error) throw error;
			fs.writeFileSync(distPath, bytes, FILE_ENCODING);
		});
	});


}

function lint(path, callback) {
	var buf = fs.readFileSync(path, 'utf-8');
	// remove Byte Order Mark
	buf = buf.replace(/^\uFEFF/, '');

	jshint.JSHINT(buf, { esversion: 11, evil: true });

	var nErrors = jshint.JSHINT.errors.length;

	if (nErrors) {
		// ruff output of errors (for now)
		console.log(jshint.JSHINT.errors);
		console.log(' Found %j lint errors on %s, do you want to continue?', nErrors, path);

		cli.choose(['no', 'yes'], function(i){
			if (i) {
				process.stdin.destroy();
				if(callback) callback();
			} else {
				process.exit(0);
			}
		});
	} else if (callback) {
		callback();
	}
}

function libFiles(){
	var src = [];
	var files = fs.readdirSync( "lib/" );
	// folter only javascript files
	for( var i in files ){
		var file = files[i];
		// exclude certain files and main.js
		if( file.substr(0, 1) == "." || file.substr(-3) !== ".js" || file == "main.js" ) continue;
		src.push( "lib/"+ file );
	}
	return src;
}
