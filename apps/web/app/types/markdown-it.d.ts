declare module "markdown-it" {
  interface MarkdownItOptions {
    html?: boolean;
    xhtmlOut?: boolean;
    breaks?: boolean;
    linkify?: boolean;
    typographer?: boolean;
    langPrefix?: string;
    quotes?: string;
  }

  export default class MarkdownIt {
    constructor(options?: MarkdownItOptions);
    render(source: string): string;
  }
}
