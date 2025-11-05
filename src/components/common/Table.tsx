import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

const Table = ({ children, className = '' }: TableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-slate-200 ${className}`}>
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, className = '' }: TableHeaderProps) => {
  return (
    <thead className={`bg-slate-50 ${className}`}>
      {children}
    </thead>
  );
};

const TableRow = ({ children, className = '' }: TableRowProps) => {
  return (
    <tr className={className}>
      {children}
    </tr>
  );
};

const TableCell = ({ children, className = '' }: TableCellProps) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
};

Table.Header = TableHeader;
Table.Row = TableRow;
Table.Cell = TableCell;

export default Table;

