const {DataTypes} = require('sequelize')

const db = require('../db/conn')

const User = require('./User')// precisa estar aqui para o sequilize saber qual modelo vai ser representado por essa relação 

const Address = db.define('Address', {

    street:{
        type: DataTypes.STRING,
        required: true,
    },
    number:{
        type: DataTypes.STRING,
        required: true,
    },
    city:{
        type: DataTypes.STRING,
        required: true,
    }

});

//hasMany = tem vários
User.hasMany(Address)
//belongs = pertencer | belongsTo = pertence à (um)
Address.belongsTo(User)// dentro da tabela Address quero uma coluna userid

/**
 * A cardinalidade das relações a cima pode ser descrita da seguinte forma:
 *      - UM usuário pode ter VÁRIOS endereços
 *      - UM endereço pertence a UM usuário
 */


module.exports = Address