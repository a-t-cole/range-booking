const sqlite3 = require('sqlite3').verbose();

class dbAdapter{
    
    constructor(source){
        this.db = new sqlite3.Database(source, (e) => {
            if(e){
                console.log('Error connecting to db: '+e)    
            }
        });
    }
    dump(){
        this.db.serialize(() => {
            let sql = `SELECT PlaylistId as id,
                             Name as name
                      FROM playlists`;
            // this.db.each(`SELECT PlaylistId as id,
            //                 Name as name
            //          FROM playlists`, (err, row) => {
            //   if (err) {
            //     console.error(err.message);
            //   }
            //   console.log(row.id + "\t" + row.name);
            // });
            this.db.all(sql,[],  (err, rows) => {
                if(err){
                    throw err; 
                }
                return rows; 
            });
          });
          
          this.db.close((err) => {
            if (err) {
              console.error(err.message);
            }
            //console.log('Close the database connection.');
          });
        
    }
}

module.exports = dbAdapter; 