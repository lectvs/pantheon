namespace MetricsPlot {
    export type Plot = {
        texture: Texture;
        dataPoints: {[x: number]: Pt};
        graphBounds: Bounds;
    }

    export function plotRecording(recording: Metrics.Span, width: number, height: number): Plot {
        let plot = {
            texture: Texture.filledRect(width, height, 0xFFFFFF),
            dataPoints: {},
            graphBounds: { left: 0, right: width, bottom: 0, top: height },
        };

        if (!recording || _.isEmpty(recording.subspans)) return plot;

        let frames = recording.subspans;
        let monitor = new Monitor();

        plot.graphBounds = { left: Infinity, right: -Infinity, bottom: Infinity, top: -Infinity };

        for (let x = 0; x < width; x++) {
            let percentLow = x / width;
            let percentHigh = (x+1) / width;
            for (let frame_i = 0; frame_i < frames.length; frame_i++) {
                let framePercent = frame_i / frames.length;
                if (percentLow <= framePercent && framePercent < percentHigh) {
                    monitor.addPoint(frames[frame_i].time);
                }
            }
            if (monitor.isEmpty()) continue;
            let y = monitor.getAvg();
            plot.dataPoints[x] = { x, y };
            plot.graphBounds.left = Math.min(plot.graphBounds.left, x);
            plot.graphBounds.right = Math.max(plot.graphBounds.right, x);
            plot.graphBounds.bottom = Math.min(plot.graphBounds.bottom, y);
            plot.graphBounds.top = Math.max(plot.graphBounds.top, y);
        }

        plot.graphBounds.top = Math.max(plot.graphBounds.top, 11);
        plot.graphBounds.bottom = Math.min(plot.graphBounds.bottom, -1);

        Draw.brush.color = 0xFF0000;
        Draw.brush.alpha = 1;
        for (let x in plot.dataPoints) {
            let dataPoint: Pt = plot.dataPoints[x];
            Draw.pixel(plot.texture, getPlotPixelX(plot, dataPoint.x), getPlotPixelY(plot, dataPoint.y));
        }

        Draw.brush.color = 0x000000;
        Draw.rectangleSolid(plot.texture, 0, getPlotPixelY(plot, 0), width, 1);
        Draw.rectangleSolid(plot.texture, 0, getPlotPixelY(plot, 10), width, 1);

        return plot;
    }

    function getPlotPixelX(plot: Plot, x: number) {
        return plot.texture.width * (x - plot.graphBounds.left) / (plot.graphBounds.right - plot.graphBounds.left);
    }

    function getPlotPixelY(plot: Plot, y: number) {
        return plot.texture.height - plot.texture.height * (y - plot.graphBounds.bottom) / (plot.graphBounds.top - plot.graphBounds.bottom);
    }
}