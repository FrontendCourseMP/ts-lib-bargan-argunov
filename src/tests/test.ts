export const form = (formElement: HTMLFormElement) => {
  const obj: Record<string, unknown> = {};
  const inputFields = formElement?.querySelectorAll("input");
  if (
    !Array.from(inputFields).every((inputField) => {
      const ariaValue = inputField.getAttribute("aria-describedby");
      const outputField =
        ariaValue && formElement.querySelector(`#${ariaValue}`);
      return (
        (!inputField.labels || inputField.labels.length === 0) &&
        !inputField.id &&
        !inputField.name &&
        !outputField
      );
    })
  ) {
    throw Error(
      "There is no sequence consisting of a label, an input field, and an error output field."
    );
  } else {
    inputFields?.length &&
      Array.from(inputFields).forEach((inputField) => {
        obj[inputField.name] = null;
      });
    return {
      field(fieldName: string) {
        const inputField: HTMLInputElement | null = formElement.querySelector(
          `input[name='${fieldName}']`
        );
        if (!inputField) {
          throw Error("There is no input field with this name in this form.")
        }
        const validator = {
          string() {
            inputField.type = "text"
            // type for inputFieldType - Literal Type
            return validator
          },
          number() {
            inputField.type = "number"
            return validator
          },
          min(error: string) {
            // code
            return validator
          },
          max: (error: string) => {
            // code
            return validator
          },
        };
        return validator
      },
    validate(){
      // code
    }
    };
  }
};
