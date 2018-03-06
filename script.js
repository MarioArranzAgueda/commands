const request = require('request');
const requestPromise = require('request-promise');
const fs = require('fs');
const chalk = require('chalk');
const parseString = require('xml2js').parseString;
const id = 1;
const json = {};
const result = [];


getGames(id);

function getGames(id) {
    let options = {
        method: 'GET',
        uri: 'http://thegamesdb.net/api/GetGame.php?id=' + id
    };
    requestPromise(options)
    .then((body) => {
        parseString(body, (err, json) => {
            if (json && json.Data && json.Data.Game) {
                result.push(json.Data.Game[0]);
            }
        })
        id++;
        if(id < 10) getGames(id);
        else fs.writeFileSync('./games.json', JSON.stringify(result));
    })
    .error((err) => {
        throw new Error(chalk.red(err));
    })
}
