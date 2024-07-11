import {
  TextAlignment,
  BoxHorizontalAlignment,
  BoxVerticalAlignment,
} from '../lightweights-line-tools'

export const verticalDefaultOption = {
  text: {
    value: '',
    alignment: TextAlignment.Left,
    font: {
      color: 'rgba(41,98,255,1)',
      size: 20,
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
        color: 'rgba(126,211,33,0)',
        width: 1,
        radius: 0,
        highlight: false,
        style: 0,
      },
      background: {
        color: 'rgba(199,56,56,0)',
        inflation: {
          x: 0,
          y: 0,
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
  },
  visible: true,
  editable: true,
}
