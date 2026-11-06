# language: pt

Funcionalidade: Normalização do código de rastreio
  Para evitar códigos duplicados por diferenças de digitação
  Como porteiro
  Quero que o sistema padronize o código lido

  Cenário: Remover espaços e converter letras para maiúsculas
    Dado que o código informado é " br123456789br "
    Quando o sistema normaliza o código de rastreio
    Então o resultado deve ser "BR123456789BR"
