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

    return { existsOrError, notExistsOrError, equalsOrError }
}