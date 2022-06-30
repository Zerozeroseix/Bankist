'use strict';

// SElECTIONS
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

// Tabbed Component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
// NavBar
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button Scrolling
//VER MAIS em #188. Implementing Smooth Scrolling
btnScrollTo.addEventListener('click', function (e) {
  // coordenadas do elemento RELATIVAS ao VIEWPORT!!! Nom ao documento!!!
  const s1coords = section1.getBoundingClientRect();
  // 2. Método moderno de SALTAR
  section1.scrollIntoView({ behavior: 'smooth' }); // Os cálculos de coordenadas som realizados polo browser. Nós só temos que indicar a que elemento viajar.
});

// LEC #192. Event Delegation: Implementing Page Navigation
//Page Navigation
// Without Event Delegation: esta soluçom está bem quando temos só uns poucos LINKS aos que saltar e podemos permitor-nos fazer um bucle pequeno sobre eles sem afectar ao desempenho.
// document
//   .querySelectorAll('.nav__link') // retorna um NodeList cos .nav__link
//   .forEach(function (el) {
//     el.addEventListener('click', function (e) {
//       // Evitamos o comportamneto por defeito, que é saltar ao "href"
//       e.preventDefault();
//       console.log('LINK');
//       // Aplicamos a smooth navigation
//       // A MINHA SOLUÇOM para procurar a Selecçom
//       // const targetSection = document.querySelector(el.getAttribute('href'));
//       // targetSection.scrollIntoView({ behavior: 'smooth' });
//       // SOLUÇOM de Jonas
//       const id = this.getAttribute('href');
//       document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     });
//   });

// NOTE SOLUÇOM DOS LINKS com Event Delegation
// 1. Add event listener to a common parent element
// 2. Determine what element originated the event
document
  .querySelector('.nav__links') // O pai dos elementos target
  .addEventListener('click', function (e) {
    e.preventDefault();
    // Matching strategy (que ignora os clicks que nom sucedem nos children que nos interessam)
    if (e.target.classList.contains('nav__link')) {
      const id = e.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });

// LEC #194. Building a Tabbed Component

// Event handlers
tabsContainer.addEventListener('click', function (e) {
  // Matching Strategy
  const clicked = e.target.closest('.operations__tab');
  // Guard clause
  if (!clicked) return;
  // Remove active classes
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document;
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
  // Activate tab
  clicked.classList.add('operations__tab--active');
});

// LEC #195. Passing Arguments to Event Handlers
// Menu fade animation
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target; // o elemento que recebe o evento
    const siblings = link.closest('.nav').querySelectorAll('.nav__link'); // os irmaos (.nav-link) do elemento com procura arriba-abaixo
    const logo = link.closest('.nav').querySelector('img'); // os irmaos (<img>) do elemento com procura arriba-abaixo
    // Activamos o FADING nos SIBLINGS/logo do elemento que recebe o mouseover
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// Passing an "argument" into handler.
// NOTE equivalente a passa um funçom: (e) => handleHover(e, 0.5);
// O método BIND fai umha cópia da funçom que recolhe, o parámetro "e" em segundo plano (assi o entendim eu). O parámetro com valor "0.5" equivale a "this". Se tivéssemos mais parámetro que passar com BIND, este this deveria ter a forma dum OBJECTO ou dum ARRAY de valores.
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// SECÇOM COMENTADA porque implementamos o METHODO em #197
// // LEC #196. Implementing a Sticky Navigation: The Scroll Event
// // SOLUÇOM com Scroll Event.
// // Este metodo nom é eficiente porque está constantemente comporvando as coordenadas, o que pode afectar ao desempenho. Em LEC @¡#197 usaremos outro método melhor.
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function (e) {
//   // console.log(window.scrollY);
//   // A NavBar fara-se sticky quando o scroll chegue à Section_1
//   // 1. Determinar dinamicamente a coordenada Y de Section_1:
//   // Guardada em initialCoords
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// LEC #197. A Better Way: The Intersection Observer API
// Existe um melhor jeito de fazer o FADING, usando a API "The Intersection Observer"
// Sticky navigation: Intersection Observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height; // Tomamos dinamicamente a height de Nav para fazer o calculo de rootMargin. Normalmenmte será de 90px, mais poderia variar.

const stickyNav = function (entries) {
  const [entry] = entries; // Tomamos o item entries[0]
  // console.log(entry);
  if (!entry.isIntersecting) return nav.classList.add('sticky');
  return nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, // Todo o viewport
  threshold: 0, // COndiçom para que salte o evento Observer: quando nom se veja no viewport um 0% de header
  rootMargin: `-${navHeight}px`, // Define a marge do root (aqui o voewport). O evento activa-se nom quando o threshold chegue ao 0% senom quando esteja a 90px de ocorrer. Os 90px coincidem co height do elemento NAV que queremos que apareza "sticky".
});
headerObserver.observe(header);

// LEC #198. Revealing Elements on Scroll
// Implementamos o efeito de novo com Intersection Observer API

// Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries; // entry = entries[0]
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); // Eliminamos a observaçom. Só deve funcionar 1 VEZ
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null, // ===viewport
  threshold: 0.15, //Quando a section seja 15% visivel
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// LEC #199. Lazy Loading Images
// Implementamos o efeito de novo com Intersection Observer API

