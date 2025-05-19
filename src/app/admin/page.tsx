'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Complaint } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { updateComplaintStatus, markComplaintAsViewed } from '@/lib/complaints';

type StatusFilter = 'all' | 'Received' | 'Under Review' | 'Resolved';
type CategoryFilter = 'all' | string;

export default function AdminDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
    fetchCategories();

    // Subscribe to complaint updates
    const channel = supabase
      .channel('complaints')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'complaints',
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setComplaints((current) =>
              current.map((complaint) =>
                complaint.id === payload.new.id ? (payload.new as Complaint) : complaint
              )
            );
          } else if (payload.eventType === 'INSERT') {
            setComplaints((current) => [payload.new as Complaint, ...current]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching complaints:', error);
    } else {
      setComplaints(data || []);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('name');

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data.map((cat) => cat.name));
    }
  };

  const handleStatusChange = async (complaintId: string, newStatus: Complaint['status']) => {
    try {
      await updateComplaintStatus(complaintId, newStatus, user?.id || '');
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  };

  const handleComplaintClick = async (complaintId: string) => {
    try {
      await markComplaintAsViewed(complaintId, user?.id || '');
    } catch (error) {
      console.error('Error marking complaint as viewed:', error);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || complaint.category_id === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
      case 'Received':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage and track citizen complaints
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="Received">Received</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Complaints List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredComplaints.map((complaint) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleComplaintClick(complaint.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Complaint #{complaint.id}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {complaint.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Last updated: {new Date(complaint.last_status_updated_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {complaint.status !== 'Under Review' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(complaint.id, 'Under Review');
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Start Review
                        </button>
                      )}
                      {complaint.status !== 'Resolved' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(complaint.id, 'Resolved');
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Mark as Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 