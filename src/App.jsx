import { useEffect, useRef, useState } from 'react';
import { createDemandRenderer } from './demand-renderer.js';

const asset = name => import.meta.env.BASE_URL + 'assets/' + name;
const documentUrl = name => import.meta.env.BASE_URL + 'docs/' + name;
const brands = {
  Wildberries: ['wildberries.svg', 'wildberries'],
  'Металлоинвест': ['metalloinvest.svg', 'metalloinvest'],
  'ВкусВилл': ['vkusvill.svg', 'vkusvill'],
  SYBOX: ['sybox.svg', 'sybox'],
  'Слобода': ['sloboda.svg', 'sloboda'],
  'НРФ / НРФ Регионы': ['nrf.svg', 'nrf'],
  'Синергия': ['synergy.svg', 'synergy'],
};
function BrandLogo({ name, heading = false }) {
  const brand = brands[name];
  if (!brand) return null;
  return <span className={'brand-logo brand-logo--' + brand[1] + (heading ? ' brand-logo--heading' : '')}><img src={asset('logos/' + brand[0])} alt={heading ? name : 'Логотип ' + name} loading="lazy"/></span>;
}
const cases = [
  { no:'03', name:'ВкусВилл', kind:'Инфлюенс-маркетинг', image:'vkusvill.jpg', alt:'Визуал кампании ВкусВилл', task:'Привлечь покупателей в магазины Челябинска и к продуктам СТМ.', role:'Разработала концепцию коммуникации, согласовала 50 блогеров и сценарии.', stats:[['50','блогеров'],['400 000+','охват'],['2 000+','переходов к скачиванию приложения']] },
  { no:'04', name:'Металлоинвест', kind:'Спецпроект «Сказки на ночь»', image:'metalloinvest-stories.jpg', alt:'Материалы спецпроекта Сказки на ночь', task:'Помочь родителям на ночной смене стать ближе к детям.', role:'Лидировала разработку сказок: сценарии, иллюстрации, озвучку и отправку в мессенджере.', stats:[['9 000+','переходов'],['1 400+','отправок сказок']] },
  { no:'05', name:'SYBOX', kind:'HR-спецпроект', image:'sybox-cat.jpg', alt:'Публикация с котовакансиями SYBOX', task:'Привлечь внимание к HR-бренду через «вакансии для котиков».', role:'Лидировала спецпроект: котовакансия на hh.ru и поддержка инфоповода в соцсетях.', stats:[['500 000+','охват'],['5 000','кликов'],['70+','заявок на работу']], note:'Органическое освещение на ТВ и шорт-лист Tagline Awards.' },
  { no:'06', name:'Слобода', kind:'Ребрендинг соцсетей', image:'sloboda.jpg', alt:'Контент и упаковка соцсетей бренда Слобода', task:'Ребрендинг соцсетей и новая контент-стратегия.', role:'Лидировала команду, подбирала подрядчиков для съемок и защищала стратегию.', stats:[['64 000+','органических подписчиков за первый год']] },
  { no:'07', name:'НРФ / НРФ Регионы', kind:'Фестиваль в реальном времени', image:'nrf.jpg', alt:'Визуал Национального рекламного форума', task:'Повышать узнаваемость фестивалей и публиковать контент с площадки.', role:'Управляла командой, вела коммуникацию с клиентом и оперативный постинг.', stats:[['190+','единиц контента за несколько дней']], note:'Клиент возвращается к сотрудничеству ежегодно.' },
];
const jobs = [
  { years:'2025 — сейчас', company:'Wildberries', role:'Руководитель команды социальных медиа', team:'Команда 8 человек', copy:'SMM-стратегия B2C, найм и управление командой, коллаборации, спецпроекты и связь соцмедиа с бизнес-метриками.', result:'GMV из соцсетей ×3 за I полугодие 2026' },
  { years:'2023 — 2025', company:'Radar Advertising', role:'Руководитель digital-направления', team:'Команда 14 человек', copy:'Развитие отдела и клиентских проектов: стратегии, бюджеты, тендеры, кампании, партнерства и рост команды.', result:'+43% к прибыли направления в 2024' },
  { years:'2021 — 2023', company:'Синергия', role:'Руководитель SMM-направления', team:'Команда 10 человек', copy:'От SMM-менеджера до руководителя: стратегия, спецпроекты, амбассадоры, найм и работа команды на мероприятиях.' },
  { years:'2020 — 2021', company:'Агентство и проекты блогеров', role:'SMM Lead / продюсер', team:'Команда до 9 человек', copy:'Проекты в IT, недвижимости, fashion и образовании. Контент-воронки, запуски и управление подрядчиками.', result:'×2 прибыль одного из запусков' },
];
const Arrow = ({diagonal=false}) => <span className="arrow" aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
const Label = ({children, index}) => <div className="section-label"><span className="section-label__rule"/><span>{children}</span>{index && <span className="section-label__index">{index}</span>}</div>;

