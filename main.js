/**
 * Simple couchapp deployment tool
 */


// fancy dep-check
try{
    var fs = require('fs'), path=require('path'), ugly=require('uglify-js'), toSource = require('tosource');
}catch(e){
    console.log("Install wokka dependencies with 'npm install'.");
    process.exit(1);
}

/**
 * Turn code-strings & any javascript thing into a minified chunk of code
 * @param  {Object} obj     String, or any other javascript object. Strings become the body of a function.
 * @param  {Object} options uglify gen_code options + mangle & squeeze
 * @return {String}         minified code
 */
function minify(obj, options){
    options = options || {"mangle":false, "squeeze":true};
    if (typeof obj == "string") obj = new Function("", obj);
    var jsp = ugly.parser;
    var pro = ugly.uglify;
    var ast = jsp.parse(toSource(obj));

    if (options.mangle) ast = pro.ast_mangle(ast);
    if (options.squeeze) ast = pro.ast_squeeze(ast);

    return pro.gen_code(ast, options);
}

/**
 * Push code & attachments into couchdb
 * @param  {Object} app   the app object
 * @param  {String} dburl The couch URL
 * @param  {String} cwd   directory to operate in
 */
exports.push = function(app, dburl, cwd){
    console.log(minify(app));
};

/**
 * Pull code & attachments from couchdb
 * @param  {Object} app   the app object
 * @param  {String} dburl The couch URL
 * @param  {String} cwd   directory to operate in
 */
exports.pull = function(app, dburl, cwd){
    console.log(arguments);
};

/**
 * Push code & attachments into couchdb, watch for changes
 * @param  {Object} app   the app object
 * @param  {String} dburl The couch URL
 * @param  {String} cwd   directory to operate in
 */
exports.watch = function(app, dburl, cwd){
    console.log(arguments);
};
