import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';


const Category = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const token = localStorage.getItem('token'); 

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/categories', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setCategories(data.categories);
            } else {
                alert('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert('Failed to fetch categories');
        }
    }, [token]);

    const handleCreateCategory = async () => {
        if (!newCategoryName) return alert('Category name is required');
        try {
            const response = await fetch('http://localhost:5000/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ category_name: newCategoryName }),
            });
            const data = await response.json();
            if (data.success) {
                setCategories([...categories, data.category]);
                setNewCategoryName('');
            } else {
                alert('Failed to save category');
            }
        } catch (error) {
            console.error('Error creating category:', error);
            alert('Failed to save category');
        }
    };

    const handleEditCategory = async (id) => {
        if (!newCategoryName) return alert('Category name is required');
        try {
            const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ category_name: newCategoryName }),
            });
            const data = await response.json();
            if (data.success) {
                setCategories(categories.map(cat => (cat.id === id ? data.category : cat)));
                setNewCategoryName('');
                setIsEditing(false);
                setEditingCategory(null);
            } else {
                alert('Failed to update category');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            alert('Failed to update category');
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setCategories(categories.filter(category => category.id !== id));
            } else {
                alert('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleEditClick = (category) => {
        setNewCategoryName(category.category_name);
        setIsEditing(true);
        setEditingCategory(category.id);
    };

    return (
        <div className="max-w-2xl mx-auto p-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-lg shadow-lg h-screen w-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-white">Category Manager</h1>
            <button onClick={() => navigate('/welcome')} className="bg-gray-700 mb-4 cursor-pointer hover:bg-gray-800 text-white p-2 rounded-md w-32">
                Back
            </button>
            <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New Category Name"
                className="border rounded px-3 py-2 mb-2 w-full"
            />
            {isEditing ? (
                <button onClick={() => handleEditCategory(editingCategory)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Update Category
                </button>
            ) : (
                <button onClick={handleCreateCategory} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Add Category
                </button>
            )}
            <table className="min-w-full table-auto my-6 bg-white rounded-lg shadow-md overflow-hidden">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">Category ID</th>
                        <th className="px-4 py-2">Category Name</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.id} className="border-b hover:bg-gray-100">
                            <td className="px-4 py-2">{category.id}</td>
                            <td className="px-4 py-2">{category.category_name}</td>
                            <td className="px-4 py-2 flex justify-end">
                                <button
                                    onClick={() => handleEditClick(category)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Category;

