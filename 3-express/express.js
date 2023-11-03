`use strict`
 // CORE MODULES IMPORT
import fs from 'fs' // File system manager module
import path from 'path' // Path module
import { fileURLToPath } from 'url' // URL module, convert path to URL


import express from 'express' // express module import

// GLOBAL VARIABLE DECLARATION
const app = express(); // Assign express function to app variable
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const __dirname = path.dirname(fileURLToPath(import.meta.url)) 
const petsPath = path.join(__dirname,'../pets.json') // Path to pets.json file
const port = 8000 // Define port for client


// PROGRAM START FUNCTION
const init=()=>{
    //input validation - ln37
    URLError()

    //GET instance - ln 53
    serverInstanceGET()

    //POST instance - ln 71
    serverInstancePOST()

    //catchAll - ln 63
    errorRes()

    //listener
    app.listen(port,()=>{console.log(`Listening on ${port}`)})
}


//input Validation
const URLError=()=>{
    app.use((req,res,next)=>{
        const route = req.url.split('/')

        route[1]==='pets'&&route[2]?
            parseInt(route[2])>-1?
                route[3]?
                    next({message:'invalid endpoint',status:401}): // Send 401 error: client request needs authentication credentials
                    next():
                next({message:'incorrect endpoint', status: 402}): 
            next()
    })
}


//instance
const serverInstanceGET=()=>{
    app.get(/^\/pets(.*)$/,(req,res,next)=>{
        console.log('getting')
        const urlInput=req.params['0']
        // Invoke fs.readFile to access and convert for client get request
        fs.readFile(petsPath,'utf8',(err,data)=>{
            const fileArr = JSON.parse(data) //parse to JSON format for get request
            
            urlInput?
                res.send(fileArr[urlInput[1]]):
                res.send(fileArr)
        })
    })
}


const serverInstancePOST=()=>{
    app.post(/^\/pets(.*)$/,(req,res,next)=>{
        console.log('posting')

        fs.readFile(petsPath,'utf8',(err,data)=>{
            let petsArr = JSON.parse(data)

            petsArr.push(req.body)
            petsArr = JSON.stringify(petsArr)
    
            fs.writeFile(petsPath,petsArr,()=>{})
    
            res.send(req.body)
        })
    })
}


//error response
const errorRes=()=>{
    app.use((err,req,res,next)=>{
        res.status(err.status).json({err:err.message,status:err.status})
    })
}


init() // Run init file and start program