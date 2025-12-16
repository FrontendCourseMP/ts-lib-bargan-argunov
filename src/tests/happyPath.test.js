// @vitest-environment jsdom
import * as c from "../lib/copyZod";
import { expect, test } from "vitest";
import renderForm from "./renderForm";

test("HappyPath: валидная форма проходит валидацию без ошибок", () => {
  // Arrange
  const formElement = renderForm();

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

  formElement.elements.namedItem("name").value = "SergeiDenis";
  formElement.elements.namedItem("age").value = "25";
  formElement.elements.namedItem("salary").value = "100000";
  formElement.elements.namedItem("bio").value = "НемногоИнформацииОбоМне";
  formElement.elements.namedItem("isActive").value = "true";
  formElement.elements.namedItem("phone").value = "1234567890";

  // Act
  validator.validate();
  formElement.dispatchEvent(
    new Event("submit", { bubbles: true, cancelable: true }),
  );

  // Assert
  expect(document.querySelector("#name-error").textContent).toBe("");
  expect(document.querySelector("#age-error").textContent).toBe("");
  expect(document.querySelector("#salary-error").textContent).toBe("");
  expect(document.querySelector("#bio-error").textContent).toBe("");
  expect(document.querySelector("#isActive-error").textContent).toBe("");
  expect(document.querySelector("#phone-error").textContent).toBe("");
});