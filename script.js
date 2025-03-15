document.addEventListener("DOMContentLoaded", () => {
    const steps = document.querySelectorAll('.form-step');
    let currentStep = 0;

    // Retrieve form data from localStorage
    const formData = JSON.parse(localStorage.getItem('formData')) || {
        name: '',
        dob: '',
        gender: '',
        email: '',
        phone: '',
        address: ''
    };

    // Function to show a specific step
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
    }

    // Function to save data in localStorage
    function saveData() {
        localStorage.setItem('formData', JSON.stringify(formData));
    }

    // Populate form fields with data from localStorage
    function populateForm() {
        document.getElementById('name').value = formData.name;
        document.getElementById('dob').value = formData.dob;
        document.getElementById('gender').value = formData.gender;
        document.getElementById('email').value = formData.email;
        document.getElementById('phone').value = formData.phone;
        document.getElementById('address').value = formData.address;
    }

    // Save data for each step
    function saveStepData(step) {
        if (step === 1) {
            formData.name = document.getElementById('name').value;
            formData.dob = document.getElementById('dob').value;
            formData.gender = document.getElementById('gender').value;
        } else if (step === 2) {
            formData.email = document.getElementById('email').value;
            formData.phone = document.getElementById('phone').value;
            formData.address = document.getElementById('address').value;
        }
        saveData(); // Save to localStorage after each update
    }

    // Form validation for each step with smart checks and regex
    function validateStep(step) {
        let isValid = true;
        const fields = steps[step].querySelectorAll('[required]');
        fields.forEach(field => {
            let errorMessage = '';
            // Name validation (only letters and spaces)
            if (field.id === 'name' && !/^[a-zA-Z\s]+$/.test(field.value)) {
                errorMessage = 'Name must contain only letters and spaces.';
            }
            // Date of Birth validation (must be 18 or older)
            else if (field.id === 'dob') {
                const birthDate = new Date(field.value);
                const age = new Date().getFullYear() - birthDate.getFullYear();
                if (age < 18) {
                    errorMessage = 'You must be at least 18 years old.';
                }
            }
            // Email validation (valid email format)
            else if (field.id === 'email' && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(field.value)) {
                errorMessage = 'Please enter a valid email address.';
            }
            // Phone number validation (accepts exactly 10 digits)
            else if (field.id === 'phone' && !/^\d{10}$/.test(field.value)) {
                errorMessage = 'Please enter a valid 10-digit phone number.';
            }
            // Address validation (must not be empty and has a minimum length)
            else if (field.id === 'address' && field.value.trim().length < 10) {
                errorMessage = 'Address must be at least 10 characters long.';
            }
            // Gender validation (must be selected)
            else if (field.id === 'gender' && field.value === '') {
                errorMessage = 'Please select your gender.';
            }

            // Display error message and highlight invalid fields
            const errorElement = field.nextElementSibling;
            if (errorMessage) {
                isValid = false;
                field.style.borderColor = 'red';
                if (!errorElement || !errorElement.classList.contains('error-message')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.classList.add('error-message');
                    errorDiv.style.color = 'red';
                    errorDiv.textContent = errorMessage;
                    field.insertAdjacentElement('afterend', errorDiv);
                }
            } else {
                field.style.borderColor = '';
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.remove();
                }
            }
        });
        return isValid;
    }

    // Event listeners for navigation
    document.getElementById('next-1').addEventListener('click', () => {
        if (validateStep(0)) {
            saveStepData(1);
            currentStep++;
            showStep(currentStep);
        }
    });

    document.getElementById('next-2').addEventListener('click', () => {
        if (validateStep(1)) {
            saveStepData(2);
            currentStep++;
            showStep(currentStep);

            // Display summary of data
            const summary = `
                <p><strong>Name:</strong> ${formData.name}</p>
                <p><strong>Date of Birth:</strong> ${formData.dob}</p>
                <p><strong>Gender:</strong> ${formData.gender}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Phone:</strong> ${formData.phone}</p>
                <p><strong>Address:</strong> ${formData.address}</p>
            `;
            document.getElementById('summary').innerHTML = summary;
        }
    });

    document.getElementById('back-2').addEventListener('click', () => {
        currentStep--;
        showStep(currentStep);
    });

    document.getElementById('back-3').addEventListener('click', () => {
        currentStep--;
        showStep(currentStep);
    });

    // Handle form submission
    document.getElementById('multi-step-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Form submitted successfully!');
        localStorage.removeItem('formData'); // Clear localStorage after submission
    });

    // Initialize the form by showing the current step and populating form data
    showStep(currentStep);
    populateForm();
});
