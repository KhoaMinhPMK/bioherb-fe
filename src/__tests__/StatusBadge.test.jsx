import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusBadge from '../components/StatusBadge';
describe('StatusBadge', () => {
    it('renders mapped status label', () => {
        render(<StatusBadge status="approved"/>);
        expect(screen.getByText('Đã duyệt')).toBeInTheDocument();
    });
    it('renders mapped variant class', () => {
        const { container } = render(<StatusBadge status="approved"/>);
        expect(container.firstChild).toHaveClass('status-badge--success');
    });
    it('renders custom label when provided', () => {
        render(<StatusBadge status="approved" label="Custom"/>);
        expect(screen.getByText('Custom')).toBeInTheDocument();
    });
    it('renders custom variant when provided', () => {
        const { container } = render(<StatusBadge status="approved" variant="error"/>);
        expect(container.firstChild).toHaveClass('status-badge--error');
    });
    it('falls back to neutral for unknown status', () => {
        const { container } = render(<StatusBadge status="unknown-status"/>);
        expect(container.firstChild).toHaveClass('status-badge--neutral');
        expect(screen.getByText('unknown-status')).toBeInTheDocument();
    });
});
