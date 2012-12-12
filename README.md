# wokka

![Fonzzy Bear][fozzy]

Simple couchapp deployment tool

## Motivation

I love [couchapp][couchapp] & [kanso][kanso], but I was annoyed with being forced into [couchapp][couchapp]/[kanso][kanso] paradigms, file-layouts & ideas.  I want to just make a design doc that has all the stuff in it, in files layed-out like a node app, and not have to do too much to get it pushed into a [couchdb][couchdb]. I also want targets, so I can push code to different [couchdb][couchdb]s easily. I want to be able to make single-file quickie-apps, and 1000-file apps the same way. Let's do this!

## Couchapp?

You should probably read a lot about [couchdb][couchdb]. It's pretty rad, and this project is just a handy way to build an app using it.

You can read more about the general concept, [here](http://couchapp.org/).

This will help you keep your code & data in the same [couchdb][couchdb], for easy replication, scaling, deployment, versioning, etc.

Checkout the [examples dir][examples] for some ready-to-go bootstrapped project-layouts. Also, feel free to ignore my layout, and do it some other way.

## Installation

### Install global, if you want:
    sudo npm install -g wokka

Now, you will ahev `wokka` in your path.

### Download file & add to package.json:

    npm install --save wokka

Now, you can put it in your [package.json script declarations][script_ref] so your end-users don't have to install it, globally. Here is a cool example for a watcher that uploads to server (put this in your package.json:)


    {
        "scripts": {
            "start": "wokka watch"
        }
    }


So, in your README:

    To install dependencies, type `npm install`
    To deploy to your local couchdb and watch for file changes, type `npm start`

Whoah! Cool!


## Usage

You can get some super-duper help with:

    wokka --help

Here is a quick usage example:

    wokka -c http://0.0.0.0:5984/wokka-wokka-wokka watch

This will watch for file changes, and push your app into a local couch db named "wokka-wokka-wokka"


## Targets

Targets make it easier to remember the syntax. You don't have to rememebr the URLs of your [couchdb][couchdb]s. They are optional, but save me lots of time/mistakes, I'm sure.

Edit your projects .wokka.json to look like this:

    {
        "target": {
            "default": {
                "db": "http://0.0.0.0:5984/wokka_app"
            }
        }
    }

This will make the default target your local [couchdb][couchdb]. To push your app, do this:

    wokka push


You can add any targets you want, just make them like default. Here is a more complex example:

    {
        "target": {
            "default": {
                "db": "http://0.0.0.0:5984/wokka_app"
            },
            "dev": {
                "db": "https://konsumer:SECRET@konsumer.cloudant.com/wokka_app_development"
            },
            "int": {
                "db": "https://konsumer:SECRET@konsumer.cloudant.com/wokka_app_integration"
            }
            "prod": {
                "db": "https://konsumer:SECRET@konsumer.cloudant.com/wokka_app_production"
            }
        }
    }

On [cloudant][cloudant], I make the (free!) databases, and I'm all set!

Now, you can deploy to a shared-dev (show other project members what you are working on) environment with this command:

    wokka push dev

You can deploy to an integration envionment (for testing and client-shows)

    wokka push int

And to production website (the [couchdb][couchdb] with the domain vhost stuff setup) with:

    wokka push prod


[couchapp]: https://github.com/mikeal/node.couchapp.js
[kanso]: http://kan.so/
[couchapp]: http://kan.so/
[cloudant]: https://cloudant.com/
[script_ref]: https://npmjs.org/doc/scripts.html
[couchdb]: http://couchdb.apache.org/

[examples]: https://github.com/konsumer/wokka/blob/master/examples
[fozzy]: http://images2.wikia.nocookie.net/__cb20101016002719/muppet/images/9/98/Fozziehole.jpg "Ahh, a bear in his natural habitat - a Studebaker."
