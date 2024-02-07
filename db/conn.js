const { Sequelize } = require('sequelize')

/** Scripts do MySQL para esse projeto:
 * 
 * CREATE SCHEMA `nodesequelize` ;
 * 
 */

/**
 * Criando a configuração de conexão com Sequilize:
 *             Sequelize('nomeDoBanco/schema', 'nomeDoUsuario', 'senhaDoUsuario', objDeConfiguracoes{
 *                  host: 'ipDoServidor',
 *                  dialect: 'nomeDoSGBD'     
 *             })
 */
const sequelize = new Sequelize('nodesequelize','root','', {
        host: 'localhost',
        dialect: 'mysql'
})

// Apenas checka a conexão, como um "ping", mas não mantém/persiste nada no banco
// Checando a conexão com o método authenticate;
/*
    try {
    
        sequelize.authenticate();
        console.log('Conectamos com sucesso com o Sequelize!');
    } catch (error) {
        console.log('Não foi possível conectar: ', error);
    }
*/

module.exports = sequelize