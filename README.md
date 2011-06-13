express-asset
=============

Add a simple asset manager to express for adding and rendering script and style elements.

Usage
=====

Attach the middleware to express and serve your static files however you like.

    app.use(require('express-asset').middleware({
      js_src: '/javascripts'
      , css_src: '/stylesheets'
    }));

This adds several functions to to the response object and to view locals;

Adding assets
=============

res.addScript(string or anonymous function containing script content)
res.addScriptFile(remote url or local filename, with or without extension)
res.addStyle(string containing style content)
res.addStyleFile(remote url or local filename, with or without extension)

Rendering assets
================

res.javascripts(enable minification)
res.stylesheets()

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