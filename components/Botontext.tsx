import * as React from 'react';
import { Button } from 'react-native-paper';

const botontext = () => (
  <Button icon="camera"  onPress={() => console.log('Pressed')}>
    Press me
  </Button>
);

export default botontext;

