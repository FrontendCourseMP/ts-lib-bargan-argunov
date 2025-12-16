# Bargan-Argunov — простая валидация HTML-форм
Авторы: dowbleu (Аргунов Денис Сергеевич) и SEREZHKA3310 (Барган Сергей Юрьевич).

## Требования
- Форма в DOM: все `input` имеют `id`, `name`, подпись через `<label>` и `aria-describedby`, которое указывает на элемент для вывода ошибки.
- Для полей с `min`/`max` в коде должны быть заданы HTML-атрибуты: `min`/`max` для `number` или `range`, `minlength`/`maxlength` для `text`.
- Поддерживаются типы полей: `text`, `number`, `range`; булевы значения вводятся в текстовое поле (`true/false`).
- Среда: обычный браузер, скрипт подключается после рендеринга формы (или в конце `body`).

## Пример
HTML:
```html
<form id="exampleForm" novalidate>
  <label for="age">Возраст</label>
  <input id="age" name="age" type="number" min="18" max="100" aria-describedby="age-error" required />
  <p id="age-error" role="alert"></p>
  <button type="submit">Отправить</button>
</form>
```

JS/TS:
```ts
import { form } from "./src/lib/copyZod";

const formEl = document.querySelector("#exampleForm") as HTMLFormElement;

const validator = formEl && form(formEl);
validator.field("age").number().min("Минимум 18").max("Максимум 100");

validator.validate(); // навешивает обработчик submit и выводит ошибки
```

## API
- `form(formElement: HTMLFormElement)` → объект валидатора формы.
  - Бросает ошибку, если нет пары `label + input + output` с `aria-describedby`.
- `field(name: string)` → валидатор выбранного поля.
  - `string()` — поле должно быть `type="text"`, к нему добавится pattern для букв.
  - `number()` — поле `text|number|range`; для `text` добавится pattern для цифр.
  - `boolean()` — поле `text`; допускает `true/false` (с учётом регистра).
  - `min(error: string)` — кастомное сообщение при `min`/`minlength`.
  - `max(error: string)` — кастомное сообщение при `max`/`maxlength`.
- `validate()` — навешивает обработчик `submit`, отменяет дефолтную отправку, проверяет `validity` и подставляет ваши сообщения или стандартные.

## Тесты
- Среда: Vitest + jsdom.
- `happyPath.test.js` — валидные данные проходят без ошибок.
- `angryTest.test.js` — неверные значения показывают ошибки для строк и чисел.
- `angryTest2.test.js` — проверка, что при нарушенной разметке (`aria-describedby`/output нет) выбрасывается понятное исключение.

## Полнота и понятность
- Используются стандартные HTML5-валидаторы (`validity`) плюс ваши тексты для `min`/`max`.
- Ошибки выводятся в элемент, на который ссылается `aria-describedby` у поля.
- Паттерны для `string/number/boolean` добавляются автоматически; встроенные атрибуты `required`, `min`, `max`, `minlength`, `maxlength` учитываются.
- Если поле или разметка не подготовлены (нет `name`, `aria-describedby` и т.п.), библиотека сразу бросит понятную ошибку, чтобы это исправить до отправки формы.