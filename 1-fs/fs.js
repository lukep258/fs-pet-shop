import fs from "fs"


const inputError=(errorType)=>{
    switch(errorType){
        case 'command':
            console.error('Usage: node fs.js [read | create | update | destroy]')
            process.exitCode = 1;
            break
        case 'read':
            console.error('Usage: node fs.js read INDEX')
            break
        case 'create':
            console.error('Usage: node fs.js create AGE KIND NAME')
            break
        case 'update':
            console.error('Usage: node fs.js update INDEX AGE KIND NAME')
            break
        case 'destroy':
            console.error('Usage: node fs.js destroy INDEX')
            break
    }
}


const init=()=>{
    fs.readFile('../pets.json','utf8',(err,data)=>{
        const input = process.argv
        changeDir(input[1])
        const petArr = JSON.parse(data)

        switch(input[2]){
            case 'read':
                input[3]?
                    console.log(petArr[input[3]]):
                    inputError('read')
                break
            case 'create':
                input[5]&&parseInt(input[3])?
                    createPet(petArr,parseInt(input[3]),input[4],input[5]):
                    inputError('create')
                break
            case 'update':
                input[6]&&parseInt(input[3])&&parseInt(input[4])?
                    updatePet(petArr,parseInt(input[3]),parseInt(input[4]),input[5],input[6]):
                    inputError('update')
                break
            case 'destroy':
                input[3]?
                    destroyPet(petArr,parseInt(input[3])):
                    inputError('destroy')
                break
            default:
                inputError('command')
        }
    })
}


const createPet=(data,age,kind,name)=>{
    const petObj = {age: age, kind: kind, name: name}
    const dataArr = data
    dataArr.push(petObj)

    const returnJSONObj = JSON.stringify(dataArr)
    fs.writeFile('../pets.json',returnJSONObj,()=>{})
    console.log(petObj)
}


const updatePet=(data,index,age,kind,name)=>{
    const petObj = {age: age, kind: kind, name: name}
    const dataArr = data
    dataArr[index] = petObj

    const returnJSONObj = JSON.stringify(dataArr)
    fs.writeFile('../pets.json',returnJSONObj,()=>{})
    console.log(petObj)
}


const destroyPet=(data,index)=>{
    console.log(dataArr[index])

    const dataArr = data
    dataArr.splice(index,1)

    const returnJSONObj = JSON.stringify(dataArr)
    fs.writeFile('../pets.json',returnJSONObj,()=>{})
}


const changeDir=(dir)=>{
    console.log(dir)
    let dirTo = dir.split('\\')
    dirTo.pop()
    dirTo = dirTo.join('\\')
    console.log(dirTo)
    process.chdir(dir)
}

init()