const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const user_create = `CREATE TABLE IF NOT EXISTS [users](
    UserId INTEGER PRIMARY KEY AUTOINCREMENT, 
    Name TEXT NOT NULL ON CONFLICT IGNORE
)`;
const targets_create = `CREATE TABLE IF NOT EXISTS [targets](
  TargetId INTEGER PRIMARY KEY AUTOINCREMENT, 
  Name TEXT NOT NULL ON CONFLICT IGNORE
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
    _source = "";
    constructor(source){
        this._source = source; 
        this.db = new sqlite3.Database(source, function(e){
            if(e){
                console.log('Error connecting to db: '+e)
                //throw e;     
            }
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
                let sql = `INSERT OR IGNORE INTO users(Name) 
                VALUES(?)`
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
    addTarget(name){
        return new Promise((resolve, reject) => {
            if(name){
                let sql = `INSERT OR IGNORE INTO targets(Name) 
                VALUES(?)`
                this.db.run(sql, [name], function(r, err){
                    if(err){
                        console.log(err);
                        reject('Could not insert target into database');
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
    getTargets(){
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                let sql = `SELECT TargetId as id,
                                    Name as name
                            FROM targets`;
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
    getreservations(startDate){
        return new Promise((resolve, reject) => {
            let sql = `SELECT reservations.ResId, users.Name as User, targets.Name as Target, reservations.StartTime, reservations.EndTime FROM reservations INNER JOIN users ON users.UserId = reservations.fkUserId INNER JOIN targets ON targets.TargetId = reservations.fkTargetId WHERE (julianday(StartTime) > julianday(?) AND julianday(EndTime) > julianday(?)) OR (julianday(StartTime) < julianday(?) AND julianday(EndTime) > julianday(?))`;
            this.db.serialize(() => {
                this.db.all(sql,[startDate, startDate, startDate, startDate],  (err, rows) => {
                    if(err){
                        reject(err); 
                    }
                    if(rows){
                        resolve(rows); 
                    }
                });
            });    
            this.db.close();         
        });
    }
    addreservation(userId, targetId, startDate, endDate){
        return new Promise((resolve, reject) => {
            let rejectMessage = "";
            if(!userId){
                rejectMessage = "UserId";
            }else if(!targetId){
                rejectMessage = "TargetId";
            }else if(!startDate){
                rejectMessage ="Start Date";
            }else if(!endDate){
                rejectMessage = "End Date";
            }
            if(rejectMessage){
                reject(`No ${rejectMessage} specified`);
            }
            let sql = `INSERT INTO reservations(fkUserId, fkTargetId, StartTime, EndTime)
            VALUES(?,?,?,?)`
            this.db.run(sql, [userId, targetId, startDate, endDate], (err)=> {
                if(err){
                    reject(err);
                }else{
                    resolve(this.lastID);
                }
            });
            this.db.close(); 
        });
    }
}

module.exports = dbAdapter; 