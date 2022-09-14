const mongoose = require('mongoose')
const User = require('../../app/model/User.js')
const Hash = require('../../app/utility/Hash')

const UserSeeder = async () => {
    await User.create([
        {
            email: 'lskk@lskk.co.id',
            password: Hash.make('AbiNoval123;'),
            name: 'LSKK',
            address: 'Bandung',
            role: 'super_admin',
            _id: new mongoose.Types.ObjectId(),
        },
        {
            email: 'smkwikrama@smkwikrama.sch.id',
            password: Hash.make('AbiNovalWk123;'),
            name: 'SMK Wikrama Bogor',
            address: 'Bogor',
            role: 'admin',
            _id: new mongoose.Types.ObjectId(),
        },
    ])
}

module.exports = UserSeeder
