import { supabase, Complaint, User } from '@/lib/supabase';

export async function updateComplaintStatus(
  complaintId: string,
  newStatus: Complaint['status'],
  adminId: string
) {
  const timestamp = new Date().toISOString();

  // Update complaint status
  const { error: updateError } = await supabase
    .from('complaints')
    .update({
      status: newStatus,
      last_status_updated_at: timestamp,
    })
    .eq('id', complaintId);

  if (updateError) throw updateError;

  // Get complaint details for notification
  const { data: complaint } = await supabase
    .from('complaints')
    .select('user_id, description')
    .eq('id', complaintId)
    .single();

  if (!complaint) throw new Error('Complaint not found');

  // Create notification for the user
  const { error: notificationError } = await supabase.from('notifications').insert({
    user_id: complaint.user_id,
    title: 'Complaint Status Updated',
    content: `Your complaint has been marked as ${newStatus}`,
    created_at: timestamp,
  });

  if (notificationError) throw notificationError;

  // Log the activity
  const { error: activityError } = await supabase.from('activity_logs').insert({
    user_id: adminId,
    action: 'UPDATE_COMPLAINT_STATUS',
    metadata: {
      complaint_id: complaintId,
      old_status: complaint.status,
      new_status: newStatus,
      timestamp,
    },
    created_at: timestamp,
  });

  if (activityError) throw activityError;
}

export async function markComplaintAsViewed(complaintId: string, adminId: string) {
  const { data: complaint } = await supabase
    .from('complaints')
    .select('status')
    .eq('id', complaintId)
    .single();

  if (!complaint) throw new Error('Complaint not found');

  // Only update status if it's not already "Under Review" or "Resolved"
  if (complaint.status === 'Received') {
    await updateComplaintStatus(complaintId, 'Under Review', adminId);
  }

  // Log the view activity
  const { error: activityError } = await supabase.from('activity_logs').insert({
    user_id: adminId,
    action: 'VIEW_COMPLAINT',
    metadata: {
      complaint_id: complaintId,
      timestamp: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
  });

  if (activityError) throw activityError;
} 