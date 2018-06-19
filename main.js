$(document).ready(() => {
  let baseAPI = "https://dog.ceo/api";
  let listAllBreedsAPI = `${baseAPI}/breeds/list/all`; 

  getListAllBreeds();

  $(`nav`).delegate(".breed-wrap .icon", "click", function() {
    let $target = $(this);
    let $subList = $target.parent().next();
    
    $subList.toggleClass("responsive");

    if($subList.hasClass("responsive")) $target.text("+");
    else $target.text("-");
  });

  function getListAllBreeds() {
    $.getJSON(listAllBreedsAPI)
      .done(data => {
        if (data && data["status"] === "success") renderAllBreedsNavigation(data["message"]);
        else console.log("Get list all breeds error!")
      })
      .fail(error => console.log(error));
  }

  function renderAllBreedsNavigation(listBreeds) {
    let $listWrap = $(`<ul></ul>`);

    for (let key in listBreeds) {
      let $breedWrap = $(breedItemTemplate(key, listBreeds[key]));
      $listWrap.append($breedWrap);
    }

    $(`nav`).append($listWrap);
  }

  function subBreedTemplate(subBreedName) {
    return `
      <li>
        <div>
          <div class="sub-breed">${subBreedName}</div>
        </div>
      </li>
    `;
  }

  function breedItemTemplate(breedName, breedValue) {
    return `
      <li>
        <div class="breed-wrap">
          <div class="breed">${breedName}</div>
          ${breedValue.length > 0 ? '<span class="icon"> + </span>' : ''}
        </div>
        ${breedValue.length > 0 ? `
        <ul class="sub-list responsive">
            ${breedValue.map(subBreedName => subBreedTemplate(subBreedName)).join('')}
        </ul>
        ` : ``
      }
      </li>
    `;
  }
});
