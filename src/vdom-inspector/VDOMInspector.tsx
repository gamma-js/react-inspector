import React, { FC, ReactElement } from 'react';

import { TreeView } from '../tree-view/TreeView';

import { themeAcceptor } from '../styles';
import ReactIs from 'react-is';
import { VDOMNodePreview } from './VDOMNodePreview';
import { getDisplayName, isTexturalNode, shouldVDOMInline } from './vdom-utils';

const vdomIterator = function* (data: React.ReactNode) {
  if (data) {
    if (isTexturalNode(data) && shouldVDOMInline(data)) {
      return;
    }
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        yield {
          name: getDisplayName(node),
          data: node,
        };
      }
    } else if (ReactIs.isElement(data)) {
      const displayName = getDisplayName(data);

      const { children } = data.props;

      if (children) {
        if (Array.isArray(children)) {
          for (let i = 0; i < children.length; i++) {
            const node = children[i];
            yield {
              name: getDisplayName(node),
              data: node,
            };
          }
        } else {
          yield {
            name: getDisplayName(children),
            data: children,
          };
        }
      }

      yield {
        name: 'CLOSE_TAG',
        data: {
          tagName: displayName,
        },
        isCloseTag: true,
      };
    }
  }
};

const VDOMInspector: FC<any> = (props) => {
  return <TreeView nodeRenderer={VDOMNodePreview} dataIterator={vdomIterator} {...props} />;
};

// DOMInspector.propTypes = {
//   // The DOM Node to inspect
//   data: PropTypes.object.isRequired,
// };

const themedDOMInspector = themeAcceptor(VDOMInspector);

export { themedDOMInspector as VDOMInspector };
