// Configura o servidor
const express = require("express")
const server = express()

//Configurar o servidor para aprensentar arquivos static
server.use(express.static('public'))

// Habilitar "body" do formulario
server.use(express.urlencoded({ extended: true}))

//Configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 1234,
    host: 'localhost',
    port: 5432,
    database: 'dsangue'
})

//configura a template ENGINE (permite enviar dados para o html)
const nunjuncks = require("nunjucks")
nunjuncks.configure("./",{
    express: server,
    noCache:true,
})


//Pega "/" do servidor e executa a funcionalidade em seguida ( Configurar a aprensentação da pagina)
server.get("/", function(req, res) {

    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows;
        return res.render("index.html", { donors })
    }) 
})

server.post("/", function(req, res) {
    // pegar dados do formulario.
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email =="" || blood ==""){
        return res.send("Todos os campos são obrigatórios.")
    }

    // colocar valores dentro do Banco de Dados
    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`
    const values = [name, email, blood]

    db.query(query, values, function(err) {
        // fluxo de erro
        if (err) return res.send("erro no banco de dados")

        // fluxo ideal
        return res.redirect("/")
    })

})

//Liga o servidor, ouvindo porta 3000
server.listen(3000, function() {
    console.log("Iniciei o servidor!!")
})

