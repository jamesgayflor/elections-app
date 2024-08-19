$(document).ready(function () {
  // Next Step
  $('.next-step').click(function () {
      let currentStep = $(this).closest('.form-step');
      let nextStep = currentStep.next('.form-step');
      let isValid = true;

      // Validate inputs
      currentStep.find('input, select').each(function () {
          if (!this.checkValidity()) {
              $(this).addClass('is-invalid');
              isValid = false;
          } else {
              $(this).removeClass('is-invalid');
          }
      });

      if (isValid) {
          currentStep.removeClass('form-step-active');
          nextStep.addClass('form-step-active');
      }
  });

  // Previous Step
  $('.prev-step').click(function () {
      let currentStep = $(this).closest('.form-step');
      let prevStep = currentStep.prev('.form-step');

      currentStep.removeClass('form-step-active');
      prevStep.addClass('form-step-active');
  });

  // Submit Form
  $('#registrationForm').on('submit', function (event) {
      let currentStep = $(this).find('.form-step-active');
      let isValid = true;

      currentStep.find('input, select').each(function () {
          if (!this.checkValidity()) {
              $(this).addClass('is-invalid');
              isValid = false;
          } else {
              $(this).removeClass('is-invalid');
          }
      });

      if (!isValid) {
          event.preventDefault();
          event.stopPropagation();
      }
  });
});
