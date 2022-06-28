let ratingBoxes = document.querySelectorAll('.rating-box');
let rating = document.querySelector('#rating');
let staffSelect = document.querySelector('#id-input');
let feedback = document.querySelector('#feedback');
let submit = document.querySelector('.submit');
let userId = document.querySelector('#userId');

let id = new URL(window.location.href).searchParams.get('id');
if (!id || id == 'null') {
  let newId = prompt('What is your Discord ID?');
  if (!newId || newId == null || newId.length < 0) window.location = window.location.href;

  let url = new URL(window.location.href);
  url.searchParams.set('id', newId);

  window.location = url.href;
}

userId.innerText = id;

let staff = [
  {
    id: '689233726319624227',
    tag: 'Domm#7800',
  },
  {
    id: '334392742266535957',
    tag: 'rugs#1014',
  },
];

staff.forEach(staff => {
  staffSelect.innerHTML += `<option value="${staff.id}">${staff.tag}</option>`;
});

ratingBoxes.forEach(element =>
  element.addEventListener('click', e => {
    let index = e.target.id;

    localStorage.setItem('rating', index);
    rating.innerText = index;

    ratingBoxes.forEach(box => {
      console.log(box.id, index);
      if (box.id <= index) {
        box.style.backgroundColor = 'var(--brand-color)';
      } else {
        box.style.backgroundColor = 'var(--background-light)';
      }
    });
  })
);

submit.addEventListener('click', e => {
  e.preventDefault();

  let staffId = staffSelect.value;
  let staffTag = staffSelect.options[staffSelect.selectedIndex].text;
  let userId = id;

  let starRating = localStorage.getItem('rating');

  let fb = feedback.value;

  if (!staffId) return alert('You must choose a staff member');
  if (!starRating) return alert('You must choose a rating');
  if (!fb) return alert('You must provide feedback');

  var xhr = new XMLHttpRequest();
  xhr.open('POST', `https://api.chathubfeedback.com/feedback?userId=${userId}&staffId=${staffId}&rating=${starRating}&review=${fb}`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({}));

  window.location = `/thanks.html?id=${staffId}&name=${encodeURIComponent(staffTag)}&userId=${userId}`;
});
