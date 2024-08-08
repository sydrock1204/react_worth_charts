import {
  TextAlignment,
  BoxHorizontalAlignment,
  BoxVerticalAlignment,
} from '../lightweights-line-tools'

export const calloutDefaultOption = {
  text: {
    value: '',
    alignment: TextAlignment.Left,
    font: {
      color: 'rgba(255,255,255,1)',
      size: 14,
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
      scale: 1,
      offset: {
        x: 0,
        y: 0,
      },
      padding: {
        x: 0,
        y: 0,
      },
      maxHeight: 300,
      shadow: {
        blur: 0,
        color: 'rgba(255,255,255,1)',
        offset: {
          x: 0,
          y: 0,
        },
      },
      border: {
        color: 'rgba(74,144,226,1)',
        width: 2,
        radius: 10,
        highlight: false,
        style: 0,
      },
      background: {
        color: 'rgba(19,73,133,1)',
        inflation: {
          x: 10,
          y: 10,
        },
      },
    },
    padding: 0,
    wordWrapWidth: 120,
    forceTextAlign: false,
    forceCalculateMaxLineWidth: true,
  },
  line: {
    color: 'rgba(74,144,226,1)',
    width: 2,
    style: 0,
    end: {
      left: 1,
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
