# Bargan-Argunov — простая валидация HTML-форм

Авторы:  
- dowbleu (Аргунов Денис Сергеевич)  
- SEREZHKA3310 (Барган Сергей Юрьевич)

---

## Требования

- Форма уже находится в DOM
- Каждый `input` обязан иметь:
  - `id`
  - `name`
  - связанную подпись `<label for="...">` или `label`, который содержит внутри себя поле `input`
  - атрибут `aria-describedby`, указывающий на элемент для вывода ошибки
- Для полей с `min` / `max`:
  - `number`, `range`, `date` → должны быть заданы HTML-атрибуты `min` / `max`
  - `text` → должны быть заданы `minlength` / `maxlength`
- Среда выполнения:
  - обычный браузер
  - скрипт подключается **после рендеринга формы** (или в конце `body`)

---

## Поддерживаемые типы полей

| Метод | Допустимый `input.type` | Используемый Constraint API |
|-----|-------------------------|-----------------------------|
| `string()` | `text` | `patternMismatch` |
| `number()` | `text`, `number`, `range` | `range*`, `patternMismatch` |
| `float()` | `text`, `number`, `range` | `stepMismatch`, `patternMismatch` |
| `boolean()` | `text` | `patternMismatch` |
| `email()` | `email` | `typeMismatch` |
| `url()` | `url` | `typeMismatch` |
| `checkbox()` | `checkbox` | `valueMissing` |
| `date()` | `date` | `rangeUnderflow`, `rangeOverflow` |

---

## Пример

### HTML

```html
<form id="exampleForm" novalidate>
  <label for="age">Возраст</label>
  <input
    id="age"
    name="age"
    type="number"
    min="18"
    max="100"
    aria-describedby="age-error"
    required
  />
  <p id="age-error" role="alert"></p>

  <button type="submit">Отправить</button>
</form>
