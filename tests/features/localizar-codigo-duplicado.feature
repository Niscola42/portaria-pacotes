# language: pt

Funcionalidade: Localização de código de rastreio já cadastrado
  Para evitar o registro duplicado de uma encomenda
  Como porteiro
  Quero localizar um código mesmo com diferenças de espaços e letras

  Cenário: Encontrar encomenda com código equivalente
    Dado que existe uma encomenda com identificador "pacote-1" e código "BR123456789BR"
    Quando o porteiro procura pelo código " br123456789br "
    Então a encomenda encontrada deve ter o identificador "pacote-1"
