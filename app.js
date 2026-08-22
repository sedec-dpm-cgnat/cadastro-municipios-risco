const views = [...document.querySelectorAll('[data-view]')];
const navItems = [...document.querySelectorAll('[data-view-target]')];
const modalBackdrop = document.querySelector('#modal-backdrop');
const modalTitle = document.querySelector('#modal-title');
const modalCopy = document.querySelector('#modal-copy');
const toast = document.querySelector('#toast');
let currentStep = 1;
let toastTimer;
let transparencyFilter = 'all';
let selectedRole = null;

const roleProfiles = {
  municipal: {
    title: 'Perfil municipal selecionado',
    copy: 'Continue para cadastrar ou acompanhar um município.',
    login: 'Entrar com gov.br',
    destination: 'dashboard',
    toast: 'Acesso municipal simulado para esta demonstração.',
    profile: 'Prefeitura de São Sebastião',
    profileType: 'Gestor municipal',
    topbar: 'Portal municipal'
  },
  estadual: {
    title: 'Perfil estadual selecionado',
    copy: 'Acompanhe os municípios do estado, a evolução das inscrições e os pedidos de apoio.',
    login: 'Acessar painel estadual',
    destination: 'indicados',
    toast: 'Acesso estadual simulado para esta demonstração.',
    profile: 'Defesa Civil do Estado de São Paulo',
    profileType: 'Gestão estadual',
    topbar: 'Portal estadual'
  },
  federal: {
    title: 'Perfil federal selecionado',
    copy: 'Monitore o universo técnico, as indicações, as análises e a visão nacional do Cadastro.',
    login: 'Acessar painel federal',
    destination: 'indicados',
    toast: 'Acesso federal simulado para esta demonstração.',
    profile: 'SEDEC · DPM',
    profileType: 'Gestão federal',
    topbar: 'Portal federal'
  },
  controle: {
    title: 'Perfil de controle selecionado',
    copy: 'Consulte dados públicos, trilhas de atualização e documentos do Cadastro para controle e fiscalização.',
    login: 'Acessar painel de controle',
    destination: 'transparencia',
    toast: 'Acesso institucional simulado para esta demonstração.',
    profile: 'Órgão de controle e fiscalização',
    profileType: 'Consulta institucional',
    topbar: 'Portal de controle'
  }
};

const actionMessages = {
  ajuda: ['Central de ajuda', 'Aqui entram os canais de orientação, perguntas frequentes e o contato técnico da equipe responsável pelo cadastro.'],
  ambiente: ['Ambiente de demonstração', 'Este protótipo usa dados ilustrativos inspirados no fluxo institucional. Nenhum documento ou informação será enviado para um serviço real.'],
  perfil: ['Perfil municipal', 'A troca de município e o gerenciamento de perfis entram nesta área na versão integrada ao acesso gov.br.'],
  suporte: ['Apoio técnico', 'O município poderá consultar modelos, formatos aceitos e canais de apoio de SGB, CEMADEN, ANA, S2iD e DPM.'],
  guia: ['Guia de preenchimento', 'O guia apresenta cada obrigação, exemplos de documentos e a estrutura recomendada para arquivos geoespaciais.'],
  anexar: ['Anexar documento', 'O seletor de arquivos será conectado ao repositório oficial nesta etapa. A demonstração preserva o fluxo sem enviar dados.'],
  visualizar: ['Visualização segura', 'A ficha do documento mostrará metadados, versão, data de envio e opção de download público, conforme as regras de transparência.'],
  'saiba-mais': ['Finalidade preventiva', 'A inscrição organiza informações sobre áreas suscetíveis, amplia a transparência e orienta o apoio técnico ao município.'],
  historico: ['Rastro do processo', 'A linha do tempo completa exibirá cada atualização, responsável, documento e decisão, com trilha de auditoria.'],
  'baixar-checklist': ['Checklist pronto para exportação', 'Nesta demonstração, a exportação está simulada. A versão integrada poderá gerar PDF ou planilha com as pendências do município.'],
  formatos: ['Formatos e modelos', 'A área reunirá modelos de ofício, estrutura de shapefile, GeoJSON, planilha de setores e orientações para cada evidência.'],
  camadas: ['Adicionar camada', 'O município poderá importar GeoJSON, shapefile compactado ou conectar uma camada publicada por órgão técnico.'],
  exportar: ['Exportar visão', 'A exportação reunirá mapa, camadas ativas e metadados da consulta em um arquivo compartilhável.'],
  configurar: ['Configurar camadas', 'Aqui entram filtros por fonte, tipo de ameaça, grau de risco, data de atualização e situação da ocupação.'],
  integrar: ['Integração de mapeamentos', 'A interface foi desenhada para comparar bases municipais com SGB, CEMADEN, ANA e outras fontes oficiais.'],
  notificacao: ['Minuta de notificação', 'A minuta de comunicação conjunta aos 206 municípios do Rio Grande do Sul está disponível para revisão institucional.'],
  detalhe: ['Ficha pública do município', 'A ficha detalhada exibirá pedido de inscrição, manifestação, aprovação, documentos e histórico de atualizações.'],
  'base-legal': ['Comprovação da área de risco', 'O pacote pode reunir inventário, relação georreferenciada de imóveis e infraestruturas expostas e outros documentos emitidos por órgãos públicos ou por agentes privados legalmente habilitados com metodologia reconhecida.'],
  'apoio-uniao': ['Apoio da União e dos Estados', 'O Decreto prevê apoio aos municípios na execução das ações do art. 5º, conforme as competências e a disponibilidade orçamentária e financeira. A versão integrada poderá reunir os caminhos de apoio técnico disponíveis.'],
  art5: ['Campo pós-inscrição', 'Este campo será habilitado depois que a inscrição do município for efetivada. O responsável poderá anexar o documento, informar a versão e registrar a atualização anual.'],
  'salvar-obrigacoes': ['Atualizações salvas', 'Nesta demonstração, os arquivos e informações permanecem apenas no navegador. Na versão integrada, cada evidência será armazenada com metadados, checksum, histórico e trilha de auditoria.'],
  acessibilidade: ['Acessibilidade', 'O produto final prevê navegação por teclado, contraste adequado, textos alternativos, linguagem clara e consulta pública sem barreiras.'],
  enviar: ['Enviar cadastro inicial', 'O cadastro será encaminhado para análise técnica após a conferência da comprovação e da manifestação municipal. Nesta demonstração, nenhum dado é enviado.']
};

