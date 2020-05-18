const express = require('express');
const bodyParser = require("body-parser");
const app = express(); 
const port = 3000; 
const dbSource = "data/bookings.db";
const logFile = 'data/log.txt';
const fs = require('fs');
const adapter= require('./db');
function errorHandler(err, req, res, next){
    let stream = fs.createWriteStream(logFile, {flags: 'a'});
    stream.write(`${new Date().toISOString()} - ${req.originalUrl || 'Unknown URL'} - ${err} \r\n`);
    stream.end(); 
    res.status(500).send({error: 'Could not complete request'});
}
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(errorHandler)
app.get('/', (req, res) => { res.send('Hello world!')});
app.get('/dump', (req, res, next) => {
    console.log('Received dump request')
    let dao = new adapter(dbSource);
    dao.dump()
    .then((r) => {
        if(r){
            res.send(r);
        }else{
            res.send('No data');
        }
    }).catch((e) => {
        next(e);
    }); 
    
});
app.post('/adduser', (request, response, next) => {
    let name = request.body.username || ''; 
    if(name){
        let dao = new adapter(dbSource);
        dao.addUser(name).then((r) => {
            response.send("Success");
        }).catch((e) => {
            next(e); 
        });
    }
});
app.post('/addtarget', (request, response, next) => {
    let name = request.body.targetname || ''; 
    if(name){
        let dao = new adapter(dbSource);
        dao.addTarget(name).then((r) => {
            response.send("Success");
        }).catch((e) => {
            next(e); 
        });
    }
});
app.get('/getusers', (req, res, next) => {
    let dao = new adapter(dbSource);
    dao.getUsers()
    .then((r) => {
        res.send(r);
    }).catch((e) => {
        next(e);
    }); 
    
});
app.get('/gettargets', (req, res, next) => {
    let dao = new adapter(dbSource);
    dao.getTargets()
    .then((r) => {
        res.send(r);
    }).catch((e) => {
        next(e);
    }); 
    
});
app.post('/getuserbyid', (req, res, next) => {
    let id = req.body.id || null;
    if(!id){
        res.status(400).send('No user id requested');
    }
    let dao =new adapter(dbSource);
    dao.getUserById(id).then(r => {
        if(r){
            res.send(r);
        }else{
            res.send(null);
        }
    })
    .catch((e) => {
        next(e);
    });
});
// app.post('/getReservations', (req, res, next) => {
//     let startDate = req.body.startDate || '';
//     let endDate = req.body.endDate ||'';
//     if(!startDate){
//         res.status(400).send('Start date not defined');
//     }else if(!endDate){
//         res.status(400).send('End date not defined');
//     }
//     let dao = new adapter(this.dbSource);
    
// });
app.get('/getdb', (req, res, next) =>{
    res.download('data/bookings.db', 'bookings.db');
});
app.listen(port, () => {
    let dao = new adapter(dbSource);
    dao.init(); 
    console.log(`Example app listening at http://localhost:${port}`);
});
