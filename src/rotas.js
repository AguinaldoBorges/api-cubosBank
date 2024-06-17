const express = require('express')
const rotas = express()

const { listarcontas, criarConta, atualizarUsuarioDaConta, excluirConta, consultarSaldo, gerarExtrato } = require('./controladores/contas')
const { depositarSaldo, sacarSaldo, transferirSaldo } = require('./controladores/transacoes')


rotas.get('/', listarcontas)
rotas.get('/contas', listarcontas)
rotas.post('/contas', criarConta)
rotas.put('/contas/:numeroConta/usuario', atualizarUsuarioDaConta)
rotas.delete('/contas/:numeroConta', excluirConta)
rotas.get('/contas/saldo/', consultarSaldo)
rotas.get('/contas/extrato', gerarExtrato)

rotas.post('/transacoes/depositar', depositarSaldo)
rotas.post('/transacoes/sacar', sacarSaldo)
rotas.post('/transacoes/transferir', transferirSaldo)



module.exports = { rotas }