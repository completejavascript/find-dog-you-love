$(document).ready(() => {
  let baseAPI = "https://dog.ceo/api/";
  let listAllBreedsAPI = `${baseAPI}breeds/list/all`;

  let $navBar = $('nav');
  let $mainApp = $('main');
  let $gridWrap = $('main .grid-wrap');
  let $collapseMenu = $('nav .collapse-menu');
  let $scrollToTop = $('nav .scroll-to-top');

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

  $collapseMenu.on("click", function() {
    $navBar.toggleClass("show");
  });

  $scrollToTop.on("click", function() {
    $('html,body').stop().animate({
      scrollTop: 0
    }, 1500);
  });

  function onNavBarItemClicked(item) {
    let $target = $(item);
    let breedName = $target.attr("breed-name");
    let subBreedName = $target.attr("sub-breed-name");

    $navBar.find(".breed, .sub-breed, .icon").removeClass("active");
    $target.addClass("active");
    $target.siblings(".icon").addClass("active");
    $navBar.removeClass("show");
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

    images.forEach(imgURL => {
      let $imgCell = $(imgCellTemplate(imgURL));
      $gridWrap.append($imgCell);

      // Smooth loading images
      $imgCell.find("img").on("load", function() {
        $(this).addClass("loaded");
      });
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
    chooseRandomBreed();
  }

  function chooseRandomBreed() {
    let $breeds = $navBar.find(".breed");
    let random = getRandomArbitrary(0, $breeds.length);
    let $randomBreed = $($breeds[random]);

    $randomBreed.trigger("click");
    $navBar.animate({
      scrollTop: $randomBreed.offset().top - 30
    }, 2000);
  }

  function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function imgCellTemplate(url) {
    return `
      <div class="cell my-transition">
        <img src="${url}" class="my-transition">
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
