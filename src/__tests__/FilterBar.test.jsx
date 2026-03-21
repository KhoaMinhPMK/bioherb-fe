import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterBar from '../components/FilterBar';
describe('FilterBar', () => {
    it('renders search input with custom placeholder', () => {
        render(<FilterBar searchPlaceholder="Search items..."/>);
        expect(screen.getByPlaceholderText('Search items...')).toBeInTheDocument();
    });
    it('calls onSearch when typing (debounced)', async () => {
        jest.useFakeTimers();
        const onSearch = jest.fn();
        render(<FilterBar onSearch={onSearch} searchPlaceholder="Search..."/>);
        fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'test' } });
        jest.advanceTimersByTime(300);
        expect(onSearch).toHaveBeenCalledWith('test');
        jest.useRealTimers();
    });
    it('renders filter dropdowns', () => {
        const filters = [
            {
                key: 'status',
                label: 'Status',
                options: [
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                ],
            },
        ];
        render(<FilterBar filters={filters}/>);
        expect(screen.getByLabelText('Status')).toBeInTheDocument();
    });
    it('renders actions slot', () => {
        render(<FilterBar actions={<button>Add New</button>}/>);
        expect(screen.getByText('Add New')).toBeInTheDocument();
    });
    it('shows clear button when search has value', () => {
        render(<FilterBar searchPlaceholder="Search..."/>);
        const input = screen.getByPlaceholderText('Search...');
        fireEvent.change(input, { target: { value: 'hello' } });
        expect(screen.getByLabelText('Xoá tìm kiếm')).toBeInTheDocument();
    });
});
