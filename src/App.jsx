import { useEffect, useRef, useState } from "react";
import { StudioLight } from "./StudioLight.jsx";
import { CursorTrail } from "./CursorTrail.jsx";
import { ApproachGlow } from "./ApproachGlow.jsx";
import { lockPageScroll } from "./scroll-lock.js";

const asset = (name) => import.meta.env.BASE_URL + "assets/" + name;
const documentUrl = (name) => import.meta.env.BASE_URL + "docs/" + name;
const brands = {
  Wildberries: ["wildberries.svg", "wildberries"],
  Металлоинвест: ["metalloinvest.svg", "metalloinvest"],
  ВкусВилл: ["vkusvill.svg", "vkusvill"],
  SYBOX: ["sybox.svg", "sybox"],
  Слобода: ["sloboda.svg", "sloboda"],
  "НРФ / НРФ Регионы": ["nrf.svg", "nrf"],
  Синергия: ["synergy.svg", "synergy"],
};
function BrandLogo({ name, heading = false }) {
  const brand = brands[name];
  if (!brand) return null;
  return (
    <span
      className={
        "brand-logo brand-logo--" +
        brand[1] +
        (heading ? " brand-logo--heading" : "")
      }
    >
      <img
        src={asset("logos/" + brand[0])}
        alt={heading ? name : "Логотип " + name}
        loading="lazy"
      />
    </span>
  );
}
const cases = [
  {
    no: "03",
    name: "ВкусВилл",
    kind: "Инфлюенс-маркетинг",
    image: "vkusvill-influencers.jpg",
    alt: "Визуал кампании ВкусВилл",
    task: "Привлечь покупателей в магазины Челябинска и к продуктам СТМ.",
    role: "Разработала концепцию коммуникации, согласовала 50 блогеров и сценарии.",
    stats: [
      ["50", "блогеров"],
      ["400 000+", "охват"],
      ["2 000+", "переходов к скачиванию приложения"],
    ],
  },
  {
    no: "04",
    name: "Металлоинвест",
    kind: "Спецпроект «Сказки на ночь»",
    image: "metalloinvest-stories.jpg",
    alt: "Материалы спецпроекта Сказки на ночь",
    task: "Помочь родителям на ночной смене стать ближе к детям.",
    role: "Лидировала разработку сказок: сценарии, иллюстрации, озвучку и отправку в мессенджере.",
    stats: [
      ["9 000+", "переходов"],
      ["1 400+", "отправок сказок"],
    ],
  },
  {
    no: "05",
    name: "SYBOX",
    kind: "HR-спецпроект",
    image: "sybox-cat.jpg",
    alt: "Публикация с котовакансиями SYBOX",
    task: "Привлечь внимание к HR-бренду через «вакансии для котиков».",
    role: "Лидировала спецпроект: котовакансия на hh.ru и поддержка инфоповода в соцсетях.",
    stats: [
      ["500 000+", "охват"],
      ["5 000", "кликов"],
      ["70+", "заявок на работу"],
    ],
    note: "Органическое освещение на ТВ и шорт-лист Tagline Awards.",
  },
  {
    no: "06",
    name: "Слобода",
    kind: "Ребрендинг соцсетей",
    image: "sloboda.jpg",
    alt: "Контент и упаковка соцсетей бренда Слобода",
    extraImage: {
      name: "Слобода — контентная съёмка",
      image: "sloboda-shoot.jpg",
      alt: "Контентная съёмка продуктов Слобода: пикник с томатным соусом",
    },
    task: "Ребрендинг соцсетей и новая контент-стратегия.",
    role: "Лидировала команду, подбирала подрядчиков для съемок и защищала стратегию.",
    stats: [["+64 000", "подписчиков органически за первый год"]],
  },
  {
    no: "07",
    name: "НРФ / НРФ Регионы",
    kind: "Фестиваль в реальном времени",
    image: "nrf.jpg",
    alt: "Визуал Национального рекламного форума",
    task: "Повышать узнаваемость фестивалей и публиковать контент с площадки.",
    role: "Управляла командой, вела коммуникацию с клиентом и оперативный постинг.",
    stats: [["190+", "единиц контента за несколько дней"]],
    note: "Клиент возвращается к сотрудничеству ежегодно.",
  },
];
const jobs = [
  {
    years: "2025 — сейчас",
    company: "Wildberries",
    role: "Руководитель команды социальных медиа",
    team: "Команда 8 человек",
    copy: "SMM-стратегия B2C, найм и управление командой, коллаборации, спецпроекты и связь соцмедиа с бизнес-метриками.",
    result: "GMV из соцсетей ×3 за I полугодие 2026",
  },
  {
    years: "2023 — 2025",
    company: "Radar Advertising",
    role: "Руководитель digital-направления",
    team: "Команда 14 человек",
    copy: "Развитие отдела и клиентских проектов: стратегии, бюджеты, тендеры, кампании, партнерства и рост команды.",
    result: "+43% к прибыли в 2024 относительно 2023",
  },
  {
    years: "2021 — 2023",
    company: "Синергия",
    role: "Руководитель SMM-направления",
    team: "Команда 10 человек",
    copy: "От SMM-менеджера до руководителя: стратегия, спецпроекты, амбассадоры, найм и работа команды на мероприятиях.",
  },
  {
    years: "2020 — 2021",
    company: "Агентство и проекты блогеров",
    role: "SMM Lead / продюсер",
    team: "Команда до 9 человек",
    copy: "Проекты в IT, недвижимости, fashion и образовании. Контент-воронки, запуски и управление подрядчиками.",
    result: "×2 прибыль одного из запусков",
    extra:
      "В проекте блогера охваты выросли на 30%. В отдельном проекте онлайн-школы доходимость учеников составила 78%.",
  },
];
const Arrow = ({ diagonal = false, up = false }) => (
  <svg
    className="arrow"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d={
        up
          ? "M12 20V4M5 11l7-7 7 7"
          : diagonal
            ? "M5 19L19 5M6 5h13v13"
            : "M3 12h18M14 5l7 7-7 7"
      }
    />
  </svg>
);
const Label = ({ children, index }) => (
  <div className="section-label">
    <span className="section-label__rule" />
    <span>{children}</span>
    {index && <span className="section-label__index">{index}</span>}
  </div>
);

