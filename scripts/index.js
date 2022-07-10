let ratingBoxes = document.querySelectorAll('.rating-box');
let rating = document.querySelector('#rating');
let staffSelect = document.querySelector('#id-input');
let feedback = document.querySelector('#feedback');
let submit = document.querySelector('.submit');
let userId = document.querySelector('#userId');
let yourId = document.querySelector('.yourId');
let form = document.querySelector('.form');
let warning = document.querySelector('.warning');

let id = new URL(window.location.href).searchParams.get('id');
if (!id || id == 'null' || id.length < 17) {
  yourId.style.display = 'none';
  form.style.display = 'none';

  warning.innerText = 'You can only leave feedback if a link is generated for you. \n\n Please ask a staff member to generate a link for you.';
}

userId.innerText = id;

window.onload = async () => {
  let { data } = await axios.get('https://api.chathubfeedback.com/staff');
  console.log(data);
  data.forEach(staff => {
    staffSelect.innerHTML += `<option value="${staff.member.id}">${staff.member.tag}</option>`;
  });
};

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

  axios({
    url: `https://api.chathubfeedback.com/feedback?userId=${userId}&staffId=${staffId}&rating=${starRating}&review=${fb}`,
    method: 'POST',
    data: {},
  }).then(d => {
    window.location = `/thanks.html?id=${staffId}&name=${encodeURIComponent(staffTag)}&userId=${userId}`;
  });
});
