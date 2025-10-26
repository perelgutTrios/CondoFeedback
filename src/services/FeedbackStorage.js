// Simple Local Database for Essex Feedback
// Stores submissions in browser localStorage with export capabilities

export class FeedbackStorage {
  static STORAGE_KEY = 'essex-feedback-submissions';
  
  // Save feedback submission
  static saveSubmission(feedbackData) {
    try {
      const submissions = this.getAllSubmissions();
      
      const newSubmission = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...feedbackData,
        submittedAt: new Date().toLocaleString()
      };
      
      submissions.push(newSubmission);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(submissions));
      
      return {
        success: true,
        id: newSubmission.id,
        count: submissions.length
      };
    } catch (error) {
      console.error('Error saving submission:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get all submissions
  static getAllSubmissions() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading submissions:', error);
      return [];
    }
  }
  
  // Get submission count
  static getSubmissionCount() {
    return this.getAllSubmissions().length;
  }
  
  // Export submissions as CSV
  static exportAsCSV() {
    const submissions = this.getAllSubmissions();
    
    if (submissions.length === 0) {
      alert('No submissions to export');
      return;
    }
    
    // CSV Headers - properly quoted for Excel
    const headers = [
      '"ID"', '"Date Submitted"', '"Last Name"', '"Unit Number"', 
      '"Topics"', '"Urgency"', '"Subject"', '"Comment"', '"Anonymous"', '"Copy PM"'
    ];
    
    // Helper function to properly escape CSV values
    const escapeCsvValue = (value) => {
      if (value == null || value === '') return '""';
      const stringValue = String(value);
      return `"${stringValue.replace(/"/g, '""')}"`;
    };
    
    // Convert submissions to CSV rows
    console.log('CSV Export - Processing submissions:', submissions);
    
    const csvRows = [
      headers.join(','),
      ...submissions.map(sub => {
        const lastNameValue = sub.lastName || sub.familyName || '';
        const topicsValue = sub.topics || sub.topic || '';
        
        return [
          escapeCsvValue(sub.id || ''),
          escapeCsvValue(sub.submittedAt || ''),
          escapeCsvValue(lastNameValue),
          escapeCsvValue(sub.unitNumber || ''),
          escapeCsvValue(topicsValue),
          escapeCsvValue(sub.urgency || ''),
          escapeCsvValue(sub.subject || ''),
          escapeCsvValue(sub.comment || ''),
          escapeCsvValue(sub.isAnonymous ? 'Yes' : 'No'),
          escapeCsvValue(sub.copyPM ? 'Yes' : 'No')
        ].join(',');
      })
    ];
    
    // Create and download CSV file with proper Windows line endings and BOM for Excel
    const csvContent = csvRows.join('\r\n'); // Use Windows line endings for Excel compatibility
    const BOM = '\uFEFF'; // UTF-8 BOM for proper Excel encoding
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `essex-feedback-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    return {
      success: true,
      count: submissions.length,
      filename: link.download
    };
  }
  
  // Export submissions as JSON (for backup)
  static exportAsJSON() {
    const submissions = this.getAllSubmissions();
    
    if (submissions.length === 0) {
      alert('No submissions to export');
      return;
    }
    
    const dataStr = JSON.stringify(submissions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `essex-feedback-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    return {
      success: true,
      count: submissions.length,
      filename: link.download
    };
  }
  
  // Clear all submissions (with confirmation)
  static clearAllSubmissions() {
    const count = this.getSubmissionCount();
    
    if (count === 0) {
      alert('No submissions to clear');
      return { success: false, message: 'No data to clear' };
    }
    
    const confirmed = window.confirm(
      `Are you sure you want to delete all ${count} submissions?\\n\\nThis cannot be undone. Consider exporting first.`
    );
    
    if (confirmed) {
      localStorage.removeItem(this.STORAGE_KEY);
      return { success: true, message: `Cleared ${count} submissions` };
    }
    
    return { success: false, message: 'Operation cancelled' };
  }
  
  // Get recent submissions for quick review
  static getRecentSubmissions(limit = 5) {
    const all = this.getAllSubmissions();
    return all
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }
}