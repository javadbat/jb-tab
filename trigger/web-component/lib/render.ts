export function renderHTML(): string {
  return /* html */ `
    <span class="trigger-content" part="content">
      <slot></slot>
    </span>
  `;
}
