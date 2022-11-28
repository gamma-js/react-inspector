import React from 'react';
import { storiesOf } from '@storybook/react';
import { DOMInspector } from '../src';

const getClassAsTagName = ({ tagName, attributes }) => {
  if (!attributes || !attributes.class) {
    return tagName;
  }

  console.log(attributes.class);

  return attributes.class.value
    .split(' ')
    .map((c) => `.${c}`)
    .join('');
};

storiesOf('DOM Node (Transformed List)', module)
  // ELEMENT_NODE
  .add('Element Node: body', () => <DOMInspector data={document.body} />)
  .add('Element Node: div', () => <DOMInspector data={document.createElement('div')} />)
  .add('Element Node: div with data attributes', () => {
    const div = document.createElement('div');
    div.setAttribute('data-test', 'test');
    // div.dataset
    return <DOMInspector data={div} />;
  })
  .add('Element Node: div with class and style', () => {
    const div = document.createElement('div');
    div.setAttribute('class', 'test');
    div.setAttribute('style', 'font-weight: bold;');
    return <DOMInspector data={div} getTagName={getClassAsTagName} />;
  })
  .add('Element Node: div with children', () => {
    const div = document.createElement('div');
    const span = document.createElement('span');
    span.textContent = 'hello';
    div.appendChild(span);
    return <DOMInspector data={div} />;
  })
  // COMMENT_NODE
  .add('Comment Node', () => <DOMInspector data={document.createComment('this is a comment')} />)
  // TEXT_NODE
  .add('Text Node', () => <DOMInspector data={document.createTextNode('this is a text node')} />)
  // PROCESSING_INSTRUCTION_NODE
  .add('Processing Instruction Node', () => {
    var docu = new DOMParser().parseFromString('<xml></xml>', 'application/xml');
    var pi = docu.createProcessingInstruction('xml-stylesheet', 'href="mycss.css" type="text/css"');
    return <DOMInspector data={pi} />;
  })
  // DOCUMENT_TYPE_NODE
  .add('Document Type Node', () => {
    return <DOMInspector data={document.childNodes[0]} />;
  })
  // DOCUMENT_NODE
  .add('Document Node', () => <DOMInspector expandLevel={2} data={document} getTagName={getClassAsTagName} />)
  // DOCUMENT_FRAGMENT_NODE
  // https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
  // x-tags http://blog.vjeux.com/2013/javascript/custom-components-react-x-tags.html
  .add('Document Fragment Node', () => <DOMInspector data={document.createElement('template').content} />);