const imageSizes = {
  "vkusvill-influencers.jpg": [2307, 1081],
  "wildberries-post.jpg": [1280, 1280],
  "wildberries-instagram.jpg": [1206, 756],
  "metalloinvest-hr.jpg": [1600, 900],
  "metalloinvest-stories.jpg": [1727, 909],
  "sloboda-shoot.jpg": [1862, 816],
  "sybox-cat.jpg": [1328, 929],
  "sloboda.jpg": [1813, 974],
  "nrf.jpg": [781, 581],
};
function ProjectImage({ item, className = "mini-case__image", caption }) {
  const dialog = useRef(null);
  const [opened, setOpened] = useState(false);
  const [width, height] = imageSizes[item.image] ?? [];
  const releaseScroll = useRef(null);
  const pointerStartedOutside = useRef(false);
  const open = () => {
    dialog.current.showModal();
    releaseScroll.current = lockPageScroll();
    setOpened(true);
  };
  const close = () => {
    releaseScroll.current?.();
    releaseScroll.current = null;
    setOpened(false);
  };
  useEffect(() => () => releaseScroll.current?.(), []);
  const isOutside = (event) => {
    const box = dialog.current.getBoundingClientRect();
    return (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    );
  };
  return (
    <>
      <button
        type="button"
        className={className + " image-open"}
        aria-label={"Рассмотреть материалы проекта " + item.name}
        aria-haspopup="dialog"
        onClick={open}
      >
        <img
          src={asset(item.image)}
          alt={item.alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
        />
        {item.no && <span>{item.no} / 07</span>}
        {caption && <span className="image-open__caption">{caption}</span>}
        <span className="image-open__hint" aria-hidden="true">
          <Arrow diagonal />
        </span>
      </button>
      <noscript>
        <a className="image-fallback" href={asset(item.image)}>
          Рассмотреть материалы проекта {item.name} <Arrow diagonal />
        </a>
      </noscript>
      <dialog
        className="image-dialog"
        ref={dialog}
        aria-label={"Материалы проекта " + item.name}
        onClose={close}
        onPointerDown={(event) => {
          pointerStartedOutside.current =
            event.target === dialog.current && isOutside(event);
        }}
        onClick={(event) => {
          if (
            pointerStartedOutside.current &&
            event.target === dialog.current &&
            isOutside(event)
          )
            dialog.current.close();
          pointerStartedOutside.current = false;
        }}
      >
        <div className="image-dialog__bar">
          <p>{item.name}</p>
          <form method="dialog">
            <button autoFocus>
              Закрыть <span aria-hidden="true">×</span>
            </button>
          </form>
        </div>
        {opened && (
          <img
            src={asset(item.image)}
            alt={item.alt}
            width={width}
            height={height}
            decoding="async"
          />
        )}
        <a
          className="image-dialog__original"
          href={asset(item.image)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Открыть оригинал <Arrow diagonal />
        </a>
      </dialog>
    </>
  );
}

export function App() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    elements.forEach((el) => el.classList.add("is-pending"));
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }),
      { threshold: 0.04, rootMargin: "0px 0px -24px 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    const finish = () => {
      if (preference.matches) {
        elements.forEach((el) => el.classList.add("is-visible"));
        observer.disconnect();
      }
    };
    preference.addEventListener("change", finish);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", finish);
    };
  }, []);
  return (
    <>
      <CursorTrail />
      <header className="site-header wrap">
        <span className="eyebrow">Портфолио / 2026</span>
        <a className="header-name" href="#top">
          <span />
          Александра Дунаева
        </a>
      </header>
      <main id="top">
        <section className="hero wrap" aria-labelledby="hero-title">
          <StudioLight />
          <div className="hero__visual">
            <div className="hero__accent" aria-hidden="true" />
            <div className="hero__portrait">
              <img
                src={asset("portrait.jpg")}
                alt="Александра Дунаева, портрет"
                width="736"
                height="1130"
                fetchPriority="high"
              />
            </div>
            <img
              className="hero__signature"
              src={asset("signature.png")}
              width="460"
              height="268"
              fetchPriority="low"
              alt="SMM Lead"
            />
          </div>
          <div className="hero__text">
            <p className="hero__eyebrow">Портфолио / 2026</p>
            <h1 id="hero-title">
              <span className="hero__line">Александра</span>
              <span className="hero__line">Дунаева</span>
            </h1>
            <p className="hero__role">
              Руководитель команды
              <br />
              социальных медиа
            </p>
            <span className="red-stroke" aria-hidden="true" />
            <p className="hero__intro">
              Собираю команды. Развиваю бренды.
              <br />
              От стратегии до измеримого результата.
            </p>
            <nav
              id="primary-nav"
              className="hero-nav"
              aria-label="Основная навигация"
            >
              <a href="#experience">
                Опыт и экспертиза <Arrow diagonal />
              </a>
              <a href="#projects">
                Проекты <Arrow diagonal />
              </a>
              <a href="#contact">
                Подход и контакт <Arrow diagonal />
              </a>
            </nav>
            <div className="hero__actions">
              <a className="text-link hero__link" href="#projects">
                Смотреть проекты <Arrow />
              </a>
              <a
                className="hero__contact"
                href="https://t.me/aleksaa_aleksa"
                target="_blank"
                rel="noopener noreferrer"
              >
                Написать <Arrow diagonal />
              </a>
              <a
                className="hero__resume"
                href={documentUrl("resume.pdf")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Резюме PDF <Arrow diagonal />
              </a>
            </div>
          </div>
        </section>
        <section
          className="experience wrap"
          id="experience"
          aria-labelledby="experience-title"
        >
          <Label index="2020 — сейчас">Опыт и экспертиза</Label>
          <div className="experience__intro reveal">
            <h2 id="experience-title">
              От идеи
              <br />
              до масштаба<span>.</span>
            </h2>
            <div>
              <p>
                Более 6 лет работаю на стороне бренда, агентства и с командами
                авторов. Знаю, как выглядит проект с каждой стороны стола.
              </p>
              <a
                className="text-link"
                href={documentUrl("resume.pdf")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Смотреть резюме <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="timeline">
            {jobs.map((job, i) => (
              <article className="timeline__row reveal" key={job.company}>
                <span className="timeline__years">{job.years}</span>
                <div>
                  <div className="timeline__identity">
                    <span className="timeline__index">0{i + 1}</span>
                  </div>
                  <h3 className="company-title">
                    {brands[job.company] ? (
                      <BrandLogo name={job.company} heading />
                    ) : (
                      job.company
                    )}
                  </h3>
                  <p className="timeline__role">{job.role}</p>
                </div>
                <div className="timeline__details">
                  <span className="eyebrow">{job.team}</span>
                  <p>{job.copy}</p>
                  {job.result && <strong>{job.result}</strong>}
                  {job.extra && (
                    <details className="timeline__extra">
                      <summary>Ещё результаты</summary>
                      <p>{job.extra}</p>
                    </details>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="education reveal">
            <span className="eyebrow">Образование и развитие</span>
            <p>
              Государственный университет управления, 2019
              <br />
              АКАР «Реклама и маркетинг», 2024 · «Масштаб» «Продюсирование
              проектов в социальных сетях», 2023
            </p>
          </div>
        </section>
        <section className="projects wrap" id="projects" aria-label="Проекты">
          <Label index="7 кейсов">Проекты</Label>
          <p className="projects-intro">
            Выберите историю — внутри задача, мой вклад и результаты.
          </p>
          <details className="project-disclosure case-expand" id="wildberries">
            <summary>
              <span className="project-number">01</span>
              <BrandLogo name="Wildberries" />
              <span className="project-title">Полный цикл SMM</span>
              <span className="project-toggle" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="project-content">
              {" "}
              <article className="case case--wildberries">
                <div className="case__top">
                  <div>
                    <div className="case__identity">
                      <span className="case__no">01 / Стратегия и рост</span>
                    </div>
                    <h2 className="company-title">
                      <BrandLogo name="Wildberries" heading />
                    </h2>
                    <p className="case__subtitle">
                      Разработка и реализация SMM-стратегии
                    </p>
                  </div>
                  <p className="case__aside">
                    Лидирую команду из 8 человек: выстраиваю SMM-стратегию,
                    запускаю коллаборации и связываю контент с бизнес-метриками.
                  </p>
                </div>
                <div className="wild-layout">
                  <ProjectImage
                    className="wild-media"
                    item={{
                      name: "Wildberries — SMM-стратегия",
                      image: "wildberries-instagram.jpg",
                      alt: "Профиль Wildberries Official из портфолио",
                    }}
                    caption="Материалы из портфолио / Wildberries"
                  />
                  <div className="wild-stat">
                    <span className="eyebrow">Telegram / подписчики</span>
                    <div className="wild-stat__old">150 000</div>
                    <div className="wild-stat__arrow" aria-hidden="true">
                      <Arrow />
                    </div>
                    <div className="wild-stat__new">550 000</div>
                    <span className="eyebrow wild-stat__period">
                      I полугодие 2026
                    </span>
                    <div className="wild-business">
                      <strong>×3</strong>
                      <p>
                        GMV из соцсетей<span>I полугодие 2026</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="case__details">
                  <p>
                    <span className="copy-label">Решение</span>Обновила
                    позиционирование и визуальную систему, выстроила продвижение
                    через контент, таргетинг, посевы, бренд-интеграции и
                    инструменты экосистемы.
                  </p>
                  <div className="micro-stats">
                    <div>
                      <strong>500 000</strong>
                      <span>
                        подписчиков в MAX
                        <br />с нуля
                      </span>
                    </div>
                    <div>
                      <strong>15 млн</strong>
                      <span>
                        охват ВК
                        <br />
                        было 1,6 млн
                      </span>
                    </div>
                    <div>
                      <strong>4,6 млн</strong>
                      <span>
                        охват ОК
                        <br />
                        было 900 тыс.
                      </span>
                    </div>
                    <div>
                      <strong>2,6 млн</strong>
                      <span>
                        дополнительный охват
                        <br />в месяц от новых каналов
                      </span>
                    </div>
                  </div>
                </div>
                <div className="strategy-proof">
                  <div className="strategy-proof__copy">
                    <span className="eyebrow">
                      Instagram / материалы проекта
                    </span>
                    <h3>
                      Новая площадка.
                      <br />
                      <em>Знакомый бренд.</em>
                    </h3>
                    <p>
                      Профиль Wildberries из портфолио — 1,2 млн подписчиков на
                      момент скриншота.
                    </p>
                  </div>
                  <ProjectImage
                    className="strategy-proof__image"
                    item={{
                      name: "Wildberries — профиль Instagram",
                      image: "wildberries-instagram.jpg",
                      alt: "Скрин профиля Wildberries Official из портфолио: 1,2 млн подписчиков",
                    }}
                  />
                </div>
                <div className="case__substory">
                  <ProjectImage
                    className="substory-media"
                    item={{
                      name: "Wildberries — бренд-интеграции",
                      image: "wildberries-post.jpg",
                      alt: "Креатив Wildberries для партнерской публикации",
                    }}
                  />
                  <div>
                    <span className="eyebrow">Креатив в экосистеме</span>
                    <h3>
                      Бренд-интеграции,
                      <br />
                      которые работают
                    </h3>
                    <p>
                      Партнерские подарки для розыгрышей, коллаборация с
                      «Пятницей» и поддержка фильма «Яга на нашу голову».
                      Интеграция с «Пятницей» привела более 50 тысяч новых
                      подписчиков в Telegram, а кампания фильма повысила
                      вовлеченность в 1,5 раза. Совместный контентный проект с
                      Банком России добавил еще 15 тысяч подписчиков и повысил
                      вовлечённость на 35%.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </details>
          <details className="project-disclosure" id="metalloinvest">
            <summary>
              <span className="project-number">02</span>
              <BrandLogo name="Металлоинвест" />
              <span className="project-title">HR-кампания</span>
              <span className="project-toggle" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="project-content">
              {" "}
              <article className="case case--metal">
                <div className="metal-intro">
                  <div>
                    <div className="case__identity case__identity--stacked">
                      <span className="case__no">02 / HR-кампания</span>
                    </div>
                    <h2 className="company-title">
                      <BrandLogo name="Металлоинвест" heading />
                    </h2>
                    <p className="case__subtitle">
                      Найти людей для трех комбинатов
                    </p>
                    <p>
                      <span className="copy-label">Мой вклад</span>Распределяла
                      бюджет, выбирала площадки, согласовывала и оптимизировала
                      медиаплан и креативы для МГОК, ЛГОК и ОЭМК. Вела
                      коммуникацию с клиентом.
                    </p>
                  </div>
                  <ProjectImage
                    className="metal-media"
                    item={{
                      name: "Металлоинвест — HR-кампания",
                      image: "metalloinvest-hr.jpg",
                      alt: "Креатив HR-кампании Металлоинвест с сотрудником производства",
                    }}
                  />
                  <div className="metal-results">
                    <span className="eyebrow">Результат за 2 месяца</span>
                    <strong>1 015</strong>
                    <span className="eyebrow">заявок</span>
                    <span className="red-stroke red-stroke--small" />
                    <dl className="metal-secondary">
                      <div>
                        <dt>Показы</dt>
                        <dd>7 348 491</dd>
                      </div>
                      <div>
                        <dt>Переходы</dt>
                        <dd>36 910</dd>
                      </div>
                      <div>
                        <dt>Звонки</dt>
                        <dd>2 156</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </article>
            </div>
          </details>
          <div className="project-list">
            {cases.map((item, i) => (
              <details className="project-disclosure" key={item.no}>
                <summary>
                  <span className="project-number">{item.no}</span>
                  <BrandLogo name={item.name} />
                  <span className="project-title">
                    {item.name === "Слобода"
                      ? "SMM-стратегия и ведение соцсетей"
                      : item.name === "ВкусВилл"
                        ? "Инфлюенс-кампания"
                        : item.kind}
                  </span>
                  <span className="project-toggle" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="project-content mini-case">
                  <ProjectImage item={item} />
                  <div className="mini-case__body">
                    <div className="mini-case__heading">
                      <div className="mini-case__identity">
                        <span className="eyebrow">{item.kind}</span>
                      </div>
                      <h3 className="company-title">
                        <BrandLogo name={item.name} heading />
                      </h3>
                    </div>
                    <div className="mini-case__copy">
                      <p>
                        <span className="copy-label">Задача</span>
                        {item.task}
                      </p>
                      <p>
                        <span className="copy-label">Мой вклад</span>
                        {item.role}
                      </p>
                    </div>
                    <div className="mini-case__results">
                      {item.stats.map(([value, label]) => (
                        <div key={value}>
                          <strong>{value}</strong>
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                    {item.note && (
                      <p className="mini-case__note">{item.note}</p>
                    )}
                    {item.extraImage && (
                      <details className="case-material">
                        <summary>
                          Ещё материал: контентная съёмка <Arrow diagonal />
                        </summary>
                        <ProjectImage
                          item={item.extraImage}
                          className="case-material__image"
                        />
                      </details>
                    )}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
        <section
          className="approach contact"
          id="contact"
          aria-labelledby="approach-title"
        >
          <ApproachGlow />
          <div className="wrap approach__inner reveal">
            <Label>Подход и контакт</Label>
            <div>
              <p className="approach__kicker">
                Не просто присутствовать в ленте.
              </p>
              <h2 id="approach-title">
                Находить точку, где <em>креатив</em> становится{" "}
                <em>результатом.</em>
              </h2>
            </div>
            <div className="approach__bottom">
              <span>Стратегия / команда / контент / партнерства</span>
              <p>
                Выстраиваю стратегию под задачу бренда, собираю команду и
                организую работу над контентом и партнерствами. Оцениваю
                результат по охватам, росту аудитории и бизнес-метрикам.
              </p>
            </div>
            <div className="approach-contact">
              <p>
                Есть задача? Давайте обсудим.
                <span>Москва / открыта к новым проектам</span>
              </p>
              <div className="contact__links">
                <a
                  href="https://t.me/aleksaa_aleksa"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Написать в Telegram <Arrow diagonal />
                </a>
                <a href="tel:+79773197769">
                  +7 977 319 77 69 <Arrow diagonal />
                </a>
              </div>
            </div>
            <div className="contact__footer">
              <span>© Александра Дунаева, 2026</span>
              <a href="#top">
                Наверх <Arrow up />
              </a>
              <a
                href={documentUrl("portfolio.pdf")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Портфолио PDF <Arrow diagonal />
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
