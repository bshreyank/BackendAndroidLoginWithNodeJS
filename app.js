const express =  require('express')
const app = express()

const mongoClient = require('mongodb').MongoClient

const url = "mongodb://localhost.27017"

app.use(express.json())

mongoClient.connect(url, (err,db)=>{
    if(err){
        console.log("Error while connecting mongo Client")
    } else{
        //if the database with this name is not created it will create it automatically!
        const myDb = db.db('myDb')

        // create a table
        const collection = myDb.collection('myTable')

        app.post('/signup',(req, res)=>{

            const newUser = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }

            const query = {email: newUser.email}

            collection.findOne(query,(err,result)=>{

                if(result == null){
                    collection.insertOne(newUser, (err, result)=>{
                        res.status(200).send()
                    })
                }else{
                    res.status(400).send()
                }
            })
        })

        app.post('/login',(req,res) =>{
            const query = {
                email: req.body.email,
                password: req.body.password
            }

            collection.findOne(query, (err, result)=>{
                if(result != null){
                    const objToSend = {
                        name : result.name,
                        email: result.email
                    }

                    // send the above object to android client!
                    res.status(200).send(JSON.stringify(objToSend))
                }else{
                    res.status(404).send()
                }
            })
        })

    }
})

app.listen(3000, ()=> {
    console.log("Listening on port 3000")
})