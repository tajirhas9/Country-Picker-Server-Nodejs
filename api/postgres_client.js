const Pool = require('pg').Pool;

module.exports = async function(app, chalk) {
    const pool = new Pool({
        user: "postgres",
        host: "localhost",
        database: "user_country_tag",
        password: "password",
        port : 5432,
        keepAlive: true,
    });

    app.post('/new/record/', async (req, res) => {
        console.log("Recieved connection...");
        const { text, tags } = req.body;
        console.log("Recieved text: " + text);
        
        var newTextIdObj = {id: "id"};
        
        try { 
            var queryString = "INSERT INTO text(text_body) VALUES('"+text+"') RETURNING id;";
            console.log("query: " + queryString);
            
            let promise = await new Promise(function (resolve, reject){
                pool.query(queryString, (err, res) => {
                    if (err) {
                        console.log('Error saving to db: ' + err);
                        reject(0)
                    }
                    else{
                        console.log('id: ' + res.rows[0].id);
                        newTextIdObj.id = res.rows[0].id;
                        resolve("Inserted into table");
                    }
                })
            });
    
        } catch(err) {
            console.log(err);
            res.send("Error: " + err);
        }

        console.log('id: ' + newTextIdObj.id);
        
        if(newTextIdObj != null) {

            tags.forEach( async (tag) => {
                console.log("Tag: "+tag);

                try {
                    var queryString = "INSERT INTO tags(text_id, tag) VALUES("+newTextIdObj.id+", '"+tag+"');";
                    console.log("query: " + queryString);
                    let promise = await new Promise(function (resolve, reject){
                        pool.query(queryString, (err, res) => {
                            if (err) {
                                console.log('Error saving to db: ' + err);
                                reject(0)
                            }
                            else{
                                resolve("Tag inserted");
                            }
                        })
                    });
        
                } catch(err) {
                    console.log(err);
                    res.send("Error: " + err);
                }
            });
        }
        console.log("Success");
        res.sendStatus(201);
    });

}
