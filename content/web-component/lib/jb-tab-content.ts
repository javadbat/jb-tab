import { defineWebComponent, JBBaseComponent } from "jb-core";
import CSS from "./jb-tab-content.css";
import { renderHTML } from "./render.js";

export class JBTabContentWebComponent extends JBBaseComponent {
  static get observedAttributes(): string[] {
    return ["value"];
  }

  #value = "";
  #selected = false;
  #internals?: ElementInternals;

  constructor() {
    super();
    if (typeof this.attachInternals === "function") {
      this.#internals = this.attachInternals();
      this.#internals.role = "tabpanel";
    } else {
      this.setAttribute("role", "tabpanel");
    }
    const shadowRoot = this.attachShadow({ mode: "open", clonable: true, serializable: true });
    const template = document.createElement("template");
    template.innerHTML = `<style>${CSS}</style>${renderHTML()}`;
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback(): void {
    this.#value = this.getAttribute("value") ?? "";
    this.#updateAccessibility();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this.#onAttributeChange(name, newValue);
  }

  get value(): string {
    return this.#value;
  }

  set value(value: string) {
    const normalizedValue = String(value ?? "");
    this.#value = normalizedValue;
    if (this.getAttribute("value") !== normalizedValue) this.setAttribute("value", normalizedValue);
  }

  get selected(): boolean {
    return this.#selected;
  }

  set selected(value: boolean) {
    const selected = Boolean(value);
    if (this.#selected === selected) return;
    this.#selected = selected;
    this.toggleAttribute("selected", selected);
    if (selected) this.#internals?.states.add("selected");
    else this.#internals?.states.delete("selected");
    this.#updateAccessibility();
  }

  setAriaLabelledBy(triggerId: string | null): void {
    if (triggerId) this.setAttribute("aria-labelledby", triggerId);
    else this.removeAttribute("aria-labelledby");
  }

  #onAttributeChange(name: string, value: string | null): void {
    if (name === "value") this.#value = value ?? "";
  }

  #updateAccessibility(): void {
    const hidden = !this.#selected;
    this.setAttribute("aria-hidden", String(hidden));
    if (this.#internals) this.#internals.ariaHidden = String(hidden);
  }
}

defineWebComponent("jb-tab-content", JBTabContentWebComponent);

declare global {
  interface HTMLElementTagNameMap {
    "jb-tab-content": JBTabContentWebComponent;
  }
}
