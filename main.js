// fancy dep-check
try{
    var fs = require('fs'), path=require('path'), ugly=require('uglify-js'), toSource = require('tosource');
}catch(e){
    console.log("Install wokka dependencies with 'npm install'.");
    process.exit(1);
}

function minify(obj, options){
    options = options || {"mangle":false, "squeeze":true};
    var jsp = ugly.parser;
    var pro = ugly.uglify;
    var ast = jsp.parse(toSource(obj));

    if (options.mangle) ast = pro.ast_mangle(ast);
    if (options.squeeze) ast = pro.ast_squeeze(ast);

    return pro.gen_code(ast, options);
}

// uglify app.js (using toSource(), so it's the whole thing)
// put attachments defined in app.js into couch
exports.push = function(app, dburl, argv){
    console.log(minify(app));
};

// grab app from couch, de-uglify and put in app.js
// grab attachments and put them in dir defined in app.js
exports.pull = function(app, dburl, argv){
    console.log(arguments);
};


exports.watch = function(app, dburl, argv){
    console.log(arguments);
};
