// define collections
const siteUrlBegin = new Map();
const siteUrlEnd = new Map();
const siteLogos = new Map();
const qtxt = document.getElementById("inputText");
const empty = "";

// get Yandex
function getYandex(event) {
  const form = document.getElementById("sear4_form");
  const trgt = event.target.innerText;
  let qstr = "";
  if (trgt === "Поиск") {
    qstr = "https://yandex.ru/search/";
  } else if (trgt === "Карты") {
    qstr = "https://yandex.ru/maps/";
  } else if (trgt === "Товары") {
    qstr = "https://yandex.ru/products/";
  } else if (trgt === "Картинки") {
    qstr = "https://yandex.ru/images/search/";
  } else if (trgt === "Видео") {
    qstr = "https://yandex.ru/video/search/";
  } else if (trgt === "Перевод") {
    qstr = "https://translate.yandex.ru/";
  }
  if (!qtxt.value) {
    if (trgt === "Поиск") {
      qstr = "https://ya.ru/";
    } else if (trgt === "Картинки") {
      qstr = "https://yandex.ru/images/";
    } else if (trgt === "Видео") {
      qstr = "https://yandex.ru/video/";
    }
    form.action = "";
    form.target = "";
    window.open(qstr, "_blank");
  } else {
    form.action = qstr;
    form.target = "_blank";
  }
}
let buttons = document.querySelectorAll(".ya-button");
buttons.forEach((button) => {
  button.addEventListener("click", getYandex);
});

// get Google
function getGoogle(event) {
  let trgt = event.target.innerText;
  if (trgt) {
    trgt = trgt.replace(/ /, "");
  }
  let qstr = "";
  let qprm = "";
  if (trgt === "Карты") {
    qstr = "https://www.google.ru/maps?q=";
    qprm = "&ie=UTF-8";
  } else if (trgt === "Поиск") {
    qstr = "https://www.google.com/search?q=";
    qprm = "";
  } else if (trgt === "Новости") {
    qstr = "https://www.google.ru/search?q=";
    qprm = "&source=lmns&tbm=nws";
  } else if (trgt === "Картинки") {
    qstr = "https://www.google.ru/search?q=";
    qprm = "&source=lmns&tbm=isch";
  } else if (trgt === "Видео") {
    qstr = "https://www.google.ru/search?q=";
    qprm = "&source=lmns&tbm=vid";
  } else if (trgt === "Перевод") {
    if (qtxt.value.search(/[^а-яА-Я]+/)) {
      qstr = "https://translate.google.ru/?hl=ru&tab=vT&sl=auto&tl=en&text=";
    } else {
      qstr = "https://translate.google.ru/?hl=ru&tab=vT&sl=auto&tl=ru&text=";
    }
    qprm = "&op=translate";
  }
  if (trgt) {
    const site = qstr + encodeURIComponent(qtxt.value) + qprm;
    window.open(site, "_blank");
  }
}
buttons = document.querySelectorAll(".g-button");
buttons.forEach((button) => {
  button.addEventListener("click", getGoogle);
});

// make link
function makeLink(event) {
  const trgt = event.target.dataset.key;
  let qstr = siteUrlBegin.get(trgt) + qtxt.value + siteUrlEnd.get(trgt);
  if (qtxt.value) {
    window.open(qstr, "_blank");
  } else {
    qstr = qstr.replace(/https:\/\//, "");
    const queryParts = qstr.split("/");
    let domain = "";
    domain = domain.concat("https://", queryParts[0]);
    window.open(domain, "_blank");
  }
}

// get data from json
function getData(type) {
  const jsonFile = empty.concat("./data-", type, ".json");
  fetch(jsonFile)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`Fetching data error from json: ${jsonFile}`);
    })
    .then((data) => {
      // fetching ok
      const place = document.getElementById(type);
      // Object.entries(data).forEach((value, index) => {
      /* eslint-disable-next-line */
      for (let [key, value] of Object.entries(data)) {
        if (!value.hidden) {
          const link = place.appendChild(document.createElement("div"));
          link.className = "s-cell";
          const icon = `./pic/96x96/${value.logo}.png`;
          link.setAttribute("style", `background: url('${icon}') 0 0 no-repeat;`);
          link.setAttribute("data-key", key);
          siteUrlBegin.set(key, value.url_begin);
          siteUrlEnd.set(key, value.url_end);
          siteLogos.set(key, value.logo);
        }
      }
      // handle clicks
      const cells = document.querySelectorAll(".s-cell");
      cells.forEach((div) => {
        div.addEventListener("click", makeLink);
      });
    })
    .catch((error) => {
      // fetching error
      console.log(error);
    });
}

// menu help
const help = document.querySelector(".s-help");
const helpLink = document.querySelector(".s-help-link");
const helpClose = document.querySelector(".s-help-close");
const sections = document.querySelectorAll(".s-section");
function tipClick() {
  help.classList.toggle("hidden");
  sections.forEach((div) => {
    div.classList.toggle("hidden");
  });
}
function tipHide() {
  help.classList.add("hidden");
  sections.forEach((div) => {
    div.classList.remove("hidden");
  });
}
helpLink.addEventListener("click", tipClick);
helpClose.addEventListener("click", tipHide);

// clear input
const eraser = document.querySelector(".eraser");
function clearInput() {
  qtxt.value = "";
}
eraser.addEventListener("click", clearInput);

// start app
getData("services");
getData("sites");
