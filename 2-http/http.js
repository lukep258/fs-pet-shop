`use strict`

import fs, { readFile } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const petsPath = path.join(__dirname,'../pets.json')
const port = 8000


const init=()=>{
    const server = http.createServer((req,res)=>{reqHandler(req,res)})
    server.listen(port,()=>{
        console.log('listening on port',port)
    })

}


const reqHandler =(req,res)=>{
    req.method==='GET'?
        reqUrl(req.url,res):
        inputError('get',res)
}


//without RegEx
// const reqUrl=(url,res)=>{
//     const urlArr=url.split('/')
//     console.log(urlArr)
//     urlArr[1]==='pets'?
//         urlArr[2]?
//             resSend(urlArr[2],res):
//             resSend('def',res):
//         inputError('pets',res)
// }

//withRegEx
const reqUrl=(url,res)=>{
    const petRegExp = /^\/pets\/(.*)$/;
    const petIndex = url.match(petRegExp)
    console.log(petIndex)

    petIndex?
        petIndex[1]?
            resSend(petIndex[1],res):
            resSend('def',res):
        inputError('pets',res)
}


const resSend=(index,res)=>{
    fs.readFile(petsPath,'utf8',(err,data)=>{
        const petsArr = JSON.parse(data)
        index==='def'?
            sendIt(res,200,'application/json',JSON.stringify(petsArr)):
            petsArr[index]?
                sendIt(res,200,'application/json',JSON.stringify(petsArr[index])):
                inputError('index',res)
    })
}


const inputError=(type,res)=>{
    switch(type){
        case 'get':
            console.error('user input non-GET requests')
        case 'pets':
            console.error('user input non-pets endpoints')
        case 'index':
            console.error('user input non-existing index')
        default:
            sendIt(res,404,'text/plain','Not Found')
    }
}


const sendIt=(res,status,type,body)=>{
    res.statusCode = status
    res.setHeader('Content-Type',type)
    return res.end(body)
}

init()