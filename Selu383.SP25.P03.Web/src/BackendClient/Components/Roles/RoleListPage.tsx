import React, { useState, useEffect } from 'react';
import { RoleService } from '../../Services/RoleService';
import RoleList from './RoleList';
import { AlertCircle } from 'lucide-react';
import "../../../index.css";

const RoleListPage: React.FC = () => {
    const [roles, setRoles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all required data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const rolesData = await RoleService.getRoles();
                setRoles(rolesData);
                setError(null);
            } catch (err) {
                setError('Failed to load roles. Please try again later.');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-red-700">{error}</span>
                    </div>
                </div>
            )}

            <RoleList roles={roles} />
        </div>
    );
};

export default RoleListPage;