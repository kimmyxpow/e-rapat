const fs = require('fs')
const chalk = require('chalk')
const shell = require('shelljs')
const prettier = require('prettier')

function makeController(name, options) {
    try {
        const { m, s, c, r } = options
        const modelFile = `app/model/${name}.js`
        const schemaFile = `database/schema/${name}Schema.js`
        const controllerFile = `app/controller/${name}Controller.js`
        const seederFile = `database/seeder/${name}Seeder.js`
        const routeFile = `routes/${name}Route.js`

        fs.writeFileSync(
            modelFile,
            prettier.format(
                `const mongoose = require('mongoose')
                const ${name}Schema = require('../../${schemaFile}')

                const ${name} = mongoose.model('${name}', ${name}Schema)

                module.exports = ${name}`,
                { parser: 'babel' }
            )
        )

        console.log(
            chalk.green(`Model berhasil dibuat: `) + chalk.blue(modelFile)
        )

        if (m) {
            fs.writeFileSync(
                schemaFile,
                prettier.format(
                    `const mongoose = require('mongoose')

                    const ${name}Schema = new mongoose.Schema(
                    {
                        //
                    },
                    { timestamps: true }
                    )

                    module.exports = ${name}Schema`,
                    { parser: 'babel' }
                )
            )

            console.log(
                chalk.green(`Schema berhasil dibuat: `) + chalk.blue(schemaFile)
            )
        }

        if (s) {
            fs.writeFileSync(
                seederFile,
                prettier.format(
                    `const mongoose = require('mongoose')
                    const ${name} = require('../../${modelFile}')

                    const ${name}Seeder = async () => {
                        //
                    }

                    module.exports = ${name}Seeder`,
                    { parser: 'babel' }
                )
            )

            console.log(
                chalk.green(`Seeder berhasil dibuat: `) + chalk.blue(seederFile)
            )
        }

        if (c) {
            fs.writeFileSync(
                controllerFile,
                prettier.format(
                    `const ${name} = require('../../${modelFile}')
                    
                     async function index(req, res, next) {
                        try {
                            //
                        } catch (err) {
                            console.error('Error', err.message)
                            next(err)
                        }
                    }
                    
                     async function store(req, res, next) {
                        try {
                            //
                        } catch (err) {
                            console.error('Error', err.message)
                            next(err)
                        }
                    }
                    
                     async function update(req, res, next) {
                        try {
                            //
                        } catch (err) {
                            console.error('Error', err.message)
                            next(err)
                        }
                    }
                    
                     async function destroy(req, res, next) {
                        try {
                            //
                        } catch (err) {
                            console.error('Error', err.message)
                            next(err)
                        }
                    }
                    
                    module.exports = {
                        index, store, update, destroy
                      }`,
                    { parser: 'babel' }
                )
            )

            console.log(
                chalk.green(`Controller berhasil dibuat: `) + chalk.blue(controllerFile)
            )
        }

        if (r) {
            fs.writeFileSync(
                routeFile,
                prettier.format(
                    `const express = require('express');
                    const router = express.Router();
                    const ${name}Controller = require('../${controllerFile}');
                    
                    router.get('/', ${name}Controller.index);
                    
                    router.post('/', ${name}Controller.store);
                    
                    router.put('/:id', ${name}Controller.update);
                    
                    router.delete('/:id', ${name}Controller.destroy);
                    
                    module.exports = router;`,
                    { parser: 'babel' }
                )
            )

            console.log(
                chalk.green(`Route berhasil dibuat: `) + chalk.blue(routeFile)
            )
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = makeController
