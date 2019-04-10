const obj = {
    person: {
        name: 'Jonathan',
        age: 33
    },

    other: {
        massa: 'chusetts'
    }
}


let why = 'other'

const { [why]: conn } = obj

console.log(conn.massa)