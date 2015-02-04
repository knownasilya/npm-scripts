'use strict';

var cli = require('ltcdr');
var path = require('path');
var spawn = require('child_process').spawn;
var mothership = require('mothership');
var inquirer = require('inquirer');
var pkg = require('./package');

var packRes = mothership.sync(process.cwd(), function (pack) {
  return pack.name;
});
var targetPkg = packRes.pack;
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
      var possible = allCommands.filter(function (possibleCommand) {
        return possibleCommand.indexOf(command) === 0;
      });

      if (possible.length === 1) {
        console.log('Shortcut used for `' + possible[0] + '`.');
        runCommand(possible[0]);
      }
      else if (possible.length > 1) {
        console.log('Command not found, did you mean one of these: ' + possible.join(', ') + '?');
      }
      else {
        console.log('Command \'' + command + '\' doesn\'t exist in this project, try `ns` instead.');
      }
    }
  });

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

function runCommand(command) {
  var args = [command];

  if (defaultCommands.indexOf(command) === -1) {
    args.unshift('run');
  }

  //console.log('Running `npm ' + args.join(' ') + '` command.');

  return spawn('npm', args, { stdio: 'inherit' });
}

function mergeDefaultCommands(commands, defaultCommands) {
  defaultCommands.forEach(function (item) {
    if (commands.indexOf(item) === -1) {
      commands.push(item);
    }
  });

  return commands;
}