// Lazy loading images
const imgTarget = document.querySelectorAll('[data-src]');
// console.log(imgTarget);
const loadImg = function (entries, observer) {
  const [entry] = entries; // entry = entries[0]
  // console.log(entry);
  if (!entry.isIntersecting) return;
  // Replace in <img> the [src] with [data-src]
  entry.target.src = entry.target.dataset.src;
  // Quando em segundo plano JS acabe de carregar a nova image, emitirá um LoadEvent
  entry.target.addEventListener('load', function () {
    // Só removemos o BLUR quando a nova image esteja carregada. Assi evitaremos que o usuario veja a image velha, em caso de ter umha conexom lenta
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target); // Eliminamos a observaçom. Só deve funcionar 1 VEZ
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null, // ===viewport
  threshold: 0, //Quando a section seja 0% visivel,
  rootMargin: '200px', // O evento salta com antelaçom de 200px (antes de chegar ao threshold). Assi damos mais tempo para as images se carregarem
});
imgTarget.forEach(img => imgObserver.observe(img));

// LEC #200. Building a Slider Component: Part 1

// Slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlide = slides.length - 1; // Número de fotos

  // FUNCTIONS
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
      // Se slide === 0: 0%, 100%, 200%, 300%
      // Se slide === 1: -100%, 0%, 100%, 200%
      // Se slide === 2: -200%, -100%, 0%, 100%
      // Se slide === 3: -300%, -200%, -100%, 0%
    );
  };

  const createDots = function () {
    slides.forEach(function (_s, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    const todosDots = document.querySelectorAll('.dots__dot');
    const dotActual = document.querySelector(
      `.dots__dot[data-slide="${slide}"]`
    );
    // Remover active em todos
    todosDots.forEach(dot => dot.classList.remove('dots__dot--active'));
    // Adicionar active em actual
    dotActual.classList.add('dots__dot--active');
  };

  // Funçom Inicializaçom
  const init = function () {
    activateDot(0);
    goToSlide(0);
  };

  createDots(); // Cria os DOTS

  // Next Slide
  const nextSlide = function () {
    if (currentSlide === maxSlide) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  //Inicializaçom
  init();

  // EVENT handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // LEC #201. Building a Slider Component: Part 2
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide(); // Short Circuiting!!!
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset; // destructuing num objecto. Delvolve o valor de slide
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();

////////////////////////////////////////////////////////////////////////////////////

/// LECTURES

// LEC #186. Selecting, Creating, and Deleting Elements
// // console.log(
// ('**** APARTADO 186. Selecting, Creating, and Deleting Elements *******');
// // );

/**** ********************************NOTE CONTIDO: 
 * ***************************************************
// .queryselector()
// .queryselectorAll()

// .getElementById()
// .getElementsByTagName()
// .getElementsByClassName()


// .createElement()
// .classList.add()
// .textContent =
// .innerHTML = 

// .prepend()
// .append()
// PAI.append(FILHO.cloneNode(true)) (cópias do elemento)
// .after()
// .before()

// FILHO.remove();
// // Método velho:  FILHO.parentElement.removeChild(FILHO);

/*************************************************
*************************************************/

// // Selecting Elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// // Os selectores MODERNOS
// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// // Os VELHOS (alguns deles)
// // TAGS
// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button'); //Nom devolve um NodeList, senom umha HTML Collection. A diferença fundamental é que a Collection será actualizada após cada alteraçom. P.e: se elminamos "no ar" um elemento button dos que tinhamos seleccionados, deixará de aparecer na colecçom. Isso NOM passará coa NodeList, que é persistente.
// console.log(allButtons);
// // CLASSES
// document.getElementsByClassName('btn');

// // Creating and inserting elements
// // .insertAdjacentHTML

// // Cria um <div
// const message = document.createElement('div');
// // Nesse div adicionamos umha classe
// message.classList.add('cookie-message');
// // Agora um texto
// message.textContent = 'We use cookied for improved functionality and analytics';
// message.innerHTML =
//   'We use cookied for improved functionality and analytics <button class="btn btn--close-cookie">Got it!</button>';

// // Ajunta o message (div) a header (<header class="header">)
// // Como 1º Child.......
// // header.prepend(message);

// // Como último child........
// // E desaparecerá como 1º elemento, porque um "live element" só pode estar num lugar ao mesmo tempo.
// // Na prática podemos usar PREPEND e APPEND nom só para ajuntar elementos, senom tamém para MOVE-LOS
// header.append(message);

// // Para ter cópias do elemento.......
// // header.append(message.cloneNode(true));

// // header.before(message);
// // header.after(message);

// // Delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     //  Método novo
//     message.remove();
//     // Método velho
//     // message.parentElement.removeChild(message);
//   });

// // LEC #187. Styles, Attributes and Classes
// // console.log(
// ('**** APARTADO 187. Styles, Attributes and Classes *******');
// // );

// /**** ********************************NOTE CONTIDO:

// ELEMENTO.style.propriedade =
// getComputedStyle(ELEMENTO).propriedade
// document.documentElement.style.setProperty('--color-primary', 'orangered');

//  * ***************************************************/

// // STYLES (inline)
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.color); // nom aparece nada, porque nom está definido inline
// console.log(message.style.backgroundColor); // si aparece, porque foi definido inline

// console.log(getComputedStyle(message)); // Aparece todo o estilo aplicado ao elemento. POUCO UTIL!!!
// console.log(getComputedStyle(message).color); // rgb(187, 187, 187)
// console.log(getComputedStyle(message).height); // 49px

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// // CSS variables ou Custom Properties
// // Modificar valor da Custom Property
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// // ATTRIBUTES
// const logo = document.querySelector('.nav__logo');
// // Acceder aos atributos STANDARD
// console.log(logo.alt); // Bankist logo
// console.log(logo.src); // http://127.0.0.1:8080/img/logo.png  // MOSTRA a URL ABSOLUTA, nom a relativa que está estabelecida no código HTML
// console.log(logo.className); // nav__logo

// // Modificar
// logo.alt = 'Beautiful minimalist logo';

// // Acceder/estabelecer aos atributos NON-STANDARD
// console.log(logo.designer); // undefined  *******( nom funciona porque nom é um atributo standard de <img>)
// console.log(logo.getAttribute('designer')); // Jonas
// console.log(logo.setAttribute('company', 'Bankist')); // Cria um atributo em <img> company="Bankist"

// // Acceder a URLS relativas e absolutas
// console.log(logo.getAttribute('src')); // img/logo.png  // MOSTRA URL RELATIVA que está estabelecida no código HTML (cf. logo.src)
// const link = document.querySelector('.btn--show-modal');
// console.log(link.href); // http://127.0.0.1:8080/#  (URL ABSOLUTA)
// console.log(link.getAttribute('href')); // # (URL RELATIVA)

// // Data Attributes
// console.log(logo.dataset.versionNumber); // 3.0
// console.log(logo.dataset.designer); // undefined
// //*** NOTE: se criamos um atributo iniciado por "data-" este será guardado no DATASET do elemento. Para acceder a el, teremos que por "dataset.restoDoNome" */

// // Classes
// logo.classList.add('c', 'j');
// logo.classList.remove('c', 'j');
// logo.classList.toggle('c');
// logo.classList.contains('c');
// //  Don't use!!!!!!!!!!: log.className('Jonas') //// isto sobreescreve o resto das classes previas

//LEC #188. Implementing Smooth Scrolling

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   // coordenadas do elemento RELATIVAS ao VIEWPORT!!! Nom ao documento!!!
//   const s1coords = section1.getBoundingClientRect();

//   /****** NOTE: EXPLICAÇOM DA COORDENADAS

//   console.log(s1coords);

//   console.log(e.target.getBoundingClientRect());

//   // Coordenadas do SCROLL
//   console.log('Current scroll (X/Y): ', window.pageXOffset, window.pageYOffset); // Valores X-Y do SCROLL
//   // Coordenadas do VIEWPORT
//   console.log(
//     '(X/Y) Viewport: ',
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   ); // Valores X-Y do Viewport
//   ***********************************************/

//   // // Scrolling

//   // 1. OLD SCHOOL WAY (calculando coordenadas e logo ordenando o salto)
//   // Método 1a (SEM behavior):
//   // // Salto da posiçom actual (actual = quando se lanza o evento!!) às coordenadas da secçom 1
//   // window.scrollTo(
//   //   // O cálculo da posiçom absoluta X da section1: pos.X actual + Scroll.X actual
//   //   s1coords.left + window.pageXOffset,
//   //   // O cálculo da posiçom absoluta Y da section1: pos.Y actual + Scroll.Y actual
//   //   s1coords.top + window.pageYOffset
//   // );

//   // Método 1b com Behavior = "smooth"
//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset,
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // });

//   // 2. Método moderno de SALTAR
//   section1.scrollIntoView({ behavior: 'smooth' }); // Os cálculos de coordenadas som realizados polo browser. Nós só temos que indicar a que elemento viajar.
// });

//LEC #189. Types of Events and Event Handlers

// // Um evento é um sinal de que algo aconteceu
// const h1 = document.querySelector('h1');

// // OLD SCHOOL
// // h1.onmouseenter = function (e) {
// //   alert('addEventListener: GREAT!! You are reading the heading!');
// // };

// const alertH1 = function (e) {
//   alert('addEventListener: GREAT!! You are reading the heading!');
//   // podemos eliminar o Listener na propria funçom.
//   // Útil se queremos que o evento salte 1 VEZ
//   h1.removeEventListener('mouseenter', alertH1);
// };

// // O cursor entra no elemento
// h1.addEventListener('mouseenter', alertH1);

// // Por suposto, podemos remover o Listener passado um tempo
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

//LEC #190. Event Propagation: Bubbling and Capturing (TEORIA)
//LEC #191. Event Propagation in Practice

// rgb(255,255,255)
// Generar inteiro aletorio entre dous numeros dados
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// // O mesmo evento pode ser reutilizado em todos os PARENTS até o ROOT PARENT (= document), porque este se propaga cara arriba
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor(0, 255));

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK: ', e.target, e.currentTarget);
//   console.log(e.currentTarget === this); // SOM O MESMO!!!

