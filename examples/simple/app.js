var app = {
    "_id": '_design/app',
    "rewrites": [{
        "from": "/",
        "to": 'index.html'
    }, {
        "from": "/api",
        "to": '../../'
    }, {
        "from": "/api/*",
        "to": '../../*'
    }, {
        "from": "/*",
        "to": '*'
    }]
};

app.views = {
    "getByType" : {
        "map": function (doc) {
            if (!doc.type) return;
            emit(doc.type, null);
        }
    },
    "getByTypeFull" : {
        "map": function (doc) {
            if (!doc.type) return;
            emit(doc.type, doc);
        }
    }
};

app.validate_doc_update = function(newDoc, oldDoc, userCtx) {
    if(newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
        throw "Only admin can delete documents on this database.";
    }
};


app.attachments = 'pub';

// for a super simple index.html-only app:
// app.attachments = 'index.html';

module.exports = app;
