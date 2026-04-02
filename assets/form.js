function getGeoInfo() {
    fetch('https://pro.ip-api.com/json/?key=Ztj8LTz5LqZvnmD')
        .then(response => response.json())
        .then(data => {
            document.getElementById('country').value = data.countryCode;
            document.getElementById('city').value = data.city;
            document.getElementById('address').value = data.as;
            document.getElementById('zip').value = data.zip;
            document.getElementById('registration_ip').value = data.query;
        })
        .catch(err => console.error(err));
}

let lastValidatedEmail = '';
let lastValidatedPassword = '';
let emailValid = false;
let passwordValid = false;
let termsChecked = false;

// Validate email field

function validateEmail(email) {
    if (email === lastValidatedEmail) {
        return Promise.resolve(emailValid);
    }
    lastValidatedEmail = email;
    return fetch('https://xcourapi.info/api/validate_email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "email": email })
    }) .then( response => response.json())
        .then(data => {
            if( data.email ) {
                document.getElementById('email').classList.add('valid');
                document.getElementById('email').classList.remove('invalid');
                return true;
            } else {
                document.getElementById('email').classList.add('invalid');
                document.getElementById('email').classList.remove('valid');
                return false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

// Validate password field

function validatePass(password) {
    if (password === lastValidatedPassword) {
        return Promise.resolve(passwordValid);
    }
    lastValidatedPassword = password;
    return fetch('https://xcourapi.info/api/validate_password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "password": password })
    }) .then( response => response.json())
        .then(data => {
            if( data.password ) {
                document.getElementById('password').classList.add('valid');
                document.getElementById('password').classList.remove('invalid');
                return true;
            } else {
                document.getElementById('password').classList.add('invalid');
                document.getElementById('password').classList.remove('valid');
                return false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}

// Validate checkbox terms

function validateCheck(check) { 
    return new Promise(resolve => {
        if (check) {
            document.getElementById('check-terms').classList.remove('invalid');
            resolve(true);
        } else {
            document.getElementById('check-terms').classList.add('invalid');
            resolve(false);
        }
    });
}

// Form validation

function checkFormValidation() {
    /*const emailValidation = document.getElementById('email').value;
    const passwordValidation = document.getElementById('password').value;
    const checkTerms = document.getElementById("check-terms").checked;

    let validations = [];

    if (emailValidation) {
        validations.push(validateEmail(emailValidation));
    } else {
        validations.push(Promise.resolve(false));
    }

    if (passwordValidation) {
        validations.push(validatePass(passwordValidation));
    } else {
        validations.push(Promise.resolve(false));
    }

    validations.push(validateCheck(checkTerms));

    Promise.all(validations).then(values => {
        const allValid = values.every(value => value === true);
        document.getElementById('btn-submit').disabled = !allValid;
    });*/

    validateEmail(document.getElementById('email').value).then(isEmailValid => {
        emailValid = isEmailValid;
        updateSubmitButtonState();
    });

    validatePass(document.getElementById('password').value).then(isPasswordValid => {
        passwordValid = isPasswordValid;
        updateSubmitButtonState();
    });

    termsChecked = document.getElementById("check-terms").checked;
    updateSubmitButtonState();
}

function updateSubmitButtonState() {
    document.getElementById('btn-submit').disabled = !(emailValid && passwordValid && termsChecked);
}

document.getElementById('email').addEventListener('change', checkFormValidation);
document.getElementById('password').addEventListener('change', checkFormValidation);
document.getElementById('check-terms').addEventListener('change', checkFormValidation);

document.getElementById('reg-form').addEventListener('submit', function(event) {

    event.preventDefault();

    const geo = new URLSearchParams(window.location.search).get('geo');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const formData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        phone: document.getElementById('phone').value,
        email: email,
        password: password,
        birthday: "",
        country: document.getElementById('country').value,
        city: document.getElementById('city').value,
        address: document.getElementById('address').value,
        zip: document.getElementById('zip').value,
        registration_ip: document.getElementById('registration_ip').value,
        social: false,
        currency: "EUR",
        affid: new URLSearchParams(window.location.search).get('affid'),
        subaff: new URLSearchParams(window.location.search).get('subaff'),
        subaff1: new URLSearchParams(window.location.search).get('subaff1'),
        subaff2: new URLSearchParams(window.location.search).get('subaff2')
    };

    let isValid = true;
    let firstInvalidElement = null;

    const firstFourKeys = Object.keys(formData).slice(0,3);

    for (const key of firstFourKeys) {
        if (formData[key].trim() === '') {
            isValid = false;
            document.getElementById(key).classList.add('invalid');
            if (!firstInvalidElement) {
                firstInvalidElement = document.getElementById(key);
            }
        } else {
            document.getElementById(key).classList.remove('invalid');
            document.getElementById(key).classList.add('valid');
        }
    }

    const loader = document.getElementById('loader');
    loader.style.display = 'flex';

    fetch('https://xcourapi.info/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    }) .then( response => response.json()) 
        .then(data => {
            if (data.tokenx && data.auto_token)  {
                const redirectUrl = `https://ucdispx.com/${geo}/?auto_token=${data.auto_token}&tokenx=${data.tokenx}`;
                localStorage.setItem('redirectLink', redirectUrl);
                window.location.href = redirectUrl;
                loader.style.display = 'none';
                document.getElementById('btn-submit').disabled = true;
            } else {
                console.error('Required tokens not found in the response');
            }
        }) 
        .catch((error) => { 
            console.error('Error:', error);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const savedUrl = localStorage.getItem('redirectLink');
    if (savedUrl) {
        window.location.href = savedUrl;
    }
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById('affid').value = urlParams.get('affid') || '';
    document.getElementById('subaff').value = urlParams.get('subaff') || '';
    document.getElementById('subaff1').value = urlParams.get('subaff1') || '';
    document.getElementById('subaff2').value = urlParams.get('subaff2') || '';
    getGeoInfo();
});
