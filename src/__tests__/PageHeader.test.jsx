import React from 'react';
import { render, screen } from '@testing-library/react';
import PageHeader from '../components/PageHeader';
describe('PageHeader', () => {
    it('renders title', () => {
        render(<PageHeader title="Test Title"/>);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
    it('renders subtitle when provided', () => {
        render(<PageHeader title="Title" subtitle="Subtitle text"/>);
        expect(screen.getByText('Subtitle text')).toBeInTheDocument();
    });
    it('does not render subtitle when not provided', () => {
        const { container } = render(<PageHeader title="Title"/>);
        expect(container.querySelector('.page-header__subtitle')).not.toBeInTheDocument();
    });
    it('renders actions slot', () => {
        render(<PageHeader title="Title" actions={<button>Click me</button>}/>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });
    it('uses h1 tag for title', () => {
        render(<PageHeader title="Heading"/>);
        const heading = screen.getByText('Heading');
        expect(heading.tagName).toBe('H1');
    });
});
