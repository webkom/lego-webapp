# lego-meter-bar

A simple react meter component with separators and labels. Originally [forked](https://github.com/webkom/react-meter-bar) from [react-meter-bar](https://github.com/Noor0/react-meter-bar) before being moved into lego-bricks.

## Example #1

```tsx
import { MeterBar } from '@webkom/lego-bricks';

<MeterBar
  labels={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
  labelColor="steelblue"
  progress={80}
  barColor="#fff34b"
  separatorColor="hotpink"
/>;
```

## Example #2

```tsx
import { MeterBar } from '@webkom/lego-bricks';

<MeterBar
  labels={[
    '',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
  ]}
  labelColor="steelblue"
  progress={85}
  barColor="#FF0303"
  separatorColor="#fff"
/>;
```

![meter-bar](https://i.imgur.com/rVpEEXf.png 'Meter Bar')