function openView(viewName) {
  views.forEach(view => view.classList.toggle('is-visible', view.dataset.view === viewName));
  navItems.forEach(item => item.classList.toggle('is-active', item.dataset.viewTarget === viewName));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openModal(key = 'ambiente') {
  const [title, copy] = actionMessages[key] || actionMessages.ambiente;
  modalTitle.textContent = title;
  modalCopy.textContent = copy;
  modalBackdrop.classList.add('is-open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modalBackdrop.classList.remove('is-open');
  modalBackdrop.setAttribute('aria-hidden', 'true');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2800);
}

function unlockPortal(destination = 'dashboard', message = 'Acesso gov.br simulado para esta demonstração.') {
  if (!selectedRole) {
    showToast('Escolha um perfil antes de continuar.');
    return;
  }
  document.querySelector('#auth-screen').style.display = 'none';
  document.querySelector('#app-frame').classList.add('is-unlocked');
  const profile = roleProfiles[selectedRole] || roleProfiles.municipal;
  const topbarKicker = document.querySelector('.topbar-kicker');
  const profileName = document.querySelector('.profile-text strong');
  const profileType = document.querySelector('.profile-text small');
  if (topbarKicker) topbarKicker.textContent = profile.topbar;
  if (profileName) profileName.textContent = profile.profile;
  if (profileType) profileType.textContent = profile.profileType;
  openView(destination);
  showToast(message);
}

function openPublicView(destination, message) {
  document.querySelector('#auth-screen').style.display = 'none';
  document.querySelector('#app-frame').classList.add('is-unlocked');
  const topbarKicker = document.querySelector('.topbar-kicker');
  const profileName = document.querySelector('.profile-text strong');
  const profileType = document.querySelector('.profile-text small');
  if (topbarKicker) topbarKicker.textContent = 'Consulta pública';
  if (profileName) profileName.textContent = 'Acesso aberto';
  if (profileType) profileType.textContent = 'Sem autenticação';
  openView(destination);
  showToast(message);
}

function setStep(step) {
  currentStep = Math.max(1, Math.min(4, Number(step)));
  document.querySelectorAll('[data-step-panel]').forEach(panel => panel.classList.toggle('active', Number(panel.dataset.stepPanel) === currentStep));
  document.querySelectorAll('[data-step-nav]').forEach(button => {
    const itemStep = Number(button.dataset.stepNav);
    button.classList.toggle('active', itemStep === currentStep);
    button.classList.toggle('done', itemStep < currentStep);
    if (itemStep < currentStep) button.querySelector('span').textContent = '✓';
    else button.querySelector('span').textContent = itemStep;
  });
  showToast(`Etapa ${currentStep} de 4 selecionada.`);
}

navItems.forEach(item => item.addEventListener('click', () => {
  const target = item.dataset.viewTarget;
  if (target) openView(target);
  if (item.dataset.stepGo) setStep(item.dataset.stepGo);
}));

document.querySelectorAll('[data-access-role]').forEach(button => button.addEventListener('click', () => {
  selectedRole = button.dataset.accessRole;
  const profile = roleProfiles[selectedRole];
  document.querySelectorAll('[data-access-role]').forEach(item => {
    const isSelected = item === button;
    item.classList.toggle('is-selected', isSelected);
    item.setAttribute('aria-selected', String(isSelected));
  });
  document.querySelector('#selected-role-note strong').textContent = profile.title;
  document.querySelector('#selected-role-note span').textContent = profile.copy;
  document.querySelector('#login-button-label').textContent = profile.login;
  document.querySelector('#auth-login-copy').textContent = profile.copy;
  const loginButton = document.querySelector('#govbr-login');
  loginButton.hidden = false;
  loginButton.classList.toggle('institutional-login', selectedRole !== 'municipal');
  loginButton.querySelector('.govbr-symbol').textContent = selectedRole === 'municipal' ? '◎' : '◈';
}));

document.querySelector('#govbr-login').addEventListener('click', () => {
  const profile = roleProfiles[selectedRole] || roleProfiles.municipal;
  unlockPortal(profile.destination, profile.toast);
});
document.querySelector('#public-access').addEventListener('click', () => openPublicView('transparencia', 'Consulta pública aberta sem autenticação.'));
document.querySelectorAll('[data-entry-destination]').forEach(button => button.addEventListener('click', () => {
  const destination = button.dataset.entryDestination;
  const message = destination === 'indicados' ? 'Abrindo a explicação e o mapa dos municípios indicados.' : 'Abrindo o mapa das inscrições concluídas.';
  openPublicView(destination, message);
}));

document.querySelectorAll('[data-step-nav]').forEach(button => button.addEventListener('click', () => setStep(button.dataset.stepNav)));
const municipalityNameInput = document.querySelector('#municipality-name');
const indicationSection = document.querySelector('#indication-attestation-section');
const indicationAttestation = document.querySelector('#indication-attestation');
const indicationStepCopy = document.querySelector('#indication-step-copy');
const indicatedMunicipalities = new Set(['sao sebastiao', 'caraguatatuba', 'ubatuba', 'ilhabela']);
function normalizeMunicipalityName(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
function updateIndicationRequirement() {
  if (!municipalityNameInput || !indicationSection) return;
  const municipalityIsIndicated = indicatedMunicipalities.has(normalizeMunicipalityName(municipalityNameInput.value));
  indicationSection.hidden = !municipalityIsIndicated;
  if (!municipalityIsIndicated && indicationAttestation) indicationAttestation.checked = false;
  if (indicationStepCopy) indicationStepCopy.textContent = municipalityIsIndicated ? 'Como o município consta na lista de indicados, a inscrição depende da manifestação prévia do responsável.' : 'Este município não está identificado no recorte demonstrativo da lista de indicados. O atesto de concordância não é necessário.';
}
if (municipalityNameInput) {
  municipalityNameInput.addEventListener('input', updateIndicationRequirement);
  municipalityNameInput.addEventListener('change', updateIndicationRequirement);
  updateIndicationRequirement();
}
document.querySelector('[data-step-next]').addEventListener('click', () => {
  if (currentStep === 3 && indicationSection && !indicationSection.hidden && !document.querySelector('#indication-attestation').checked) {
    showToast('Marque o atesto obrigatório para continuar.');
    document.querySelector('#indication-attestation').focus();
    return;
  }
  if (currentStep < 4) setStep(currentStep + 1);
  else openModal('enviar');
});
document.querySelector('[data-step-prev]').addEventListener('click', () => setStep(currentStep - 1));

document.querySelectorAll('[data-demo-action]').forEach(button => button.addEventListener('click', () => openModal(button.dataset.demoAction)));
document.querySelectorAll('[data-view-target]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.viewTarget) openView(button.dataset.viewTarget);
  if (button.dataset.stepGo) setStep(button.dataset.stepGo);
}));

