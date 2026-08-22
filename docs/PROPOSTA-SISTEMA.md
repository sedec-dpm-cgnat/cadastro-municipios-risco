# Cadastro Nacional de Municípios — proposta de sistema

## 1. Visão do produto

O Cadastro Nacional de Municípios será um portal simples para que o município:

1. entre com sua conta gov.br;
2. consulte se está na lista de municípios indicados;
3. envie uma única comprovação da existência de áreas de risco;
4. ateste a manifestação prévia quando tiver sido indicado;
5. acompanhe a análise e a efetivação da inscrição;
6. depois da efetivação, atualize os documentos e informações do art. 5º;
7. consulte publicamente a lista de indicados, processos e municípios cadastrados.

O desenho separa três situações que não devem ser confundidas:

- **Indicado:** integra o universo técnico das notas e ainda não significa inscrição concluída;
- **Em preenchimento ou em análise:** possui processo municipal aberto;
- **Cadastrado:** inscrição efetivada na base oficial.

## 1.1 Perfis de acesso

A porta de entrada apresenta quatro perfis, com permissões e painéis próprios:

- **Município:** inscrição, comprovação, manifestação prévia e obrigações pós-efetivação;
- **Estado:** acompanhamento regional dos municípios, apoio técnico e evolução das inscrições;
- **União:** gestão do universo nacional, indicações, análises, notificações e dados agregados;
- **Órgãos de controle e fiscalização:** consulta institucional, fichas públicas, documentos disponíveis e trilha de auditoria, para CGU, MPU, Tribunais e órgãos habilitados.

O acesso público geral permanece aberto e não exige autenticação. O perfil selecionado deve limitar menus, dados pessoais e ações conforme a função institucional.

## 1.2 Princípio de navegação

A navegação deve ser direta e igual em todas as telas, com no máximo seis destinos principais:

1. **Início:** resumo do município e próxima ação;
2. **Meu cadastro:** etapas de identificação, comprovação, manifestação e envio;
3. **Obrigações:** acompanhamento posterior à efetivação;
4. **Mapa:** leitura territorial e camadas de risco;
5. **Transparência:** listas públicas, filtros e downloads;
6. **Visão nacional:** acompanhamento agregado para Estado, União e controle.

Ajuda, formatos e canais de apoio ficam em uma área secundária para não competir com a ação principal do usuário.

## 2. Fluxo municipal simplificado

### Acesso

O usuário seleciona o perfil e, quando aplicável, entra com gov.br. O sistema identifica o município, o CPF do responsável e as permissões institucionais. A consulta pública continua disponível sem login.

### Cadastro inicial

O cadastro inicial possui quatro passos:

1. **Identificação:** município, UF, código IBGE, órgão responsável e responsável pelo cadastro;
2. **Comprovação:** um único pacote de arquivos, com ZIP como formato preferencial;
3. **Manifestação prévia:** atesto obrigatório para município indicado;
4. **Revisão e envio:** resumo, declaração de responsabilidade e encaminhamento para análise.

### Comprovação de áreas de risco

O sistema deve aceitar um arquivo em qualquer formato necessário ao município. O formato recomendado é um ZIP contendo, quando aplicável:

- inventário ou relatório técnico;
- relação georreferenciada de imóveis e infraestruturas expostas;
- arquivos vetoriais, como SHP compactado, GeoJSON ou geopackage;
- mapas, memoriais, notas técnicas ou documentos expedidos por órgãos públicos;
- documentos de agentes privados legalmente habilitados, com indicação da metodologia pública adotada.

O Decreto nº 10.692/2021 condiciona a inscrição à comprovação da existência de áreas de risco e determina que o inventário inclua cadastro ou relação georreferenciada dos imóveis e infraestruturas expostas. Consulte o [texto oficial do Decreto](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/decreto/d10692.htm).

