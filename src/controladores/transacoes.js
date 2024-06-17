let { banco, contas, saques, depositos, transferencias, identificadorConta } = require('../bancodedados')
const fusoHorario = "America/Sao_Paulo"
const data = new Date().toLocaleString("pt-BR", { timeZone: fusoHorario }).slice(0, 10)
const hora = new Date().toLocaleString("pt-BR", { timeZone: fusoHorario }).slice(12)
const dataHora = `${data} ${hora}`

const depositarSaldo = (req, res) => {
    const { numero_conta, valor } = req.body

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O numero da conta é obrigatório.' })
    }

    const contaAtual = contas.find((conta) => {
        return conta.numero === numero_conta
    })

    if (!contaAtual) {
        return res.status(404).json({ mensagem: 'Não há nenhuma conta cadastrada com o numero informado.' })
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'O preenchimento do valor é obrigatório.' })
    }

    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: 'O valor deve ser maior que 0.' })
    }

    contaAtual.saldo += Number(valor)
    depositos.push(
        {
            data: dataHora,
            numero_conta: numero_conta,
            valor: valor
        }
    )

    return res.status(201).json({ mensagem: 'Depósito realizado com sucesso' })
}

const sacarSaldo = (req, res) => {
    const { numero_conta, senha, valor } = req.body

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O numero da conta é obrigatório.' })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória.' })
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'O valor é obrigatório.' })
    }

    const contaAtual = contas.find((conta) => {
        return conta.numero === numero_conta
    })

    if (!contaAtual) {
        return res.status(404).json({ mensagem: 'Não há nenhuma conta cadastrada com o numero informado.' })
    }

    if (senha !== contaAtual.usuario.senha) {
        return res.status(404).json({ mensagem: 'Senha incorreta.' })
    }

    if (Number(valor) > contaAtual.saldo) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente.' })
    }

    contaAtual.saldo -= Number(valor)
    saques.push(
        {
            data: dataHora,
            numero_conta: numero_conta,
            valor: valor
        }
    )

    console.log(saques);

    return res.status(201).json({ mensagem: 'Saque realizado com sucesso' })
}

const transferirSaldo = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, senha, valor } = req.body


    if (!numero_conta_origem) {
        return res.status(400).json({ mensagem: 'O numero da conta de origem é obrigatório.' })
    }

    if (!numero_conta_destino) {
        return res.status(400).json({ mensagem: 'O numero da conta destino é obrigatório.' })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória.' })
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'O valor é obrigatório.' })
    }


    const contaOrigem = contas.find((conta) => {
        return conta.numero === numero_conta_origem
    })
    const contaDestino = contas.find((conta) => {
        return conta.numero === numero_conta_destino
    })


    if (!contaOrigem) {
        return res.status(404).json({ mensagem: 'Conta origem não localizada. Verifique o número e tente novamente.' })
    }

    if (!contaDestino) {
        return res.status(404).json({ mensagem: 'Conta destino não localizada. Verifique o número e tente novamente.' })
    }

    if (senha !== contaOrigem.usuario.senha) {
        return res.status(404).json({ mensagem: 'Senha incorreta.' })
    }

    if (Number(valor) > contaOrigem.saldo) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente.' })
    }

    contaOrigem.saldo -= Number(valor)
    contaDestino.saldo += Number(valor)
    transferencias.push(
        {
            data: dataHora,
            numero_conta_origem: numero_conta_origem,
            numero_conta_destino: numero_conta_destino,
            valor: valor
        }
    )

    console.log(transferencias);

    return res.status(201).json({ mensagem: 'Transferencia realizada com sucesso' })
}

module.exports = { depositarSaldo, sacarSaldo, transferirSaldo }