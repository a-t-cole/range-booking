const express = require('express');
const bodyParser = require("body-parser");
const moment = require('moment');
const app = express(); 
const port = 3000; 
const dbSource = "data/bookings.db";
const logFile = "data/log.txt";
const fs = require('fs');
const adapter= require('./db');
const dateFormatString = 'YYYY-MM-DD HH:mm:ss'
function errorHandler(err, req, res, next){
    //If an exception is thrown parsing the request body the scope of the error is the folder above
    let filePath = fs.existsSync(logFile) ? logFile : 'api/'+logFile; 
    let stream = fs.createWriteStream(filePath , {flags: 'a'});
    stream.on('error', function(err){
        console.log(err);
        stream.end(); 
    });
    stream.write(`${new Date().toISOString()} - ${req.originalUrl || 'Unknown URL'} - ${err} \r\n`, (err)=>{
        if(err){
            console.log(err);
        }
    });
    
    stream.end(); 
    res.status(500).send({error: 'Could not complete request'});
}
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(errorHandler)
app.get('/', (req, res) => { res.send('Hello world!')});
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
app.post('/getreservations', (req, res, next) => {
    let startDate = req.body.startDate || '';
    let endDate = req.body.endDate ||'';
    if(!startDate){
        res.status(400).send('Start date not defined');
    }else if(!Date.parse(startDate)){
        res.status(400).send('Could not parse start date');
    }
    else{
        startDate = new moment(startDate).format(dateFormatString);
    }
    // if(!endDate){
    //     res.status(400).send('End date not defined');
    // }else if(!Date.parse(endDate)){
    //     res.status(400).send('Could not parse end date');
        
    // }else{
    //     endDate = new moment(endDate).format(dateFormatString);
    // }
    let dao = new adapter(dbSource);
    dao.getreservations(startDate).then((r) =>{
        res.send(r);
    }).catch((e) => {
        next(e);
    });
    
});
app.get('/getdb', (req, res, next) =>{
    res.download('data/bookings.db', 'bookings.db');
});
app.listen(port, () => {
    let dao = new adapter(dbSource);
    dao.init(); 
    console.log(`Example app listening at http://localhost:${port}`);
});
