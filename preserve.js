(function () {
  // IIEF to prevent leaking into global namespace
  const VERSION = "v0.2";
  const DOCUMENT = window?.document;

  function Preserve() {
    this.timeInitialized = Date.now().toString();
    this.formData = JSON.parse(
      window.localStorage.getItem("preservejs-formdata") || "{}"
    );

    this.updateFormData = function (key, value, bucket) {
      if (!this.formData[bucket]) this.formData[bucket] = {};
      this.formData[bucket][key] = value;
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

      // Get URL path for indexing

      const urlHost = window?.location.host;
      const urlPathname = window?.location.pathname;

      formsOnPage.forEach((formElement, formIdx) => {
        const bucket = `${urlHost}+${urlPathname}+${formIdx}`;
        formElement.addEventListener("input", (event) => {
          this.updateFormData(event.target.name, event.target.value, bucket);
        });
        formElement.addEventListener("change", (event) => {
          this.updateFormData(event.target.name, event.target.value, bucket);
        });

        const formInputElements = [
          ...formElement.querySelectorAll('input:not([type="password"])'),
        ];

        formInputElements.forEach((formInputElement) => {
          const persistedValue = this.formData[bucket]?.[formInputElement.name];
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
