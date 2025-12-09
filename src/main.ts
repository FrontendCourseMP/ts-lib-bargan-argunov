import * as c from "./tests/test";

const formElement = document!.querySelector("#exampleForm") as HTMLFormElement;

if (formElement) {
  const validator = c.form(formElement);

  validator.field("name").string();

  validator
    .field("age")
    .number()
    .min("Возраст должен быть не менее 18 лет")
    .max("Возраст не может превышать 100 лет");

  validator
    .field("salary")
    .number()
    .min("Зарплата должна быть не менее 30000")
    .max("Зарплата не может превышать 500000");

  validator
    .field("bio")
    .string()
    .min("Описание должно содержать минимум 10 символов")
    .max("Описание не может превышать 200 символов");

  validator.field("isActive").boolean();

  validator.field("phone").number();

  validator.validate();
}
