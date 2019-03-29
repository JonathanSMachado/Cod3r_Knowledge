module.exports = app => {
    function existsOrError(value, errorMsg) {
        if(!value) throw errorMsg
        if(Array.isArray(value) && value.length === 0) throw errorMsg
        if(typeof value === 'string' && !value.trim()) throw errorMsg
    }
    
    function notExistsOrError(value, errorMsg) {
        try {
            existsOrError(value, errorMsg)
        } catch(errorMsg) {
            return
        }
    
        throw errorMsg
    }
    
    function equalsOrError(valueA, valueB, errorMsg) {
        if(valueA !== valueB) throw errorMsg
    }

    function isValidEmailOrError(email, errorMsg) {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!email.match(emailRegex)) throw errorMsg        
    }

    function numberOrError(number, errorMsg) {
        if(!Number(number)) throw errorMsg
    }

    return { existsOrError, notExistsOrError, equalsOrError, isValidEmailOrError, numberOrError }
}