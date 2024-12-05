import {
    TextAlignment,
    BoxHorizontalAlignment,
    BoxVerticalAlignment,
  } from '../lightweights-line-tools'
  
  export const trendLineOption = {
    text: {
        value: '',
        alignment: TextAlignment.Left,
        font: {
          color: '#000000',
          size: 16,
          bold: false,
          italic: false,
          family: 'Arial',
        },
        box: {
          alignment: {
            vertical: BoxVerticalAlignment.Top,
            horizontal: BoxHorizontalAlignment.Center,
          },
          angle: 0,
          scale: 1,
          offset: {
            x: 0,
            y: 0,
          },
          padding: {
            x: 10,
            y: 0,
          },
          maxHeight: 100,
          shadow: {
            blur: 0,
            color: 'rgba(255,255,255,1)',
            offset: {
              x: 0,
              y: 0,
            },
          },
          border: {
            color: '#ffffff00',
            width: 4,
            radius: 20,
            highlight: false,
            style: 1,
          },
          background: {
            color: '#ffffff00',
            inflation: {
              x: 10,
              y: 10,
            },
          },
        },
        padding: 0,
        wordWrapWidth: 0,
        forceTextAlign: false,
        forceCalculateMaxLineWidth: false,
      },
      line: {
        color: 'rgba(41,98,255,1)',
        width: 2,
        style: 0,
        end: {
          left: 0,
          right: 0,
        },
        extend: {
          right: false,
          left: false,
        },
      },
      visible: true,
      editable: true,
  }
  