import {
    TextAlignment,
    BoxHorizontalAlignment,
    BoxVerticalAlignment,
  } from '../lightweights-line-tools'
  
  export const circleOption = {
    text: {
        value: '',
        alignment: TextAlignment.Center,
        font: {
          color: '#000000',
          size: 16,
          bold: false,
          italic: false,
          family: 'Arial',
        },
        box: {
          alignment: {
            vertical: BoxVerticalAlignment.Middle,
            horizontal: BoxHorizontalAlignment.Center,
          },
          angle: 0,
          scale: 3,
          offset: {
            x: 0,
            y: 10,
          },
          padding: {
            x: 0,
            y: 0,
          },
          maxHeight: 500,
          border: {
            color: '#ffffff00',
            width: 4,
            radius: 20,
            highlight: false,
            style: 3,
          },
          background: {
            color: '#ffffff00',
            inflation: {
              x: 10,
              y: 30,
            },
          },
        },
        padding: 30,
        wordWrapWidth: 0,
        forceTextAlign: false,
        forceCalculateMaxLineWidth: false,
      },
      circle: {
        background: {
          color: '#ffffff00',
        },
        border: {
          color: 'rgba(41,98,255,1)',
          width: 2,
          style: 0,
        },
        extend: {
          right: true, 
          left: false, 
        },
      },
      visible: true,
      editable: true,
  }
  