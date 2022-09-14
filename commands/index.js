#! /usr/bin/env node
const { program } = require('commander')
const makeModel = require('./makeModel')
const dbSeed = require('./dbSeed')

program
    .command('make:model <name>')
    .option('-m', 'With schema')
    .option('-s', 'With seeder')
    .option('-c', 'With controller')
    .option('-r', 'With route')
    .description('Add a new model')
    .action(makeModel)

program
    .command('db:seed')
    .option('-p <path>', 'Seeder path')
    .description('Run seeder')
    .action(dbSeed)

program.parseAsync()
