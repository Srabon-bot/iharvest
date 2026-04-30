import React, { useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { updateUserPassword } from '../../services/authService';
import { validatePassword } from '../../utils/validators';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const { valid, errors } = validatePassword(newPassword);
    if (!valid) {
      setError(errors[0]);
      return;
    }

    setSaving(true);
    try {
      await updateUserPassword(newPassword);
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to change password. You may need to log out and log back in.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Password" size="sm">
      {success ? (
        <div style={{ padding: 'var(--spacing-lg) 0', textAlign: 'center', color: 'var(--primary)' }}>
          <strong>Password successfully changed!</strong>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {error && <div style={{ padding: '0.75rem', background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>{error}</div>}
          <Input 
            label="New Password" 
            type="password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            placeholder="At least 6 characters" 
            required 
          />
          <Input 
            label="Confirm New Password" 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="Repeat password" 
            required 
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)' }}>
            <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={saving || !newPassword || !confirmPassword}>
              {saving ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ChangePasswordModal;
