const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

$('#year').textContent = new Date().getFullYear();

const menu = $('.menu-toggle');
const nav = $('#main-nav');
menu.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', isOpen);
  menu.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
$$('nav a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }));

$$('.project-trigger').forEach(trigger => trigger.addEventListener('click', () => {
  const card = trigger.closest('.project-card');
  const opened = card.classList.contains('open');
  $$('.project-card').forEach(item => { item.classList.remove('open'); $('.project-trigger', item).setAttribute('aria-expanded', 'false'); });
  if (!opened) { card.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); }
}));

const command = 'langgraph --mode=agentic --port 8000';
let char = 0;
const typeCommand = () => { if (char <= command.length) { $('#typed-command').textContent = command.slice(0, char++); setTimeout(typeCommand, 42); } };
typeCommand();

const stepList = $('#flow-steps');
const requestText = $('#request-text');
const run = $('#run-flow');
const status = $('#console-status');
const message = $('#console-message');
let selectedScenario = $('.scenario.active');

function renderSteps(steps) { stepList.innerHTML = steps.map((step, index) => `<li><b>${String(index + 1).padStart(2, '0')}</b><strong>${step}</strong><em>${index === 0 ? 'READY' : 'WAIT'}</em></li>`).join(''); }
$$('.scenario').forEach(scenario => scenario.addEventListener('click', () => {
  if (run.disabled) return;
  selectedScenario.classList.remove('active'); scenario.classList.add('active'); selectedScenario = scenario;
  requestText.textContent = scenario.dataset.request;
  renderSteps(scenario.dataset.steps.split('|'));
  status.textContent = 'IDLE'; message.textContent = 'Waiting for execution request_';
}));
run.addEventListener('click', async () => {
  run.disabled = true; status.textContent = 'RUNNING'; message.textContent = 'Executing bounded workflow...';
  const steps = $$('.flow-steps li');
  for (let index = 0; index < steps.length; index++) {
    const step = steps[index]; const label = $('em', step);
    step.classList.add('running'); label.textContent = 'RUN';
    await new Promise(resolve => setTimeout(resolve, 620));
    step.classList.replace('running', 'done'); label.textContent = 'DONE';
  }
  status.textContent = 'COMPLETE'; message.textContent = 'Workflow completed successfully_'; run.disabled = false;
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.1 });
$$('.reveal').forEach(item => observer.observe(item));