function StudioLight() {
  const ref = useRef(null);
  useEffect(() => {
    const allowed = matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const el = ref.current, host = el.parentElement;
    if (!allowed.matches || !('IntersectionObserver' in window) || !('ResizeObserver' in window)) { el.dataset.state = 'disabled'; return; }
    const gl = el.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power' });
    if (!gl) { el.dataset.state = 'unsupported'; return; }
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, 'attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}');
    const fragment = compile(gl.FRAGMENT_SHADER, 'precision mediump float; uniform vec2 m; uniform vec2 s; void main(){vec2 u=gl_FragCoord.xy/s; float line=abs(u.x*.85+u.y*.5-(m.x*.35+.48)); float beam=exp(-line*line*55.); float spot=exp(-distance(u,vec2(m.x,1.-m.y))*3.); vec3 tint=mix(vec3(.64,.32,.40),vec3(1.,.97,.91),beam); gl_FragColor=vec4(tint,beam*.18+spot*.035);}');
    if (!vertex || !fragment) { if (vertex) gl.deleteShader(vertex); if (fragment) gl.deleteShader(fragment); return; }
    const program = gl.createProgram();
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment); return; }
    gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'p'); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const size = gl.getUniformLocation(program, 's'), mouse = gl.getUniformLocation(program, 'm');
    let inView = false, bounds = host.getBoundingClientRect();
    const point = { x: .7, y: .25 };
    const renderer = createDemandRenderer({
      requestFrame: requestAnimationFrame,
      cancelFrame: cancelAnimationFrame,
      draw: () => {
        gl.uniform2f(size, el.width, el.height); gl.uniform2f(mouse, point.x, point.y);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      },
    });
    el.dataset.state = 'ready';
    const sync = () => renderer.setActive(inView && !document.hidden && allowed.matches);
    const resize = () => {
      bounds = host.getBoundingClientRect();
      const scale = Math.min(1, 900 / bounds.width, 720 / bounds.height);
      el.width = Math.round(bounds.width * scale); el.height = Math.round(bounds.height * scale);
      gl.viewport(0, 0, el.width, el.height); renderer.request();
    };
    const move = event => {
      if (!inView || !allowed.matches || document.hidden) return;
      bounds = host.getBoundingClientRect();
      point.x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      point.y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
      renderer.request();
    };
    const leave = () => { point.x = .7; point.y = .25; renderer.request(); };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    const resizer = new ResizeObserver(resize);
    observer.observe(host); resizer.observe(host); resize();
    host.addEventListener('pointermove', move, { passive: true }); host.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', sync); allowed.addEventListener('change', sync);
    return () => {
      renderer.dispose(); observer.disconnect(); resizer.disconnect();
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', sync); allowed.removeEventListener('change', sync);
      gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment);
    };
  }, []);
  return <canvas className="studio-light" ref={ref} data-state="pending" aria-hidden="true"/>;
}

