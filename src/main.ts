import * as c from "./tests/test";

const formElement = document!.querySelector("form") as HTMLFormElement;

const validator = c.form(formElement);

validator.field("dada").max("DADA").number()
