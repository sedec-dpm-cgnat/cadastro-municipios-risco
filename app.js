const views = [...document.querySelectorAll('[data-view]')];
const navItems = [...document.querySelectorAll('[data-view-target]')];
const modalBackdrop = document.querySelector('#modal-backdrop');
const modalTitle = document.querySelector('#modal-title');
const modalCopy = document.querySelector('#modal-copy');
const toast = document.querySelector('#toast');
let currentStep = 1;
let toastTimer;
let transparencyFilter = 'all';

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
  document.querySelector('#auth-screen').style.display = 'none';
  document.querySelector('#app-frame').classList.add('is-unlocked');
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

document.querySelector('#govbr-login').addEventListener('click', () => unlockPortal());
document.querySelector('#public-access').addEventListener('click', () => unlockPortal('transparencia', 'Consulta pública aberta sem autenticação.'));

document.querySelectorAll('[data-step-nav]').forEach(button => button.addEventListener('click', () => setStep(button.dataset.stepNav)));
document.querySelector('[data-step-next]').addEventListener('click', () => {
  if (currentStep === 3 && !document.querySelector('#indication-attestation').checked) {
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
