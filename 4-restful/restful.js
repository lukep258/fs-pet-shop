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
    client.connect()
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

        client.query('select * from pets')
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
        fs.readFile(petsPath,'utf8',(err,data)=>{
            let petsArr = JSON.parse(data)

            petsArr.push(req.body)
            petsArr = JSON.stringify(petsArr)
    
            fs.writeFile(petsPath,petsArr,()=>{})
    
            res.send(req.body)
        })
    })
}

//delete server instance
const serverInstanceDELETE=()=>{
    app.delete(/^\/pets(.*)$/,(req,res)=>{
        fs.readFile(petsPath,'utf8',(err,data)=>{
            let petsArr = JSON.parse(data)
            const urlInput = req.params['0']
            const indexedPet = petsArr[urlInput[1]]

            petsArr.splice(urlInput[1],1)
            petsArr = JSON.stringify(petsArr)

            fs.writeFile(petsPath,petsArr,()=>{})

            res.send(indexedPet)
        })
    })
}

//patch server instance
const serverInstancePATCH=()=>{
    app.patch(/^\/pets(.*)$/,(req,res)=>{
        fs.readFile(petsPath,'utf8',(err,data)=>{
            let petsArr = JSON.parse(data)

            for(let key in req.body){
                petsArr[req.params['0'][1]][key]=req.body[key]
            }
            const indexedPet = petsArr[req.params['0'][1]]
            petsArr=JSON.stringify(petsArr)

            fs.writeFile(petsPath,petsArr,()=>{})

            res.send(indexedPet)
        })
    })
}

//error response
const errorRes=()=>{
    app.use((err,req,res,next)=>{
        res.status(err.status).json({err:err.message,status:err.status})
    })
}


const newClient=()=>{
    const client = new pg.Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'null',
        port: 5432
    })
    return client
}


const client = newClient()
init() // Run init file and start program