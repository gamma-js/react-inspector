import React from 'react';
import { storiesOf } from '@storybook/react';
import { Inspector } from '../src';

interface FooProps {
  value: number;
  msg: string;
  cb: () => void;
}

const FunctionComponent = (props: FooProps) => (
  <div className="foo container">
    <span>{props.msg}</span>
    <span>{props.value}</span>
  </div>
);

class ClassComponent extends React.Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const nop = () => {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ForwardFoo = React.forwardRef<HTMLDivElement, FooProps>((props, ref) => <div ref={ref}>forward ref</div>);

storiesOf('VDOM Node', module)
  // ELEMENT_NODE
  .add('<div>', () => <Inspector data={<div className="foo">test</div>} table={false} />)
  .add('Function Component', () => (
    <Inspector data={<FunctionComponent value={3} msg="test" cb={nop} />} table={false} />
  ))
  .add('ClassComponent', () => (
    <Inspector
      data={
        <ClassComponent>
          <FunctionComponent value={3} msg="test" cb={nop} />
        </ClassComponent>
      }
      table={false}
    />
  ))
  .add('Fragment', () => (
    <Inspector
      data={
        <>
          <ClassComponent>
            <FunctionComponent value={5} msg="test" cb={nop} />
          </ClassComponent>
          <FunctionComponent value={3} msg="test" cb={nop} />
        </>
      }
      table={false}
    />
  ))
  .add('ForwardRef', () => <Inspector data={<ForwardFoo value={3} msg="test" cb={nop} />} table={false} />);
