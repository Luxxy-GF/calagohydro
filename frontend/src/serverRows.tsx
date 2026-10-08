import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import type { CardProps } from '@/elements/data-display/Card.tsx';

/** Keep the original polling, permissions, selection and context menu handlers. */
export function adaptServerRow<P extends CardProps>(props: P): P {
  if (!props.leftStripeClassName || !props.className?.includes('@container')) return props;

  const parts = Children.toArray(props.children);
  return {
    ...props,
    className: `hydro-server-row ${props.className}`,
    children: (
      <>
        <div className='hydro-server-identity'>{parts[0]}</div>
        <div className='hydro-server-resources'>{parts.slice(1).map(removeDividers)}</div>
      </>
    ),
  };
}

function removeDividers(node: ReactNode): ReactNode {
  if (!isValidElement<{ children?: ReactNode; orientation?: string; my?: string }>(node)) return node;
  // The resource group already has spacing; retain vertical separators only.
  if (node.props.my && !node.props.children && node.props.orientation !== 'vertical') return null;
  if (node.props.children === undefined) return node;
  return cloneElement(node as ReactElement<{ children?: ReactNode }>, {
    children: Children.map(node.props.children, removeDividers),
  });
}
