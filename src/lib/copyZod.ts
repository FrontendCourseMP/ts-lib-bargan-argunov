import type { FormFn, FieldValidator } from "../types/types";

export const form: FormFn = (formElement: HTMLFormElement) => {
  const obj: Record<string, Record<string, string>> = {};
  const inputFields = formElement?.querySelectorAll("input");

  if (
    Array.from(inputFields).some((inputField) => {
      const ariaValue = inputField.getAttribute("aria-describedby");
      const outputField =
        ariaValue && formElement.querySelector(`#${ariaValue}`);
      return (
        !inputField.labels ||
        inputField.labels.length === 0 ||
        !inputField.id ||
        !inputField.name ||
        !outputField
      );
    })
  ) {
    throw Error(
      "There is no sequence consisting of a label, an input field, and an error output field."
    );
  }

  inputFields.forEach((inputField) => {
    obj[inputField.name] = {};
  });

  return {
    field(fieldName: string) {
      const inputField: HTMLInputElement | null = formElement.querySelector(
        `input[name='${fieldName}']`
      );

      if (!inputField) {
        throw Error("There is no input field with this name in this form.");
      }

      const validator: FieldValidator = {
        string() {
          if (inputField.type !== "text") {
            throw Error(
              "Narrowing of types is impossible because the input type is not 'text'."
            );
          }
          inputField.setAttribute("pattern", "[a-zA-Zа-яА-Я]+");
          return validator;
        },

        number() {
          if (!["text", "number", "range"].includes(inputField.type)) {
            throw Error(
              "Narrowing of types is impossible because the input type cannot be number."
            );
          }
          if (inputField.type === "text") {
            inputField.setAttribute("pattern", "[0-9]+");
          }
          return validator;
        },

        boolean() {
          if (inputField.type === "text") {
            inputField.setAttribute("pattern", "[Tt]rue|[Ff]alse");
            return validator;
          }
          throw Error(
            "Narrowing of types is impossible because the input type cannot be boolean."
          );
        },

        email() {
          if (inputField.type !== "email") {
            throw Error(
              "Narrowing of types is impossible because the input type is not 'email'."
            );
          }
          return validator;
        },

        url() {
          if (inputField.type !== "url") {
            throw Error(
              "Narrowing of types is impossible because the input type is not 'url'."
            );
          }
          return validator;
        },

        float() {
          if (!["text", "number", "range"].includes(inputField.type)) {
            throw Error(
              "Narrowing of types is impossible because the input type cannot be float."
            );
          }

          if (inputField.type === "text") {
            inputField.setAttribute("pattern", "^-?\\d+(\\.\\d+)?$");
          } else {
            inputField.step = "any";
          }

          return validator;
        },

        checkbox() {
          if (inputField.type !== "checkbox") {
            throw Error(
              "Narrowing of types is impossible because the input type is not 'checkbox'."
            );
          }
          return validator;
        },

        date() {
          if (inputField.type !== "date") {
            throw Error(
              "Narrowing of types is impossible because the input type is not 'date'."
            );
          }
          return validator;
        },

        min(error: string) {
          if (inputField.type === "text") {
            if (inputField.minLength === -1) {
              throw Error(
                `InputField with name ${inputField.name} does not contain "minlength".`
              );
            }
          } else if (["number", "range", "date"].includes(inputField.type)) {
            if (inputField.min === "") {
              throw Error(
                `InputField with name ${inputField.name} does not contain "min".`
              );
            }
          }

          obj[inputField.name]["min"] = error;
          return validator;
        },

        max(error: string) {
          if (inputField.type === "text") {
            if (inputField.maxLength === -1) {
              throw Error(
                `InputField with name ${inputField.name} does not contain "maxlength".`
              );
            }
          } else if (["number", "range", "date"].includes(inputField.type)) {
            if (inputField.max === "") {
              throw Error(
                `InputField with name ${inputField.name} does not contain "max".`
              );
            }
          }

          obj[inputField.name]["max"] = error;
          return validator;
        },
      };

      return validator;
    },

    validate() {
      formElement.addEventListener("submit", (event) => {
        event.preventDefault();

        inputFields.forEach((inputField) => {
          const fieldName = inputField.name;
          const ariaValue = inputField.getAttribute("aria-describedby");
          const outputField =
            ariaValue &&
            (formElement.querySelector(
              `#${ariaValue}`
            ) as HTMLOutputElement);

          const fieldErrors = obj[fieldName];
          if (!outputField || !fieldErrors) return;

          outputField.textContent = "";

          const validity = inputField.validity;
          if (!validity.valid) {
            if (validity.rangeUnderflow || validity.tooShort) {
              outputField.textContent =
                fieldErrors["min"] ?? inputField.validationMessage;
              return;
            }

            if (validity.rangeOverflow || validity.tooLong) {
              outputField.textContent =
                fieldErrors["max"] ?? inputField.validationMessage;
              return;
            }

            outputField.textContent = inputField.validationMessage;
          }
        });
      });
    },
  };
};
