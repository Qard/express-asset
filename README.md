express-asset
=============

Add a simple asset manager to express for adding and rendering script and style elements.

Usage
=====

Attach the middleware to express and serve your static files however you like. Then use the add functions to add new script and style content and files.

    app.use(require('express-asset').middleware({
      js_src: '/javascripts'
      , css_src: '/stylesheets'
    }));

    app.get('/', function(req, res){
      res.addScriptFile('jquery');
      res.addScript(function(){
        $(document).ready(function(){
          console.log('This jquery was written on the server and rendered with express-asset!');
        });
      });
      res.render('index');
    });

Adding assets
=============

* res.addScript(string or anonymous function containing script content)
* res.addScriptFile(remote url or local filename, with or without extension)
* res.addStyle(string containing style content)
* res.addStyleFile(remote url or local filename, with or without extension)

Rendering assets
================

* res.javascripts(enable minification)
* res.stylesheets()

Using in views
==============

All the functions attached to the response object can also be used inside a view, for example;

    !!! 5
    html(lang="en")
      head
        title Express-Asset
        != stylesheets()
      body
        #header
          a#title(href='/') Express-Asset
        #content
          != body
        != javascripts(true)