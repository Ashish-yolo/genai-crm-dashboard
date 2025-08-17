declare module 'react-dom' {
  import { ReactElement, ReactNode } from 'react';

  export function render(
    element: ReactElement,
    container: Element | null
  ): void;

  export function unmountComponentAtNode(container: Element | null): boolean;

  export function findDOMNode(instance: any): Element | Text | null;

  export function createPortal(
    children: ReactNode,
    container: Element
  ): ReactElement;

  export * from 'react-dom/client';
}