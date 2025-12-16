// @vitest-environment jsdom
import * as c from "../lib/copyZod";
import { expect, test } from "vitest";

function createTestForm() {
  document.body.innerHTML = `
    <form novalidate id="testForm">
      <div class="form-group">
        <label for="name">Имя</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          aria-describedby="name-error" 
          required
          minlength="2"  <!-- Добавляем minlength для string валидатора -->
        />
        <p role="alert" id="name-error" class="error-message"></p>
      </div>

      <div class="form-group">
        <label for="age">Возраст</label>
        <input 
          type="number" 
          id="age" 
          name="age" 
          aria-describedby="age-error" 
          required
          min="18"  <!-- ОБЯЗАТЕЛЬНО добавляем min атрибут! -->
        />
        <p role="alert" id="age-error" class="error-message"></p>
      </div>

      <button type="submit">Отправить</button>
    </form>
  `;

  const formElement = document.querySelector("#testForm");
  if (!formElement || !(formElement instanceof HTMLFormElement)) {
    throw new Error("Form not found in DOM");
  }

  return formElement;
}

test("AngryPath: невалидные данные показывают ошибки валидации", () => {
  // Arrange
  const formElement = createTestForm();
  const validator = c.form(formElement);

  validator.field("name").string().min("Имя должно быть не короче 2 символов");
  
  validator.field("age").number();

  formElement.elements.namedItem("name").value = "1";
  formElement.elements.namedItem("age").value = "abc";

  // Act
  validator.validate();
  
  const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
  formElement.dispatchEvent(submitEvent);

  // Assert
  expect(document.querySelector("#name-error").textContent).not.toBe("");
  expect(document.querySelector("#age-error").textContent).not.toBe("");
});