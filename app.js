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
  const points = [...document.querySelectorAll('.public-map-point')];
  points.forEach(point => point.classList.toggle('is-dimmed', filter !== 'all' && point.dataset.mapCategory !== filter));
  const visibleCount = filter === 'all' ? points.length : points.filter(point => point.dataset.mapCategory === filter).length;
  const label = { all: 'municípios no recorte', indicated: 'indicados no recorte', registered: 'cadastrados no recorte', 'in-progress': 'processos no recorte' }[filter] || 'municípios no recorte';
  const counter = document.querySelector('#map-counter');
  if (counter) counter.textContent = `${visibleCount} ${label}`;
}

document.querySelectorAll('[data-public-map-filter]').forEach(button => button.addEventListener('click', () => {
  setPublicMapFilter(button.dataset.publicMapFilter);
  const labels = { all: 'Visão geral', indicated: 'Indicados', registered: 'Cadastrados', 'in-progress': 'Em preenchimento' };
  showToast(`${labels[button.dataset.publicMapFilter]} destacados no mapa.`);
}));

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
