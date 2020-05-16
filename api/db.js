const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const user_create = `CREATE TABLE IF NOT EXISTS [users](
    UserId INTEGER PRIMARY KEY AUTOINCREMENT, 
    Name TEXT NOT NULL 
)`;
const targets_create = `CREATE TABLE IF NOT EXISTS [targets](
  TargetId INTEGER PRIMARY KEY AUTOINCREMENT, 
  Name TEXT NOT NULL 
)`;

const reservation_create = `CREATE TABLE IF NOT EXISTS [reservations](
	ResId	INTEGER PRIMARY KEY AUTOINCREMENT,
	fkUserId	INTEGER NOT NULL,
	fkTargetId	INTEGER NOT NULL,
	StartTime	REAL NOT NULL,
	EndTime	REAL NOT NULL, 
	  FOREIGN KEY (fkUserId)
       REFERENCES users (UserId), 
	  FOREIGN KEY (fkTargetId)
       REFERENCES targets (TargetId)	    
)`;
class dbAdapter{
    
    constructor(source){
        this.db = new sqlite3.Database(source, (e) => {
            if(e){
                console.log('Error connecting to db: '+e)    
            }
        });
    }
    dump(){
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                let sql = `SELECT PlaylistId as id,
                                 Name as name
                          FROM playlists`;
                this.db.all(sql,[],  (err, rows) => {
                    if(err){
                        reject(err); 
                    }
                    if(rows){
                        resolve(rows); 
                    }
                });
              });
              
              this.db.close((err) => {
                if (err) {
                  console.error(err.message);
                }
                console.log('Close the database connection.');
              });
        });
    }
    init(){
        this.db.exec(user_create, (err) => {if(err){
            throw 'Could not create user table';
        }});
        this.db.exec(targets_create, (err) => {if(err){
            throw 'Could not create target table';
        }})
        this.db.exec(reservation_create, (err) => {if(err){
            throw 'Could not create reservations table';
        }})
    }
    addUser(name){
        return new Promise((resolve, reject) => {
            if(name){

                let sql = `INSERT INTO users(Name) SELECT ? WHERE NOT EXISTS (SELECT * FROM users WHERE name = ?)`
                this.db.run(sql, [name], function(r, err){
                    if(err){
                        console.log(err);
                        reject('Could not insert name into database');
                    }
                    else{
                        resolve(r); 
                    }
                }); 
                this.db.close(); 
            }else{
                reject('No name supplied to add to DB')
            }   
        });
        
    }
    getUsers(){
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                let sql = `SELECT UserId as id,
                                 Name as name
                          FROM users`;
                this.db.all(sql,[],  (err, rows) => {
                    if(err){
                        reject(err); 
                    }
                    if(rows){
                        resolve(rows); 
                    }
                });
              });
              
              this.db.close((err) => {
                if (err) {
                  console.error(err.message);
                }
              });
        });
    }
    getUserById(id){
        return new Promise((resolve, reject) => {
            if(!id){
                reject('No user id requested');
            }
            this.db.get(`SELECT UserId as id, Name as name FROM users WHERE UserId = ?`, [id], function(err, row){
                if(err){
                    reject(err);
                }else{
                    resolve(row);
                }

            })
        });
    }
}

module.exports = dbAdapter; 