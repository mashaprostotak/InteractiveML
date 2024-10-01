import React from 'react';
import { Button, Container, Text } from '@mantine/core';

export default function ExampleComponent() {
  return (
    <Container>
      <h1 className="text-3xl font-bold underline pt-3">Hello world!</h1>
      <div>
        <Text>
          Buttons using <b>mantine</b>
        </Text>
        <Button color="blue">Blue</Button>
        <Button color="red">Red</Button>
        <Button color="black">Yellow</Button>
        <Button color="green">Green</Button>
      </div>
      <div>
        <Text>
          Buttons using <b>tailwind</b>
        </Text>
        <button className="px-4 py-1 rounded text-white font-semibold bg-blue-600 hover:bg-blue-700">
          Blue
        </button>
        <button className="px-4 py-1 rounded text-white font-semibold bg-red-600 hover:bg-red-700">
          Red
        </button>
        <button className="px-4 py-1 rounded text-white font-semibold bg-yellow-600 hover:bg-yellow-700">
          Yellow
        </button>
        <button className="px-4 py-1 rounded text-white font-semibold bg-green-600 hover:bg-green-700">
          Green
        </button>
      </div>
    </Container>
  );
}
