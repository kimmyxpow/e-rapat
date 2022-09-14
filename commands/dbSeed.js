require('../database/connection')
const fs = require('fs')
const rl = require('readline')
const chalk = require('chalk')
const shell = require('shelljs')
const prettier = require('prettier')
const mongoose = require('mongoose')

async function dbSeed(options) {
    try {
        const { p } = options

        if (p) {
            let seeder = require(`../database/seeder/${p}`)
            await seeder()
            console.log(chalk.green(`Berhasil melakukan seed ` + chalk.blue(p)))
        } else {
            let files = fs.readdirSync('database/seeder');
            for (let i = 0; i < files.length; i++) {
                let seeder = require(`../database/seeder/${files[i]}`)
                await seeder()
                console.log(chalk.green(`Berhasil melakukan seed ` + chalk.blue(files[i])))
            }
        }

        process.exit()
    } catch (error) {
        console.log(error.message)
        process.exit()
    }
}

module.exports = dbSeed
