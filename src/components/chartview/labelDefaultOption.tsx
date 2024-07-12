import {
  TextAlignment,
  BoxHorizontalAlignment,
  BoxVerticalAlignment,
} from '../lightweights-line-tools'

export const labelDefaultOption = {
  text: {
<<<<<<< Updated upstream
    value: 'Text Line Tool, below is highlighter',
    alignment: TextAlignment.Left,
    font: {
      color: 'rgba(255,255,255,1)',
=======
    value: '',
    alignment: TextAlignment.Left,
    font: {
      color: 'black',
>>>>>>> Stashed changes
      size: 14,
      bold: false,
      italic: false,
      family: 'Arial',
    },
    box: {
      alignment: {
        vertical: BoxVerticalAlignment.Bottom,
        horizontal: BoxHorizontalAlignment.Center,
      },
      angle: 0,
      scale: 1,
      offset: {
        x: 0,
        y: 0,
      },
      padding: {
        x: 0,
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
        color: 'rgba(126,211,33,1)',
        width: 4,
        radius: 0,
        highlight: false,
        style: 0,
      },
      background: {
        color: 'rgba(153,27,27,1)',
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
  visible: true,
  editable: true,
}
