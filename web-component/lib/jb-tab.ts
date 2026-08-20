import { defineWebComponent, JBBaseComponent, parseBooleanAttribute, uniqueId } from "jb-core";
import "jb-tab/content";
import "jb-tab/list";
import "jb-tab/trigger";
import type { JBTabContentWebComponent } from "jb-tab/content";
import type { JBTabListWebComponent } from "jb-tab/list";
import type { JBTabSelectEvent } from "jb-tab/trigger";
import CSS from "./jb-tab.css";
import { renderHTML } from "./render.js";
import type { JBTabChangeEvent } from "./types.js";

export class JBTabWebComponent extends JBBaseComponent {
  static get observedAttributes(): string[] {
    return ["value", "default-value", "nullable"];
  }

  #value: string | null = null;
  #defaultValue: string | null = null;
  #initialized = false;
  #syncQueued = false;
  #mutationObserver?: MutationObserver;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open", clonable: true, serializable: true });
    const template = document.createElement("template");
    template.innerHTML = `<style>${CSS}</style>${renderHTML()}`;
    shadowRoot.appendChild(template.content.cloneNode(true));
    this.#registerEventListener();
  }

  connectedCallback(): void {
    if (!this.#initialized) this.#initProp();
    this.#observeDescendants();
    this.#scheduleSync();
  }

  disconnectedCallback(): void {
    this.#mutationObserver?.disconnect();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this.#onAttributeChange(name, newValue);
  }

  get value(): string | null {
    return this.#value;
  }

  set value(value: string | null) {
    this.#setValue(value === null || value === undefined ? null : String(value), true);
  }

  get defaultValue(): string | null {
    return this.#defaultValue;
  }

  set defaultValue(value: string | null) {
    const normalizedValue = value === null || value === undefined ? null : String(value);
    this.#defaultValue = normalizedValue;
    if (normalizedValue === null) this.removeAttribute("default-value");
    else if (this.getAttribute("default-value") !== normalizedValue) this.setAttribute("default-value", normalizedValue);
  }

  get nullable(): boolean {
    return parseBooleanAttribute(this.getAttribute("nullable"));
  }

  set nullable(value: boolean) {
    this.toggleAttribute("nullable", Boolean(value));
  }

  refresh(): void {
    this.#syncSelection();
  }

  #registerEventListener(): void {
    this.addEventListener("select", this.#onTriggerSelect as EventListener);
  }

  #initProp(): void {
    this.#defaultValue = this.getAttribute("default-value");
    this.#value = this.hasAttribute("value") ? this.getAttribute("value") : this.#defaultValue;
    this.#initialized = true;
  }

  #onAttributeChange(name: string, value: string | null): void {
    if (name === "value") this.#value = value;
    if (name === "default-value") {
      this.#defaultValue = value;
      if (!this.#initialized && !this.hasAttribute("value")) this.#value = value;
    }
    this.#scheduleSync();
  }

  #onTriggerSelect = (event: JBTabSelectEvent): void => {
    const trigger = event.detail?.trigger;
    if (!trigger || trigger.closest("jb-tab") !== this) return;
    const list = trigger.parentElement;
    if (list?.localName !== "jb-tab-list" || list.closest("jb-tab") !== this || trigger.disabled) return;
    const previousValue = this.#value;
    this.#setValue(trigger.value, true);
    if (previousValue === trigger.value) return;
    const changeEvent: JBTabChangeEvent = new CustomEvent("change", {
      detail: { value: trigger.value, previousValue, trigger },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(changeEvent);
  };

  #setValue(value: string | null, reflect: boolean): void {
    this.#value = value;
    if (reflect) {
      if (value === null) {
        if (this.hasAttribute("value")) this.removeAttribute("value");
      } else if (this.getAttribute("value") !== value) {
        this.setAttribute("value", value);
      }
    }
    this.#scheduleSync();
  }

  #observeDescendants(): void {
    this.#mutationObserver?.disconnect();
    if (typeof MutationObserver === "undefined") return;
    this.#mutationObserver = new MutationObserver(records => {
      if (records.every(record => record.target === this)) return;
      this.#scheduleSync();
    });
    this.#mutationObserver.observe(this, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["value", "disabled"],
    });
  }

  #scheduleSync(): void {
    if (!this.isConnected || this.#syncQueued) return;
    this.#syncQueued = true;
    queueMicrotask(() => {
      this.#syncQueued = false;
      if (this.isConnected) this.#syncSelection();
    });
  }

  #syncSelection(): void {
    const lists = this.#getOwnedElements<JBTabListWebComponent>("jb-tab-list");
    const triggers = lists.flatMap(list => list.triggers);
    const contents = this.#getOwnedElements<JBTabContentWebComponent>("jb-tab-content");

    if (this.#value === null && !this.nullable) {
      const firstEnabledTrigger = triggers.find(trigger => !trigger.disabled);
      if (firstEnabledTrigger) this.#setValue(firstEnabledTrigger.value, true);
    }

    for (const content of contents) {
      if (!content.id) content.id = uniqueId("jb-tab-content");
    }
    for (const trigger of triggers) {
      if (!trigger.id) trigger.id = uniqueId("jb-tab-trigger");
      const matchingContents = contents.filter(content => content.value === trigger.value);
      trigger.setAriaControls(matchingContents);
      trigger.selected = this.#value !== null && trigger.value === this.#value;
    }

    const focusableTrigger = triggers.find(trigger => trigger.selected && !trigger.disabled) ?? triggers.find(trigger => !trigger.disabled) ?? null;
    for (const trigger of triggers) trigger.tabIndex = trigger === focusableTrigger ? 0 : -1;

    for (const content of contents) {
      const matchingTrigger = triggers.find(trigger => trigger.value === content.value) ?? null;
      content.setAriaLabelledBy(matchingTrigger?.id ?? null);
      content.selected = this.#value !== null && content.value === this.#value;
    }
    for (const list of lists) {
      const selectedTrigger = list.triggers.find(trigger => trigger.selected) ?? null;
      list.setActiveTrigger(selectedTrigger);
    }
  }

  #getOwnedElements<TElement extends Element>(selector: string): TElement[] {
    return Array.from(this.querySelectorAll<TElement>(selector)).filter(element => element.closest("jb-tab") === this);
  }
}

defineWebComponent("jb-tab", JBTabWebComponent);

declare global {
  interface HTMLElementTagNameMap {
    "jb-tab": JBTabWebComponent;
  }
}
