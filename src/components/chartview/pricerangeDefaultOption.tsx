import {
  TextAlignment,
  BoxHorizontalAlignment,
  BoxVerticalAlignment,
} from '../lightweights-line-tools'

export const pricerangeDefaultOption = {
  text: {
    value: '',
    alignment: TextAlignment.Left,
    font: {
      color: 'rgba(41,98,255,1)',
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
        width: 4,
        radius: 0,
        highlight: false,
        style: 3,
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
    forceTextAlign: true,
    forceCalculateMaxLineWidth: true,
  },
  priceRange: {
    background: {
      color: 'rgba(156,39,176,0.2)',
    },
    border: {
      color: 'rgba(39,176,80,1)',
      width: 3,
      style: 0,
    },
    extend: {
      right: false,
      left: false,
    },
  },
  visible: true,
  editable: true,
}
