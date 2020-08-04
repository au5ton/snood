#!/usr/bin/env node

import path from 'path';
import { program, Command, Option } from 'commander';
import express from 'express';
import { UI } from 'bull-board';
import getPort from 'get-port';

import { info, error, success } from './prettyPrint';

program
  .version(process.env.npm_package_version || "")
  .description(process.env.npm_package_description || "")
  .option('--host <url>',' Use this host instead of the default.', '127.0.0.1')
  .option('--redis <connection>', 'Redis information', 'redis://127.0.0.1:6379')
  .option('--cred <string>', 'Location of .env file with credentials', path.join(__dirname, '..', '.env')) 
  .action(async (command: Command) => {    
    info(`Starting snood (${process.env.npm_package_version}) ...`)

    const app = express();
    const port = await getPort();
    app.use('/', UI);
    app.listen(port, program.host);
    info(`Listening on port: http://${program.host}:${port}`);
 
    info('Exitting...');
  })
  .parse(process.argv);

