# API e dados — desenho inicial

## Rotas públicas

```text
GET /api/public/municipios?uf=SP&status=INDICADO
GET /api/public/municipios/{ibge}
GET /api/public/municipios/{ibge}/mapa
GET /api/public/fontes
```

As respostas públicas não devem expor CPF, e-mail pessoal, credenciais ou caminho físico dos arquivos.

## Rotas autenticadas

```text
GET  /api/me
GET  /api/me/municipio
POST /api/cadastro-inicial
POST /api/cadastro-inicial/{id}/comprovacao
POST /api/cadastro-inicial/{id}/manifestacao
POST /api/cadastro-inicial/{id}/enviar
GET  /api/municipios/{id}/obrigacoes
POST /api/municipios/{id}/obrigacoes/{item}/documentos
PATCH /api/municipios/{id}/obrigacoes/{item}
GET  /api/municipios/{id}/auditoria
```

## Regras essenciais

- somente usuário autenticado e vinculado ao município pode editar o cadastro;
- o upload inicial aceita um único pacote lógico;
- o arquivo original deve ser armazenado fora da pasta pública;
- guardar nome original, MIME, tamanho, checksum SHA-256, data, usuário e versão;
- bloquear o envio se a comprovação estiver ausente;
- bloquear o envio de município indicado sem manifestação prévia;
- toda mudança de situação deve gerar evento de auditoria;
- a consulta pública deve exibir somente metadados e documentos liberados para publicação;
- separar tecnicamente “indicação” de “inscrição efetivada”.
