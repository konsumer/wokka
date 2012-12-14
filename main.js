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
        watchr = require('watchr'),
        UglifyJS = require('uglify-js'),
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

    if (u.auth){
        u.hostname = u.auth + '@' + u.hostname;
    }

    var db = new(cradle.Connection)(u.protocol + '//' + u.hostname, u.port, {cache:false, raw:true}).database(u.path.slice(1));
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
        var body = fs.readFileSync(file);
        attachments[name] = {
            'content_type': mime.lookup(path.join(dir, file)),
            'data': body.toString('base64')
        };
        icallback();
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
                            i++; if (i == files.length) callback(attachments);
                        });
                    }else{
                        i++; if (i == files.length) callback(attachments);
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
 * @param  {String} cwd   directory to operate in
 */
exports.push = function(app, dburl, cwd){
    var db = getdb(dburl, function(err, db){
        if (err) throw(err);
        var doc = _.extend({}, app);
        delete doc.attachments;
        if (app.attachments){
            exports.attach(path.join(cwd, app.attachments), function(attachments){
                doc['_attachments'] = attachments;
                db.save(app['_id'], doc, function(err, res){
                    if (err) throw(err.error + ' : ' + err.reason);
                });
            });
        }else{
            db.save(app['_id'], doc, function(err, res){
                if (err) throw(err.error + ' : ' + err.reason);
            });
        }
    });
};

/**
 * Pull app from couchdb
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
 * Push app into couchdb, watch for changes
 * @param  {Object} app   the app object
 * @param  {String} dburl the couch URL
 * @param  {String} cwd   directory to operate in
 */
exports.watch = function(app, dburl, cwd){
    console.log('Watching ', cwd);
    exports.push(app, dburl);

    var file;

    // Watch a directory or file
    watchr.watch({
        path: cwd,
        ignoreHiddenFiles: true,
        listener: function(eventName,filePath,fileCurrentStat,filePreviousStat){
            console.log('updating.');
            exports.push(app, dburl);
        },
        next: function(err,watcher){
            if (err)  throw err;
        }
    });
};
