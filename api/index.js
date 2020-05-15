const express = require('express');
const app = express(); 
const port = 3000; 
const dbSource = "data/chinook.db";
const adapter= require('./db');
app.get('/', (req, res) => { res.send('Hello world!')});
app.get('/dump', (req, res) => {
    console.log('Received dump request')
    let dao = new adapter(dbSource);
    let r = dao.dump(); 
    if(r){
        res.send(r);
    }else{
        res.send('No data');
    }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));