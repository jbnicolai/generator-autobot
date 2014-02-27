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
      message: 'What version do you want to include?' + '\n\n' + '(Remember, jQuery 2.x has no support for lte IE8)',
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
    }];

    this.prompt(prompts, function (props) {
      this.siteName = props.siteName;
      this.includeJQuery = props.includeJQuery;
      this.jQueryVersion = props.jQueryVersion;

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

    this.write('app/index.html', this.indexFile);
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = AutobotGenerator;