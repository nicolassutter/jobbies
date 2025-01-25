import { marked, Renderer } from "marked";

const renderer = new Renderer();

marked.use({
  renderer: {
    table(...args) {
      return `<div class='w-full overflow-auto'>${renderer.table.apply(this, args)}</div>`;
    },
  },
});

export { marked };
