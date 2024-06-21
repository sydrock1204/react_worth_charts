import {
  TextAlignment,
  BoxHorizontalAlignment,
  BoxVerticalAlignment,
} from '../lightweights-line-tools'

export const circleDefaultOption = {
  text: {
    value: '',
    alignment: TextAlignment.Center,
    font: {
      color: 'rgba(255,255,255,1)',
      size: 18,
      bold: false,
      italic: false,
      family: 'Roboto',
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
        y: 30,
      },
      padding: {
        x: 0,
        y: 0,
      },
      maxHeight: 500,
      border: {
        color: 'rgba(126,211,33,1)',
        width: 4,
        radius: 20,
        highlight: false,
        style: 3,
      },
      background: {
        color: 'rgba(208,2,27,1)',
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
      color: 'rgba(39,176,119,0.2)',
    },
    border: {
      color: 'rgba(156,39,176,0.5)',
      width: 1,
      style: 3,
    },
    extend: {
      right: true, //does not do anything, left in for ease of use with rectangle settings
      left: false, //does not do anything, left in for ease of use with rectangle settings
    },
  },
  visible: true,
  editable: true,
}
