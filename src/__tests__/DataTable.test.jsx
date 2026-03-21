import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataTable from '../components/DataTable';
const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
];
const data = [
    { id: '1', name: 'Alice', age: 30 },
    { id: '2', name: 'Bob', age: 25 },
    { id: '3', name: 'Charlie', age: 35 },
];
describe('DataTable', () => {
    it('renders column headers', () => {
        render(<DataTable columns={columns} data={data}/>);
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Age')).toBeInTheDocument();
    });
    it('renders row data', () => {
        render(<DataTable columns={columns} data={data}/>);
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
    });
    it('shows empty message when no data', () => {
        render(<DataTable columns={columns} data={[]} emptyMessage="No records"/>);
        expect(screen.getByText('No records')).toBeInTheDocument();
    });
    it('handles sorting on click', () => {
        render(<DataTable columns={columns} data={data}/>);
        const nameHeader = screen.getByText('Name');
        fireEvent.click(nameHeader);
        // After ascending sort, Alice should be first
        const cells = screen.getAllByRole('cell');
        expect(cells[0]).toHaveTextContent('Alice');
    });
    it('calls onRowClick when row is clicked', () => {
        const onRowClick = jest.fn();
        render(<DataTable columns={columns} data={data} onRowClick={onRowClick}/>);
        fireEvent.click(screen.getByText('Alice'));
        expect(onRowClick).toHaveBeenCalledWith(data[0]);
    });
    it('renders custom column renderer', () => {
        const customColumns = [
            { key: 'name', label: 'Name', render: (v) => <strong>{v}</strong> },
        ];
        render(<DataTable columns={customColumns} data={data}/>);
        const strong = screen.getByText('Alice');
        expect(strong.tagName).toBe('STRONG');
    });
    it('renders loading skeleton', () => {
        const { container } = render(<DataTable columns={columns} data={data} loading={true}/>);
        expect(container.querySelector('.data-table__skeleton')).toBeInTheDocument();
    });
});
