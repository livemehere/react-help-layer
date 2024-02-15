# react-help-layer

![example](https://github.com/livemehere/react-help-layer/blob/main/img/example.png?raw=true)

## function

- `click` layer to next scene.
- `shift + click` to prev scene.
- after last scene, layer disappeared.
- if `enableKeyboardShortcut` option true, `shift + ?` start help layer at scene 1. And `ESC` run `hideHelpLayer()`
- `showHelpLayer()` set show `true` and set step `1`.
- `hideHelpLayer()` only set show `false`

## Props

```ts
interface Props {
    steps: {
        selector: string;
        scene: number;
        label?: string;
        gap?: number;
        color?: string;
        labelDir?: TDir;
    }[];
    currentStep: number;
    onClick?: (e?: React.PointerEvent) => void;
    onShiftClick?: (e?: React.PointerEvent) => void;
    show: boolean;
    padding?: number;
}
```

## example

```tsx

import { HelpLayer, useHelpLayer } from "react-help-layer";

// ...

function App(){
   const { showHelpLayer, currentStep, goToNextStep, goToPrevStep, show } = useHelpLayer({ enableKeyboardShortcut: true }); // Shift + "?" trigger layer
 
   return (
       <HelpLayer
           onClick={goToNextStep}
           onShiftClick={goToPrevStep}
           currentStep={currentStep}
           show={show}
           steps={[
               {
                   selector: "a:nth-of-type(1)",
                   scene: 1,
                   label: "This is menu",
                   gap: 14,
                   labelDir: "bottom",
               },
               {
                   selector: "#lottie",
                   scene: 2,
                   label: "This is lottie",
                   gap: 14,
                   labelDir: "right",
               },
               {
                   selector: "h2",
                   scene: 3,
                   label: "This is title2",
                   gap: 14,
                   labelDir: "bottom",
               },
               {
                   selector: "section button",
                   scene: 4,
                   label: "this is section 👉",
                   gap: 14,
                   labelDir: "left",
               },
               {
                   selector: "[data-help='1']",
                   scene: 5,
                   label: "this is last one!",
                   gap: 14,
                   labelDir: "top",
               },
           ]}
           {/* layer text style follows root element's style */}
           style={{
               fontSize: "20px",
               fontWeight: "bold",
               fontFamily: "sans-serif",
               letterSpacing: -2,
           }}
       />
   )
}
```
