var _ = require('underscore')
  , jsp = require('uglify-js').parser
  , pro = require('uglify-js').uglify;

// Provides middleware to add and render scripts.
module.exports.middleware = function(options, js_src, css_src){
  // Allow args as string.
  if (typeof options === 'string') {
    options = {
      src: options
      , js_src: js_src
      , css_src: css_src
    };
  }

  // Fallback to defaults where necessary.
  _.defaults(options, {
    src: '/var/www/public'
    , js_src: '/javascripts'
    , css_src: '/stylesheets'
  });
  
  // Return our middleware handler.
  return function(req, res, next) {
    res.scripts = [];
    res.styles = [];

    // Handle minification.
    function minify(input) {
      var ast = jsp.parse(input);
      ast = pro.ast_mangle(ast);
      ast = pro.ast_squeeze(ast);
      return pro.gen_code(ast);
    }

    // More direct way to add assets.
    res.addAsset = function(type, opts) {
      var ext = (type === 'script') ? '.js' : '.css';

      // Merge options with defaults.
      _.defaults(opts, {
        type: (type === 'script') ? 'text/javascript' : 'text/css'
        , content: null
        , src: null
        , remote: false
      });

      // Files require some extra manipulation.
      if (opts.src) {
        // Make sure the file extension is there..
        if (opts.src.indexOf(ext) < 0) {
          opts.src = opts.src+ext;
        }

        // Identify remote files.
        if (opts.src.indexOf('://') >= 0) {
          opts.remote = true;
        } else {
          opts.src = options[type === 'script' ? 'js_src' : 'css_src']+'/'+opts.src;
        }
      }

      // Javascript content can be supplied as an anonymous function.
      if (type === 'script' && typeof opts.content === 'function') {
        var val = opts.content.toString();
        opts.content = val.substring(val.indexOf("{") + 1, val.lastIndexOf("}"));
      }

      // Push item to specified asset list.
      this[type+'s'].push(opts);
    }
    
    // Add some helpers to res.
    res.addScript = function(val){ res.addAsset('script', { content: val }); return this; };
    res.addScriptFile = function(file){ res.addAsset('script', { src: file }); return this; };
    res.addStyle = function(val){ res.addAsset('style', { content: val }); return this; };
    res.addStyleFile = function(file){ res.addAsset('style', { src: file }); return this; };

    // Render scripts.
    res.javascripts = function(min){
      var ret = [];
      res.scripts.forEach(function(script) {
        ret.push(
          script.src
            ? '<script type="text/javascript" src="'+script.src+'"></script>'
            : '<script type="text/javascript">'+(min ? minify(script.content) : script.content)+'</script>'
        );
      });
      return ret.join('');
    };

    // Render styles.
    res.stylesheets = function(){
      var ret = [];
      res.styles.forEach(function(style) {
        ret.push(
          style.src
            ? '<link rel="stylesheet" href="'+style.src+'" />'
            : '<style type="text/css">'+style.content+'</style>'
        );
      });
      return ret.join('');
    };
    
    // Allow adding of new scripts from within a view.
    res.local('addAsset', res.addAsset);
    res.local('addScript', res.addScript);
    res.local('addScriptFile', res.addScriptFile);
    res.local('addStyle', res.addStyle);
    res.local('addStyleFile', res.addStyleFile);
    res.local('javascripts', res.javascripts);
    res.local('stylesheets', res.stylesheets);
    
    next();
  }
};