Como apoio à preparação do pacote, o sistema deve apresentar uma referência ao [catálogo de Cartografia de Riscos Geológicos do SGB/CPRM](https://www.sgb.gov.br/produtos-por-estado-cartografia-de-riscos-geologicos), organizado por estado e município. O produto disponível poderá orientar a comprovação e ser relacionado ao processo, sem substituir a responsabilidade municipal nem transformar a consulta externa em requisito obrigatório.

### Manifestação do município indicado

Quando o município estiver na lista de indicados, o responsável deve marcar um checkbox obrigatório com o texto:

> Atesto que o município está de acordo com a referida indicação e tomou ciência das condições para a inscrição no Cadastro Nacional, conforme o art. 3º, § 4º, do Decreto nº 10.692/2021.

Sem o atesto, o botão de envio permanece bloqueado.

O componente de atesto deve ser condicional: ele só aparece quando a identificação do município estiver associada à lista vigente de indicados. Para municípios fora da lista, a etapa informa que a manifestação específica da indicação não é necessária.

## 3. Painel depois da efetivação

Após a inscrição ser efetivada, o painel municipal libera os sete acompanhamentos do art. 5º:

| Item | Campo do sistema | Evidência sugerida |
|---|---|---|
| I | Órgão municipal de defesa civil | ato de criação, identificação da COMPDEC e responsável |
| II | Mapeamento georreferenciado | camada espacial, relatório e data da atualização |
| III | Plano de contingência | plano vigente e data-limite de um ano |
| IV | Plano de obras e serviços | plano, setores, prioridades e estimativas |
| V | Controle e fiscalização | instrumento legal, procedimento e declaração |
| VI | Carta geotécnica e diretrizes urbanísticas | carta, diretrizes e camada correspondente |
| VII | Evolução anual das ocupações | declaração anual, inventário atualizado e histórico |

Cada item terá:

- status: não iniciado, em elaboração, enviado, aprovado ou precisa de atualização;
- upload de documento ou pacote;
- data e versão;
- observação técnica;
- histórico de alterações;
- responsável pela atualização;
- visibilidade pública configurável conforme a regra do cadastro.

No protótipo, o botão **Ver painel habilitado** simula a efetivação da inscrição e libera uma visão demonstrativa dessas sete obrigações. Cada cartão permite selecionar um arquivo, definir status, registrar a data da atualização e incluir uma observação técnica. Na versão integrada, a abertura desse painel será condicionada ao estado `CADASTRADO`, com armazenamento seguro, checksum, histórico e trilha de auditoria.

## 4. Transparência e mapa nacional

### Consulta pública

A página pública deve abrir sem login e começar por uma explicação simples: indicação é identificação técnica; cadastro é inscrição efetivada; transparência é o acompanhamento público das duas camadas. Ela deve oferecer filtros por UF, município, código IBGE e situação, além de downloads separados para as listas de indicados e cadastrados em CSV/ODS.

A ficha pública deve apresentar:

- origem da indicação e nota técnica de referência;
- versão e data da lista técnica;
- data do pedido de inscrição;
- data da manifestação municipal;
- data da aprovação ou anuência;
- situação atual;
- documentos apresentados e seus metadados;
- data da última atualização;
- trilha resumida das alterações públicas.

### Mapa

O mapa nacional terá três camadas principais, com a geometria do Brasil em baixo contraste para deixar a leitura dos municípios no centro:

- azul: municípios indicados;
- dourado: processos em preenchimento ou em análise;
- verde/teal: municípios cadastrados;
- vermelho discreto: cadastro devolvido ou com pendência crítica.

Ao clicar em um município, o mapa abre um cartão com nome, UF, código IBGE, situação, data da última atualização e link para a ficha pública. O visitante poderá destacar apenas indicados, cadastrados ou processos em preenchimento. No protótipo, a hachura e a densidade dos pontos representam visualmente o universo de 2.095 indicados; na integração, cada ponto será alimentado pelo código IBGE e pela coordenada da lista oficial. A proposta mantém a possibilidade de integrar camadas do SGB, CEMADEN, ANA, IBGE e bases municipais.

### Evolução da metodologia de indicação

O portal deve explicar que a lista publicada representa a metodologia técnica vigente e que seus critérios podem ser aperfeiçoados e revisados conforme os estudos avancem. A definição de um índice poderá apoiar futuras atualizações metodológicas, sempre com comunicação da versão, data e origem dos critérios utilizados.

Como referência de pesquisa e experimentação, o portal poderá apontar para o [ICPM — plataforma preliminar de testes para estudos referentes à definição do índice](https://icpm.dpm-sedec-sas.tech/). Essa plataforma deve ser apresentada como ambiente preliminar de estudos, sem substituir a lista oficial da Casa Civil, o Cadastro Nacional ou as fontes normativas do processo.

## 5. Apoio da União e dos Estados

O sistema não deve transformar apoio técnico em documento obrigatório. Ele deve funcionar como uma área de orientação com links, modelos e canais. O art. 4º prevê apoio ao município indicado para o levantamento dos dados de risco, e o art. 6º prevê apoio da União e dos Estados na execução das ações do art. 5º, conforme disponibilidade orçamentária e financeira.

Sugestão de cartões de apoio:

- orientação para preparar o pacote de comprovação;
- modelos de inventário e relação georreferenciada;
- integração ou referência ao SGB/CPRM;
- apoio a mapeamento e planos de contingência;
- orientação sobre S2iD;
- dúvidas e contato técnico da SEDEC/DPM.

## 6. Arquitetura proposta

### Camadas

- **Frontend:** HTML, CSS e JavaScript no protótipo atual; pode evoluir para uma aplicação com componentes reutilizáveis;
- **API:** serviço HTTP responsável por autenticação, cadastro, upload, análise, transparência e auditoria;
- **Banco:** MySQL de testes na VPS Hostinger;
- **Arquivos:** diretório privado da VPS ou armazenamento compatível com S3, sempre com cópia do checksum e metadados no banco;
- **Mapa:** Leaflet ou OpenLayers na versão integrada; o protótipo atual usa mapa ilustrativo sem dependência externa;
- **Integração cartográfica:** referência ao catálogo de produtos SGB/CPRM e, na versão completa, consulta de disponibilidade por estado/município;
- **Autenticação:** OAuth/OIDC gov.br, com credenciais somente no ambiente do servidor.

### Estados do processo

`INDICADO → EM_PREENCHIMENTO → EM_ANALISE → CADASTRADO`

Possíveis retornos:

`EM_ANALISE → DEVOLVIDO`

Após correção:

`DEVOLVIDO → EM_PREENCHIMENTO`

## 7. Dicas para apresentação

1. Começar pela explicação “Indicação, cadastro e transparência” na tela inicial;
2. abrir a transparência sem login, alternando as camadas do mapa;
3. baixar separadamente a lista de indicados e a de cadastrados;
4. selecionar cada um dos quatro perfis e mostrar que cada painel tem uma finalidade;
5. clicar em “Entrar com gov.br” e mostrar que a prefeitura vê somente o próprio fluxo;
6. demonstrar o upload único, ressaltando que o município não precisa preencher sete formulários para iniciar a inscrição;
7. tentar avançar sem o atesto e mostrar a validação obrigatória;
8. abrir “Obrigações” para mostrar a separação entre cadastro inicial e obrigações continuadas.

## 8. Próximas entregas

1. API e banco de testes;
2. integração de upload com checksum e antivírus;
3. autenticação gov.br em ambiente de homologação;
4. carga oficial das listas técnicas e da base S2iD;
5. painel interno de análise e devolução;
6. publicação da consulta pública;
7. testes de acessibilidade, segurança e auditoria.
