let { banco, contas, identificadorConta, saques, depositos, transferencias } = require('../bancodedados')

const listarcontas = (req, res) => {
    const { senha_banco } = req.query

    if (!senha_banco) {
        return res.status(401).json({ mensagem: 'O campo senha_banco é obrigatório.' })
    }

    if (senha_banco !== banco.senha) {
        return res.status(401).json({ mensagem: 'A senha digitada está incorreta.' })
    }
    return res.status(200).json(contas)
}

const criarConta = (req, res) => {
    const { nome, email, cpf, data_nascimento, telefone, senha } = req.body

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome é obrigatório.' })
    }

    if (!cpf) {
        return res.status(400).json({ mensagem: 'O cpf é obrigatório.' })
    } else if (contas.find((contaCadastrada) => {
        return contaCadastrada.usuario.cpf === cpf ? true : false
    })) {
        return res.status(400).json({ mensagem: 'O cpf informado já está cadastrado.' })
    }

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'A data de nascimento é obrigatória.' })
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: 'O telefone é obrigatório.' })
    }

    if (!email) {
        return res.status(400).json({ mensagem: 'O email é obrigatório.' })
    } else if (contas.find((contaCadastrada) => {
        return contaCadastrada.usuario.email === email ? true : false
    })) {
        return res.status(400).json({ mensagem: 'O email informado já está cadastrado.' })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória.' })
    }

    const novaConta = {
        numero: String(identificadorConta++),
        saldo: 0,
        usuario: {
            nome: nome,
            cpf: cpf,
            data_nascimento: data_nascimento,
            telefone: telefone,
            email: email,
            senha: senha
        }
    }

    contas.push(novaConta)

    return res.status(201).json(novaConta)
}

const atualizarUsuarioDaConta = (req, res) => {
    const { numeroConta } = req.params
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    const contaAtual = contas.find((contaCadastrada) => {
        return contaCadastrada.numero === numeroConta
    })

    if (!contaAtual) {
        return res.status(400).json({ mensagem: `A conta número ${numeroConta} não existe.` })
    }

    if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
        return res.status(400).json({ mensagem: 'Não foi possível atualizar. Você deve passar perlo menos uma das seguintes propriedades para ser alterada: nome, cpf, data_nascimento, telefone, email ou senha' })
    }

    if (cpf) {
        if (contas.find((contaCadastrada) => {
            return contaCadastrada.usuario.cpf === cpf ? true : false
        })) {
            return res.status(400).json({ mensagem: 'O cpf informado já está cadastrado.' })
        }
    }

    if (email) {
        if (contas.find((contaCadastrada) => {
            return contaCadastrada.usuario.email === email ? true : false
        })) {
            return res.status(400).json({ mensagem: 'O email informado já está cadastrado.' })
        }
    }

    const usuario = contaAtual.usuario

    if (nome) {
        usuario.nome = nome
    }
    if (cpf) {
        usuario.cpf = cpf
    }
    if (data_nascimento) {
        usuario.data_nascimento = data_nascimento
    }
    if (telefone) {
        usuario.telefone = telefone
    }
    if (email) {
        usuario.email = email
    }
    if (senha) {
        usuario.senha = senha
    }


    return res.status(204).json({ mensagem: 'Conta atualizada com sucesso!' })
}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params

    const conta = contas.find((contaAtual) => {
        return contaAtual.numero === numeroConta
    })

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' })
    }

    if (conta.saldo > 0) {
        return res.status(403).json({ mensagem: 'Não é possível excluir. Motivo: Conta possui saldo.' })
    }

    contas = contas.filter((contaAtual) => {
        return contaAtual.numero !== numeroConta
    })


    return res.status(201).json({ mensagem: "Conta excluída com sucesso!" })
}

const consultarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta) {
        return res.status(401).json({ mensagem: 'O numero da conta é obrigatório.' })
    }

    const contaAtual = contas.find((conta) => {
        return conta.numero === numero_conta
    })

    if (!contaAtual) {
        return res.status(404).json({ mensagem: 'O numero da conta informado está incorreto. Conta não localizada.' })
    }

    if (!senha) {
        return res.status(401).json({ mensagem: 'O campo senha é obrigatório.' })
    }

    if (senha !== banco.senha) {
        return res.status(401).json({ mensagem: 'A senha digitada está incorreta.' })
    }
    return res.status(200).json({ saldo: contaAtual.saldo })
}

const gerarExtrato = (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O numero da conta é obrigatório.' })
    }


    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória.' })
    }

    const contaAtual = contas.find((conta) => {
        return conta.numero === numero_conta
    })

    if (!contaAtual) {
        return res.status(400).json({ mensagem: 'Conta não cadastrada.' })
    }

    if (contaAtual.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'A senha incorreta.' })
    }


    const meusSaques = saques.filter((saque) => {
        return saque.numero_conta === contaAtual.numero
    })

    const meusDepositos = depositos.filter((deposito) => {
        return deposito.numero_conta === contaAtual.numero
    })

    const transferenciasEnviadas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === contaAtual.numero
    })

    const transferenciasRecebidas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === contaAtual.numero
    })


    return res.status(200).json(
        {
            depositos: meusDepositos,
            saques: meusSaques,
            transferenciasEnviadas: transferenciasEnviadas,
            transferenciasRecebidas: transferenciasRecebidas
        }
    )
}

module.exports = { listarcontas, criarConta, atualizarUsuarioDaConta, excluirConta, consultarSaldo, gerarExtrato }