// @vitest-environment jsdom
import * as c from "../lib/copyZod";
import { expect, test } from "vitest";

test("AngryPath: форма с отсутствующим полем в HTML не проходит начальную проверку", () => {
  // Arrange
  document.body.innerHTML = `
    <main>
      <section>
        <h1>Форма с ошибкой структуры</h1>
        <form novalidate id="brokenForm">
          <div class="form-group">
            <label for="name">Имя</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              <!-- НЕТ aria-describedby! -->
              required
            />
            <!-- Нет соответствующего элемента для ошибок -->
          </div>

          <div class="form-group">
            <label for="age">Возраст</label>
            <input 
              type="number" 
              id="age" 
              name="age"
              aria-describedby="age-error" 
              required
            />
            <p role="alert" id="age-error" class="error-message"></p>
          </div>

          <button type="submit">Отправить</button>
        </form>
      </section>
    </main>
  `;

  const brokenForm = document.querySelector("#brokenForm")

  // Act & Assert
  expect(() => {
    c.form(brokenForm);
  }).toThrow("There is no sequence consisting of a label, an input field, and an error output field.");
});