`use strict`

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express, { json } from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const petsPath = path.join(__dirname,'../pets.json')
const port = 8000
const app = express();


const init=()=>{
    //input validation
    URLError()

    //instance
    serverInstance()

    //catchAll
    errorRes()

    //listener
    app.listen(port,()=>{console.log(`Listening on ${port}`)})
}


//input Validation
const URLError=()=>{
    app.use((req,res,next)=>{
        const route = /^\/pets(.*)$/
        const petIndex = req.url.match(route)

        switch(petIndex[1][0]){
            case '/':
            case undefined:
                next()
                break
            default:
                next({message:'Token not present',status:401})
        }
    })
}


//instance
const serverInstance=()=>{
    app.get(/^\/pets(.*)$/,(req,res)=>{
        res.send('good test')
        const urlInput=req.params

        fs.readFile(petsPath,'utf8',(err,data)=>{
            const fileArr = JSON.parse(data)
            console.log(fileArr)
        })
    })
}


//get request
// const getPet=(res,route)=>{
//     const petIndex = route
//     fs.readFile(petsPath,'utf8',(err,data)=>{

//     })
// }


//error response
const errorRes=()=>{
    app.use((err,req,res,next)=>{
        res.status(err.status).json({err:err.message})
    })
}


init()