export function App() {
  const [menuOpen,setMenuOpen]=useState(false);
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || !('IntersectionObserver' in window)) return;
    elements.forEach(el => el.classList.add('is-pending'));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible'); observer.unobserve(entry.target);
    }), { threshold: .04, rootMargin: '0px 0px -24px 0px' });
    elements.forEach(el => observer.observe(el));
    const finish = () => { if (preference.matches) { elements.forEach(el => el.classList.add('is-visible')); observer.disconnect(); } };
    preference.addEventListener('change', finish);
    return () => { observer.disconnect(); preference.removeEventListener('change', finish); };
  }, []);
  return <>
    <header className="site-header wrap">
      <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="primary-nav" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?'Закрыть':'Меню'} <span aria-hidden="true">{menuOpen?'×':'+'}</span></button>
      <nav id="primary-nav" className={menuOpen?'nav nav--open':'nav'} aria-label="Основная навигация"><a href="#projects" onClick={()=>setMenuOpen(false)}>Проекты</a><span>/</span><a href="#experience" onClick={()=>setMenuOpen(false)}>Опыт</a><span>/</span><a href="#contact" onClick={()=>setMenuOpen(false)}>Контакт</a></nav>
      <a className="header-name" href="#top"><span/>Александра Дунаева</a>
    </header>
    <main id="top">
      <section className="hero wrap" aria-labelledby="hero-title">
        <StudioLight/>
        <div className="hero__accent" aria-hidden="true"/>
        <div className="hero__portrait"><img src={asset('portrait.jpg')} alt="Александра Дунаева, портрет" width="736" height="1130" fetchPriority="high"/><div className="hero__portrait-note">Стратегия<br/>Команда<br/>Креатив<br/>Результат</div></div>
        <div className="hero__text"><p className="hero__eyebrow">Портфолио / 2026</p><h1 id="hero-title"><span className="hero__line">Александра</span><span className="hero__line">Дунаева</span></h1><p className="hero__role">Руководитель команды<br/>социальных медиа</p><span className="red-stroke" aria-hidden="true"/><p className="hero__intro">Собираю команды. Развиваю бренды.<br/>От стратегии до измеримого результата.</p><div className="hero__actions"><a className="text-link hero__link" href="#projects">Смотреть проекты <Arrow/></a><a className="hero__contact" href="https://t.me/aleksaa_aleksa" target="_blank" rel="noopener noreferrer">Написать <Arrow diagonal/></a></div></div>
        <img className="hero__signature" src={asset('signature.png')} alt="SMM Lead"/>
      </section>
      <section className="projects wrap" id="projects" aria-label="Проекты">
        <Label index="01 / 07">Избранные проекты</Label>
        <article className="case case--wildberries reveal" id="wildberries">
          <div className="case__top"><div><div className="case__identity"><span className="case__no">01 / Стратегия и рост</span></div><h2 className="company-title"><BrandLogo name="Wildberries" heading/></h2><p className="case__subtitle">Разработка и реализация SMM-стратегии</p></div><p className="case__aside">Лидирую команду из 8 человек: выстраиваю SMM-стратегию, запускаю коллаборации и связываю контент с бизнес-метриками.</p></div>
          <div className="wild-layout"><div className="wild-media"><img src={asset('wildberries-campaign.jpg')} alt="Материалы кампании Wildberries в фирменной цветовой палитре" loading="lazy"/><span>Материалы из портфолио / Wildberries</span></div><div className="wild-stat"><span className="eyebrow">Telegram / подписчики</span><div className="wild-stat__old">150 000</div><div className="wild-stat__arrow" aria-hidden="true">⟶</div><div className="wild-stat__new">550 000</div><span className="eyebrow wild-stat__period">I полугодие 2026</span></div></div>
          <details className="case-expand"><summary>Подробнее о стратегии <span aria-hidden="true">+</span></summary><div className="case__details"><p><span className="copy-label">Решение</span>Обновила позиционирование и визуальную систему, выстроила продвижение через контент, таргетинг, посевы, бренд-интеграции и инструменты экосистемы.</p><div className="micro-stats"><div><strong>500 000</strong><span>подписчиков в MAX<br/>с нуля</span></div><div><strong>15 млн</strong><span>охват ВК<br/>было 1,6 млн</span></div><div><strong>4,6 млн</strong><span>охват ОК<br/>было 900 тыс.</span></div><div><strong>2,6 млн</strong><span>дополнительный охват<br/>в месяц от новых каналов</span></div></div></div>
          <div className="case__substory"><img src={asset('wildberries-post.jpg')} alt="Креатив Wildberries для партнерской публикации" loading="lazy"/><div><span className="eyebrow">Креатив в экосистеме</span><h3>Бренд-интеграции,<br/>которые работают</h3><p>Партнерские подарки для розыгрышей, коллаборация с «Пятницей» и поддержка фильма «Яга на нашу голову». Интеграция с «Пятницей» привела более 50 тысяч новых подписчиков в Telegram, а кампания фильма повысила вовлеченность в 1,5 раза. Совместный контентный проект с Банком России добавил еще 15 тысяч подписчиков.</p></div></div></details>
        </article>
        <article className="case case--metal reveal" id="metalloinvest"><div className="metal-intro"><div><div className="case__identity case__identity--stacked"><span className="case__no">02 / HR-кампания</span></div><h2 className="company-title"><BrandLogo name="Металлоинвест" heading/></h2><p className="case__subtitle">Найти людей для трех комбинатов</p><p><span className="copy-label">Мой вклад</span>Распределяла бюджет, выбирала площадки, согласовывала и оптимизировала медиаплан и креативы для МГОК, ЛГОК и ОЭМК. Вела коммуникацию с клиентом.</p></div><img src={asset('metalloinvest-hr.jpg')} alt="Креатив HR-кампании Металлоинвест с сотрудником производства" loading="lazy"/><div className="metal-results"><span className="eyebrow">Результат за 2 месяца</span><strong>1 015</strong><span className="eyebrow">заявок</span><span className="red-stroke red-stroke--small"/><p>7 348 491 показ<br/>36 910 переходов<br/>2 156 звонков</p></div></div></article>
        <div className="more-heading reveal"><Label index="03 — 07">Другие истории</Label><h2>Идеи, которые<br/><em>вышли в мир.</em></h2><p>От инфлюенс-кампаний до контента с площадки фестиваля — у каждого проекта свой голос и измеримый результат.</p></div>
        <div className="case-grid">{cases.map((item,i)=><article className={'mini-case mini-case--'+(i+1)+' reveal'} key={item.no}><div className="mini-case__image"><img src={asset(item.image)} alt={item.alt} loading="lazy"/><span>{item.no} / 07</span></div><div className="mini-case__body"><div className="mini-case__heading"><div className="mini-case__identity"><span className="eyebrow">{item.kind}</span></div><h3 className="company-title"><BrandLogo name={item.name} heading/></h3></div><div className="mini-case__copy"><p><span className="copy-label">Задача</span>{item.task}</p><p><span className="copy-label">Мой вклад</span>{item.role}</p></div><div className="mini-case__results">{item.stats.map(([value,label])=><div key={value}><strong>{value}</strong><span>{label}</span></div>)}</div>{item.note&&<p className="mini-case__note">{item.note}</p>}</div></article>)}</div>
      </section>
      <section className="approach" aria-labelledby="approach-title"><div className="wrap approach__inner reveal"><Label>Подход</Label><div><p className="approach__kicker">Не просто присутствовать в ленте.</p><h2 id="approach-title">Находить точку, где <em>креатив</em> становится <em>результатом.</em></h2></div><div className="approach__bottom"><span>Стратегия / команда / контент / партнерства</span><p>Я соединяю идеи с процессами: собираю команды, выстраиваю систему и оставляю место для смелых решений. Так проекты работают и в цифрах, и в памяти людей.</p></div></div></section>
      <section className="experience wrap" id="experience" aria-labelledby="experience-title"><Label index="2020 — сейчас">Опыт и экспертиза</Label><div className="experience__intro reveal"><h2 id="experience-title">От идеи<br/>до масштаба<span>.</span></h2><div><p>Более 6 лет работаю на стороне бренда, агентства и с командами авторов. Знаю, как выглядит проект с каждой стороны стола.</p><a className="text-link" href={documentUrl('resume.pdf')} target="_blank" rel="noopener noreferrer">Смотреть резюме <Arrow diagonal/></a></div></div><div className="timeline">{jobs.map((job,i)=><article className="timeline__row reveal" key={job.company}><span className="timeline__years">{job.years}</span><div><div className="timeline__identity"><span className="timeline__index">0{i+1}</span></div><h3 className="company-title">{brands[job.company] ? <BrandLogo name={job.company} heading/> : job.company}</h3><p className="timeline__role">{job.role}</p></div><div className="timeline__details"><span className="eyebrow">{job.team}</span><p>{job.copy}</p>{job.result&&<strong>{job.result}</strong>}</div></article>)}</div><div className="education reveal"><span className="eyebrow">Образование и развитие</span><p>Государственный университет управления, 2019<br/>АКАР «Реклама и маркетинг», 2024 · «Масштаб» «Продюсирование проектов в социальных сетях», 2023</p></div></section>
      <section className="contact" id="contact" aria-labelledby="contact-title"><div className="wrap contact__inner reveal"><div className="contact__top"><Label>Контакт</Label><span>Москва / открыта к новым проектам</span></div><h2 id="contact-title">Есть идея?<br/><em>Давайте обсудим.</em></h2><div className="contact__bottom"><p>Расскажите о задаче — вместе найдем для нее сильную форму и понятный результат.</p><div className="contact__links"><a href="https://t.me/aleksaa_aleksa" target="_blank" rel="noopener noreferrer">Написать в Telegram <Arrow diagonal/></a><a href="tel:+79773197769">+7 977 319 77 69 <Arrow diagonal/></a></div></div><div className="contact__footer"><span>© Александра Дунаева, 2026</span><a href="#top">Наверх ↑</a><a href={documentUrl('portfolio.pdf')} target="_blank" rel="noopener noreferrer">Портфолио PDF ↗</a></div></div></section>
    </main>
  </>;
}
