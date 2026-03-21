import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressBar from '../components/ProgressBar';
describe('ProgressBar', () => {
    it('renders with default value 0', () => {
        render(<ProgressBar />);
        expect(screen.getByText('0%')).toBeInTheDocument();
    });
    it('renders correct percentage', () => {
        render(<ProgressBar value={75}/>);
        expect(screen.getByText('75%')).toBeInTheDocument();
    });
    it('clamps value to 100', () => {
        render(<ProgressBar value={150}/>);
        expect(screen.getByText('100%')).toBeInTheDocument();
    });
    it('clamps value to 0 for negatives', () => {
        render(<ProgressBar value={-10}/>);
        expect(screen.getByText('0%')).toBeInTheDocument();
    });
    it('hides label when showLabel=false', () => {
        const { container } = render(<ProgressBar value={50} showLabel={false}/>);
        expect(container.querySelector('.progress-bar__label')).not.toBeInTheDocument();
    });
    it('applies success variant for >= 90', () => {
        const { container } = render(<ProgressBar value={95}/>);
        expect(container.querySelector('.progress-bar__fill')).toHaveClass('progress-bar__fill--success');
    });
    it('applies warning variant for < 50', () => {
        const { container } = render(<ProgressBar value={20}/>);
        expect(container.querySelector('.progress-bar__fill')).toHaveClass('progress-bar__fill--warning');
    });
    it('has correct ARIA attributes', () => {
        render(<ProgressBar value={60}/>);
        const bar = screen.getByRole('progressbar');
        expect(bar).toHaveAttribute('aria-valuenow', '60');
        expect(bar).toHaveAttribute('aria-valuemin', '0');
        expect(bar).toHaveAttribute('aria-valuemax', '100');
    });
});
