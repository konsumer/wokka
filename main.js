/**
 * Simple couchapp deployment tool
 */


// fancy dep-check
try{
    var url = require('url'),
        fs = require('fs'),
        path=require('path'),
        _ = require('cloneextend'),
        wrench = require("wrench"),
        cradle = require('cradle'),
        mime = require('mime');
}catch(e){
    console.log("Install wokka dependencies with 'npm install'.");
    process.exit(1);
}

/**
 * local: get couchdb instance
 * @param  {[type]}   dburl    couchdb URL
 * @param  {Function} callback called when db is setup: function(err, db)
 */
function getdb(dburl, callback){
    var u = url.parse(dburl);
    var db = new(cradle.Connection)(u.protocol + '//' + u.hostname, u.port).database(u.path.slice(1));
    db.exists(function (err, exists) {
        if (!exists){
            db.create(function(res){
                callback(err, db);
            });
        }else{
            callback(err, db);
        }
    });
}

/**
 * Given a dir-name, get all attachments in couchdb format
 * @param  {String}   dir      location of attachment files
 * @param  {Function} callback called when all attachments are loaded: function(attachments)
 */
exports.attach = function(dir, callback){
    var attachments = {};

    var worker = function(name, file, icallback){
        fs.readFile(file, function(err, body){
            attachments[name] = {
                'content_type': mime.lookup(path.join(dir, file)),
                'data': body.toString('base64')
            };
            icallback();
        });
    };

    fs.stat(dir, function(err, stats){
        if (err) throw(err);
        if (stats.isDirectory()){
            var files = wrench.readdirSyncRecursive(dir);
            var i = 0;
            files.forEach(function(file){
                fs.stat(path.join(dir, file), function(err, stats){
                    if (stats.isFile() && path.basename(file)[0] != '.'){
                        worker(file, path.join(dir, file), function(){
                            i++;
                            if (i == files.length){
                                callback(attachments);
                            }
                        });
                    }else{
                        i++;
                        if (i == files.length){
                            callback(attachments);
                        }
                    }
                });
            });
        }else{
            worker(path.basename(dir), dir, function(){
                callback(attachments);
            });
        }
    });
};

/**
 * Push app into couchdb
 * @param  {Object} app   the app object
 * @param  {String} dburl the couch URL
 */
exports.push = function(app, dburl){
    var db = getdb(dburl, function(err, db){
        if (err) throw(err);
        var doc = _.extend({}, app);
        db.save(app['_id'], doc, function(err, res){
            if (err) throw(err.error + ' : ' + err.reason);
        });
    });
};

/**
 * Pull code & attachments from couchdb
 * @param  {Object} app   the app object
 * @param  {String} dburl the couch URL
 * @param  {String} cwd   directory to operate in
 */
exports.pull = function(app, dburl, cwd){
    var db = getdb(dburl, function(err, db){
        if (err) throw(err);
        db.get(app['_id'], function(err, doc){
            attachments = _.extend({}, doc['_attachments']);
            delete doc['_attachments'];
            console.log(doc);
        });
    });
};

/**
 * Push code & attachments into couchdb, watch for changes
 * @param  {Object} app   the app object
 * @param  {String} dburl the couch URL
 * @param  {String} cwd   directory to operate in
 */
exports.watch = function(app, dburl, cwd){
    console.log(arguments);
};
