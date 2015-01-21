'use strict';

var path = require('path');
var spawn = require('child_process').spawn;
var inquirer = require('inquirer');
var pkg = require(path.join(process.cwd(), 'package.json'));

var defaultCommands = ['test', 'install', 'start'];
var commands = pkg.scripts ? Object.keys(pkg.scripts) : [];

inquirer.prompt([
  {
    type: 'list',
    name: 'command',
    message: 'Select a package.json script command to run, e.g. npm run [command].',
    default: 'start',
    choices: mergeDefaultCommands(commands, defaultCommands)
  }
], function(answers) {
  var args = [answers.command];

  if (defaultCommands.indexOf(answers.command) === -1) {
    args = args.unshift('run');
  }

  spawn('npm', args, { stdio: 'inherit' });
});

function mergeDefaultCommands(commands, defaultCommands) {
  defaultCommands.forEach(function (item) {
    if (commands.indexOf(item) === -1) {
      commands.push(item);
    }
  });

  return commands;
}
