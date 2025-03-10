import React from 'react';

type DownloadCSVProps = {
    data: Record<string, unknown>[];
    fileName: string;
};

const DownloadCSV: React.FC<DownloadCSVProps> = ({ data, fileName }) => {
    const convertToCSV = (objArray: Record<string, unknown>[]): string => {
        const array = Array.isArray(objArray) ? objArray : JSON.parse(objArray);
        let str = '';

        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (const index in array[i]) {
                if (line !== '') line += ',';
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    };

    const downloadCSV = () => {
        const csvData = new Blob([convertToCSV(data)], { type: 'text/csv' });
        const csvURL = URL.createObjectURL(csvData);
        const link = document.createElement('a');
        link.href = csvURL;
        link.download = `${fileName}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return <button onClick={downloadCSV}>Download CSV</button>;
};

export default DownloadCSV;