declare module 'lucide-react'

declare module 'chartjs-node-canvas' {
  export class ChartJSNodeCanvas {
    constructor(config: {
      width: number
      height: number
      backgroundColour: string
      plugins?: any
    })
    renderToBuffer(config: any): Promise<Buffer>
  }
}
