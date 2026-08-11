declare module 'react' {
  export type PropsWithChildren<P = {}> = P & { children?: ReactNode };
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string> {
    type: T;
    props: P;
    key: string | number | null;
  }
  export type JSXElementConstructor<P> = ((props: P) => ReactElement<any>) | (new (props: any) => any);
  export type ReactNode = ReactElement | string | number | boolean | null | undefined | ReactNode[];
  export type ComponentType<P = {}> = FunctionComponent<P> | (new (props: any) => any);
  export interface FunctionComponent<P = {}> {
    (props: PropsWithChildren<P>): ReactElement<any> | null;
    displayName?: string;
  }
  export type FC<P = {}> = FunctionComponent<P>;
  export const StrictMode: any;
  export function createElement(type: any, props: any, ...children: any[]): ReactElement<any>;
  export const Fragment: any;
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prevState: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initialValue: T): { current: T };
  export function useContext<T>(context: any): T;
  export function useReducer<R extends (...args: any) => any, I>(
    reducer: R,
    initialState: I,
    initializer?: (arg: I) => I,
  ): [ReturnType<R>, React.Dispatch<any>];
  export function useLayoutEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useDebugValue(value: any): void;
  export function forwardRef<T, P = {}>(render: (props: P, ref: any) => ReactElement | null): any;
  export function memo<T extends ComponentType<any>>(component: T): T;
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface ElementAttributesProperty {
      props: any;
    }
    interface ElementChildrenAttribute {
      children: any;
    }
    interface ElementClass {}
    type Element = ReactElement<any>;
    type ElementType = ReactElement<any>;
  }
}

declare module 'react-dom' {
  export function createRoot(container: any): any;
  export function hydrateRoot(container: any, value: any): any;
  export function render(element: any, container: any): void;
  const ReactDOM: any;
  export default ReactDOM;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export function jsxDEV(type: any, props: any, key?: any, isStaticChildren?: any, source?: any, self?: any): any;
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'react/jsx-dev-runtime' {
  export function jsxDEV(type: any, props: any, key?: any, isStaticChildren?: any, source?: any, self?: any): any;
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module '@vercel/node' {
  export interface VercelRequest {
    query: Record<string, string | string[]>;
    body: any;
  }
  export interface VercelResponse {
    status(code: number): VercelResponse;
    json(body?: any): void;
  }
}
