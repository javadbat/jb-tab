# jb-tab

Accessible, composable tabs for the JB Design System. The package contains four independently importable custom elements and matching React wrappers.

## Installation

```sh
npm install jb-tab
```

Importing the root package registers all four custom elements:

```js
import "jb-tab";
```

## Web component usage

```html
<jb-tab value="home">
  <aside>
    <jb-tab-list aria-label="Account sections">
      <jb-tab-trigger value="home">Home</jb-tab-trigger>
      <jb-tab-trigger value="about">About</jb-tab-trigger>
      <jb-tab-trigger value="user">User</jb-tab-trigger>
    </jb-tab-list>
  </aside>

  <main>
    <jb-tab-content value="home">Home content</jb-tab-content>
    <jb-tab-content value="about">About content</jb-tab-content>
    <jb-tab-content value="user">User content</jb-tab-content>
  </main>
</jb-tab>
```

The list and panels may be nested in ordinary light-DOM elements. Triggers must be direct children of `jb-tab-list`. Nested `jb-tab` instances manage only their own nearest descendants.

## Selection

`jb-tab` is the only selection owner. Its public properties are:

| Property | Attribute | Type | Behavior |
| --- | --- | --- | --- |
| `value` | `value` | `string \| null` | Current selected value. |
| `defaultValue` | `default-value` | `string \| null` | Initial value used when `value` is absent. |
| `nullable` | `nullable` | `boolean` | Keeps the initial value null instead of selecting the first enabled trigger. |

When `nullable` is absent and neither value is supplied, the first enabled trigger is selected. Setting `value` to `null` on a nullable tab hides every panel. Trigger values must be unique. Multiple panels may use the same value; every matching panel is shown.

Selecting a trigger dispatches a bubbling, composed `select` event from `jb-tab-trigger`. When the value changes, `jb-tab` dispatches a bubbling, composed `change` event.

```js
tab.addEventListener("change", event => {
  console.log(event.detail.value);
  console.log(event.detail.previousValue);
  console.log(event.detail.trigger);
});
```

## React

```tsx
import { useState } from "react";
import { JBTab } from "jb-tab/react";
import { JBTabList } from "jb-tab/list/react";
import { JBTabTrigger } from "jb-tab/trigger/react";
import { JBTabContent } from "jb-tab/content/react";

export function AccountTabs() {
  const [value, setValue] = useState("home");

  return (
    <JBTab value={value} onChange={event => setValue(event.detail.value)}>
      <JBTabList aria-label="Account sections">
        <JBTabTrigger value="home">Home</JBTabTrigger>
        <JBTabTrigger value="about">About</JBTabTrigger>
      </JBTabList>
      <JBTabContent value="home">Home content</JBTabContent>
      <JBTabContent value="about">About content</JBTabContent>
    </JBTab>
  );
}
```

The React event props are `onSelect` on `JBTabTrigger` and `onChange` on `JBTab`.

## Keyboard behavior

- `ArrowLeft` and `ArrowRight` navigate horizontal lists.
- `ArrowUp` and `ArrowDown` navigate vertical lists.
- `Home` and `End` move to the first and last enabled trigger.
- `Enter` and `Space` select a focused trigger.
- Disabled triggers are skipped.

Arrow navigation automatically activates the newly focused trigger.

## Panel display and animation

Inactive `jb-tab-content` hosts have `hidden` set to `true` and use `display: none`; visible hosts have `hidden` set to `false` and use `display: block`. Visibility is exposed through the standard `hidden` property and attribute and through `:state(hidden)`. Changing a panel's `hidden` property does not change the selected trigger, so a consumer may explicitly show an additional panel when needed.

```css
jb-tab-content {
  opacity: 0;
  transition: opacity 200ms ease, display 200ms allow-discrete;
}

jb-tab-content:not([hidden]) {
  display: grid;
  opacity: 1;
}

@starting-style {
  jb-tab-content:not([hidden]) {
    opacity: 0;
  }
}
```

`display: none` removes inactive panels from layout and painting. It does not defer custom-element construction or JavaScript execution inside a panel.

## List styling

`jb-tab-list` exposes `list` and `indicator` CSS parts. Each trigger exposes a `content` part.

| CSS variable | Purpose |
| --- | --- |
| `--jb-tab-list-background` | List background. |
| `--jb-tab-list-padding` | Uniform space between the list background and its triggers. |
| `--jb-tab-trigger-border-radius` | Shared trigger and indicator radius; also used to derive the outer background radius. |
| `--jb-tab-list-indicator-color` | Default indicator color. |
| `--jb-tab-list-indicator-duration` | Indicator transition duration. |
| `--jb-tab-list-indicator-easing` | Indicator transition easing. |
| `--jb-tab-list-indicator-shadow` | Indicator shadow. |
| `--jb-tab-trigger-indicator-color` | Per-trigger indicator color override. |
| `--jb-tab-trigger-color` | Trigger text color. |
| `--jb-tab-trigger-color-selected` | Selected trigger text color. |
| `--jb-tab-trigger-padding` | Trigger padding. |

Each trigger can set the indicator color with a design-system variant or any valid CSS color:

```html
<jb-tab-trigger value="home" color="primary">Home</jb-tab-trigger>
<jb-tab-trigger value="about" color="#efefef">About</jb-tab-trigger>
```

Supported base variants are `primary`, `secondary`, `positive`, `danger`, `warning`, `light`, and `dark`. Accent colors
also provide `primary-subtle`, `secondary-subtle`, `positive-subtle`, `danger-subtle`, and `warning-subtle`. Base colors
use inverse selected text while subtle and light colors use primary selected text, with no delayed color update. Arbitrary
CSS colors automatically choose primary or inverse text. `--jb-tab-trigger-indicator-color` and
`--jb-tab-trigger-color-selected` remain available as explicit per-trigger overrides.

Set `size` once on `jb-tab-list` so every direct trigger uses the same `xs`, `sm`, `md`, `lg`, or `xl` preset. The default is `md`:

```html
<jb-tab-list size="xl">
  <jb-tab-trigger value="first">First</jb-tab-trigger>
  <jb-tab-trigger value="second">Second</jb-tab-trigger>
</jb-tab-list>
```

The outer list radius is derived as `calc(var(--tab-trigger-border-radius) + var(--padding))`, keeping the background
curve concentric with the shared trigger and indicator curve at every size.

Use `orientation="vertical"` on `jb-tab-list` for a vertical list. The default orientation is horizontal.
