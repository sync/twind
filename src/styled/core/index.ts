/**
 * [[include:src/styled/README.md]]
 *
 * @packageDocumentation
 * @module twind/styled
 */

import type { HTMLAttributes } from './jsx'
import type { Token, TW, Context } from '../../index'

export interface CreateElementFunction {
  (type: any, props: {}, ...children: any[]): JSX.Element
}

export type Tag = keyof JSX.IntrinsicElements

export interface BaseProps {
  className?: string
}

export interface StyledProps extends BaseProps {
  as?: string
}

export type DefaultProps = {}

export interface ForwardRefFunction {
  (props: any, ref: any): any
}

export interface AttrsCallback<Props = DefaultProps, Attrs = Props> {
  (props: Props, context: Context): Attrs
}

export interface StyledComponent<Props = DefaultProps, Attrs = Props> {
  (props: Props): any

  // propTypes?: WeakValidationMap<P>;
  // contextTypes?: ValidationMap<any>;
  defaultProps?: Partial<Props>
  displayName?: string

  attrs<A = Attrs, P = Props>(
    attrs: A | AttrsCallback<Props & P & Attrs, A>,
  ): StyledComponent<Props & P, Attrs & P & A>

  /**
   * Returns the marker class as a selector: `.tw-xxx`
   */
  toString(): string
}

export interface StyleFactory<Props = DefaultProps> {
  (props: Props, context: Context): Token
}

export interface TaggedTwind<Props = DefaultProps, Attrs = Props> {
  <P = Props>(
    strings: TemplateStringsArray,
    ...interpolations: (Token | StyleFactory<Props & P & Attrs>)[]
  ): StyledComponent<Props & P, Attrs>

  <P = Props>(factory: StyleFactory<Props & P & Attrs>): StyledComponent<Props & P, Attrs>

  <P = Props>(
    token: Token,
    ...tokens: (Token | StyleFactory<Props & P & Attrs>)[]
  ): StyledComponent<Props & P, Attrs>

  attrs<A = Attrs, P = Props>(
    attrs: A | AttrsCallback<Props & P & Attrs, A>,
  ): TaggedTwind<Props & P, Attrs & P & A>
}

export interface TaggedStyled<Props = DefaultProps, Attrs = Props> {
  <P = Props>(
    strings: TemplateStringsArray,
    ...interpolations: (Token | StyleFactory<Props & P & Attrs>)[]
  ): StyledComponent<Props & P, Attrs>

  <P = Props>(factory: StyleFactory<Props & P & Attrs>): StyledComponent<Props & P, Attrs>

  <P = Props>(
    token: Token,
    ...tokens: (Token | StyleFactory<Props & P & Attrs>)[]
  ): StyledComponent<Props & P, Attrs>

  attrs<A = Attrs, P = Props>(
    attrs: A | AttrsCallback<Props & P & Attrs, A>,
  ): TaggedStyled<Props & P, Attrs & P & A>
}

export interface ShouldForwardProp {
  (prop: string, defaultValidatorFn: (prop: string) => boolean): boolean
}

export interface StyledOptions {
  shouldForwardProp?: ShouldForwardProp
  forwardRef?: ForwardRefFunction
}

export interface ComponentClass<Props = DefaultProps> {
  new (props: Props): any
}

export type FunctionComponent<Props = DefaultProps> = (props: Props) => any

export type ComponentType<Props = DefaultProps> = ComponentClass<Props> | FunctionComponent<Props>

export type ComponentProps<C> = C extends ComponentType<infer Props>
  ? Props
  : C extends keyof JSX.IntrinsicElements
  ? StyledProps &
      JSX.IntrinsicElements[C] &
      JSX.IntrinsicAttributes &
      JSX.LibraryManagedAttributes<C, JSX.IntrinsicElements[C]>
  : // used when creating a component from a string (html native) but using a non HTML standard
  // component, such as when you want to style web components
  C extends string
  ? StyledProps &
      HTMLAttributes &
      JSX.IntrinsicAttributes &
      Partial<JSX.ElementChildrenAttribute> & { slot?: string }
  : StyledProps

export interface Twind {
  <Props extends BaseProps = BaseProps>(
    this: TW | null | undefined | void,
    tag: ComponentType<Props>,
    options?: StyledOptions,
  ): TaggedTwind<Props>

  <Props = DefaultProps, Tag extends keyof JSX.IntrinsicElements | string = string>(
    this: TW | null | undefined | void,
    tag: Tag,
    options?: StyledOptions,
  ): TaggedTwind<Props & ComponentProps<Tag>>

  <Props extends BaseProps = BaseProps>(
    this: TW | null | undefined | void,
    tag: JSX.Element | JSX.ElementClass,
    options?: StyledOptions,
  ): TaggedTwind<Props>
}

export interface Styled {
  <Props extends BaseProps = BaseProps>(
    this: TW | null | undefined | void,
    tag: ComponentType<Props>,
    options?: StyledOptions,
  ): TaggedStyled<Props>

  <Props = DefaultProps, Tag extends keyof JSX.IntrinsicElements | string = string>(
    this: TW | null | undefined | void,
    tag: Tag,
    options?: StyledOptions,
  ): TaggedStyled<Props & ComponentProps<Tag>>

  <Props extends BaseProps = BaseProps>(
    this: TW | null | undefined | void,
    tag: JSX.Element | JSX.ElementClass,
    options?: StyledOptions,
  ): TaggedStyled<Props>
}

export type WithTags<Factory> = Factory &
  {
    readonly [Tag in keyof JSX.IntrinsicElements]: Factory extends Styled
      ? TaggedStyled<ComponentProps<Tag>>
      : Factory extends Twind
      ? TaggedTwind<ComponentProps<Tag>>
      : never
  }

export const bind = (
  createElement: CreateElementFunction,
): { styled: WithTags<Styled>; twind: WithTags<Twind> } => {
  return {} as any
}
