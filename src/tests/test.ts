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
        const inputField = formElement.querySelector(
          `input[name='${fieldName}']`
        );
        const typeOfInput: string = "";
        const validator = {
          string: () => {
            return validator;
          },
          number: () => {
            return validator;
          },
          min: (error: string) => {
            return validator;
          },
          max: (error: string) => {
            return validator;
          },
        };
        return validator;
      },
    };
  }
};
