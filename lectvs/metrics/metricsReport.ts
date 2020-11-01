type MetricsReport = {
    name: string;
    time: number;
} & any;

namespace MetricsReport {
    export function generateTimeReportForSpan(recording: Metrics.Span): MetricsReport {
        let report: MetricsReport = {
            time: recording.time,
        };

        let num = 0;
        for (let subspan of recording.subspans || []) {
            report[`${num}_${subspan.name}`] = generateTimeReportForSpan(subspan);
            num++;
        }

        return report;
    }
}