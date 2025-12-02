// ===== Типы специально под функцию form из test.ts =====

// Валидатор поля, который возвращает form(...).field(...)
export type FieldValidator = {
  string: () => FieldValidator;
  number: () => FieldValidator;
  min: (error: string) => FieldValidator;
  max: (error: string) => FieldValidator;
};

// Метод field у результата form(...)
export type FormFieldMethod = (fieldName: string) => FieldValidator;

// Объект, который возвращает функция form(...)
export type FormObject = {
  field: FormFieldMethod;
  validate: () => void;
};

// Сигнатура функции form из test.ts
export type FormFn = (formElement: HTMLFormElement) => FormObject;



