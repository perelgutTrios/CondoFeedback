/**
 * GitHub Pages Compatible CSV Storage
 * Uses GitHub API to store feedback data as CSV in repository
 * No server required - works entirely with GitHub Pages
 */

class GitHubCSVStorage {
  constructor() {
    // GitHub repository information
    this.owner = 'perelgutTrios';
    this.repo = 'CondoFeedback';
    this.branch = 'deployAndSave';
    this.csvPath = 'data/essex-feedback.csv';
    
    // GitHub Personal Access Token (create at github.com/settings/tokens)
    // Only needs 'repo' scope for private repos or 'public_repo' for public repos
    this.token = 'YOUR_GITHUB_TOKEN_HERE'; // Replace with actual token
  }

  async saveSubmission(submissionData) {
    try {
      // Format submission as CSV row
      const timestamp = new Date().toISOString();
      const submissionId = `feedback_${Date.now()}`;
      
      const csvRow = [
        timestamp,
        submissionId,
        submissionData.lastName || 'N/A',
        submissionData.unitNumber || 'N/A',
        submissionData.topics || 'N/A',
        submissionData.urgency || 'N/A',
        submissionData.subject || 'N/A',
        (submissionData.comment || 'N/A').replace(/[\r\n]/g, ' '),
        submissionData.email || '',
        submissionData.isAnonymous ? 'Yes' : 'No',
        submissionData.copyPM ? 'Yes' : 'No',
        submissionData.copyMe ? 'Yes' : 'No',
        submissionData.buttonType || 'General Submit'
      ];

      // Get current CSV content
      const currentContent = await this.getCurrentCSV();
      
      // Add new row
      const newContent = currentContent + '\n' + csvRow.map(field => 
        typeof field === 'string' && field.includes(',') ? `"${field}"` : field
      ).join(',');

      // Update file in GitHub
      await this.updateGitHubFile(newContent);
      
      return {
        success: true,
        id: submissionId,
        timestamp: timestamp,
        totalSubmissions: newContent.split('\n').length - 2, // Subtract header and empty lines
        message: 'Saved to GitHub repository'
      };

    } catch (error) {
      console.error('GitHub save failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'GitHub save failed - using browser storage only'
      };
    }
  }

  async getCurrentCSV() {
    try {
      const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.csvPath}?ref=${this.branch}`, {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.status === 404) {
        // File doesn't exist, create with headers
        const headers = [
          'Timestamp',
          'Submission ID',
          'Last Name', 
          'Unit Number',
          'Topics',
          'Urgency',
          'Subject',
          'Comment',
          'Email',
          'Anonymous',
          'Copy PM',
          'Copy Me',
          'Submit Type'
        ];
        return headers.join(',');
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      return atob(data.content.replace(/\s/g, '')); // Decode base64 content

    } catch (error) {
      console.error('Error getting current CSV:', error);
      throw error;
    }
  }

  async updateGitHubFile(content) {
    try {
      // Get current file SHA (required for updates)
      let sha = null;
      try {
        const currentFile = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.csvPath}?ref=${this.branch}`, {
          headers: {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        if (currentFile.ok) {
          const fileData = await currentFile.json();
          sha = fileData.sha;
        }
      } catch (e) {
        // File doesn't exist yet, that's okay
      }

      // Update or create file
      const updateData = {
        message: `Add feedback submission - ${new Date().toISOString()}`,
        content: btoa(content), // Encode content as base64
        branch: this.branch
      };

      if (sha) {
        updateData.sha = sha; // Required for updates
      }

      const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.csvPath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API error: ${response.status} - ${errorData.message}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Error updating GitHub file:', error);
      throw error;
    }
  }

  // Get download URL for CSV file
  getDownloadURL() {
    return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${this.csvPath}`;
  }

  // Check if GitHub storage is configured
  isConfigured() {
    return this.token && this.token !== 'YOUR_GITHUB_TOKEN_HERE';
  }
}

export { GitHubCSVStorage };