// Import express
const express = require('express');
const app = express();
const port = 3000;

// Import express-handlebars
const exphbs = require('express-handlebars')

// Import do conn para conexão do MySQL com Sequelize nesse projeto
const conn = require('./db/conn')


// Imports Modelos
// Obs.: só o fato delas estarem aqui quando rodar o projeto elas já são criadas.
const User = require('./models/User')
const Address = require('./models/Address')


/**************CONFIGURAÇÕES APP****************/
// Configurar Express para poder pegar o body dos forms
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json()) //Obter o dado do body em json()

// Config partials
const hbs = exphbs.create({
    partialsDir: ['views/partials']//array de onde pode-se encontra partials
})

// Config handlebars (com partials)
app.engine('handlebars', hbs.engine)
/**
        Aqui, você está registrando o Handlebars como mecanismo de visualização no Express. A função app.engine é usada para associar a extensão 'handlebars' ao engine do Handlebars que configuramos anteriormente (hbs.engine)
    */

app.set('view engine', 'handlebars')
/**
        - app.set: É um método do Express usado para configurar diferentes configurações no aplicativo.
        - view engine: É a configuração que define o mecanismo de visualização que o Express usará para renderizar as páginas.
        - handlebars: Indica que o mecanismo de visualização a ser usado é o Handlebars.
    */

// Config styles
app.use(express.static('public'))//middleware
/***********************************************/



/*********************ROTAS*********************/
// (C)
app.get('/users/create', (req, res) => {
    res.render('adduser')
})
app.post('/users/create', async (req, res) => {
    const name = req.body.name
    const occupation = req.body.occupation
    let newsletter = req.body.newsletter

    // O inputcheckbox quando vem marcado seu value é 'on', quando vem desmarcado seu value é undefined e o undefined se comporta como false também;
    if (newsletter === 'on') {
        newsletter = true
    } else {
        newsletter = false
    }

    await User.create({ name, occupation, newsletter }) // espera o usuário ser criado para só depois redirecioná-lo

    res.redirect('/')

})

app.post('/address/create', async (req, res) => {
    const UserId = req.body.UserId
    const street = req.body.street
    const number = req.body.number
    const city = req.body.city

    const address = {
        street,
        number,
        city,
        UserId
    }

    await Address.create(address)

    res.redirect(`/users/edit/${UserId}`)
})

//(R)
app.get('/users/:id', async (req, res) => {

    const id = req.params.id

    const user = await User.findOne({ raw: true, where: { id: id } })
    // Caso eu tbm quisesse filtrar por mais atributos, poderia fazer assim:   User.findOne( { where: { id: id }, {name: name} } )

    res.render('userview', { user })

})

//(U)
app.get('/users/edit/:id', async (req, res) => {
    const id = req.params.id

    try {
        //FORMA ANTIGA
        //const user = await User.findOne({ raw: true, where: { id: id } })

        //FORMA ATUAL
        const user = await User.findOne({ include: Address, where: { id: id } })/** Automaticamente o sequelize vai entender que quero resgatar todos os endereços do usuário, este que por sua vez possui o id igual o id que veio pela requisição e passado na cláusula where*/

        res.render('useredit', { user: user.get({ plain: true }) })
    } catch (error) {
        console.log(error)
    }

})
app.post('/users/update', async (req, res) => {
    const id = req.body.id
    const name = req.body.name
    const occupation = req.body.occupation
    let newsletter = req.body.newsletter

    newsletter === 'on' ? newsletter = true : newsletter = false;

    // values                                           // where   
    await User.update({ id: id, name, occupation, newsletter: newsletter }, { where: { id: id } })

    res.redirect('/')

})


//(D)
app.post('/users/delete/:id', async (req, res) => {
    const id = req.params.id

    await User.destroy({ where: { id: id } })

    res.redirect('/')
})

app.post('/address/delete', async (req, res) => {
    const id = req.body.id
    const UserId = req.body.UserId
    await Address.destroy({ where: { id: id } })

    res.redirect(`/users/edit/${UserId}`)
})

app.get('/', async (req, res) => {

    //console.log( await User.findAll() )

    // raw:true -> serve para converter o objeto especial, em um array de objetos
    const users = await User.findAll({ raw: true })
    // console.log(users);

    res.render('home', { users })
})
/***********************************************/



/********************SERVER*********************/
conn
    .sync()
    //.sync({force: true}) /** server para dar drop nas tabelas, ou seja, remove todos os valores inseridos até o momento; serve, por exemplo, para quando criamos uma nova coluna de chave estrangeira no modelo e precisamos reiniciar as relações */
    .then(() => {
        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        })
    }).catch((err) => console.log(err))


/***********************************************/
