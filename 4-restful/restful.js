`use strict`
 // CORE MODULES IMPORT
import fs from 'fs' 
import path from 'path' 
import { fileURLToPath } from 'url' 
import express from 'express' 
import pg from 'pg' 

// GLOBAL VARIABLE DECLARATION
const app = express(); 
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// set petsPath
const __dirname = path.dirname(fileURLToPath(import.meta.url)) 
const petsPath = path.join(__dirname,'../pets.json')
const port = 8000 

// client.connect()
// .then(()=>{
//     client.query('SELECT * FROM pets')
//     .then(result=>{
//         console.log(result.rows)
//         client.end()
//     })
// })

// PROGRAM START FUNCTION
const init=()=>{
    pool.connect()
    .then(()=>{
        //url validation
        URLError()

        //GET instance
        serverInstanceGET()

        //body validation for POST req
        postError()

        //POST instance
        serverInstancePOST()

        //DELETE instance
        serverInstanceDELETE()

        //PATCH instance
        serverInstancePATCH()

        //catchAll
        errorRes()
    })

    //listener
    app.listen(port,()=>{console.log(`Listening on ${port}`)})
}


//url Validation
const URLError=()=>{
    app.use((req,res,next)=>{
        const route = req.url.split('/')

        route[1]!=='pets'||route.length>3||parseInt(route[2])<0?
            next({message:'invalid endpoint', status: 404}):
            next()
    })
}

//get server instance
const serverInstanceGET=()=>{
    app.get(/^\/pets(.*)$/,(req,res)=>{
        const urlInput=req.params['0']

        pool.query('select * from pets')
        .then(result=>{
            urlInput[1]?
                res.send(result.rows[urlInput[1]]):
                res.send(result.rows)
        })
    })
}

const postError=()=>{
    app.use((req,res,next)=>{
        req.method!=='POST'?next():
        req.body['age']>=0&&req.body['kind']&&req.body['name']&&Object.keys(req.body).length===3?
            next():
            next({message:'invalid body content', status: 404})
    })
}

//post server instance
const serverInstancePOST=()=>{
    app.post(/^\/pets(.*)$/,(req,res)=>{
        pool.query(`insert into pets (age,kind,name) values (${req.body.age},'${req.body.kind}','${req.body.name}')`)
        res.send(req.body)
    })
}

//delete server instance
const serverInstanceDELETE=()=>{
    app.delete(/^\/pets(.*)$/,(req,res)=>{
        pool.query(`select * from pets where id=${req.params['0'][1]}`)
        .then(result=>{
            res.send(result.rows)
        })
        pool.query(`delete from pets where id=${req.params['0'][1]}`)
    })
}

//patch server instance
const serverInstancePATCH=()=>{
    app.patch(/^\/pets(.*)$/,(req,res)=>{
        for(let key in req.body){
            pool.query(`update pets set ${key}='${req.body[key]}' where id=${req.params['0'][1]}`)
        }
        pool.query(`select * from pets where id=${req.params['0'][1]}`)
        .then(result=>{
            res.send(result.rows)
        })
    })
}

//error response
const errorRes=()=>{
    app.use((err,req,res,next)=>{
        res.status(err.status).json({err:err.message,status:err.status})
    })
}


const newPool=()=>{
    const pool = new pg.Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'null',
        port: 5432
    })
    return pool
}


const pool = newPool()
init() // Run init file and start program