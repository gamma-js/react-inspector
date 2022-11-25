import React, { FC, ReactChild } from 'react';
import ReactIs from 'react-is';

import { useStyles } from '../styles';
import { getDisplayName, isTexturalNode, shouldVDOMInline } from './vdom-utils';

const OpenTag: FC<any> = ({ tagName, attributes, styles }) => {
  return (
    <span style={styles.base}>
      {'<'}
      <span style={{ ...styles.tagName, textTransform: 'none' }}>{tagName}</span>

      {(() => {
        if (attributes) {
          const attributeNodes: ReactChild[] = [];
          for (const key in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, key)) {
              const value = attributes[key];
              attributeNodes.push(
                <span key={key}>
                  {' '}
                  <span style={styles.htmlAttributeName}>{key}</span>
                  {'="'}
                  <span style={styles.htmlAttributeValue}>{value.toString()}</span>
                  {'"'}
                </span>
              );
            }
          }
          return attributeNodes;
        }
      })()}

      {'>'}
    </span>
  );
};

// isChildNode style={{ marginLeft: -12 /* hack: offset placeholder */ }}
const CloseTag = ({ tagName, isChildNode = false, styles }) => (
  <span style={Object.assign({}, styles.base, isChildNode && styles.offsetLeft)}>
    {'</'}
    <span style={{ ...styles.tagName, textTransform: 'none' }}>{tagName}</span>
    {'>'}
  </span>
);

export const VDOMNodePreview: FC<any> = ({ isCloseTag, data, expanded }) => {
  const styles = useStyles('DOMNodePreview');

  if (isCloseTag) {
    return <CloseTag styles={styles.htmlCloseTag} isChildNode tagName={data.tagName} />;
  }

  if (isTexturalNode(data)) {
    return <span>{data}</span>;
  }

  if (ReactIs.isElement(data)) {
    const displayName = getDisplayName(data);
    const { children, ...rest } = data.props;
    return (
      <span>
        <OpenTag tagName={displayName} attributes={rest} styles={styles.htmlOpenTag} />

        {!expanded && (shouldVDOMInline(data) ? children : '…')}

        {!expanded && <CloseTag tagName={displayName} styles={styles.htmlCloseTag} />}
      </span>
    );
  }

  return <span>Not implemented: {JSON.stringify(data)}</span>;
};

// DOMNodePreview.propTypes = {
//   /** If true, just render a close tag */
//   isCloseTag: PropTypes.bool,
//   /**  */
//   name: PropTypes.string,
//   /** The DOM Node */
//   data: PropTypes.object.isRequired,
//   /** Whether the DOM node has been expanded. */
//   expanded: PropTypes.bool.isRequired,
// };
