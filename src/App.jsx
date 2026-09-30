import { useEffect, useRef, useState } from 'react';

const asset = name => '/assets/' + name;
const brands = {
  Wildberries: ['wildberries.svg', 'wildberries'],
  'Металлоинвест': ['metalloinvest.svg', 'metalloinvest'],
  'ВкусВилл': ['vkusvill.svg', 'vkusvill'],
  SYBOX: ['sybox.svg', 'sybox'],
  'Слобода': ['sloboda.svg', 'sloboda'],
  'НРФ / НРФ Регионы': ['nrf.svg', 'nrf'],
  'Синергия': ['synergy.svg', 'synergy'],
};
function BrandLogo({ name }) {
  const brand = brands[name];
  if (!brand) return null;
  return <span className={'brand-logo brand-logo--' + brand[1]}><img src={asset('logos/' + brand[0])} alt={'Логотип ' + name} loading="lazy"/></span>;
}
const cases = [
  { no:'03', name:'ВкусВилл', kind:'Инфлюенс-маркетинг', image:'vkusvill.jpg', alt:'Визуал кампании ВкусВилл', copy:'Разработала коммуникацию для магазинов в Челябинске и согласовала сценарии для 50 блогеров.', stats:[['50','блогеров'],['400 000+','охват'],['2 000+','переходов к скачиванию приложения']] },
  { no:'04', name:'Металлоинвест', kind:'Спецпроект «Сказки на ночь»', image:'metalloinvest-stories.jpg', alt:'Материалы спецпроекта Сказки на ночь', copy:'Истории, которые родители на ночной смене могли отправить детям. Лидировала создание сценариев, иллюстраций и озвучки.', stats:[['9 000+','переходов'],['1 400+','отправок сказок']] },
  { no:'05', name:'SYBOX', kind:'HR-спецпроект', image:'sybox-cat.jpg', alt:'Публикация с котовакансиями SYBOX', copy:'«Мир без коробок» и вакансии для котиков: необычный инфоповод для разговора об HR-бренде. Лидировала разработку и реализацию.', stats:[['500 000+','охват'],['5 000','кликов'],['70+','заявок на работу']], note:'Органическое освещение на ТВ и шорт-лист Tagline Awards.' },
  { no:'06', name:'Слобода', kind:'Ребрендинг соцсетей', image:'sloboda.jpg', alt:'Контент и упаковка соцсетей бренда Слобода', copy:'Новая контент-стратегия и визуальная подача. Руководила командой, искала подрядчиков для съемок и защищала стратегию.', stats:[['64 000+','органических подписчиков за первый год']] },
  { no:'07', name:'НРФ / НРФ Регионы', kind:'Фестиваль в реальном времени', image:'nrf.jpg', alt:'Визуал Национального рекламного форума', copy:'Оперативный контент с площадки: управление командой, коммуникация с клиентом и публикации в дни фестиваля.', stats:[['190+','единиц контента за несколько дней']], note:'Клиент возвращается к сотрудничеству ежегодно.' },
];
const jobs = [
  { years:'2025 — сейчас', company:'Wildberries', role:'Руководитель команды социальных медиа', team:'Команда 8 человек', copy:'SMM-стратегия B2C, найм и управление командой, коллаборации, спецпроекты и связь соцмедиа с бизнес-метриками.', result:'GMV из соцсетей ×3 за I полугодие 2026' },
  { years:'2023 — 2025', company:'Radar Advertising', role:'Руководитель digital-направления', team:'Команда 14 человек', copy:'Развитие отдела и клиентских проектов: стратегии, бюджеты, тендеры, кампании, партнерства и рост команды.', result:'+43% к прибыли направления в 2024' },
  { years:'2021 — 2023', company:'Синергия', role:'Руководитель SMM-направления', team:'Команда 10 человек', copy:'От SMM-менеджера до руководителя: стратегия, спецпроекты, амбассадоры, найм и работа команды на мероприятиях.' },
  { years:'2020 — 2021', company:'Агентство и проекты блогеров', role:'SMM Lead / продюсер', team:'Команда до 9 человек', copy:'Проекты в IT, недвижимости, fashion и образовании. Контент-воронки, запуски и управление подрядчиками.', result:'×2 прибыль одного из запусков' },
];
const Arrow = ({diagonal=false}) => <span className="arrow" aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
const Label = ({children, index}) => <div className="section-label"><span className="section-label__rule"/><span>{children}</span>{index && <span className="section-label__index">{index}</span>}</div>;

