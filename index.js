'use strict';

var cli = require('ltcdr');
var path = require('path');
var spawn = require('child_process').spawn;
var inquirer = require('inquirer');
var pkg = require('./package');

var targetPkg = loadTargetPackage();
var defaultCommands = ['test', 'install', 'start'];
var commands = targetPkg.scripts ? Object.keys(targetPkg.scripts) : [];
var allCommands = mergeDefaultCommands(commands, defaultCommands);

cli
  .version(pkg.version)
  .usage('[command|run shell-code]');

cli
  .command('*')
  .description('Run an arbitrary script without `npm run [command]`.')
  .action(function (command) {
    if (allCommands.indexOf(command) > -1) {
      runCommand(command);
    }
    else {
      console.log('Command \'' + command + '\' doesn\'t exist in this project, try `ns` instead.');
    }
  });

function mergeDefaultCommands(commands, defaultCommands) {
  defaultCommands.forEach(function (item) {
    if (commands.indexOf(item) === -1) {
      commands.push(item);
    }
  });

  return commands;
}

function runCommand(command) {
  var args = [command];

  if (defaultCommands.indexOf(command) === -1) {
    args.unshift('run');
  }

  //console.log('Running `npm ' + args.join(' ') + '` command.');

  return spawn('npm', args, { stdio: 'inherit' });
}

function loadTargetPackage() {
  try {
    return require(path.join(process.cwd(), 'package.json'));
  } catch(e) {
    return {};
  }
}

cli.parse(process.argv);

if (process.argv.length === 2) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'command',
      message: 'Select a package.json script command to run, e.g. npm run [command].',
      default: 'start',
      choices: mergeDefaultCommands(commands, defaultCommands)
    }
  ], function(answers) {
    runCommand(answers.command);
  });
}
