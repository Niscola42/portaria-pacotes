# language: pt

Funcionalidade: Regras de registro, notificação e retirada de encomendas
  Para manter o controle das encomendas da portaria
  Como porteiro
  Quero que as principais regras sejam verificadas automaticamente

  Cenário: Gerar PIN de retirada com quatro dígitos
    Quando o sistema gerar um PIN de retirada
    Então o PIN deve possuir 4 dígitos

  Cenário: Normalizar o código durante o cadastro
    Dado os dados de uma encomenda com código " br987654321br "
    Quando o sistema cadastrar a encomenda
    Então o código cadastrado deve ser "BR987654321BR"

  Cenário: Criar uma encomenda com situação pendente
    Dado os dados de uma encomenda com código "BR987654321BR"
    Quando o sistema cadastrar a encomenda
    Então a situação cadastrada deve ser "pending"

  Cenário: Reenviar notificação de uma encomenda pendente
    Dado que existe uma encomenda "pending" com 1 notificação
    Quando o porteiro solicitar o reenvio da notificação
    Então o reenvio deve ser autorizado
    E a encomenda deve possuir 2 notificações

  Cenário: Bloquear reenvio de uma encomenda retirada
    Dado que existe uma encomenda "collected" com 1 notificação
    Quando o porteiro solicitar o reenvio da notificação
    Então o reenvio deve ser recusado
    E a encomenda deve possuir 1 notificação

  Cenário: Confirmar retirada com o PIN correto
    Dado que existe uma encomenda pendente com PIN "1234"
    Quando o porteiro informar o PIN "1234"
    Então o resultado da retirada deve ser "ok"
    E a situação da encomenda deve ser "collected"

  Cenário: Recusar retirada com um PIN incorreto
    Dado que existe uma encomenda pendente com PIN "1234"
    Quando o porteiro informar o PIN "9999"
    Então o resultado da retirada deve ser "invalid-pin"
    E a situação da encomenda deve ser "pending"