function Atmosphere() {
  const ref = useRef(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current, gl = el?.getContext('webgl', {alpha:true, antialias:false, powerPreference:'low-power'});
    if (!gl) return;
    const vertex = 'attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}';
    const fragment = 'precision mediump float; uniform vec2 s; uniform vec2 m; uniform float t; float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);} void main(){vec2 u=gl_FragCoord.xy/s; float d=distance(u,vec2(m.x,1.-m.y)); float beam=exp(-d*d*5.5)*.075; float grain=(h(gl_FragCoord.xy+floor(t*2.))-.5)*.022; gl_FragColor=vec4(.62,.08,.18,max(0.,beam+grain));}';
    const shader = (type, source) => {const x=gl.createShader(type); gl.shaderSource(x,source); gl.compileShader(x); return x;};
    const program=gl.createProgram(); gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex)); gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment)); gl.linkProgram(program); gl.useProgram(program);
    const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const pos=gl.getAttribLocation(program,'p'); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
    const size=gl.getUniformLocation(program,'s'), mouse=gl.getUniformLocation(program,'m'), time=gl.getUniformLocation(program,'t');
    const point={x:innerWidth*.72,y:innerHeight*.34};
    const move=e=>{point.x=e.clientX;point.y=e.clientY;};
    const resize=()=>{el.width=Math.min(innerWidth,1800); el.height=innerHeight; gl.viewport(0,0,el.width,el.height);};
    resize(); addEventListener('resize',resize); addEventListener('pointermove',move);
    let frame; const render=t=>{gl.uniform2f(size,el.width,el.height); gl.uniform2f(mouse,point.x*el.width/innerWidth,point.y); gl.uniform1f(time,t*.001); gl.drawArrays(gl.TRIANGLES,0,6); frame=requestAnimationFrame(render);}; frame=requestAnimationFrame(render);
    return ()=>{cancelAnimationFrame(frame); removeEventListener('resize',resize); removeEventListener('pointermove',move);};
  },[]);
  return <canvas className="atmosphere" ref={ref} aria-hidden="true"/>;
}

