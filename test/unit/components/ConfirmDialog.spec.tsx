import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

describe('ConfirmDialog Component', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Confirmar acción',
    message: '¿Estás seguro?',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    onConfirm: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    const dialog = screen.queryByText('Confirmar acción');
    expect(dialog).not.toBeInTheDocument();
  });

  it('renders title and message when isOpen is true', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Confirmar acción')).toBeInTheDocument();
    expect(screen.getByText('¿Estás seguro?')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    
    fireEvent.click(confirmButton);
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    
    fireEvent.click(cancelButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when isLoading is true', () => {
    render(<ConfirmDialog {...defaultProps} isLoading={true} />);
    const confirmButton = screen.getByRole('button', { name: /cargando/i });
    expect(confirmButton).toBeDisabled();
  });

  it('displays custom labels', () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmLabel="Sí, eliminar"
        cancelLabel="No, cancelar"
      />
    );
    expect(screen.getByRole('button', { name: /sí, eliminar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /no, cancelar/i })).toBeInTheDocument();
  });
});
