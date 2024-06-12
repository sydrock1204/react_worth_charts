import {
  TextAlignment,
  BoxHorizontalAlignment,
  BoxVerticalAlignment,
} from '../lightweights-line-tools'

export const trendlineDefaultOption = {
  text: {
    value: 'TrendLine with box',
    alignment: TextAlignment.Left,
    font: {
      color: 'rgba(255,255,255,1)',
      size: 14,
      bold: true,
      italic: true,
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
        y: 20,
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
        radius: 20,
        highlight: false,
        style: 1,
      },
      background: {
        color: 'rgba(199,56,56,0.25)',
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
    width: 4,
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
