function phoneMask() {
    var num = this.value.replace(/\D/g, '');
    num = num.substring(0, 12);
    if (num.length > 0) {
        num = '+' + num;
    }
    if (num.length > 3) {
        num = num.slice(0, 3) + num.slice(3);
    }
    this.value = num;
}

var input = document.querySelector('#phone');
input.addEventListener('input', phoneMask);