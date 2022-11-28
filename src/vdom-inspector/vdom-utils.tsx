import React from 'react';
import ReactIs from 'react-is';

export function shouldVDOMInline(node: React.ReactNode) {
  return ReactIs.isElement(node) && isTexturalNode(node.props.children);
}

export function isTexturalNode(node: React.ReactNode): node is string | number | boolean {
  const nodeType = typeof node;
  return nodeType === 'string' || nodeType === 'number' || nodeType === 'boolean';
}

export function getDisplayName(node: React.ReactNode) {
  if (!node || isTexturalNode(node)) {
    return JSON.stringify(node);
  }

  if (ReactIs.isElement(node)) {
    const { type } = node;

    if (typeof type === 'string') {
      return type;
    }
    return (
      (type as any).displayName ||
      (type as any).name ||
      (type as any).$$typeof?.toString() ||
      type.toString() ||
      'Unknown'
    );
  }

  return JSON.stringify(node);
}