export function App() {
  const [menuOpen,setMenuOpen]=useState(false);
  useEffect(()=>{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));return ()=>observer.disconnect();},[]);
  return <>
    <Atmosphere/>
    <header className="site-header wrap">
      <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="primary-nav" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?'Закрыть':'Меню'} <span aria-hidden="true">{menuOpen?'×':'+'}</span></button>
      <nav id="primary-nav" className={menuOpen?'nav nav--open':'nav'} aria-label="Основная навигация"><a href="#projects" onClick={()=>setMenuOpen(false)}>Проекты</a><span>/</span><a href="#experience" onClick={()=>setMenuOpen(false)}>Опыт</a><span>/</span><a href="#contact" onClick={()=>setMenuOpen(false)}>Контакт</a></nav>
      <a className="header-name" href="#top"><span/>Александра Дунаева</a>
    </header>
    <main id="top">
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero__accent" aria-hidden="true"/>
        <div className="hero__portrait"><img src={asset('portrait.jpg')} alt="Александра Дунаева, портрет" fetchPriority="high"/><div className="hero__portrait-note">Стратегия<br/>Команда<br/>Креатив<br/>Результат</div></div>
        <div className="hero__text"><p className="hero__eyebrow">Портфолио / 2026</p><h1 id="hero-title">Александра<br/>Дунаева</h1><p className="hero__role">Руководитель команды<br/>социальных медиа</p><span className="red-stroke" aria-hidden="true"/><p className="hero__intro">Стратегия, команда и креатив —<br/>от идеи до результата.</p><a className="text-link hero__link" href="#projects">Смотреть проекты <Arrow/></a></div>
        <img className="hero__signature" src={asset('signature.png')} alt="SMM Lead"/>
      </section>
      <section className="projects wrap" id="projects" aria-label="Проекты">
        <Label index="01 / 07">Избранные проекты</Label>
        <article className="case case--wildberries reveal" id="wildberries">
          <div className="case__top"><div><div className="case__identity"><span className="case__no">01 / Стратегия и рост</span><BrandLogo name="Wildberries"/></div><h2>Wildberries</h2><p className="case__subtitle">Разработка и реализация SMM-стратегии</p></div><p className="case__aside">Помогаю брендам расти в социальных медиа: от стратегии и запуска до масштабирования и стабильных результатов.</p></div>
          <div className="wild-layout"><div className="wild-media"><img src={asset('wildberries-campaign.jpg')} alt="Материалы кампании Wildberries в фирменной цветовой палитре" loading="lazy"/><span>Материалы из портфолио / Wildberries</span></div><div className="wild-stat"><span className="eyebrow">Telegram / подписчики</span><div className="wild-stat__old">150 000</div><div className="wild-stat__arrow" aria-hidden="true">⟶</div><div className="wild-stat__new">550 000</div><span className="eyebrow">Рост канала</span></div></div>
          <details className="case-expand"><summary>Подробнее о стратегии <span aria-hidden="true">+</span></summary><div className="case__details"><p>Обновила позиционирование и визуальную систему, выстроила продвижение через контент, таргетинг, посевы, бренд-интеграции и инструменты экосистемы.</p><div className="micro-stats"><div><strong>500 000</strong><span>подписчиков в MAX<br/>с нуля</span></div><div><strong>15 млн</strong><span>охват ВК<br/>было 1,6 млн</span></div><div><strong>4,6 млн</strong><span>охват ОК<br/>было 900 тыс.</span></div><div><strong>2,6 млн</strong><span>дополнительный охват<br/>в месяц от новых каналов</span></div></div></div>
          <div className="case__substory"><img src={asset('wildberries-post.jpg')} alt="Креатив Wildberries для партнерской публикации" loading="lazy"/><div><span className="eyebrow">Креатив в экосистеме</span><h3>Бренд-интеграции,<br/>которые работают</h3><p>Партнерские подарки для розыгрышей, коллаборация с «Пятницей» и поддержка фильма «Яга на нашу голову». Интеграция с «Пятницей» привела более 50 тысяч новых подписчиков в Telegram, а кампания фильма повысила вовлеченность в 1,5 раза. Совместный контентный проект с Банком России добавил еще 15 тысяч подписчиков.</p></div></div></details>
        </article>
        <article className="case case--metal reveal" id="metalloinvest"><div className="metal-intro"><div><div className="case__identity case__identity--stacked"><span className="case__no">02 / HR-кампания</span><BrandLogo name="Металлоинвест"/></div><h2>Металлоинвест</h2><p className="case__subtitle">Найти людей для трех комбинатов</p><p>Комплексная кампания для МГОК, ЛГОК и ОЭМК. Распределяла бюджет, выбирала площадки, согласовывала медиаплан и креативы, оптимизировала запуск и вела коммуникацию с клиентом.</p></div><img src={asset('metalloinvest-hr.jpg')} alt="Креатив HR-кампании Металлоинвест с сотрудником производства" loading="lazy"/><div className="metal-results"><span className="eyebrow">Результат за 2 месяца</span><strong>1 015</strong><span className="eyebrow">заявок</span><span className="red-stroke red-stroke--small"/><p>7 348 491 показ<br/>36 910 переходов<br/>2 156 звонков</p></div></div></article>
        <div className="more-heading reveal"><Label index="03 — 07">Другие истории</Label><h2>Идеи, которые<br/><em>вышли в мир.</em></h2><p>От инфлюенс-кампаний до контента с площадки фестиваля — у каждого проекта свой голос и измеримый результат.</p></div>
        <div className="case-grid">{cases.map((item,i)=><article className={'mini-case mini-case--'+(i+1)+' reveal'} key={item.no}><div className="mini-case__image"><img src={asset(item.image)} alt={item.alt} loading="lazy"/><span>{item.no} / 07</span></div><div className="mini-case__body"><div className="mini-case__heading"><div className="mini-case__identity"><span className="eyebrow">{item.kind}</span><BrandLogo name={item.name}/></div><h3>{item.name}</h3></div><p>{item.copy}</p><div className="mini-case__results">{item.stats.map(([value,label])=><div key={value}><strong>{value}</strong><span>{label}</span></div>)}</div>{item.note&&<p className="mini-case__note">{item.note}</p>}</div></article>)}</div>
      </section>
      <section className="approach" aria-labelledby="approach-title"><div className="wrap approach__inner reveal"><Label>Подход</Label><div><p className="approach__kicker">Не просто присутствовать в ленте.</p><h2 id="approach-title">Находить точку, где <em>креатив</em> становится <em>результатом.</em></h2></div><div className="approach__bottom"><span>Стратегия / команда / контент / партнерства</span><p>Я соединяю идеи с процессами: собираю команды, выстраиваю систему и оставляю место для смелых решений. Так проекты работают и в цифрах, и в памяти людей.</p></div></div></section>
      <section className="experience wrap" id="experience" aria-labelledby="experience-title"><Label index="2020 — сейчас">Опыт и экспертиза</Label><div className="experience__intro reveal"><h2 id="experience-title">От идеи<br/>до масштаба<span>.</span></h2><div><p>Более 6 лет работаю на стороне бренда, агентства и с командами авторов. Знаю, как выглядит проект с каждой стороны стола.</p><a className="text-link" href="/docs/resume.pdf" target="_blank" rel="noopener noreferrer">Смотреть резюме <Arrow diagonal/></a></div></div><div className="timeline">{jobs.map((job,i)=><article className="timeline__row reveal" key={job.company}><span className="timeline__years">{job.years}</span><div><div className="timeline__identity"><span className="timeline__index">0{i+1}</span><BrandLogo name={job.company}/></div><h3>{job.company}</h3><p className="timeline__role">{job.role}</p></div><div className="timeline__details"><span className="eyebrow">{job.team}</span><p>{job.copy}</p>{job.result&&<strong>{job.result}</strong>}</div></article>)}</div><div className="education reveal"><span className="eyebrow">Образование и развитие</span><p>Государственный университет управления, 2019<br/>АКАР «Реклама и маркетинг», 2024 · «Масштаб» «Продюсирование проектов в социальных сетях», 2023</p></div></section>
      <section className="contact" id="contact" aria-labelledby="contact-title"><div className="wrap contact__inner reveal"><div className="contact__top"><Label>Контакт</Label><span>Москва / открыта к новым проектам</span></div><h2 id="contact-title">Есть идея?<br/><em>Давайте обсудим.</em></h2><div className="contact__bottom"><p>Расскажите о задаче — вместе найдем для нее сильную форму и понятный результат.</p><div className="contact__links"><a href="https://t.me/aleksaa_aleksa" target="_blank" rel="noopener noreferrer">Написать в Telegram <Arrow diagonal/></a><a href="tel:+79773197769">+7 977 319 77 69 <Arrow diagonal/></a></div></div><div className="contact__footer"><span>© Александра Дунаева, 2026</span><a href="#top">Наверх ↑</a><a href="/docs/portfolio.pdf" target="_blank" rel="noopener noreferrer">Портфолио PDF ↗</a></div></div></section>
    </main>
  </>;
}
