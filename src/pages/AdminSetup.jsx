import React, { useState, useEffect } from 'react';
import { initializeAdminProfile } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

export default function AdminSetup() {
    const { user } = useAuth();
    const [uid, setUid] = useState(user?.uid || '');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        if (user?.uid) setUid(user.uid);
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanUid = uid.trim();
        const cleanEmail = email.trim();
        const cleanName = name.trim();

        if (!cleanUid || !cleanEmail || !cleanName) {
            addToast({ message: 'Please fill all fields', type: 'error' });
            return;
        }

        setLoading(true);
        try {
            await initializeAdminProfile(cleanUid, cleanEmail, cleanName);
            addToast({ message: 'Admin profile created successfully!', type: 'success' });
            setUid('');
            setEmail('');
            setName('');
        } catch (error) {
            addToast({ message: error.message || 'Failed to create admin profile', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '100px auto', padding: '20px' }}>
            <Card title="iHarvest Admin Initialization">
                <p style={{ marginBottom: '20px', color: '#666' }}>
                    This utility creates the first admin record in Firestore.
                    Use this AFTER creating the user in Firebase Auth Console.
                </p>

                {user && (
                    <div style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9rem', color: '#166534' }}>
                        <strong>Detected Session:</strong> You are currently signed in as {user.email}.
                        The UID below has been auto-filled.
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <Input
                        label="Firebase UID"
                        placeholder="Copy from Auth Console"
                        value={uid}
                        onChange={(e) => setUid(e.target.value)}
                        disabled={loading}
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    <Input
                        label="Full Name"
                        placeholder="System Admin"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                    />
                    <Button type="submit" variant="primary" isLoading={loading}>
                        Initialize Admin Profile
                    </Button>
                </form>
            </Card>
        </div>
    );
}
