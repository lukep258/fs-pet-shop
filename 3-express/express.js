`use strict`

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import express from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const petsPath = path.join(__dirname,'../pets.json')
const port = 8000
const app = express();


app.get(/^\/pets(.*)$/,(req,res)=>{
    res.send('hello')
    console.log(req.params)
    const route = req.params['0']
    route[0]==='/'?
        getPet():
        getList()
})





app.listen(port,()=>{console.log(`Listening on ${port}`)})