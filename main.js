$(document).ready(() => {
  let baseAPI = "https://dog.ceo/api/";
  let listAllBreedsAPI = `${baseAPI}breeds/list/all`;

  let $navBar = $('nav');
  let $gridWrap = $('main .grid-wrap');

  getListAllBreeds();

  $navBar.delegate(".breed-wrap .icon", "click", function () {
    let $target = $(this);
    let $subList = $target.parent().next();

    if ($subList.hasClass("responsive")) {
      $subList.removeClass("responsive");
      $subList.css("maxHeight", $subList[0].scrollHeight);
      $target.text("-");
    } else {
      $subList.addClass("responsive");
      $subList.css("maxHeight", 0);
      $target.text("+");
    }
  });

  $navBar.delegate(".breed-wrap .breed", "click", function () {
    onNavBarItemClicked(this);
  });

  $navBar.delegate(".sub-list .sub-breed", "click", function () {
    onNavBarItemClicked(this);
  });

  function onNavBarItemClicked(item) {
    let $target = $(item);
    let breedName = $target.attr("breed-name");
    let subBreedName = $target.attr("sub-breed-name");

    $navBar.find(".breed, .sub-breed, .icon").removeClass("active");
    $target.addClass("active");
    $target.siblings(".icon").addClass("active");
    fetchImages(breedName, subBreedName);
  }

  function fetchImages(breedName, subBreedName) {
    let apiURL = `${baseAPI}breed/${breedName}${subBreedName ? `/${subBreedName}` : ''}/images`;

    $.getJSON(apiURL)
      .done(data => {
        if (data && data["status"] === "success") renderAllBreedImages(data["message"]);
        else console.log("Get all breed images error!");
      })
      .fail(error => console.log(error));
  }

  function renderAllBreedImages(images) {
    $gridWrap.empty();

    images.forEach(element => {
      $gridWrap.append(imgCellTemplate(element));
    });
  }

  function getListAllBreeds() {
    $.getJSON(listAllBreedsAPI)
      .done(data => {
        if (data && data["status"] === "success") renderAllBreedsNavigation(data["message"]);
        else console.log("Get list all breeds error!");
      })
      .fail(error => console.log(error));
  }

  function renderAllBreedsNavigation(listBreeds) {
    let $listWrap = $(`<ul></ul>`);

    for (let key in listBreeds) {
      let $breedWrap = $(breedItemTemplate(key, listBreeds[key]));
      $listWrap.append($breedWrap);
    }


    $navBar.append($listWrap);
    addScrollbarIfNeeded($navBar);
  }

  function imgCellTemplate(url) {
    return `
      <div class="cell my-transition">
        <img src="${url}">
      </div>
    `;
  }

  function subBreedTemplate(breedName, subBreedName) {
    return `
      <li>
        <div>
          <div class="sub-breed my-transition" breed-name="${breedName}" sub-breed-name="${subBreedName}">${subBreedName}</div>
        </div>
      </li>
    `;
  }

  function breedItemTemplate(breedName, breedValue) {
    return `
      <li>
        <div class="breed-wrap">
          <div class="breed my-transition" breed-name="${breedName}">${breedName}</div>
          ${breedValue.length > 0 ? '<span class="icon"> + </span>' : ''}
        </div>
        ${breedValue.length > 0 ? `
        <ul class="sub-list my-transition responsive">
          ${breedValue.map(subBreedName => subBreedTemplate(breedName, subBreedName)).join('')}
        </ul>
        ` : ``
      }
      </li>
    `;
  }

  function isOverflowedX(element) {
    return element.scrollWidth > element.clientWidth;
  }

  function isOverflowedY(element) {
    return element.scrollHeight > element.clientHeight;
  }

  function addScrollbarIfNeeded($element) {
    if (isOverflowedY($element[0])) $element.css("overflow-y", "scroll");
    else $element.css("overflow-y", "initial");
  }
});