document.querySelector('#modal-close').addEventListener('click', closeModal);
document.querySelector('#modal-ok').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', event => { if (event.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

const docFilter = document.querySelector('#doc-filter');
if (docFilter) docFilter.addEventListener('change', () => {
  const filter = docFilter.value;
  document.querySelectorAll('.obligation-detail').forEach(row => {
    const matches = filter === 'all' || (filter === 'done' && row.classList.contains('done')) || (filter === 'pending' && row.classList.contains('pending'));
    row.style.display = matches ? 'flex' : 'none';
  });
});

const enableObligations = document.querySelector('#enable-obligations');
const enabledObligations = document.querySelector('#enabled-obligations');
const postRegistrationCopy = document.querySelector('#post-registration-copy');
const postRegistrationStatus = document.querySelector('#post-registration-status');
const documentSummaryScore = document.querySelector('.doc-summary .big-score');
const documentScoreTrack = document.querySelector('.doc-summary .score-track span');
const documentSummaryFoot = document.querySelector('.doc-summary .summary-foot');
function refreshObligationSummary() {
  if (!enabledObligations) return;
  const rows = [...enabledObligations.querySelectorAll('[data-obligation-card]')];
  const completed = rows.filter(row => {
    const fileInput = row.querySelector('[data-obligation-file]');
    const statusSelect = row.querySelector('select');
    return Boolean(fileInput?.files?.length) || ['Enviado', 'Aprovado'].includes(statusSelect?.value);
  }).length;
  if (documentSummaryScore) documentSummaryScore.innerHTML = `${completed}<span>/${rows.length}</span>`;
  if (documentScoreTrack) documentScoreTrack.style.width = `${rows.length ? (completed / rows.length) * 100 : 0}%`;
  if (documentSummaryFoot) documentSummaryFoot.innerHTML = `<span><i class="mini-dot green"></i> ${completed} liberadas</span><span><i class="mini-dot orange"></i> ${rows.length - completed} aguardando</span><span>Atualização anual após a inscrição</span>`;
}
if (enableObligations && enabledObligations) {
  enableObligations.addEventListener('click', () => {
    enabledObligations.hidden = false;
    enableObligations.style.display = 'none';
    if (postRegistrationCopy) postRegistrationCopy.textContent = 'Modo de demonstração: a inscrição foi efetivada e os sete campos de acompanhamento estão disponíveis para atualização.';
    if (postRegistrationStatus) {
      postRegistrationStatus.className = 'status-badge status-success';
      postRegistrationStatus.innerHTML = '<span></span> Cadastrado';
    }
    refreshObligationSummary();
    showToast('Painel pós-cadastro habilitado.');
    enabledObligations.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

document.querySelectorAll('[data-obligation-file]').forEach(input => input.addEventListener('change', () => {
  const row = input.closest('[data-obligation-card]');
  const feedback = row?.querySelector('[data-obligation-feedback]');
  const status = row?.querySelector('[data-obligation-status]');
  const selectedFile = input.files[0];
  if (!selectedFile) return;
  if (feedback) feedback.textContent = selectedFile.name;
  if (status) {
    status.textContent = 'Arquivo selecionado';
    status.className = 'row-status success';
  }
  refreshObligationSummary();
  showToast(`Arquivo da obrigação ${row?.dataset.obligationCard || ''} selecionado.`);
}));

if (enabledObligations) enabledObligations.querySelectorAll('select').forEach(select => select.addEventListener('change', () => {
  const row = select.closest('[data-obligation-card]');
  const status = row?.querySelector('[data-obligation-status]');
  if (status) {
    status.textContent = select.value;
    status.className = `row-status ${select.value === 'Aprovado' ? 'success' : select.value === 'Enviado' ? 'warning' : 'neutral'}`;
  }
  refreshObligationSummary();
}));

const saveObligations = document.querySelector('[data-obligations-save]');
if (saveObligations) saveObligations.addEventListener('click', () => openModal('salvar-obrigacoes'));

const municipalitySearch = document.querySelector('#municipality-search');
const publicStatus = document.querySelector('#public-status');
function filterMunicipalities() {
  const query = (municipalitySearch.value || '').toLowerCase().trim();
  const status = publicStatus.value;
  document.querySelectorAll('#municipality-table tr').forEach(row => {
    const text = row.textContent.toLowerCase();
    const matchesQuery = !query || text.includes(query);
    const matchesStatus = status === 'all' || text.includes(status.toLowerCase());
    const matchesCategory = transparencyFilter === 'all' || row.dataset.category === transparencyFilter;
    row.style.display = matchesQuery && matchesStatus && matchesCategory ? '' : 'none';
  });
}
if (municipalitySearch) municipalitySearch.addEventListener('input', filterMunicipalities);
if (publicStatus) publicStatus.addEventListener('change', filterMunicipalities);

const proofUpload = document.querySelector('[data-proof-upload]');
const proofFile = document.querySelector('#proof-file');
if (proofUpload && proofFile) {
  proofUpload.addEventListener('click', () => proofFile.click());
  proofFile.addEventListener('change', () => {
    const selectedFile = proofFile.files[0];
    if (!selectedFile) return;
    const fileName = document.querySelector('.upload-placeholder strong');
    const fileStatus = document.querySelector('.upload-placeholder .row-status');
    fileName.textContent = selectedFile.name;
    fileStatus.textContent = 'Arquivo selecionado';
    showToast('Pacote de comprovação selecionado.');
  });
}

document.querySelectorAll('[data-transparency-filter]').forEach(button => button.addEventListener('click', () => {
  transparencyFilter = button.dataset.transparencyFilter;
  document.querySelectorAll('[data-transparency-filter]').forEach(item => item.classList.toggle('active', item === button));
  filterMunicipalities();
  const labels = { all: 'Visão geral', indicated: 'Municípios indicados', registered: 'Municípios cadastrados', 'in-progress': 'Processos em preenchimento' };
  showToast(`${labels[transparencyFilter]} selecionados.`);
}));

function setPublicMapFilter(filter) {
  document.querySelectorAll('[data-public-map-filter]').forEach(button => button.classList.toggle('active', button.dataset.publicMapFilter === filter));
  const mapCanvas = document.querySelector('.public-map-canvas');
  if (mapCanvas) mapCanvas.dataset.mapFilter = filter;
  const points = [...document.querySelectorAll('.public-map-canvas .public-map-point')];
  points.forEach(point => point.classList.toggle('is-dimmed', filter !== 'all' && point.dataset.mapCategory !== filter));
  const labels = { all: '2.095 indicados · 5 cadastrados', indicated: '2.095 indicados', registered: '5 cadastrados', 'in-progress': 'processos em preenchimento' };
  const counter = document.querySelector('#map-counter');
  if (counter) counter.textContent = labels[filter] || labels.all;
}

document.querySelectorAll('[data-public-map-filter]').forEach(button => button.addEventListener('click', () => {
  setPublicMapFilter(button.dataset.publicMapFilter);
  const labels = { all: 'Visão geral', indicated: 'Indicados', registered: 'Cadastrados', 'in-progress': 'Em preenchimento' };
  showToast(`${labels[button.dataset.publicMapFilter]} destacados no mapa.`);
}));

function createMapSvgElement(tagName, attributes = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

function createMapLabel(svg, value, caption) {
  const label = createMapSvgElement('g', { class: 'map-coverage-label' });
  label.append(
    createMapSvgElement('rect', { x: 25, y: 23, width: 164, height: 57, rx: 9 }),
    createMapSvgElement('text', { x: 40, y: 49, class: 'map-coverage-value' })
  );
  label.querySelector('.map-coverage-value').textContent = value;
  const captionText = createMapSvgElement('text', { x: 40, y: 67, class: 'map-coverage-caption' });
  captionText.textContent = caption;
  label.append(captionText);
  svg.append(label);
}

function createCoveragePattern(defs, id, tone) {
  const pattern = createMapSvgElement('pattern', { id, width: 12, height: 12, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(8)' });
  pattern.append(createMapSvgElement('path', { d: 'M 0 0 V 12 M 6 0 V 12', class: `coverage-hatch-line ${tone}` }));
  defs.append(pattern);
}

const fallbackBrazilPath = 'M369.1 344L365.1 339.4L371.5 335.5L363.1 329.9L351.7 325.4L336.8 320.1L331.4 320.3L316.8 314L307.5 314.9L326.8 303.7L343.2 295.7L352.9 292.4L365.1 287.9L365.4 281.3L358.1 276.6L350.9 278.2L353.8 273.4L355.7 268.6L355.7 264.1L350.5 262.6L345.1 263.9L339.7 263.6L338 260.4L336.6 252.9L333.9 250.4L324.2 248.2L318.2 249.8L302.9 248.2L303.9 237.1L299.6 232.5L304.1 230.9L302.7 226.2L306.7 222.6L309.3 216.1L305.8 211L298 208.7L296.4 205.5L298.5 200.7L270.7 200.4L265.1 190.9L269.3 190.7L269.2 187.2L266.3 184.8L265.7 180.1L257.3 177.6L248.2 177.7L242.1 175.3L232.3 173.7L226.6 170.6L210.4 169.3L194.6 161.9L195.8 156.4L194.1 153.3L195.6 147.1L176.6 148.5L169 151.6L156.3 154.9L153 157.4L145.6 157.6L134.8 156.9L126.6 158.3L120.1 157.4L121 144.9L109.1 149.7L96.3 149.5L90.8 145.2L81.2 144.7L84.3 141.2L76.2 136.2L70.2 128.8L74 127.3L74 123.8L82.8 121.5L81.3 117L85 114.2L86.1 110.4L102.7 104.8L114.5 103.2L116.5 102L129.6 102.3L136.1 79.9L136.4 76.3L134.1 71.6L127.7 68.6L127.8 62.7L135.9 61.3L138.8 62.2L139.3 59L130.9 58.2L130.6 53L158.9 53.2L163.7 50.4L167.7 53L170.6 57.8L173.3 56.8L181.3 61.2L192.6 60.6L195.4 58.1L206.1 56.2L212.1 54.9L213.8 51.4L224.1 49.1L223.4 47.3L211.1 46.6L209.1 41.5L209.7 36L203.2 33.8L205.9 33.1L216.6 34.1L228.2 36.2L232.3 34.2L242.8 33L259 29.9L264.3 26.8L262.4 24.5L269.9 24.1L273.3 26L271.4 29.6L276.4 30.8L279.7 34.6L275.7 37.5L273.4 44.5L277.1 48.7L278.1 52.5L287 56.3L294.2 56.7L295.8 55.1L300.4 54.7L306.9 53.3L311.6 51.1L319.7 51.8L323.2 51.5L331 52.2L332.4 50.5L330 48.9L331.4 46.5L337.3 47.2L344.1 46.4L352.4 48.1L358.7 49.8L363.2 47.6L366.4 48L368.4 50.3L375.4 49.7L381 46.6L385.4 40.5L393.9 33L398.9 32.6L402.5 37.2L410.6 51.5L418.4 52.9L418.7 58.5L407.9 65.3L412.4 67.7L438 69L438.5 77.3L449.5 71.9L467.8 74.8L491.9 79.8L498.9 84.6L496.6 89.2L513.4 86.6L541.6 91L563.3 90.7L584.7 97.4L603.3 106.6L614.4 109L626.8 109.3L632.1 111.9L637 122.3L639.4 127.3L633.7 140.9L626.2 146.2L605.8 157.6L596.6 166.9L585.8 174L582.2 174.2L578.2 180.2L579.2 195.6L575.2 208.2L573.6 213.6L569 216.8L566.5 227.8L551.8 238.5L549.3 247L537.6 250.5L534.2 255.5L518.4 255.4L495.6 258.6L485.4 262.2L469.2 264.6L452.1 271.2L439.8 279.3L437.7 285.4L440.1 289.9L437.4 298.2L434.1 302.2L424 306.7L407.9 321.2L395.1 327.7L385.3 331.5L378.7 339.3L369.1 344Z';

function buildFallbackBrazilCoverageMap(svg) {
  const mapHost = svg.closest('.national-map-shell') || svg.closest('.public-map-canvas');
  const isPublicMap = Boolean(svg.closest('.public-map-canvas'));
  const isRegisteredMode = mapHost?.classList.contains('registered-mode');
  const isIndicatedMode = mapHost?.classList.contains('indicated-mode');
  const mapId = `fallback-${Math.random().toString(36).slice(2, 8)}`;
  const defs = createMapSvgElement('defs');
  createCoveragePattern(defs, `${mapId}-hatch`, isRegisteredMode ? 'gray' : 'blue');
  const clip = createMapSvgElement('clipPath', { id: `${mapId}-clip` });
  clip.append(createMapSvgElement('path', { d: fallbackBrazilPath }));
  defs.append(clip);
  svg.replaceChildren(defs);
  svg.setAttribute('viewBox', '0 0 720 385');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', isRegisteredMode ? 'Mapa do Brasil com 2.095 municípios indicados em hachura cinza e cinco municípios cadastrados destacados em verde' : 'Mapa do Brasil com 2.095 municípios indicados em hachura e municípios cadastrados destacados');
  svg.append(
    createMapSvgElement('path', { d: fallbackBrazilPath, class: 'brazil-base' }),
    createMapSvgElement('path', { d: fallbackBrazilPath, class: 'brazil-hatch', fill: `url(#${mapId}-hatch)` }),
    createMapSvgElement('path', { d: fallbackBrazilPath, class: 'brazil-outline' })
  );

  const density = createMapSvgElement('g', { class: 'indicated-density', 'clip-path': `url(#${mapId}-clip)` });
  let densitySeed = 20952025;
  const densityRandom = () => {
    densitySeed = (densitySeed * 1664525 + 1013904223) >>> 0;
    return densitySeed / 4294967296;
  };
  for (let index = 0; index < 2095; index += 1) {
    density.append(createMapSvgElement('circle', {
      cx: 72 + densityRandom() * 575,
      cy: 25 + densityRandom() * 322,
      r: isRegisteredMode ? .95 : 1.05,
      class: isPublicMap ? 'public-map-point indicated' : 'national-indicated-dot',
      'data-map-category': 'indicated',
      'aria-label': 'Município indicado'
    }));
  }
  svg.append(density);

  const registeredMunicipalities = [[426, 303], [514, 211], [467, 243], [637, 126], [274, 119]];
  if (!isIndicatedMode) {
    const registeredLayer = createMapSvgElement('g', { class: 'registered-density' });
    registeredMunicipalities.forEach(([cx, cy], index) => {
      const group = createMapSvgElement('g', { class: isPublicMap ? 'public-map-point registered' : 'registered-dot', 'data-map-category': 'registered' });
      group.append(createMapSvgElement('circle', { cx, cy, r: 10, class: 'registered-halo' }), createMapSvgElement('circle', { cx, cy, r: 5.5 }), createMapSvgElement('title', {}));
      group.querySelector('title').textContent = `Cadastro efetivado ${String(index + 1).padStart(2, '0')} · recorte demonstrativo`;
      registeredLayer.append(group);
    });
    svg.append(registeredLayer);
  }
  if (isPublicMap) {
    const process = createMapSvgElement('g', { class: 'public-map-point in-progress', 'data-map-category': 'in-progress' });
    process.append(createMapSvgElement('circle', { cx: 411, cy: 233, r: 7 }), createMapSvgElement('title', {}));
    process.querySelector('title').textContent = 'São Sebastião · SP · Processo em preenchimento · recorte demonstrativo';
    svg.append(process);
  }
  createMapLabel(svg, isIndicatedMode ? '2.095' : '2.095 + 5', isIndicatedMode ? 'municípios indicados' : isRegisteredMode ? 'indicados · cadastrados' : 'indicação · cadastro');
}

function buildBrazilCoverageMap(svg, brazilFeature, indicatedLocations) {
  const mapHost = svg.closest('.national-map-shell') || svg.closest('.public-map-canvas');
  const isPublicMap = Boolean(svg.closest('.public-map-canvas'));
  const isRegisteredMode = mapHost?.classList.contains('registered-mode');
  const isIndicatedMode = mapHost?.classList.contains('indicated-mode');
  const projection = d3.geoMercator().fitExtent([[70, 22], [650, 350]], brazilFeature);
  const path = d3.geoPath(projection);
  const brazilPath = path(brazilFeature);
  if (!brazilPath) return;

  const mapId = `coverage-${Math.random().toString(36).slice(2, 8)}`;
  const defs = createMapSvgElement('defs');
  createCoveragePattern(defs, `${mapId}-hatch`, isRegisteredMode ? 'gray' : 'blue');
  svg.replaceChildren(defs);
  svg.setAttribute('viewBox', '0 0 720 385');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', isRegisteredMode ? 'Mapa do Brasil com 2.095 municípios indicados em hachura cinza e cinco municípios cadastrados destacados em verde' : 'Mapa do Brasil com 2.095 municípios indicados em hachura e municípios cadastrados destacados');

  const base = createMapSvgElement('path', { d: brazilPath, class: 'brazil-base' });
  const hatch = createMapSvgElement('path', { d: brazilPath, class: 'brazil-hatch', fill: `url(#${mapId}-hatch)` });
  const outline = createMapSvgElement('path', { d: brazilPath, class: 'brazil-outline' });
  svg.append(base, hatch, outline);

  const density = createMapSvgElement('g', { class: 'indicated-density' });
  indicatedLocations.forEach(([longitude, latitude]) => {
    const point = projection([longitude, latitude]);
    if (!point) return;
    const pointElement = createMapSvgElement('circle', {
      cx: point[0], cy: point[1], r: isRegisteredMode ? 0.95 : 1.05,
      class: isPublicMap ? 'public-map-point indicated' : 'national-indicated-dot',
      'data-map-category': 'indicated',
      'aria-label': 'Município indicado'
    });
    density.append(pointElement);
  });
  svg.append(density);

  const registeredMunicipalities = [
    ['Porto Alegre', 'RS', -51.2300, -30.0346],
    ['Rio de Janeiro', 'RJ', -43.1729, -22.9068],
    ['São Paulo', 'SP', -46.6333, -23.5505],
    ['Recife', 'PE', -34.8770, -8.0476],
    ['Manaus', 'AM', -60.0217, -3.1190]
  ];
  if (!isIndicatedMode) {
    const registeredLayer = createMapSvgElement('g', { class: 'registered-density' });
    registeredMunicipalities.forEach(([name, uf, longitude, latitude], index) => {
      const point = projection([longitude, latitude]);
      if (!point) return;
      const group = createMapSvgElement('g', { class: isPublicMap ? 'public-map-point registered' : 'registered-dot', 'data-map-category': 'registered' });
      group.append(
        createMapSvgElement('circle', { cx: point[0], cy: point[1], r: 10, class: 'registered-halo' }),
        createMapSvgElement('circle', { cx: point[0], cy: point[1], r: 5.5 }),
        createMapSvgElement('title', {})
      );
      group.querySelector('title').textContent = `${name} · ${uf} · Cadastro efetivado ${String(index + 1).padStart(2, '0')} · recorte demonstrativo`;
      registeredLayer.append(group);
    });
    svg.append(registeredLayer);
  }

  if (isPublicMap) {
    const [longitude, latitude] = [-45.4095, -23.7950];
    const point = projection([longitude, latitude]);
    if (point) {
      const process = createMapSvgElement('g', { class: 'public-map-point in-progress', 'data-map-category': 'in-progress' });
      process.append(createMapSvgElement('circle', { cx: point[0], cy: point[1], r: 7 }), createMapSvgElement('title', {}));
      process.querySelector('title').textContent = 'São Sebastião · SP · Processo em preenchimento · recorte demonstrativo';
      svg.append(process);
    }
  }

  createMapLabel(svg, isIndicatedMode ? '2.095' : isRegisteredMode ? '2.095 + 5' : '2.095 + 5', isIndicatedMode ? 'municípios indicados' : isRegisteredMode ? 'indicados · cadastrados' : 'indicação · cadastro');
}

async function renderBrazilCoverageMaps() {
  const mapSvgs = document.querySelectorAll('.public-map-canvas svg, .national-map-shell svg');
  if (!window.d3 || !window.topojson || typeof fetch !== 'function') {
    mapSvgs.forEach(svg => buildFallbackBrazilCoverageMap(svg));
    setPublicMapFilter('all');
    return;
  }
  try {
    const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    if (!response.ok) throw new Error('Não foi possível carregar a geometria nacional.');
    const world = await response.json();
    const countries = topojson.feature(world, world.objects.countries).features;
    const brazil = countries.find(feature => String(feature.id).padStart(3, '0') === '076');
    if (!brazil) throw new Error('Geometria do Brasil não encontrada.');

    const indicatedLocations = [];
    let seed = 20952025;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    let attempts = 0;
    while (indicatedLocations.length < 2095 && attempts < 40000) {
      attempts += 1;
      const longitude = -73.9 + random() * 39.4;
      const latitude = -33.7 + random() * 29.8;
      if (d3.geoContains(brazil, [longitude, latitude])) indicatedLocations.push([longitude, latitude]);
    }

    mapSvgs.forEach(svg => buildBrazilCoverageMap(svg, brazil, indicatedLocations));
    setPublicMapFilter('all');
  } catch (error) {
    console.warn('Mapa nacional dinâmico indisponível; mantendo a prévia ilustrativa.', error);
    mapSvgs.forEach(svg => buildFallbackBrazilCoverageMap(svg));
    setPublicMapFilter('all');
  }
}

renderBrazilCoverageMaps();

function csvValue(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function downloadMunicipalities(category) {
  const rows = [...document.querySelectorAll('#municipality-table tr')].filter(row => category === 'all' || row.dataset.category === category);
  const header = ['Município', 'Código IBGE', 'UF', 'Origem', 'Pedido de inscrição', 'Manifestação municipal', 'Aprovação / anuência', 'Documentos', 'Situação'];
  const data = rows.map(row => {
    const cells = [...row.querySelectorAll('td')];
    return [cells[0]?.querySelector('strong')?.textContent.trim() || '', cells[0]?.querySelector('small')?.textContent.replace('IBGE', '').trim() || '', cells[1]?.textContent.trim() || '', cells[2]?.textContent.trim() || '', cells[3]?.textContent.trim() || '', cells[4]?.textContent.trim() || '', cells[5]?.textContent.trim() || '', cells[6]?.textContent.trim() || '', cells[7]?.textContent.trim() || ''];
  });
  const csv = `\uFEFF${[header, ...data].map(line => line.map(csvValue).join(';')).join('\r\n')}`;
  const fileName = { indicated: 'municipios-indicados-cnm-risco.csv', registered: 'municipios-cadastrados-cnm-risco.csv', all: 'recorte-cnm-risco.csv' }[category] || 'dados-cnm-risco.csv';
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast(`Download preparado: ${fileName}.`);
}

document.querySelectorAll('[data-download]').forEach(button => button.addEventListener('click', () => downloadMunicipalities(button.dataset.download)));

document.querySelector('#global-search').addEventListener('keydown', event => {
  if (event.key !== 'Enter') return;
  const query = event.currentTarget.value.toLowerCase();
  const match = query.includes('mapa') || query.includes('risco') ? 'mapa' : query.includes('document') || query.includes('obrig') ? 'documentos' : query.includes('transpar') || query.includes('munic') ? 'transparencia' : query.includes('cadastro') ? 'cadastro' : null;
  if (match) { openView(match); showToast(`Seção encontrada: ${match}.`); }
  else openModal('ajuda');
});

document.querySelectorAll('.map-pill').forEach(pill => pill.addEventListener('click', () => {
  document.querySelectorAll('.map-pill').forEach(item => item.classList.remove('active'));
  pill.classList.add('active');
  showToast(`Camada ${pill.textContent} selecionada.`);
}));

const territoryMunicipality = document.querySelector('#territory-municipality');
const territoryUf = document.querySelector('#territory-uf');
const territorySearch = document.querySelector('#territory-search');
const territoryStateCount = document.querySelector('#territory-state-count');
const territoryResultTitle = document.querySelector('#territory-result-title');
const territoryResultCopy = document.querySelector('#territory-result-copy');
const territoryCatalogLink = document.querySelector('#territory-catalog-link');
const territoryRiskLink = document.querySelector('#territory-risk-link');
const territorySusceptibilityLink = document.querySelector('#territory-susceptibility-link');
const territoryMapName = document.querySelector('#territory-map-name');
const territoryMapStatus = document.querySelector('#territory-map-status');
const territoryMapAttribution = document.querySelector('#territory-map-attribution');
const territorySgbLayerCopy = document.querySelector('#territory-sgb-layer-copy');
const sgbStateCounts = { AC: 22, AL: 37, AP: 8, AM: 62, BA: 95, CE: 72, DF: 1, ES: 77, GO: 28, MA: 93, MT: 32, MS: 24, MG: 222, PA: 96, PB: 40, PR: 46, PE: 115, PI: 48, RJ: 5, RN: 32, RS: 134, RO: 52, RR: 5, SC: 294, SP: 126, SE: 31, TO: 15 };
const sgbStateCatalogs = { SP: 'https://sgb.gov.br/cartografia-de-riscos-geologicos-sao-paulo' };
function updateTerritorySource(showFeedback = false) {
  if (!territoryMunicipality || !territoryUf) return;
  const municipality = territoryMunicipality.value.trim() || 'Município selecionado';
  const uf = territoryUf.value;
  const count = sgbStateCounts[uf] || 0;
  const catalogUrl = sgbStateCatalogs[uf] || 'https://www.sgb.gov.br/produtos-por-estado-cartografia-de-riscos-geologicos';
  if (territoryResultTitle) territoryResultTitle.textContent = `${municipality} · ${uf}`;
  if (territoryResultCopy) territoryResultCopy.textContent = `O catálogo do SGB/CPRM informa ${count} municípios mapeados em ${uf}. Nesta demonstração, a consulta está pronta para ser vinculada ao código IBGE, aos produtos encontrados e aos metadados do processo municipal.`;
  if (territoryStateCount) territoryStateCount.innerHTML = `${String(count).padStart(3, '0')}<small>municípios mapeados em ${uf}</small>`;
  if (territoryCatalogLink) {
    territoryCatalogLink.href = catalogUrl;
    territoryCatalogLink.textContent = `Abrir catálogo SGB/CPRM de ${uf} ↗`;
  }
  if (territoryRiskLink) territoryRiskLink.href = catalogUrl;
  if (territorySusceptibilityLink) territorySusceptibilityLink.href = 'https://www.sgb.gov.br/produtos-por-estado-cartografia-de-suscetibilidade';
  if (territoryMapName) territoryMapName.textContent = `${municipality.toUpperCase()} · ${uf}`;
  if (territoryMapStatus) territoryMapStatus.textContent = `${count} municípios mapeados no estado`;
  if (territoryMapAttribution) territoryMapAttribution.textContent = `Prévia municipal · referência SGB/CPRM · catálogo ${uf}`;
  if (territorySgbLayerCopy) territorySgbLayerCopy.textContent = `Catálogo por município · ${count} mapeados em ${uf}`;
  if (showFeedback) showToast(`Consulta SGB/CPRM preparada para ${municipality}/${uf}.`);
}
if (territorySearch) territorySearch.addEventListener('click', () => updateTerritorySource(true));
if (territoryMunicipality) territoryMunicipality.addEventListener('change', () => updateTerritorySource());
if (territoryUf) territoryUf.addEventListener('change', () => updateTerritorySource());
document.querySelector('[data-territory-relate]')?.addEventListener('click', () => openModal('integrar'));
updateTerritorySource();
