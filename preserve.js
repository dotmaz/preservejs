(function () {
  // IIEF to prevent leaking into global namespace
  const VERSION = "v1.0";
  const DOCUMENT = window?.document;

  function Preserve() {
    this.timeInitialized = Date.now().toString();
    this.formData = JSON.parse(
      window.localStorage.getItem("preservejs-formdata") || "{}"
    );

    this.updateFormData = function (key, value) {
      this.formData[key] = value;
      window.localStorage.setItem(
        "preservejs-formdata",
        JSON.stringify(this.formData)
      );
    };

    this.injectFormTracker = function () {
      const formsOnPage = [...DOCUMENT.getElementsByTagName("form")];
      if (!formsOnPage.length) {
        return;
      }

      formsOnPage.forEach((formElement) => {
        formElement.addEventListener("input", (event) => {
          this.updateFormData(event.target.name, event.target.value);
        });
        formElement.addEventListener("change", (event) => {
          this.updateFormData(event.target.name, event.target.value);
        });

        const formInputElements = [
          ...formElement.querySelectorAll('input:not([type="password"])'),
        ];

        formInputElements.forEach((formInputElement) => {
          const persistedValue = this.formData[formInputElement.name];
          if (
            persistedValue !== undefined &&
            persistedValue != null &&
            persistedValue !== formInputElement.value
          ) {
            formInputElement.value = persistedValue;
          }
        });
      });
    };

    (function init(preserve) {
      preserve.injectFormTracker();
    })(this);
  }

  (function main() {
    console.log(`Preserve.js ${VERSION} has been initialized.\n`);
  })();

  window.Preserve = Preserve;
})();

