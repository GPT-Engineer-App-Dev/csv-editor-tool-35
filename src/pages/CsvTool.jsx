import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const CsvTool = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const result = Papa.parse(text, { header: true });
        setHeaders(result.meta.fields);
        setCsvData(result.data);
      };
      reader.readAsText(file);
    }
  };

  const handleAddRow = () => {
    setCsvData([...csvData, {}]);
  };

  const handleRemoveRow = (index) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
  };

  const handleCellChange = (index, field, value) => {
    const newData = [...csvData];
    newData[index][field] = value;
    setCsvData(newData);
  };

  const handleDownload = () => {
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => headers.map((field) => row[field] || "").join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "edited.csv");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
      {csvData.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((field) => (
                    <TableCell key={field}>
                      <Input
                        value={row[field] || ""}
                        onChange={(e) => handleCellChange(rowIndex, field, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleRemoveRow(rowIndex)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="outline" onClick={handleAddRow} className="mt-4">
            Add Row
          </Button>
          <Button variant="primary" onClick={handleDownload} className="mt-4 ml-4">
            Download CSV
          </Button>
        </>
      )}
    </div>
  );
};

export default CsvTool;