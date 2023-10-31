import petList from '../pets.json' assert {type:'json'} 

const inputError=(errorType)=>{
    switch(errorType){
        case 'command':
            console.error('Usage: node fs.js [read | create | update | destroy]')
            process.exitCode = 1;
            break;
        case 'read':
            console.error('Usage: node fs.js read INDEX')
            break;
            
    }
}

const init=()=>{
    switch(process.argv[2]){
        case 'read':
            readPets(process.argv[3]);
            break
        case 'create':
            console.log('create')
            break
        case 'update':
            console.log('update')
            break
        case 'destroy':
            console.log('destroy')
            break
        default:
            inputError('command')
    }
}

const readPets=(petIndex)=>{
    if(petList[petIndex]){
        console.log(petList[petIndex])
    }
    else{
        inputError('read')
    }
}

init()