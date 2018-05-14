#! /usr/bin/env node

const requestPromise = require('request-promise');
const fs = require('fs');
const chalk = require('chalk');
const parseString = require('xml2js').parseString;
const id = 1;
const result = [];
const yargs = require('yargs')
    .alias('id', 'idPlatform')
    .argv
const idPlatform = yargs.idPlatform;

if (!idPlatform) {
    throw new Error('No ha especificado un id de plataforma');
}

getPlatfomGames(idPlatform);

/**
 * ID de la plataforma
 * 
 * @param {number} idPlatform 
 */
function getPlatfomGames(idPlatform) {
    let options = {
        method: 'GET',
        uri: 'http://thegamesdb.net/api/GetPlatformGames.php?platform=' + idPlatform
    };
    requestPromise(options)
    .then((body) => {
        parseString(body, (err, json) => {
            if (err) throw new Error(chalk.red(err));
            else {
                console.log('hola bbeb');
                if (json && json.Data && json.Data) {
                    if (!fs.existsSync('./mocks/')){
                        fs.mkdirSync('./mocks/');
                    }
                    fs.writeFileSync('./mocks/platformGames.json', JSON.stringify(json.Data));
                    console.log(chalk.green('Ha finalizado correctamente'))
                } else {
                    console.log(chalk.red('No existe ninguna plataforma con el id ', idPlatform));
                }
            }
        })
    })
    .error((err) => {
        throw new Error(chalk.red(err));
    })
}
