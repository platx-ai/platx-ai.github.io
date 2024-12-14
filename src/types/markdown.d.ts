declare module '*.md?raw' {
  const rawContent: string;
  export default rawContent;
}

declare module '*.md' {
  const component: React.ComponentType;
  export default component;
}
