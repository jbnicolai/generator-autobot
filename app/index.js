'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var AutobotGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.npmInstall();
        this.installDependencies(function (res) {
          if (!res) {
            return;
          }
        });
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    console.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    console.log(chalk.magenta('You\'re using the fantastic Mason Digital\'s Autobot generator.'));

    var prompts = [{
      name: 'siteName',
      message: 'What is the name of your new project?'
    }, {
      type: 'confirm',
      name: 'includeJQuery',
      message: 'Do you want to include jQuery?',
      default: true
    }, {
      type: 'list',
      name: 'jQueryVersion',
      message: 'What version do you want to include?' + '\n' + '(Remember, jQuery 2.x has no support for lte IE8)',
      choices: [{
        name: 'jQuery 1.x',
        value: '1x'
      }, {
        name: 'jQuery 2.x',
        value: '2x'
      }],
      default: '2x',
      when: function (props) {
        return props.includeJQuery;
      }
    }, {
      type: 'confirm',
      name: 'includeModernizr',
      message: 'Do you want to include Modernizr?',
      default: true
    }, {
      type: 'confirm',
      name: 'includeAngular',
      message: 'Do you want to include Angular?',
      default: true
    }, {
      type: 'confirm',
      name: 'includeCoffeeScript',
      message: 'Do you want to include CoffeeScript?',
      default: true
    }, {
      type: 'confirm',
      name: 'includeSASS',
      message: 'Do you want to include SASS?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.siteName = props.siteName;
      this.includeJQuery = props.includeJQuery;
      this.jQueryVersion = props.jQueryVersion;
      this.includeModernizr = props.includeModernizr;
      this.includeAngular = props.includeAngular;
      this.includeCoffeeScript = props.includeCoffeeScript;
      this.includeSASS = props.includeSASS;

      done();
    }.bind(this));
  },

  app: function () {

    this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
    this.indexFile = this.engine(this.indexFile, this);

    this.mkdir('app');
    this.mkdir('app/styles');
    this.mkdir('app/scripts');
    this.mkdir('app/images');
    this.mkdir('app/fonts');

    if (this.includeCoffeeScript) {
      this.copy('main.coffee', 'app/scripts/main.coffee');
      if (this.includeAngular) {
        this.copy('app.coffee', 'app/scripts/app.coffee');
        this.copy('directives.coffee', 'app/scripts/directives.coffee');
        this.copy('controllers.coffee', 'app/scripts/controllers.coffee');
        this.write('app/scripts/services.coffee',
          'app/scripts/filters.coffee');
      }
    } else {
      this.copy('main.js', 'app/scripts/main.js');
      if (this.includeAngular) {
        this.copy('app.js', 'app/scripts/app.js');
        this.copy('directives.js', 'app/scripts/directives.js');
        this.copy('controllers.js', 'app/scripts/controllers.js');
        this.write('app/scripts/services.js',
          'app/scripts/filters.js');
      }
    }

    if (this.includeSASS) {
      this.copy('styles.scss', 'app/styles/styles.scss');
      this.copy('reset.scss', 'app/styles/reset.scss');
    } else {
      this.copy('styles.css', 'app/styles/styles.css');
    }

    this.write('app/index.html', this.indexFile);
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('.htaccess', 'app/.htaccess');
    this.copy('jshintrc', '.jshintrc');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = AutobotGenerator;
