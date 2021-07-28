type MetricsReport = {
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

    export function filterReport(report: MetricsReport, keyFilter: string | string[]) {
        if (_.isString(keyFilter)) keyFilter = [keyFilter];

        for (let keyFilterString of keyFilter) {
            let result: MetricsReport = {};
            for (let key in report) {
                let filtered = filterReportSpanForKey(report[key], keyFilterString);
                if (filtered) {
                    for (let key2 in filtered) {
                        result[`${key}_${key2}`] = filtered[key2];
                    }
                }
            }
            report = result;
        }
        
        return report;
    }

    function filterReportSpanForKey(reportSpan: any, keyFilter: string) {
        if (_.isEmpty(reportSpan)) return undefined;
        if (_.isNumber(reportSpan) || _.isString(reportSpan)) return undefined;

        for (let key in reportSpan) {
            if (key.indexOf(keyFilter) > -1) return { [key]: reportSpan[key] };
        }

        for (let key in reportSpan) {
            let filtered = filterReportSpanForKey(reportSpan[key], keyFilter);
            if (filtered) return filtered;
        }

        return undefined;
    }
}