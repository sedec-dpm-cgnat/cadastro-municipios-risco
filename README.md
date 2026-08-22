# Cadastro Nacional de Municípios · Protótipo de demonstração

Protótipo navegável do painel municipal para o **Cadastro Nacional de Municípios com Áreas Suscetíveis à Ocorrência de Deslizamentos de Grande Impacto, Inundações Bruscas ou Processos Geológicos ou Hidrológicos Correlatos**.

**Demonstração pública:** [sedec-dpm-cgnat.github.io/cadastro-municipios-risco](https://sedec-dpm-cgnat.github.io/cadastro-municipios-risco/)

## Executar localmente

Na pasta do protótipo, execute:

```powershell
python -m http.server 4173
```

Depois abra [http://127.0.0.1:4173](http://127.0.0.1:4173).

## Escopo da demonstração

- painel municipal com o município de São Sebastião/SP como cenário demonstrativo;
- tela inicial de acesso municipal com fluxo simulado de autenticação gov.br;
- seleção de quatro perfis: município, estado, União e órgãos de controle/fiscalização;
- login gov.br liberado somente depois da escolha do perfil municipal;
- explicação visual da diferença entre indicação técnica, cadastro efetivado e transparência;
- atalhos públicos na tela inicial para a explicação dos 2.095 indicados e o mapa das 5 inscrições concluídas;
- páginas nacionais com mapa do Brasil, notas técnicas da Casa Civil e responsabilidades posteriores à inscrição;
- contexto público sobre o aprimoramento da metodologia e referência ao [ICPM](https://icpm.dpm-sedec-sas.tech/) como plataforma preliminar de estudos do índice;
- fluxo de cadastro inicial em quatro etapas: identificação, comprovação, manifestação prévia e revisão;
- upload único da comprovação de áreas de risco, com ZIP como formato preferencial;
- atesto obrigatório para municípios indicados;
- área pós-efetivação com os sete campos de acompanhamento do art. 5º;
- mapa esquemático com camadas de risco e integração com bases técnicas;
- consulta pública de transparência;
- painel público com mapa nacional demonstrativo, filtros por situação e downloads CSV separados;
- separação visual entre municípios indicados, cadastrados e processos em preenchimento;
- visão nacional dos municípios indicados e da fila de notificação do Rio Grande do Sul;
- interações simuladas, sem envio de dados reais.

As marcas institucionais usadas no protótipo são carregadas a partir das referências públicas indicadas pelo solicitante.

## Proposta completa

- [Proposta do sistema](docs/PROPOSTA-SISTEMA.md)
- [API e desenho de dados](docs/API-E-DADOS.md)
- [Esquema MySQL](database/schema.sql)
- [Carga de demonstração](database/seed_demo.sql)
- [Orientações para a VPS Hostinger](deploy/README-HOSTINGER.md)

O subprojeto está isolado em `C:\Users\cassi\OneDrive\Documents\SEDEC\CADASTRO_Municipios\CNM-RISCO` para não alterar os demais materiais existentes na pasta de trabalho.
