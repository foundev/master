const echarts = {
  init: jest.fn(() => ({
    setOption: jest.fn(),
    resize: jest.fn(),
    dispose: jest.fn(),
  })),
  use: jest.fn(),
};

// Mock chart components
const BarChart = {};
const LineChart = {};

const TitleComponent = {};
const TooltipComponent = {};
const GridComponent = {};
const LegendComponent = {};

const CanvasRenderer = {};

module.exports = echarts;
module.exports.default = echarts;
module.exports.BarChart = BarChart;
module.exports.LineChart = LineChart;
module.exports.TitleComponent = TitleComponent;
module.exports.TooltipComponent = TooltipComponent;
module.exports.GridComponent = GridComponent;
module.exports.LegendComponent = LegendComponent;
module.exports.CanvasRenderer = CanvasRenderer;