//   // STOP PROPAGTION (geralmente nom é umha idea para a propagaçom dos eventos)
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER: ', e.target, e.currentTarget);
//   console.log(e.currentTarget === this); // SOM O MESMO!!!
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('NAV: ', e.target, e.currentTarget);
//     console.log(e.currentTarget === this); // SOM O MESMO!!!
//   },
//   // Como terceiro parámetro do AddEventListener temos a CATCHING PHASE, que se activa com "TRUE". Aqui o evento pai toma o evento na primeira fase (v. #190.) ou Catching Phase, parando o resto do processo e executando a funçom assignada. Deste jeito o(s) Listener do(s) elemento(s) nunca ouvirám o evento. Note-se a saida da consola pra ver como mudou o target do evento!!
//   false
// );

// LEC #193. DOM Traversing
// const h1 = document.querySelector('h1');

// // Going downwards: selecting Child Elements
// console.log(h1.querySelectorAll('.highlight')); // NodeList(2) [span.highlight, span.highlight]
// console.log(h1.childNodes); // NodeList(9) [text, comment, text, span.highlight, text, br, text, span.highlight, text]
// console.log(h1.children); // FILHOS DIRECTOS!!! HTMLCollection(3) [span.highlight, br, span.highlight]
// console.log(h1.firstElementChild); // <span class="highlight"> (banking) …</span>
// console.log(h1.lastElementChild); // <span class="highlight">(minimalist) …</span>
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orange';

