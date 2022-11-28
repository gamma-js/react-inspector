import React, { FC, useMemo } from 'react';

import { createDOMNodePreview } from './DOMNodePreview';
import { TreeView, TreeViewProps } from '../tree-view/TreeView';

import { shouldInline } from './shouldInline';
import { themeAcceptor } from '../styles';

function createDOMIterator(getTagName = (n: DOMNodeLike) => n.tagName) {
  return function* (data: any) {
    if (data && data.childNodes) {
      const textInlined = shouldInline(data);

      if (textInlined) {
        return;
      }

      for (let i = 0; i < data.childNodes.length; i++) {
        const node = data.childNodes[i];

        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length === 0) continue;

        yield {
          name: `${node.tagName}[${i}]`,
          data: node,
        };
      }

      // at least 1 child node
      if (data.tagName) {
        yield {
          name: 'CLOSE_TAG',
          data: {
            tagName: getTagName(data),
          },
          isCloseTag: true,
        };
      }
    }
  };
}

export interface DOMNodeLike {
  tagName: string;
  attributes: { [key: string]: any };
  textContent: string;
  childNodes?: DOMNodeLike[];
}

export interface DOMInspectorProps extends TreeViewProps<DOMNodeLike> {
  getTagName?: (node: DOMNodeLike) => string;
  filterAttr?: (key: string, value: string) => boolean;
}

const DOMInspector: FC<DOMInspectorProps> = (props) => {
  const [nodeRenderer, domIterator] = useMemo(() => {
    const renderer = createDOMNodePreview(props.getTagName, props.filterAttr);
    const iterator = createDOMIterator(props.getTagName);
    return [renderer, iterator];
  }, [props]) as any;
  return <TreeView nodeRenderer={nodeRenderer} dataIterator={domIterator} {...props} />;
};

// DOMInspector.propTypes = {
//   // The DOM Node to inspect
//   data: PropTypes.object.isRequired,
// };

const themedDOMInspector = themeAcceptor(DOMInspector);

export { themedDOMInspector as DOMInspector };
