#! /usr/bin/env node

const requestPromise = require('request-promise');
const fs = require('fs');
const chalk = require('chalk');
const parseString = require('xml2js').parseString;
const id = 1;
const json = {};
const result = [];
const yargs = require('yargs')
    .alias('il', 'idLimit')
    .argv
const idLimit = yargs.idLimit;

if (!idLimit) {
    throw new Error('No ha especificado un id límite para la descarga');
}
getGames(id);

/**
 * Obtiene los juegos hasta un id limite
 * 
 * @param {any} id 
 */
function getGames(id) {
    let options = {
        method: 'GET',
        uri: 'http://thegamesdb.net/api/GetGame.php?id=' + id
    };
    requestPromise(options)
        .then((body) => {
            parseString(body, (err, json) => {
                if (err) throw new Error(chalk.red(err));
                if (json && json.Data && json.Data.Game) {
                    result.push(json.Data.Game[0]);
                    console.log(chalk.green('Descargado el juego con id ', id));
                } else {
                    console.log(chalk.red('No esta disponible el juego con id ', id));
                }
            })
            id++;
            if (id <= idLimit) getGames(id);
            else {
                if (!fs.existsSync('./mocks/')) {
                    fs.mkdirSync('./mocks/');
                }
                fs.writeFileSync('./mocks/games.json', JSON.stringify(result));
                console.log(chalk.green('Ha finalizado correctamente'))
            }

        })
        .error((err) => {
            throw new Error(chalk.red(err));
        })
}