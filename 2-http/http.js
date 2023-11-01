`use strict`

import fs, { readFile } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import { send } from 'process'

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
    switch(req.method){
        case 'GET':
            reqUrl(req.url,res)
            break
        case 'POST':
            postUrl(req,res)
            break
        default:
            inputError('get',res)
    }
}


//reqUrl without RegEx
// const reqUrl=(url,res)=>{
//     const urlArr=url.split('/')
//     console.log(urlArr)
//     urlArr[1]==='pets'?
//         urlArr[2]?
//             resSend(urlArr[2],res):
//             resSend('def',res):
//         inputError('pets',res)
// }


const reqUrl=(url,res)=>{//with RegEx
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
        case 'body':
            console.error('user input invalid post request body')
            sendIt(res,400,'text/plain','Bad Request')
            break;
        case 'get':
            console.error('user input non-GET/POST requests')
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


const postUrl=(req,res)=>{
    let chunks=[]
    req.on('data',chunk=>chunks.push(chunk))
    req.on('end',()=>{
        try{
            chunks = JSON.parse(chunks.join(' ').toString())
        }
        catch(SyntaxError){
            inputError('body',res)
            return
        }
        const petRegExp = /^\/pets\/(.*)$/;
        const petIndex = req.url.match(petRegExp)
        console.log(req.url)
        petIndex&&!petIndex[1]?
            chunks.name&&parseInt(chunks.age)>-1&&chunks.kind?
                postReq(parseInt(chunks.age),chunks.kind,chunks.name,res):
                inputError('body',res):
            inputError('pets',res)
    })
}


const postReq=(age,kind,name,res)=>{
    fs.readFile(petsPath,'utf8',(err,data)=>{
        let petsArr = JSON.parse(data)
        const petObj = {age:age,kind:kind,name:name}

        petsArr.push(petObj)
        petsArr = JSON.stringify(petsArr)
        console.log(petsArr)
        console.log(petObj)

        fs.writeFile(petsPath,petsArr,()=>{})

        sendIt(res,200,'application/json',JSON.stringify(petObj))
    })
}


init()