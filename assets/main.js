// Show pass

window.addEventListener('load', function () {

    document.getElementById('toggle-pass').addEventListener('click', function() {
        let inputPass = document.getElementById('password');
        if (inputPass.type === 'password') {
            inputPass.type = 'text';
            inputPass.classList.add('show');
        } else {
            inputPass.type = 'password';
            inputPass.classList.remove('show');
        }
    });

    document.querySelector('.terms-btn').addEventListener('click', function() {
        document.querySelector('.modal').style.display = 'flex';
        document.querySelector('.body').classList.add('hidden');
    });

    document.querySelector('.close-btn').addEventListener('click', function() {
        document.querySelector('.modal').style.display = 'none';
        document.querySelector('.body').classList.remove('hidden');
    });

    document.querySelector('.modal__content-btn').addEventListener('click', function() {
        document.querySelector('.modal').style.display = 'none';
        document.querySelector('.body').classList.remove('hidden');
    });

});

// Slider

var swiper = new Swiper(".gallerySwiper", {
    slidesPerView: "auto",
    spaceBetween: 10,
    breakpoints: {
        640: {
            slidesPerView: 2,
            spaceBetween: 17,
        },
        991: {
            slidesPerView: 3,
            spaceBetween: 24,
        }
    }
});