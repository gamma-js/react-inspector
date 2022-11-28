import React from 'react';
import { storiesOf } from '@storybook/react';
import { DOMInspector } from '../src';

const getClassAsTagName = ({ tagName, attributes }) => {
  if (!attributes || !attributes.class) {
    return tagName;
  }

  return attributes.class.value
    .split(' ')
    .map((c) => `.${c}`)
    .join('');
};

const hideClassAndStyle = (key) => key !== 'class' && key !== 'style';

const renderWithTransform = (data) => (
  <DOMInspector data={data} getTagName={getClassAsTagName} filterAttr={hideClassAndStyle} />
);

storiesOf('DOM Node (Transformed List)', module)
  // ELEMENT_NODE
  .add('Element Node: body', () => renderWithTransform(document.body))
  .add('Element Node: div', () => renderWithTransform(document.createElement('div')))
  .add('Element Node: div with data attributes', () => {
    const div = document.createElement('div');
    div.setAttribute('data-test', 'test');
    // div.dataset
    return renderWithTransform(div);
  })
  .add('Element Node: div with class and style', () => {
    const div = document.createElement('div');
    div.setAttribute('class', 'test');
    div.setAttribute('style', 'font-weight: bold;');
    return renderWithTransform(div);
  })
  .add('Element Node: div with children', () => {
    const div = document.createElement('div');
    const span = document.createElement('span');
    span.textContent = 'hello';
    div.appendChild(span);
    return renderWithTransform(div);
  })
  // COMMENT_NODE
  .add('Comment Node', () => renderWithTransform(document.createComment('this is a comment')))
  // TEXT_NODE
  .add('Text Node', () => renderWithTransform(document.createTextNode('this is a text node')))
  // PROCESSING_INSTRUCTION_NODE
  .add('Processing Instruction Node', () => {
    var docu = new DOMParser().parseFromString('<xml></xml>', 'application/xml');
    var pi = docu.createProcessingInstruction('xml-stylesheet', 'href="mycss.css" type="text/css"');
    return renderWithTransform(pi);
  })
  // DOCUMENT_TYPE_NODE
  .add('Document Type Node', () => {
    return renderWithTransform(document.childNodes[0]);
  })
  // DOCUMENT_NODE
  .add('Document Node', () => renderWithTransform(document))
  // DOCUMENT_FRAGMENT_NODE
  // https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
  // x-tags http://blog.vjeux.com/2013/javascript/custom-components-react-x-tags.html
  .add('Document Fragment Node', () => renderWithTransform(document.createElement('template').content));
