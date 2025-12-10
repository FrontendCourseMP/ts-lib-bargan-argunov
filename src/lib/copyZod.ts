import type { FormFn, FieldValidator } from "../types/types";

export const form: FormFn = (formElement: HTMLFormElement) => {
  let formIsValid = true
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
  } else {
    inputFields?.length &&
      Array.from(inputFields).forEach((inputField: HTMLInputElement) => {
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
            if (!["text"].includes(inputField.type)) {
              throw Error(
                "Narrowing of types is impossible because the type 'text' cannot be narrowed to this type."
              );
            }
            inputField.setAttribute("pattern", "[a-zA-Zа-яА-Я]+");
            return validator;
          },
          number() {
            if (!["text", "number", "range"].includes(inputField.type)) {
              throw Error(
                "Narrowing of types is impossible because the type 'text' or 'number' or 'range' cannot be narrowed to this type."
              );
            }
            if (inputField.type === "text") {
              inputField.setAttribute("pattern", "[0-9]+");
            }
            return validator;
          },
          boolean() {
            if (["text"].includes(inputField.type)) {
              inputField.setAttribute("pattern", "[Tt]rue|[Ff]alse");
            }
            return validator;
          },
          min(error: string) {
            if (inputField.type === "text") {
              if (inputField.minLength === -1) {
                throw Error(
                  `InputField with name ${inputField.name} does not contain a value for the attribute "minlength"`
                );
              }
            } else if (["number", "range"].includes(inputField.type)) {
              if (inputField.min === "") {
                throw Error(
                  `InputField with name ${inputField.name} does not contain a value for the attribute "min"`
                );
              }
            }
            obj[inputField.name]["min"] = error;
            return validator;
          },
          max: (error: string) => {
            if (inputField.type === "text") {
              if (inputField.maxLength === -1) {
                throw Error(
                  `InputField with name ${inputField.name} does not contain a value for the attribute "maxlength"`
                );
              }
            } else if (["number", "range"].includes(inputField.type)) {
              if (inputField.max === "") {
                throw Error(
                  `InputField with name ${inputField.name} does not contain a value for the attribute "max"`
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
              (formElement.querySelector(`#${ariaValue}`) as HTMLOutputElement);

            const fieldNameErrors = obj[fieldName];

            if (!outputField) return;
            if (!fieldNameErrors) return;

            outputField!.textContent = "";

            const validity = inputField.validity;

            if (!validity.valid) {
              formIsValid = false
              if (validity.rangeUnderflow) {
                outputField.textContent = fieldNameErrors["min"]
                  ? fieldNameErrors["min"]
                  : inputField.validationMessage;
                return;
              }

              if (validity.rangeOverflow) {
                outputField.textContent = fieldNameErrors["max"]
                  ? fieldNameErrors["max"]
                  : inputField.validationMessage;
                return;
              }

              if (validity.tooShort) {
                outputField.textContent = fieldNameErrors["min"]
                  ? fieldNameErrors["min"]
                  : inputField.validationMessage;
                return;
              }

              if (validity.tooLong) {
                outputField.textContent = fieldNameErrors["max"]
                  ? fieldNameErrors["max"]
                  : inputField.validationMessage;
                return;
              }

              outputField.textContent = inputField.validationMessage;
              return;
            }

            if (fieldNameErrors["min"]) {
              let isValid = true;
              formIsValid = false
              if (inputField.type === "text") {
                const minLength = inputField.minLength;
                if (minLength !== -1 && inputField.value.length < minLength) {
                  isValid = false;
                  formIsValid =  false
                }
              } else if (["number", "range"].includes(inputField.type)) {
                const min = parseFloat(inputField.min);
                const value = parseFloat(inputField.value);
                if (
                  !isNaN(min) &&
                  inputField.value !== "" &&
                  !isNaN(value) &&
                  value < min
                ) {
                  isValid = false;
                  formIsValid = false;
                }
              }
              if (!isValid) {
                outputField.textContent = fieldNameErrors["min"];
                return;
              }
            }

            if (fieldNameErrors["max"]) {
              let isValid = true;
              if (inputField.type === "text") {
                const maxLength = inputField.maxLength;
                if (maxLength !== -1 && inputField.value.length > maxLength) {
                  isValid = false;
                  formIsValid = false;
                }
              } else if (["number", "range"].includes(inputField.type)) {
                const max = parseFloat(inputField.max);
                const value = parseFloat(inputField.value);
                if (
                  !isNaN(max) &&
                  inputField.value !== "" &&
                  !isNaN(value) &&
                  value > max
                ) {
                  isValid = false;
                  formIsValid = false;
                }
              }
              if (!isValid) {
                outputField.textContent = fieldNameErrors["max"];
                return;
              }
            }
          });
        });
      return formIsValid
      },
    };
  }
};