// // Going upwards: selecting PARENT Elements
// console.log(h1.parentNode); // <div class="header__title">…</div>grid
// console.log(h1.parentElement); // <div class="header__title">…</div>grid

// // Encontra o parent do elemento mais próximo que cumpra a condiçom de busca
// // Pode-se dizer que é o "contrario" de querySelector. Mentres este busca por coincidencias nos filhos, closest() procura-as nos pais do eleemnto (começando polo elemento mesmo).
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

// // Going sideways: selecting SIBLINGS
// // Só podemos acceder aos irmaos mais proximos
// console.log(h1.previousElementSibling); // null
// console.log(h1.nextElementSibling); // <h4>A simpler banking experience for a simpler life.</h4>

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// // para listar todos os irmaos podemos fazer o truco de subir ao Pai e listar todos os Filhos
// console.log(h1.parentElement.children); // HTMLCollection(4)
// // Como as NodeList som tamém iteraveis, usam os metodos dos arrays:
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

// LEC #197. A Better Way: The Intersection Observer API
// Existe um melhor jeito de fazer o FADING, usando a API "The Intersection Observer"
// Explicaçom do que imos fazer co elemento HEADER mais aplicado ao eleemnto SECTION-1

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry.intersectionRatio, entry.isIntersecting);
//   });
//   // entry devolve um OBJECTO IntersectionObserverEntry, com vária props. As que nos interessam som:;
//   // isIntersecting: true; // Indica que o Observado está a intersectar com ROOT (=== viewport)
//   // intersectionRatio: 0.10356542468070984; // Indica a ratio (porcentage) de intersecçom do Observado em Root (0.1035 = 10%).
//   // Precisamente o OBJECTO criou-se (é dizer o OBSERVADOR deu um aviso) quando o OBSERVADO passou o THRESHOLD (limiar, límite) estabelecido nas Opçons (pode-se estabelecer um array de límites se for necessaŕio, por exemplo threshold: [0.1, 0.3, 0.5])
//   // IMPORTANTE: o OBSERVADOR devolve um objecto cada vez que umha das condiçons é mudada, é dizer, cada vez que se cruza o limiar estabelecido. No noso caso cada vez que a porcentage do elemento SOBE de 0.1 ou BAIXA de 0.1. Isso permite que o nosso Observador trabalhe em ambos sentidos arriba-abaixo e abaixo-arriba.
// };
// const obsOptions = {
//   root: null, // Null === viewport (Pode definir-se qualquer outro elemento do DOM). root só define o elemento que o nosso elemento observado (section1) deverá intersectar.
//   // Para o nosso caso: quando apareça em pantalha (viewport) o elmento section1
//   threshold: [0, 0.2], // threshold === limiar, limite, umbral. Define um límite a partir da qual "section1" é "observado" (0.1 === 10% do elemento)
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

// LEC #202. Lifecycle DOM Events

//EVENTO 1: DOMContentLoaded
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built ', e);
});
//EVENTO 2: load
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

//EVENTO 2: beforeunload
//NOTE: útil para perguntar antes de sair da página. MOI INTRUSIVO
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault(); // requirido nalguns browsers
//   console.log(e);
//   e.returnValue = '';
// });

// LEC #203. Efficient Script Loading: defer and async
// Explicaçom de quando e como é melhor LER e EXECUTAR o script js quando se carrega a página. VER video e PDF
