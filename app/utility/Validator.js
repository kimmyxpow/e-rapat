const validator = require('validator')

async function Validator(data, validate) {
    const errorBag = {}

    for (const key in validate) {
        for (let i = 0; i < validate[key].length; i++) {
            if (validate[key][i] === 'required') {
                required(key, data[key] || '') ? (errorBag[key] = required(key, data[key] || '')) : undefined
            }

            if (validate[key][i] === 'email') {
                email(key, data[key] || '') ? (errorBag[key] = email(key, data[key] || '')) : undefined
            }

            if (validate[key][i] === 'password') {
                password(key, data[key] || '') ? (errorBag[key] = password(key, data[key] || '')) : undefined
            }

            if (validate[key][i].split(':')[0] === 'min') {
                min(key, data[key] || '', validate[key][i].split(':')[1]) ? (errorBag[key] = min(key, data[key] || '', validate[key][i].split(':')[1])): undefined
            }

            if (validate[key][i].split(':')[0] === 'unique') {
                let except
                let table = validate[key][i].split(':')[1]
                if (validate[key][i].split(',')[1]) {
                    except = validate[key][i].split(',')[1]
                    table  = validate[key][i].split(':')[1].split(',')[0]
                }
                await unique(key, data[key] || '', table, except) 
                    ? errorBag[key] = await unique(key, data[key] || '', table, except) 
                    : undefined
            }

            if (validate[key][i] === 'date') {
                date(key, data[key] || '', validate[key][i]) ? (errorBag[key] = date(key, data[key] || '', validate[key][i])): undefined
            }

            if (validate[key][i] === 'phone') {
                phone(key, data[key] || '', validate[key][i]) ? (errorBag[key] = phone(key, data[key] || '', validate[key][i])): undefined
            }
        }
    }

    return errorBag
}

const required = (field, val) => {
    return validator.isEmpty(val) ? `${field} field is required` : false
}

const email = (field, val) => {
    return validator.isEmail(val) ? false : `${field} field is not a valid email`
}

const password = (field, val) => {
    return validator.isStrongPassword(val) ? false : `${field} field is not strong enough`
}

const min = (field, val, min) => {
    return val.length >= min ? false : `${field} field is too short, min: ${min} characters`
}

const unique = async (field, val, table, except) => {
    const model = require(`../model/${table}`)
    let data

    if (except != undefined) {
        if (val != except) {
            data = await model.findOne(JSON.parse(`{ "${field}" : "${val}" }`))
        }
    }

    return data == null ? false : `${field} already used`
}

const date = (field, val) => {
    return validator.isDate(val) ? false : `${field} field is not a valid date`
}

const phone = (field, val) => {
    return validator.isMobilePhone(val) ? false : `${field} field is not a valid mobile phone`
}

module.exports = Validator
