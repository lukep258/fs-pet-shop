`use strict`
 // CORE MODULES IMPORT
import fs from 'fs' // File system manager module
import path from 'path' // Path module
import { fileURLToPath } from 'url' // URL module, convert path to URL
import express, { json } from 'express' // express module import

// GLOBAL VARIABLE DECLARATION
const app = express(); // Assign express function to app variable
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const __dirname = path.dirname(fileURLToPath(import.meta.url)) 
const petsPath = path.join(__dirname,'../pets.json') // Path to pets.json file
const port = 8000 // Define port for client


// PROGRAM START FUNCTION
const init=()=>{
    //input validation
    URLError()

    //GET instance
    serverInstanceGET()

    //input validation for POST req
    postError()

    //POST instance
    serverInstancePOST()

    //DELETE instance
    serverInstanceDELETE()

    //PATCH instance
    serverInstancePATCH()

    //catchAll
    errorRes()

    //listener
    app.listen(port,()=>{console.log(`Listening on ${port}`)})
}


//input Validation
const URLError=()=>{
    app.use((req,res,next)=>{
        const route = req.url.split('/')

        route[1]!=='pets'&&route.length>2&&parseInt(route[2])>-1?
            next({message:'invalid endpoint', status: 404}):
            next()
    })
}


//get server instance
const serverInstanceGET=()=>{
    app.get(/^\/pets(.*)$/,(req,res)=>{
        const urlInput=req.params['0']
        // Invoke fs.readFile to access and convert for client get request
        fs.readFile(petsPath,'utf8',(err,data)=>{
            const fileArr = JSON.parse(data) //parse to JSON format for get request
            
            urlInput[1]?
                res.send(fileArr[urlInput[1]]):
                res.send(fileArr)
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


init() // Run init file and start program