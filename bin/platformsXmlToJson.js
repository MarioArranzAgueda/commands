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
getPlatforms(id);


function getPlatforms(id) {
    let options = {
        method: 'GET',
        uri: ' http://thegamesdb.net/api/GetPlatform.php?id=' + id
    };
    requestPromise(options)
    .then((body) => {
        parseString(body, (err, json) => {
            if(err) throw new Error(chalk.red(err));
            else {
                if (json && json.Data && json.Data.Platform) {
                    result.push(json.Data.Platform[0]);
                    console.log(chalk.green('Descargada la plataforma con id ', id));
                } else {
                    console.log(chalk.red('No esta disponible la plataforma con id ', id));
                }
            }
        })
        id ++;
        if(id <= idLimit) getPlatforms(id);
        else {
            if (!fs.existsSync('./mocks/')){
                fs.mkdirSync('./mocks/');
            }
            fs.writeFileSync('./mocks/platforms.json', JSON.stringify(result));
            console.log(chalk.green('Ha finalizado correctamente'))
        } 
            
    })
    .error((err) => {
        throw new Error(chalk.red(err));
    })
}
